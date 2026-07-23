import type { Metadata } from "next";
import Link from "next/link";
import SectionHeading from "@/components/SectionHeading";
import ShowcaseFeature from "@/components/ShowcaseFeature";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbJsonLd } from "@/lib/seo";
import { featuredShowcase } from "@/content/showcase";

export const metadata: Metadata = {
  title: "Showcase — real personal websites built with CVUnicorn",
  description:
    "See real personal websites built with CVUnicorn, including a CMO's six-section site with work history, keynote galleries, published writing, and more.",
  alternates: { canonical: "/showcase" },
};

const anatomy = [
  {
    title: "Work — a career told as chapters",
    body: "Fifteen years across luxury retail, Web3, and AI, organized as a narrative with quantified wins — $30M year-one digital revenue, 50,000+ users scaled — instead of bullet points.",
  },
  {
    title: "Field — proof you show up",
    body: "Keynotes, brand activations, and corporate events as a visual diary. Uploaded photos become an art-directed gallery that says 'operator', not 'attendee'.",
  },
  {
    title: "Vibe Coding — side projects as range",
    body: "AI prototypes and experiments presented as a lab. Side projects signal curiosity and momentum — CVUnicorn gives them their own stage.",
  },
  {
    title: "Writings & Fiction — a voice, not just a title",
    body: "Thought leadership on Pay-Fi and AI-crypto markets next to speculative fiction. Uploading your writing unlocks a publication-grade reading experience.",
  },
  {
    title: "About — the close",
    body: "A professional summary and contact that converts: after five sections of proof, the ask feels earned.",
  },
];

export default function ShowcasePage() {
  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Showcase", path: "/showcase" },
        ])}
      />
      <section className="bg-aurora px-5 pb-16 pt-10 sm:pt-16">
        <SectionHeading
          eyebrow="Showcase"
          title="Rich input, rich output"
          sub="CVUnicorn scales with what you give it. This site was built from a full upload — CV, metrics, photography, articles, side projects — and it shows."
        />
        <div className="mx-auto mt-12 max-w-6xl">
          <ShowcaseFeature />
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-5 py-16 sm:py-20">
        <SectionHeading
          eyebrow="Anatomy of the site"
          title="What each upload unlocked"
          sub={`A walkthrough of ${featuredShowcase.name.split(" ")[0]}'s six sections — and the material behind each one.`}
        />
        <ol className="mt-12 space-y-5">
          {anatomy.map((a, i) => (
            <li key={a.title} className="card card-hover reveal flex gap-5 p-6">
              <span className="text-gradient font-display text-2xl font-semibold">
                {String(i + 1).padStart(2, "0")}
              </span>
              <div>
                <h3 className="font-semibold text-white">{a.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-ink-300">{a.body}</p>
              </div>
            </li>
          ))}
        </ol>

        <div className="card reveal mt-12 p-7 text-center">
          <h3 className="font-display text-2xl font-semibold text-white">
            Your story could look like this
          </h3>
          <p className="mx-auto mt-2 max-w-md text-sm text-ink-300">
            Upload as much as you can — every photo, article, and win gives the
            AI more to design with.
          </p>
          <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link href="/start" className="btn-primary px-6 py-3 text-sm">
              Build mine now
            </Link>
            <a href={featuredShowcase.url} target="_blank" rel="noopener" className="btn-ghost px-6 py-3 text-sm">
              Visit {featuredShowcase.name}&rsquo;s site
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
