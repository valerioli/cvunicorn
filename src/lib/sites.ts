export type SiteRecord = {
  slug: string;
  orderId: string;
  html: string;
  generatedAt: number;
};

export const SITE_TTL = 60 * 60 * 24 * 400;

export function siteUrlForSlug(slug: string): string {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://cvunicorn.com";
  try {
    const url = new URL(baseUrl);
    if (url.hostname === "localhost" || url.hostname === "127.0.0.1") {
      return `${url.origin}/site/${slug}`;
    }
    return `${url.protocol}//${slug}.${url.hostname}`;
  } catch {
    return `/site/${slug}`;
  }
}
