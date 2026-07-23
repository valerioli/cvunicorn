import type { MetadataRoute } from "next";
import { SITE } from "@/lib/seo";
import { professions } from "@/content/professions";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const page = (
    path: string,
    priority: number,
    changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"] = "weekly",
  ) => ({
    url: `${SITE.url}${path}`,
    lastModified: now,
    changeFrequency,
    priority,
  });

  return [
    page("/", 1),
    page("/start", 0.9),
    page("/pricing", 0.9),
    page("/showcase", 0.8),
    page("/how-it-works", 0.8),
    page("/faq", 0.7),
    ...professions.map((p) => page(`/for/${p.slug}`, 0.7)),
    page("/legal/terms", 0.2, "yearly"),
    page("/legal/privacy", 0.2, "yearly"),
    page("/legal/refunds", 0.2, "yearly"),
  ];
}
