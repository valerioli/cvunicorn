import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import SectionHeading from "@/components/SectionHeading";
import FaqList from "@/components/FaqList";
import { JsonLd } from "@/components/JsonLd";
import { faqJsonLd, breadcrumbJsonLd, SITE } from "@/lib/seo";
import { professions, getProfession } from "@/content/professions";

type Params = { profession: string };

export function generateStaticParams(): Params[] {
  return professions.map((p) => ({ profession: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { profession } = await params;
  const p = getProfession(profession);
  if (!p) return {};
  return {
    title: `Personal websites for ${p.plural.toLowerCase()} — ${p.headline}`,
    description: `${p.subline} Built by AI from your CV and career materials, live in minutes from $0.99.`,
    alternates: { canonical: `/for/${p.slug}` },
    openGraph: {
      title: `${SITE.name} for ${p.plural}`,
      description: p.subline,
    },
  };
}

export default async function ProfessionPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { profession } = await params;
  const p = getProfession(profession);
  if (!p) notFound();

  return (
    <>
      <JsonLd
        data={[
          faqJsonLd(p.faqs),
          breadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: `For ${p.plural}`, path: `/for/${p.slug}` },
          ]),
        ]}
      />
      <section className="border-b border-[#e5edf5] bg-white px-5 pb-16 pt-10 sm:pt-16">
        <p className="reveal inline-flex rounded-[4px] border border-[#d6d9fc] bg-[#f8fafd] px-3 py-1.5 text-xs font-normal uppercase tracking-[0.08em] text-[#533afd]">
          CVUnicorn for {p.plural}
        </p>
        <h1 className="reveal mt-5 max-w-3xl font-display text-4xl font-light leading-[1.04] tracking-[-0.02em] text-[#061b31] sm:text-5xl">
          {p.headline}
        </h1>
        <p className="reveal mt-5 max-w-xl text-base font-light leading-relaxed text-[#50617a] sm:text-xl">
          {p.subline}
        </p>
        <div className="reveal mt-8">
          <Link href="/start" className="btn-primary px-7 py-3.5 text-base">
            Build my {p.noun} site
          </Link>
          <p className="mt-3 text-xs text-ink-400">From $0.99 · Live in ~4 minutes</p>
        </div>
      </section>

      <section className="mx-auto max-w-[1320px] border-b border-[#e5edf5] px-5 py-16 sm:py-20">
        <div className="grid gap-5 md:grid-cols-2">
          <div className="card card-hover reveal p-7">
            <h2 className="text-lg font-normal text-[#061b31]">
              Your site's structure, tuned for {p.plural.toLowerCase()}
            </h2>
            <p className="mt-2 text-sm text-[#50617a]">
              Sections CVUnicorn typically builds from a {p.noun}'s materials:
            </p>
            <ul className="mt-4 space-y-2.5">
              {p.heroSections.map((s, i) => (
                <li key={s} className="flex items-center gap-3 text-sm text-[#50617a]">
                  <span className="font-display text-base font-light text-[#061b31]">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  {s}
                </li>
              ))}
            </ul>
          </div>
          <div className="card card-hover reveal p-7">
            <h2 className="text-lg font-normal text-[#061b31]">What to upload</h2>
            <p className="mt-2 text-sm text-[#50617a]">
              All optional — each one makes your site stronger:
            </p>
            <ul className="mt-4 space-y-2.5">
              {p.materials.map((m) => (
                <li key={m} className="flex items-start gap-2.5 text-sm text-[#50617a]">
                  <svg className="mt-0.5 h-4 w-4 shrink-0 text-[#533afd]" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="m4 10.5 4 4 8-9" />
                  </svg>
                  {m}
                </li>
              ))}
            </ul>
            <p className="mt-5 rounded-[4px] border border-[#e5edf5] bg-[#f8fafd] p-3.5 text-xs leading-relaxed text-[#50617a]">
              {p.example}
            </p>
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-[1320px] px-5">
          <SectionHeading
            eyebrow="Common questions"
            title={`${p.plural} ask us`}
          />
          <div className="reveal mt-8">
            <FaqList faqs={p.faqs} />
          </div>
          <div className="reveal mt-10">
            <Link href="/start" className="btn-primary px-7 py-3.5 text-sm">
              Build my website
            </Link>
            <p className="mt-4 text-xs text-[#64748d]">
              Not a {p.noun}?{" "}
              <Link href="/" className="text-[#533afd] hover:underline">
                CVUnicorn works for every profession →
              </Link>
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
