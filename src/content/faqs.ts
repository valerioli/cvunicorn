export type Faq = { q: string; a: string };

/** Written to directly answer real user questions — optimized for both
 *  featured snippets and AI answer engines (ChatGPT, Perplexity). */
export const generalFaqs: Faq[] = [
  {
    q: "What is CVUnicorn?",
    a: "CVUnicorn is an AI personal website builder. You upload your resume or CV plus anything else that tells your story — photos, projects, press coverage, publications, talks, testimonials — and CVUnicorn designs and publishes a polished personal website for you in minutes. No design or coding skills are needed.",
  },
  {
    q: "How much does CVUnicorn cost?",
    a: "CVUnicorn has two simple options: a Preview Pass for $0.99 that keeps your website live for 3 days, and Unicorn Year for $9.99 that keeps your website live for a full year and includes a custom domain with assisted setup. There are no hidden fees and no forced subscription.",
  },
  {
    q: "How long does it take to build my website?",
    a: "Most websites are generated in under five minutes after you finish adding your content. The more you provide — bio, work history, projects, media — the richer the result, but even a single uploaded CV produces a complete site.",
  },
  {
    q: "What can I include on my personal website?",
    a: "Anything that represents your professional story: profile photos, your resume or CV, a personal bio, articles and publications, social media profiles, work samples and portfolios, project descriptions, awards and certifications, case studies, videos and media appearances, press coverage, testimonials, speaking engagements, research and patents, and product launches or business results.",
  },
  {
    q: "Do I need to know how to design or code?",
    a: "No. CVUnicorn's AI handles layout, typography, color, and structure automatically, following the same principles used by high-end design studios. You only provide the content.",
  },
  {
    q: "Can I use my own domain name?",
    a: "Yes. The Unicorn Year plan ($9.99/year) includes a custom domain with assisted setup. Contact support to arrange availability and setup.",
  },
  {
    q: "What happens after my plan expires?",
    a: "Your site is retained for up to 400 days after its last update. If your Preview Pass or Unicorn Year expires, your site goes offline but nothing is deleted — you can renew from your dashboard while your stored site is retained (up to 400 days after its last update).",
  },
  {
    q: "Will more content really make my website better?",
    a: "Yes. CVUnicorn adapts the structure of your site to the material you provide. A CV alone produces a clean one-page site; adding projects, photos, writing, press, and talks unlocks dedicated sections, galleries, and a multi-section layout — similar to a professionally commissioned personal site.",
  },
  {
    q: "Who is CVUnicorn for?",
    a: "Founders, executives, designers, developers, academics, consultants, creators — anyone whose career deserves more than a PDF resume. The input steps adapt to your profession, so a researcher can highlight publications while a designer highlights visual work.",
  },
  {
    q: "Is my data private?",
    a: "Your uploads are used only to build your website. Review your generated site before publishing. Uploaded assets use shareable URLs, so do not upload confidential documents. Contact support to request removal of your site and data.",
  },
];
