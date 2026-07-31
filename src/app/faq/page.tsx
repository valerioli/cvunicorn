import type { Metadata } from "next";
import Link from "next/link";
import SectionHeading from "@/components/SectionHeading";
import FaqList from "@/components/FaqList";
import { T } from "@/components/i18n";
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
      <section className="border-b border-[#e5edf5] bg-white px-5 pb-4 pt-10 sm:pt-16">
        <SectionHeading
          eyebrow={<T en="FAQ" zh="常见问题" />}
          title={<T en="Everything, answered plainly" zh="把所有问题说清楚" />}
          sub={<T en="If it's not here, email us — a human reads every message." zh="如果这里没有回答，欢迎邮件联系我们，每封消息都会有人认真看。" />}
        />
      </section>
      <section className="mx-auto max-w-[1320px] px-5 py-12 sm:py-16">
        <div className="reveal">
          <FaqList faqs={generalFaqs} />
        </div>
        <div className="reveal mt-12">
          <Link href="/start" className="btn-primary px-7 py-3.5 text-base">
            <T en="Build my website" zh="生成我的网站" />
          </Link>
        </div>
      </section>
    </>
  );
}
