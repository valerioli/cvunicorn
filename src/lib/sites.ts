export type SiteRecord = {
  slug: string;
  orderId: string;
  html: string;
  previewHtml?: string;
  generatedAt: number;
};

export const SITE_TTL = 60 * 60 * 24 * 400;

export function siteUrlForSlug(slug: string): string {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://cvunicorn.com";
  try {
    const url = new URL(baseUrl);
    if (!["cvunicorn.com", "www.cvunicorn.com"].includes(url.hostname)) {
      return `${url.origin}/site/${slug}`;
    }
    return `${url.protocol}//${slug}.cvunicorn.com`;
  } catch {
    return `/site/${slug}`;
  }
}
