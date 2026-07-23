export type SiteRecord = {
  slug: string;
  orderId: string;
  html: string;
  generatedAt: number;
};

export const SITE_TTL = 60 * 60 * 24 * 400;
