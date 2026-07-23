import type { Faq } from "./faqs";

export type Profession = {
  slug: string;
  noun: string; // "founder"
  plural: string; // "Founders"
  headline: string;
  subline: string;
  heroSections: string[]; // sections the generated site emphasizes
  materials: string[]; // what to upload
  example: string;
  faqs: Faq[];
};

export const professions: Profession[] = [
  {
    slug: "founders",
    noun: "founder",
    plural: "Founders",
    headline: "A personal site that raises your next round's first impression",
    subline:
      "Investors and press Google you before they reply. Give them a story — traction, product launches, media, and vision — not a LinkedIn profile.",
    heroSections: ["Vision & bio", "Companies & traction", "Press coverage", "Talks & interviews", "Writing"],
    materials: [
      "Company milestones and business results",
      "Press and PR coverage",
      "Pitch-ready bio and photos",
      "Podcast and conference appearances",
      "Essays or investor updates worth showing",
    ],
    example: "From zero-to-50k-user growth stories to product launch timelines, laid out like a magazine feature.",
    faqs: [
      {
        q: "Why does a startup founder need a personal website?",
        a: "Investors, journalists, and candidates research founders before ever replying to an email. A personal website lets you control that first impression with your traction, story, and press — instead of an outdated LinkedIn page.",
      },
      {
        q: "What should a founder's personal website include?",
        a: "A sharp bio, your companies with concrete results, press coverage, talks and interviews, and a way to contact you. CVUnicorn builds all of these sections automatically from what you upload.",
      },
    ],
  },
  {
    slug: "executives",
    noun: "executive",
    plural: "Executives",
    headline: "Executive presence, online before you walk in the room",
    subline:
      "Boards, recruiters, and teams look you up. Show a career of P&L wins, keynotes, and leadership — designed like it was commissioned.",
    heroSections: ["Leadership bio", "Career highlights & results", "Keynotes & panels", "Press & thought leadership", "Board roles"],
    materials: [
      "Career history with quantified results",
      "Keynote and panel photos or videos",
      "Published thought leadership",
      "Media mentions and interviews",
      "Awards and board positions",
    ],
    example: "Think of a CMO's site with revenue milestones, keynote galleries, and published narratives — one link to send a board.",
    faqs: [
      {
        q: "How is a personal executive website different from LinkedIn?",
        a: "LinkedIn is a database profile that looks identical for everyone. A personal website is your own stage: it ranks for your name on Google, presents your results the way you choose, and signals seniority the way a tailored suit does.",
      },
      {
        q: "What results should an executive highlight?",
        a: "Concrete, quantified outcomes: revenue built, markets turned around, teams scaled, transformations delivered. CVUnicorn turns those numbers into headline moments on your site.",
      },
    ],
  },
  {
    slug: "designers",
    noun: "designer",
    plural: "Designers",
    headline: "A portfolio that looks as good as your work",
    subline:
      "Your taste is your resume. CVUnicorn arranges your projects, case studies, and visuals into gallery-grade layouts that let the work speak.",
    heroSections: ["Selected work", "Case studies", "About & approach", "Recognition", "Contact"],
    materials: [
      "Project images and work samples",
      "Case studies with process and outcomes",
      "Client list and testimonials",
      "Awards and features",
      "A short personal statement",
    ],
    example: "Full-bleed imagery, careful typography, and case studies structured problem → process → result.",
    faqs: [
      {
        q: "Can CVUnicorn handle image-heavy design portfolios?",
        a: "Yes. Upload your project images and CVUnicorn builds gallery layouts with proper art direction — full-bleed heroes, consistent grids, and case study pages — without you touching a layout tool.",
      },
      {
        q: "What makes a strong design portfolio website?",
        a: "Three things: curated work (quality over quantity), case studies that show your thinking, and typography and spacing that demonstrate taste. CVUnicorn enforces all three by design.",
      },
    ],
  },
  {
    slug: "developers",
    noun: "developer",
    plural: "Developers",
    headline: "Ship a personal site as clean as your code",
    subline:
      "Projects, open source, talks, and writing — presented with the polish of a design studio, generated in less time than a CI run.",
    heroSections: ["Projects & open source", "Technical writing", "Talks", "Experience", "Contact"],
    materials: [
      "Project descriptions and links (GitHub, demos)",
      "Blog posts or technical articles",
      "Conference talks and slides",
      "Resume or CV",
      "Certifications",
    ],
    example: "Project cards with impact metrics, embedded writing, and a clean reading experience recruiters actually finish.",
    faqs: [
      {
        q: "Why should a developer have a personal website instead of just GitHub?",
        a: "GitHub shows code; it doesn't explain impact. A personal site frames your best projects with context — what you built, why, and what happened — which is what hiring managers and clients actually evaluate.",
      },
      {
        q: "Can I link my GitHub and live demos?",
        a: "Yes. Add repository links, live demos, package downloads, and talks — CVUnicorn presents them as evidence of shipping, not just a link list.",
      },
    ],
  },
  {
    slug: "academics",
    noun: "academic",
    plural: "Academics",
    headline: "Your research deserves more reach than a faculty page",
    subline:
      "Publications, citations, grants, teaching, and talks — organized into a scholarly site that search engines and colleagues can navigate.",
    heroSections: ["Research overview", "Publications", "Grants & awards", "Teaching", "Talks & service"],
    materials: [
      "Publication list or CV",
      "Research statements and project summaries",
      "Grants, fellowships, and awards",
      "Course list and teaching philosophy",
      "Conference presentations",
    ],
    example: "A publications section with proper citation formatting, research themes explained for humans, and a bio that travels well.",
    faqs: [
      {
        q: "Can CVUnicorn format my publication list?",
        a: "Yes. Upload your CV or publication list and CVUnicorn structures it into a clean, chronological, properly formatted publications section, with links to DOIs, preprints, or PDFs where you provide them.",
      },
      {
        q: "Why do academics need a personal website?",
        a: "University faculty pages are rigid and often outdated. A personal site consolidates your research identity — publications, grants, talks, teaching — under your own name, improving discoverability for collaborators, students, and funders.",
      },
    ],
  },
  {
    slug: "consultants",
    noun: "consultant",
    plural: "Consultants",
    headline: "Turn your track record into your best salesperson",
    subline:
      "Case studies, testimonials, and outcomes — packaged into a credibility engine that closes clients before the first call.",
    heroSections: ["What I do", "Case studies & results", "Testimonials", "Credentials", "Engage"],
    materials: [
      "Case studies with client outcomes",
      "Testimonials and recommendations",
      "Service descriptions",
      "Certifications and credentials",
      "Speaking and workshop history",
    ],
    example: "Outcome-first case studies and social proof arranged to answer a prospect's real question: 'can this person deliver?'",
    faqs: [
      {
        q: "What should a consultant's website emphasize?",
        a: "Proof. Concrete case studies with before/after outcomes, named or anonymized testimonials, and credentials. CVUnicorn structures your material so proof appears before pitch.",
      },
      {
        q: "Can I keep client names confidential?",
        a: "Yes. Describe engagements in anonymized form — industry, problem, outcome — and CVUnicorn presents them as professional case studies without exposing client identities.",
      },
    ],
  },
  {
    slug: "creators",
    noun: "creator",
    plural: "Creators",
    headline: "One link that does your whole story justice",
    subline:
      "Your channels, media appearances, collaborations, and best work — a home base that turns followers into partners and sponsors.",
    heroSections: ["About & channels", "Featured work", "Collaborations & press", "Media kit", "Contact"],
    materials: [
      "Social media profiles and stats",
      "Best videos, posts, or episodes",
      "Brand collaborations and results",
      "Press features and interviews",
      "Photos and visual identity",
    ],
    example: "A link-in-bio that grew up: audience numbers, collaboration highlights, and a media kit brands take seriously.",
    faqs: [
      {
        q: "Is CVUnicorn better than a link-in-bio tool?",
        a: "A link-in-bio page is a list; CVUnicorn builds a full personal website with your story, audience metrics, featured work, and a media kit — the difference between a business card and a storefront.",
      },
      {
        q: "Can I show audience and collaboration metrics?",
        a: "Yes. Add your channel stats and brand collaboration results, and CVUnicorn presents them as clear proof points for sponsors and partners.",
      },
    ],
  },
  {
    slug: "marketers",
    noun: "marketer",
    plural: "Marketers",
    headline: "Market the product you know best: you",
    subline:
      "Campaigns, growth numbers, brand launches, and narratives you created — presented with the storytelling craft you sell every day.",
    heroSections: ["Positioning & bio", "Campaigns & results", "Brand work", "Writing & narratives", "Talks & press"],
    materials: [
      "Campaign case studies with metrics",
      "Brand and launch work",
      "Published narratives or thought leadership",
      "Event and keynote appearances",
      "Career history with growth numbers",
    ],
    example: "Growth stories told like campaigns — hooks, numbers, and outcomes — the way a CMO's own site should read.",
    faqs: [
      {
        q: "What should a marketing leader's personal site include?",
        a: "The campaigns and numbers that made you: user growth, revenue built, brands launched, narratives created, plus talks and press. CVUnicorn turns them into a story-driven site rather than a list of duties.",
      },
      {
        q: "Can I show work across companies and industries?",
        a: "Yes. CVUnicorn organizes multi-company careers into a coherent narrative — by chapter, brand, or theme — so a move from luxury retail to Web3 to AI reads as range, not randomness.",
      },
    ],
  },
];

export function getProfession(slug: string) {
  return professions.find((p) => p.slug === slug);
}
