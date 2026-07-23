export const SITE = {
  name: "CVUnicorn",
  tagline: "Your career, made unforgettable",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://cvunicorn.com",
  description:
    "CVUnicorn turns your resume, work, and story into a stunning personal website in minutes. Upload your CV, photos, projects, press, and achievements — AI designs a site worthy of your career.",
  twitter: "@cvunicorn",
  email: "hello@cvunicorn.com",
} as const;

export function absoluteUrl(path = "/"): string {
  return new URL(path, SITE.url).toString();
}

/* ——— Schema.org JSON-LD builders (AEO: entity clarity for AI answer engines) ——— */

export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": absoluteUrl("/#organization"),
    name: SITE.name,
    url: SITE.url,
    logo: absoluteUrl("/icon.svg"),
    description: SITE.description,
    email: SITE.email,
    sameAs: [`https://twitter.com/${SITE.twitter.replace("@", "")}`],
  };
}

export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": absoluteUrl("/#website"),
    name: SITE.name,
    url: SITE.url,
    description: SITE.description,
    publisher: { "@id": absoluteUrl("/#organization") },
  };
}

export function productJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    "@id": absoluteUrl("/#product"),
    name: "CVUnicorn Personal Website Builder",
    description:
      "AI-built personal websites from your CV, portfolio, press, and achievements. Live in minutes, no design or code skills needed.",
    brand: { "@id": absoluteUrl("/#organization") },
    offers: [
      {
        "@type": "Offer",
        name: "Preview Pass — 3 days",
        price: "0.99",
        priceCurrency: "USD",
        url: absoluteUrl("/pricing"),
        availability: "https://schema.org/InStock",
      },
      {
        "@type": "Offer",
        name: "Unicorn Year — 12 months + custom domain",
        price: "9.99",
        priceCurrency: "USD",
        url: absoluteUrl("/pricing"),
        availability: "https://schema.org/InStock",
      },
    ],
  };
}

export function faqJsonLd(faqs: { q: string; a: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
}

export function breadcrumbJsonLd(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

