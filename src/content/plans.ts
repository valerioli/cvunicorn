export type Plan = {
  id: "preview" | "year";
  name: string;
  priceCents: number;
  priceLabel: string;
  period: string;
  durationDays: number;
  tagline: string;
  features: string[];
  cta: string;
  highlight: boolean;
};

export const plans: Plan[] = [
  {
    id: "preview",
    name: "Preview Pass",
    priceCents: 99,
    priceLabel: "$0.99",
    period: "for 3 days",
    durationDays: 3,
    tagline: "See yourself online before you commit.",
    features: [
      "Your full website, live for 3 days",
      "Every section your content unlocks",
      "Shareable cvunicorn.com link",
      "Upgrade anytime — your site carries over",
    ],
    cta: "Preview my website",
    highlight: false,
  },
  {
    id: "year",
    name: "Unicorn Year",
    priceCents: 999,
    priceLabel: "$9.99",
    period: "per year",
    durationDays: 365,
    tagline: "Your career's home for a full year.",
    features: [
      "Website live for 12 months",
      "Custom domain included (yourname.com)",
      "Unlimited content updates & regeneration",
      "Priority generation queue",
      "SEO-optimized so you rank for your name",
    ],
    cta: "Claim my year",
    highlight: true,
  },
];

export function getPlan(id: string): Plan | undefined {
  return plans.find((p) => p.id === id);
}
