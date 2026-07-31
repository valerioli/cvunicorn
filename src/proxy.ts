import { NextResponse, type NextRequest } from "next/server";

const generatedSiteHosts: Record<string, { slug: string; style: string }> = {
  "valerio.cvunicorn.com": { slug: "valerio-li", style: "valerio" },
  "mayachen.cvunicorn.com": { slug: "maya-chen", style: "mercury" },
  "noahrivera.cvunicorn.com": { slug: "noah-rivera", style: "resend" },
  "ariokafor.cvunicorn.com": { slug: "ari-okafor", style: "active" },
};

const generatedSitePaths: Record<string, { slug: string; style: string }> = {
  "/valerio": { slug: "valerio-li", style: "valerio" },
  "/maya": { slug: "maya-chen", style: "mercury" },
  "/noah": { slug: "noah-rivera", style: "resend" },
  "/ari": { slug: "ari-okafor", style: "active" },
};

export function proxy(request: NextRequest) {
  const host = request.headers.get("host")?.toLowerCase().split(":")[0] ?? "";
  const pathname = request.nextUrl.pathname;

  if (host === "valerio.cvunicorn.com" && !pathname.startsWith("/valerio-original")) {
    const url = request.nextUrl.clone();
    url.pathname = `/valerio-original${pathname === "/" ? "" : pathname}`;
    return NextResponse.rewrite(url);
  }

  if (pathname === "/valerio") {
    const url = request.nextUrl.clone();
    url.pathname = "/valerio-original";
    return NextResponse.rewrite(url);
  }

  const site =
    pathname === "/"
      ? generatedSiteHosts[host]
      : generatedSitePaths[pathname];

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
  matcher: ["/:path*"],
};
