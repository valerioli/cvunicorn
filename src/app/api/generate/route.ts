import { NextRequest, NextResponse } from "next/server";
import { getOrder, hasActiveAccess, saveOrder } from "@/lib/orders";
import { verifyAccessToken } from "@/lib/access";
import { kvGet, kvSet, acquireLease, releaseLease } from "@/lib/storage";
import { isIntake } from "@/lib/intakeValidation";
import { generateSiteHtml, slugify } from "@/lib/ai/generator";
import type { IntakeData } from "@/lib/intake";
import { SITE_TTL, siteUrlForSlug, type SiteRecord } from "@/lib/sites";

export const runtime = "nodejs";
export const maxDuration = 300; // generation can take a few minutes

/** POST /api/generate — generate (or regenerate) the site for a paid order.
 *  Access control: valid signed token + paid order + unexpired access. */
export async function POST(req: NextRequest) {
  const body = (await req.json().catch(() => null)) as {
    orderId?: string;
    token?: string;
  } | null;
  if (typeof body?.orderId !== "string" || typeof body.token !== "string" || !body.orderId || !body.token) {
    return NextResponse.json({ error: "Missing parameters" }, { status: 400 });
  }
  const verified = verifyAccessToken(body.token);
  if (!verified || verified.orderId !== body.orderId) {
    return NextResponse.json({ error: "Invalid access token" }, { status: 403 });
  }
  const order = await getOrder(body.orderId);
  if (!order) return NextResponse.json({ error: "Order not found" }, { status: 404 });
  if (!hasActiveAccess(order)) {
    return NextResponse.json(
      { error: "This order doesn't have active access. Renew to generate your site." },
      { status: 402 },
    );
  }

  const draft = await kvGet<IntakeData>(`draft:${order.draftId}`);
  if (!isIntake(draft) || !draft.essentials.fullName.trim() || !draft.essentials.headline.trim()) {
    return NextResponse.json(
      { error: "We couldn't find your content draft. Please rebuild it at /start." },
      { status: 404 },
    );
  }

  const lease = crypto.randomUUID();
  if (!await acquireLease(`generation:${order.id}`, lease, 280)) return NextResponse.json({ error: "Your site is already being generated. Please wait, then refresh your dashboard." }, { status: 409 });
  try {
    const html = await generateSiteHtml(draft);
    const slug = order.siteSlug ?? (await uniqueSiteSlug(draft.essentials.fullName));
    const existing = order.siteSlug ? await kvGet<SiteRecord>(`site:${slug}`) : null;
    const record: SiteRecord = {
      slug,
      orderId: order.id,
      html: existing?.html ?? "",
      previewHtml: html,
      generatedAt: Date.now(),
    };
    await kvSet(`site:${slug}`, record, SITE_TTL);
    if (!order.siteSlug) {
      order.siteSlug = slug;
      await saveOrder(order);
    }
    return NextResponse.json({ siteUrl: siteUrlForSlug(slug), needsPublish: true });
  } catch (err) {
    console.error("[generate] failed:", err);
    const message = "We couldn't finish this design. Your content and any published site are safe. Try again in a minute, or contact support with your order number.";
    return NextResponse.json({ error: message }, { status: 502 });
  } finally {
    await releaseLease(`generation:${order.id}`, lease).catch(() => console.error("[generate] lease release failed; it will expire automatically"));
  }
}

async function uniqueSiteSlug(name: string): Promise<string> {
  const base = slugify(name, { randomSuffix: false });
  for (let i = 0; i < 20; i += 1) {
    const candidate = `${base}-${crypto.randomUUID().slice(0, 8)}`;
    const existing = await kvGet<SiteRecord>(`site:${candidate}`);
    if (!existing) return candidate;
  }
  return slugify(name);
}
