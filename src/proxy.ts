import { NextResponse, type NextRequest } from "next/server";

const generatedSiteHosts: Record<string, { slug: string; style: string }> = {
  "mayachen0.vercel.app": { slug: "maya-chen", style: "mercury" },
  "noahrivera6.vercel.app": { slug: "noah-rivera", style: "resend" },
  "ariokafor11.vercel.app": { slug: "ari-okafor", style: "active" },
};

const generatedSitePaths: Record<string, { slug: string; style: string }> = {
  "/valerio": { slug: "valerio-li", style: "valerio" },
  "/maya": { slug: "maya-chen", style: "mercury" },
  "/noah": { slug: "noah-rivera", style: "resend" },
  "/ari": { slug: "ari-okafor", style: "active" },
};

export function proxy(request: NextRequest) {
  const host = request.headers.get("host")?.toLowerCase().split(":")[0] ?? "";
  const site =
    request.nextUrl.pathname === "/"
      ? generatedSiteHosts[host]
      : generatedSitePaths[request.nextUrl.pathname];

  if (!site) {
    return NextResponse.next();
  }

  const url = request.nextUrl.clone();
  url.pathname = `/case-study-sites/${site.slug}`;
  url.searchParams.set("style", site.style);
  url.searchParams.set("lang", request.nextUrl.searchParams.get("lang") ?? "en");

  return NextResponse.rewrite(url);
}

export const config = {
  matcher: ["/", "/valerio", "/maya", "/noah", "/ari"],
};
