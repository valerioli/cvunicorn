import { NextRequest, NextResponse } from "next/server";
import { getOrder, hasActiveAccess, saveOrder } from "@/lib/orders";
import { verifyAccessToken } from "@/lib/access";
import { kvGet, kvSet } from "@/lib/storage";
import { generateSiteHtml, slugify } from "@/lib/ai/generator";
import type { IntakeData } from "@/lib/intake";
import { SITE_TTL, type SiteRecord } from "@/lib/sites";

export const runtime = "nodejs";
export const maxDuration = 300; // generation can take a few minutes

/** POST /api/generate — generate (or regenerate) the site for a paid order.
 *  Access control: valid signed token + paid order + unexpired access. */
export async function POST(req: NextRequest) {
  const body = (await req.json().catch(() => null)) as {
    orderId?: string;
    token?: string;
  } | null;
  if (!body?.orderId || !body.token) {
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
  if (!draft) {
    return NextResponse.json(
      { error: "We couldn't find your content draft. Please rebuild it at /start." },
      { status: 404 },
    );
  }

  try {
    const html = await generateSiteHtml(draft);
    const slug = order.siteSlug ?? slugify(draft.essentials.fullName);
    const record: SiteRecord = {
      slug,
      orderId: order.id,
      html,
      generatedAt: Date.now(),
    };
    await kvSet(`site:${slug}`, record, SITE_TTL);
    if (!order.siteSlug) {
      order.siteSlug = slug;
      await saveOrder(order);
    }
    return NextResponse.json({ siteUrl: `/site/${slug}` });
  } catch (err) {
    console.error("[generate] failed:", err);
    const message =
      err instanceof Error &&
      (err.message.includes("OPENAI_API_KEY") || err.message.includes("ANTHROPIC_API_KEY"))
        ? err.message
        : "Generation hit a snag — please try again in a minute. If it keeps failing, contact hello@cvunicorn.com.";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
