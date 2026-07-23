import type { Metadata } from "next";
import Link from "next/link";
import SectionHeading from "@/components/SectionHeading";
import FaqList from "@/components/FaqList";
import { JsonLd } from "@/components/JsonLd";
import { faqJsonLd, breadcrumbJsonLd } from "@/lib/seo";
import { generalFaqs } from "@/content/faqs";

export const metadata: Metadata = {
  title: "FAQ — everything about CVUnicorn, answered plainly",
  description:
    "What CVUnicorn is, how much it costs, what you can include on your personal website, how long generation takes, custom domains, privacy, and more.",
  alternates: { canonical: "/faq" },
};

export default function FaqPage() {
  return (
    <>
      <JsonLd
        data={[
          faqJsonLd(generalFaqs),
          breadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "FAQ", path: "/faq" },
          ]),
        ]}
      />
      <section className="bg-aurora px-5 pb-4 pt-10 sm:pt-16">
        <SectionHeading
          eyebrow="FAQ"
          title="Everything, answered plainly"
          sub="If it's not here, email us — a human reads every message."
        />
      </section>
      <section className="mx-auto max-w-6xl px-5 py-12 sm:py-16">
        <div className="reveal">
          <FaqList faqs={generalFaqs} />
        </div>
        <div className="reveal mt-12 text-center">
          <Link href="/start" className="btn-primary px-7 py-3.5 text-base">
            Build my website
          </Link>
        </div>
      </section>
    </>
  );
}
