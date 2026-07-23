import { NextRequest, NextResponse } from "next/server";
import { kvGet } from "@/lib/storage";
import { getOrder, hasActiveAccess } from "@/lib/orders";
import type { SiteRecord } from "@/lib/sites";

export const runtime = "nodejs";

/** GET /site/[slug] — serves a generated personal website.
 *  Access control enforced on every request: the owning order must be
 *  paid and unexpired, otherwise visitors see a graceful offline page. */
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  const record = await kvGet<SiteRecord>(`site:${slug}`);
  if (!record) {
    return new NextResponse(offlineHtml("This site doesn't exist (yet)."), {
      status: 404,
      headers: { "Content-Type": "text/html; charset=utf-8" },
    });
  }

  const order = await getOrder(record.orderId);
  if (!order || !hasActiveAccess(order)) {
    return new NextResponse(
      offlineHtml("This website's plan has expired. The owner can renew it in seconds."),
      { status: 410, headers: { "Content-Type": "text/html; charset=utf-8" } },
    );
  }

  return new NextResponse(record.html, {
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "public, max-age=300, stale-while-revalidate=3600",
      "X-Robots-Tag": "index, follow",
    },
  });
}

function offlineHtml(message: string): string {
  return `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="robots" content="noindex"><title>Site offline · CVUnicorn</title>
<style>body{margin:0;min-height:100vh;display:grid;place-items:center;background:#08070d;color:#dddbe9;font-family:system-ui,sans-serif;text-align:center;padding:24px}
a{color:#b7a6ff}p{max-width:420px;line-height:1.6}</style></head>
<body><div><h1 style="font-size:1.5rem">💤 ${message}</h1>
<p>Build your own stunning personal website in minutes at <a href="/">CVUnicorn</a> — from $0.99.</p></div></body></html>`;
}
