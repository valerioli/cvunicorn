import { NextRequest, NextResponse } from "next/server";
import { verifyAccessToken } from "@/lib/access";
import { getOrder, hasActiveAccess } from "@/lib/orders";
import { kvGet, kvSet, acquireLease, releaseLease } from "@/lib/storage";
import { SITE_TTL, siteUrlForSlug, type SiteRecord } from "@/lib/sites";
import { siteHeaders } from "@/lib/siteSecurity";

export const runtime = "nodejs";
async function authorized(id: string, token: string) {
  if (!id || verifyAccessToken(token)?.orderId !== id) return null;
  const order = await getOrder(id);
  if (!order?.siteSlug || !hasActiveAccess(order)) return null;
  const site = await kvGet<SiteRecord>(`site:${order.siteSlug}`);
  return site?.orderId === id ? site : null;
}
export async function GET(req: NextRequest) {
  const site = await authorized(req.nextUrl.searchParams.get("order") ?? "", req.nextUrl.searchParams.get("t") ?? "");
  if (!site) return new NextResponse("Preview not available", { status: 403 });
  return new NextResponse(site.previewHtml || site.html, { headers: { ...siteHeaders, "X-Robots-Tag": "noindex, nofollow" } });
}
export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  if (typeof body?.orderId !== "string" || typeof body?.token !== "string") return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  if (verifyAccessToken(body.token)?.orderId !== body.orderId) return NextResponse.json({ error: "Invalid access link" }, { status: 403 });
  const key = `generation:${body.orderId}`;
  const lease = crypto.randomUUID();
  if (!await acquireLease(key, lease, 30)) return NextResponse.json({ error: "Generation is still in progress. Publish after it finishes." }, { status: 409 });
  try {
  const site = await authorized(body.orderId, body.token);
  if (!site?.previewHtml) return NextResponse.json({ error: "Generate a preview before publishing" }, { status: 400 });
  site.html = site.previewHtml;
  delete site.previewHtml;
  await kvSet(`site:${site.slug}`, site, SITE_TTL);
  return NextResponse.json({ siteUrl: siteUrlForSlug(site.slug) });
  } finally { await releaseLease(key, lease); }
}
