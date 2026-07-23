import Link from "next/link";
import type { Metadata } from "next";
import SiteMockup from "@/components/SiteMockup";
import ShowcaseFeature from "@/components/ShowcaseFeature";
import SectionHeading from "@/components/SectionHeading";
import PricingCards from "@/components/PricingCards";
import FaqList from "@/components/FaqList";
import { JsonLd } from "@/components/JsonLd";
import { productJsonLd, faqJsonLd } from "@/lib/seo";
import { generalFaqs } from "@/content/faqs";
import { professions } from "@/content/professions";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

const contentTypes = [
  { icon: "📸", label: "Photos & images" },
  { icon: "📄", label: "Resume / CV" },
  { icon: "✍️", label: "Bio & introduction" },
  { icon: "📰", label: "Articles & publications" },
  { icon: "🔗", label: "Social profiles" },
  { icon: "🎨", label: "Work samples & portfolio" },
  { icon: "🛠", label: "Projects" },
  { icon: "🏆", label: "Awards & certifications" },
  { icon: "📊", label: "Case studies" },
  { icon: "🎬", label: "Videos & media" },
  { icon: "🗞", label: "PR & news coverage" },
  { icon: "💬", label: "Testimonials" },
  { icon: "🎤", label: "Speaking engagements" },
  { icon: "🔬", label: "Research & patents" },
  { icon: "🚀", label: "Launches & results" },
  { icon: "✨", label: "Anything else you're proud of" },
];

const steps = [
  {
    n: "01",
    title: "Give us everything",
    body: "Drop in your CV and add as much of your story as you like — photos, projects, press, talks, testimonials. Every field is optional; every addition makes your site richer.",
  },
  {
    n: "02",
    title: "AI designs your site",
    body: "CVUnicorn reads your material like an editor and designs like a studio: structure, typography, galleries, and narrative — matched to your profession and content.",
  },
  {
    n: "03",
    title: "Go live in minutes",
    body: "Preview your finished website, then publish for $0.99. Love it? Keep it for a year with your own domain for $9.99. No subscription traps.",
  },
];

export default function HomePage() {
  return (
    <>
      <JsonLd data={[productJsonLd(), faqJsonLd(generalFaqs.slice(0, 5))]} />

      {/* ————— HERO ————— */}
      <section className="bg-aurora relative overflow-hidden">
        <div className="mx-auto max-w-6xl px-5 pb-20 pt-14 text-center sm:pt-20">
          <p className="reveal mx-auto inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/4 px-4 py-1.5 text-xs font-medium text-ink-200">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-mint-400" />
            AI-built personal websites, live in minutes
          </p>
          <h1 className="reveal mx-auto mt-6 max-w-4xl font-display text-4xl font-semibold leading-[1.05] tracking-tight text-white sm:text-6xl md:text-7xl">
            Your career deserves
            <br />
            <span className="text-gradient">more than a PDF.</span>
          </h1>
          <p className="reveal mx-auto mt-6 max-w-xl text-base leading-relaxed text-ink-300 sm:text-lg">
            Upload your CV, photos, projects, press, and story. CVUnicorn
            designs a personal website that looks commissioned — for less than
            a coffee.
          </p>
          <div className="reveal mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link href="/start" className="btn-primary px-7 py-3.5 text-base">
              Build my website
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M5 12h14m-6-6 6 6-6 6" />
              </svg>
            </Link>
            <Link href="/showcase" className="btn-ghost px-7 py-3.5 text-base">
              See a real example
            </Link>
          </div>
          <p className="reveal mt-4 text-xs text-ink-400">
            From $0.99 · No account needed to start · Ready in ~4 minutes
          </p>

          <div className="mt-14 sm:mt-16">
            <SiteMockup />
          </div>
        </div>
      </section>

      {/* ————— HOW IT WORKS ————— */}
      <section className="mx-auto max-w-6xl px-5 py-20 sm:py-24" aria-labelledby="how">
        <SectionHeading
          eyebrow="How it works"
          title={<span id="how">Three steps between you and unforgettable</span>}
          sub="No templates to fight, no drag-and-drop, no design decisions. You bring the substance; CVUnicorn brings the style."
        />
        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {steps.map((s) => (
            <article key={s.n} className="card card-hover reveal p-7">
              <span className="text-gradient font-display text-4xl font-semibold">{s.n}</span>
              <h3 className="mt-4 text-lg font-semibold text-white">{s.title}</h3>
              <p className="mt-2.5 text-sm leading-relaxed text-ink-300">{s.body}</p>
            </article>
          ))}
        </div>
      </section>

      {/* ————— SHOWCASE ————— */}
      <section className="bg-aurora border-y border-white/6 py-20 sm:py-24" aria-labelledby="showcase">
        <div className="mx-auto max-w-6xl px-5">
          <SectionHeading
            eyebrow="Showcase"
            title={<span id="showcase">This is what &ldquo;upload everything&rdquo; buys you</span>}
            sub="A real CVUnicorn site, live right now. Rich input, rich output — six sections, galleries, writing, and a career told like a story."
          />
          <div className="mt-12">
            <ShowcaseFeature />
          </div>
          <p className="reveal mt-6 text-center text-sm text-ink-400">
            Give us this much, get this much.{" "}
            <Link href="/showcase" className="text-iris-300 underline decoration-iris-300/40 underline-offset-4 hover:text-iris-400">
              Explore the showcase →
            </Link>
          </p>
        </div>
      </section>

      {/* ————— WHAT YOU CAN INCLUDE ————— */}
      <section className="mx-auto max-w-6xl px-5 py-20 sm:py-24" aria-labelledby="include">
        <SectionHeading
          eyebrow="Bring your whole story"
          title={<span id="include">Everything you are, on one site</span>}
          sub="A CV alone makes a clean site. Add more, and CVUnicorn unlocks galleries, case studies, press sections, and a multi-page layout automatically."
        />
        <ul className="mt-12 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {contentTypes.map((c) => (
            <li
              key={c.label}
              className="card card-hover reveal flex items-center gap-3 rounded-xl px-4 py-3.5 text-sm text-ink-200"
            >
              <span aria-hidden="true" className="text-lg">{c.icon}</span>
              {c.label}
            </li>
          ))}
        </ul>
        <div className="reveal mt-10 text-center">
          <Link href="/start" className="btn-primary px-6 py-3 text-sm">
            Start with just a CV — add the rest anytime
          </Link>
        </div>
      </section>

      {/* ————— FOR EVERY PROFESSION ————— */}
      <section className="border-y border-white/6 py-20 sm:py-24" aria-labelledby="professions">
        <div className="mx-auto max-w-6xl px-5">
          <SectionHeading
            eyebrow="Made for your field"
            title={<span id="professions">Your profession sets the stage</span>}
            sub="CVUnicorn adapts structure and emphasis to your line of work — publications for academics, galleries for designers, traction for founders."
          />
          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {professions.map((p) => (
              <Link
                key={p.slug}
                href={`/for/${p.slug}`}
                className="card card-hover reveal group p-5"
              >
                <h3 className="flex items-center justify-between text-base font-semibold text-white">
                  {p.plural}
                  <svg className="h-4 w-4 text-ink-400 transition group-hover:translate-x-1 group-hover:text-iris-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M5 12h14m-6-6 6 6-6 6" />
                  </svg>
                </h3>
                <p className="mt-2 text-xs leading-relaxed text-ink-400">{p.headline}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ————— PRICING ————— */}
      <section className="bg-aurora mx-auto max-w-6xl px-5 py-20 sm:py-24" aria-labelledby="pricing">
        <SectionHeading
          eyebrow="Pricing"
          title={<span id="pricing">Less than a coffee. Looks like a retainer.</span>}
          sub="One-time payments. No subscriptions you forget to cancel."
        />
        <div className="mt-12">
          <PricingCards />
        </div>
      </section>

      {/* ————— FAQ TEASER ————— */}
      <section className="mx-auto max-w-6xl px-5 py-20 sm:py-24" aria-labelledby="faq">
        <SectionHeading
          eyebrow="Questions"
          title={<span id="faq">Answers, before you ask</span>}
        />
        <div className="reveal mt-10">
          <FaqList faqs={generalFaqs.slice(0, 5)} />
        </div>
        <p className="reveal mt-6 text-center text-sm text-ink-400">
          More questions?{" "}
          <Link href="/faq" className="text-iris-300 underline decoration-iris-300/40 underline-offset-4 hover:text-iris-400">
            Read the full FAQ →
          </Link>
        </p>
      </section>

      {/* ————— FINAL CTA ————— */}
      <section className="relative overflow-hidden border-t border-white/6">
        <div className="bg-aurora noise relative mx-auto max-w-6xl px-5 py-24 text-center">
          <h2 className="reveal font-display text-4xl font-semibold tracking-tight text-white sm:text-5xl">
            Be the result people find
            <br />
            when they <span className="text-gradient">Google your name.</span>
          </h2>
          <p className="reveal mx-auto mt-5 max-w-md text-ink-300">
            Four minutes from now, your career could have a home it deserves.
          </p>
          <div className="reveal mt-8">
            <Link href="/start" className="btn-primary px-8 py-4 text-base">
              Build my website — from $0.99
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
