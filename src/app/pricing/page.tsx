import type { Metadata } from "next";
import Link from "next/link";
import PricingCards from "@/components/PricingCards";
import SectionHeading from "@/components/SectionHeading";
import FaqList from "@/components/FaqList";
import { T } from "@/components/i18n";
import { JsonLd } from "@/components/JsonLd";
import { productJsonLd, faqJsonLd, breadcrumbJsonLd } from "@/lib/seo";
import type { Faq } from "@/content/faqs";

export const metadata: Metadata = {
  title: "Pricing — $0.99 preview or $9.99 for a year with domain",
  description:
    "CVUnicorn pricing: get your AI-built personal website live for 3 days for $0.99, or for a full year with a custom domain for $9.99. One-time payments, no subscription.",
  alternates: { canonical: "/pricing" },
};

const pricingFaqs: Faq[] = [
  {
    q: "Is CVUnicorn a subscription?",
    a: "No. Both plans are one-time payments. The Preview Pass ($0.99) keeps your site live for 3 days; Unicorn Year ($9.99) keeps it live for 12 months with a custom domain. You choose if and when to renew.",
  },
  {
    q: "What does the $0.99 Preview Pass include?",
    a: "Everything. Your complete website with every section your content unlocks, live on a shareable link for 3 days. It exists so you can see the real thing — not a cropped screenshot — before committing to a year.",
  },
  {
    q: "What does the $9.99 Unicorn Year include?",
    a: "Your website live for 12 months, a custom domain (like yourname.com), unlimited content updates and regeneration, priority generation, and SEO optimization so you rank for your own name.",
  },
  {
    q: "Can I upgrade from the Preview Pass to Unicorn Year?",
    a: "Yes, at any time — including after the preview expires. Your website and all your content carry over exactly as they were.",
  },
  {
    q: "What payment methods do you accept?",
    a: "Major credit and debit cards through Stripe Checkout. CVUnicorn never sees or stores your card details.",
  },
  {
    q: "What is your refund policy?",
    a: "If your website fails to generate or a technical fault on our side keeps it offline, we refund you in full. See our Refund Policy for details.",
  },
];

export default function PricingPage() {
  return (
    <>
      <JsonLd
        data={[
          productJsonLd(),
          faqJsonLd(pricingFaqs),
          breadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "Pricing", path: "/pricing" },
          ]),
        ]}
      />
      <section className="border-b border-[#e5edf5] bg-white px-5 pb-16 pt-10 sm:pt-16">
        <SectionHeading as="h1"
          eyebrow={<T en="Pricing" zh="价格" />}
          title={<T en="Two prices. Zero fine print." zh="两个价格，没有隐藏条款。" />}
          sub={<T en="Try the real thing for less than a dollar. Keep it for a year for less than lunch." zh="不到 1 美元先试真实网站；全年上线价格比一顿午餐还低。" />}
        />
        <div className="mx-auto mt-12 max-w-[1320px]">
          <PricingCards />
        </div>
        <p className="reveal mt-8 text-sm text-[#64748d]">
          <T en="Prices in USD. Taxes may apply at checkout depending on your country." zh="价格以美元计。根据你所在国家或地区，结账时可能产生税费。" />
        </p>
      </section>

      <section className="mx-auto max-w-[1320px] px-5 py-16 sm:py-20">
        <SectionHeading
          eyebrow={<T en="Pricing questions" zh="价格问题" />}
          title={<T en="The details, plainly" zh="把细节说清楚" />}
        />
        <div className="reveal mt-10">
          <FaqList faqs={pricingFaqs} />
        </div>
        <div className="reveal mt-10">
          <Link href="/start" className="btn-primary px-7 py-3.5 text-base">
            <T en="Build my website now" zh="现在生成我的网站" />
          </Link>
        </div>
      </section>
    </>
  );
}
