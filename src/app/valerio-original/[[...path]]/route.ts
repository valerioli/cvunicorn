import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const SOURCE_ORIGIN = "https://valerioli.vercel.app";

function sourceUrl(path: string[] | undefined) {
  const cleanPath = path?.join("/") ?? "";
  return `${SOURCE_ORIGIN}/${cleanPath}`;
}

function rewriteHtml(html: string) {
  return html
    .replaceAll("https://valerioli.vercel.app", "https://valerio.cvunicorn.com")
    .replaceAll("https://cvunicorn.vercel.app", "https://cvunicorn.com")
    .replace(/\b(src|poster)=["'](?!https?:|data:|mailto:|#|\/)([^"']+)["']/g, '$1="/valerio-original/$2"')
    .replace(/\bhref=["'](?!https?:|mailto:|#|\/)([^"']+\.(?:html|jpg|jpeg|png|webp|gif|mp4))["']/g, 'href="/valerio-original/$1"')
    .replaceAll("window.location.href='kol-radar.html'", "window.location.href='/valerio-original/kol-radar.html'");
}

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ path?: string[] }> },
) {
  const { path } = await params;
  const upstream = await fetch(sourceUrl(path), {
    cache: "no-store",
    headers: {
      accept: "*/*",
      "user-agent": "CVUnicorn site mirror",
    },
  });

  if (!upstream.ok) {
    return new NextResponse("Not found", { status: upstream.status });
  }

  const contentType = upstream.headers.get("content-type") ?? "application/octet-stream";

  if (contentType.includes("text/html")) {
    return new NextResponse(rewriteHtml(await upstream.text()), {
      headers: {
        "content-type": "text/html; charset=utf-8",
        "cache-control": "public, max-age=0, must-revalidate",
      },
    });
  }

  return new NextResponse(upstream.body, {
    headers: {
      "content-type": contentType,
      "cache-control": "public, max-age=86400",
    },
  });
}
