export type ShowcaseSite = {
  name: string;
  role: string;
  url: string;
  live: boolean;
  summary: string;
  sections: string[];
  highlights: string[];
  materials: string; // what they uploaded — reinforces "more content = better site"
};

export const showcaseSites: ShowcaseSite[] = [
  {
    name: "Valerio Li",
    role: "Chief Marketing Officer, AInfinity",
    url: "https://valerioli.vercel.app",
    live: true,
    summary:
      "A marketing and growth leader spanning luxury retail, Web3, and AI. Valerio gave CVUnicorn the full picture — 15 years of work history, keynote photography, published writing, even fiction — and received a six-section personal magazine, not a resume page.",
    sections: ["Work", "Field", "Vibe Coding", "Writings", "Fiction", "About"],
    highlights: [
      "Scaled a fintech app from zero to 50,000+ users across APAC and LATAM",
      "Built a luxury brand's digital business to $30M revenue in year one",
      "Created the global \"Pay-Fi\" narrative across multiple languages",
      "Keynotes and brand activations documented in a visual field diary",
    ],
    materials:
      "Full CV · career metrics · keynote photos · published articles · side projects · fiction writing",
  },
];

export const featuredShowcase = showcaseSites[0];
