import type { Metadata } from "next";
import Link from "next/link";
import SectionHeading from "@/components/SectionHeading";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbJsonLd } from "@/lib/seo";

export const metadata: Metadata = {
  title: "How it works — from CV to live website in three steps",
  description:
    "How CVUnicorn works: upload your CV and career materials, AI designs a personal website matched to your profession and content, and you're live in about four minutes.",
  alternates: { canonical: "/how-it-works" },
};

const howToJsonLd = {
  "@context": "https://schema.org",
  "@type": "HowTo",
  name: "How to build a personal website with CVUnicorn",
  description:
    "Turn a resume and career materials into a live personal website in about four minutes.",
  totalTime: "PT4M",
  estimatedCost: { "@type": "MonetaryAmount", currency: "USD", value: "0.99" },
  step: [
    {
      "@type": "HowToStep",
      position: 1,
      name: "Add your content",
      text: "Upload your resume or CV, then optionally add photos, projects, articles, press, testimonials, talks, and anything else that tells your professional story.",
    },
    {
      "@type": "HowToStep",
      position: 2,
      name: "Let AI design your site",
      text: "CVUnicorn analyzes your material and profession, then designs the structure, sections, typography, and layout of your personal website automatically.",
    },
    {
      "@type": "HowToStep",
      position: 3,
      name: "Preview and publish",
      text: "Review your finished website, publish it live for $0.99 for 3 days, or keep it for a year with a custom domain for $9.99.",
    },
  ],
};

const details = [
  {
    step: "Step 1",
    title: "Add your content — as little or as much as you want",
    points: [
      "Start with a single file: your resume or CV. That alone produces a complete site.",
      "Then feed the unicorn: profile photos, work samples, project write-ups, articles, social links, press coverage, testimonials, talks, research, launches.",
      "Everything is optional and organized into small, skippable steps — you're never staring at one giant form.",
      "The more you add, the more sections, galleries, and pages your site earns.",
    ],
  },
  {
    step: "Step 2",
    title: "AI reads like an editor, designs like a studio",
    points: [
      "Your material is analyzed for what makes it strong: numbers, narratives, visuals, credentials.",
      "Structure adapts to your profession — publications for academics, case studies for consultants, galleries for designers.",
      "Typography, spacing, color, and hierarchy follow the standards of high-end personal sites.",
      "Nothing generic: your content determines the layout, not a template.",
    ],
  },
  {
    step: "Step 3",
    title: "Preview, publish, own it",
    points: [
      "See your complete website before paying a cent of the yearly price.",
      "$0.99 puts it live for 3 days on a shareable link — the real site, not a demo.",
      "$9.99 keeps it live for a year with a custom domain and unlimited updates.",
      "Renew only if you want to. Your content is never held hostage.",
    ],
  },
];

export default function HowItWorksPage() {
  return (
    <>
      <JsonLd
        data={[
          howToJsonLd,
          breadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "How it works", path: "/how-it-works" },
          ]),
        ]}
      />
      <section className="bg-aurora px-5 pb-4 pt-10 sm:pt-16">
        <SectionHeading
          eyebrow="How it works"
          title="Four minutes, honestly spent"
          sub="No design skills, no code, no template shopping. Here's exactly what happens between your upload and your live site."
        />
      </section>
      <section className="mx-auto max-w-3xl px-5 py-12 sm:py-16">
        <div className="space-y-6">
          {details.map((d) => (
            <article key={d.step} className="card card-hover reveal p-7">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-iris-300">
                {d.step}
              </p>
              <h2 className="mt-2 font-display text-2xl font-semibold text-white">
                {d.title}
              </h2>
              <ul className="mt-4 space-y-2.5">
                {d.points.map((p) => (
                  <li key={p} className="flex items-start gap-2.5 text-sm leading-relaxed text-ink-300">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-gradient-to-r from-iris-400 to-rose-400" />
                    {p}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
        <div className="reveal mt-12 text-center">
          <Link href="/start" className="btn-primary px-7 py-3.5 text-base">
            Start step one now
          </Link>
          <p className="mt-3 text-xs text-ink-400">
            Takes about 4 minutes · From $0.99
          </p>
        </div>
      </section>
    </>
  );
}
