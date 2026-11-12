import type { Metadata } from "next";
import Link from "next/link";
import SectionHeading from "@/components/SectionHeading";
import CaseStudies from "@/components/CaseStudies";
import { T } from "@/components/i18n";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbJsonLd } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Showcase — generated personal websites",
  description:
    "Explore four generated personal websites from CVUnicorn, each with a distinct style and live embedded preview.",
  alternates: { canonical: "/showcase" },
};

const outputDetails = [
  {
    title: { en: "Distinct visual systems", zh: "不同视觉系统" },
    body: {
      en: "Each site uses its own design direction, not one CVUnicorn house style repeated four times.",
      zh: "每个网站都有独立设计方向，而不是把同一种 CVUnicorn 风格重复四次。",
    },
  },
  {
    title: { en: "Working design examples", zh: "可浏览的设计示例" },
    body: {
      en: "The previews are live pages with sections, imagery, motion, proof, and calls to action.",
      zh: "预览是真实页面，包含板块、图片、动效、证据和行动入口。",
    },
  },
  {
    title: { en: "Content-led structure", zh: "内容决定结构" },
    body: {
      en: "Finance, design, research, and executive profiles produce different rhythms and evidence layouts.",
      zh: "财务、设计、研究和高管履历会生成不同节奏和证据结构。",
    },
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

      <section className="border-b border-[#e5edf5] bg-white px-5 pb-16 pt-10 sm:pt-16">
        <SectionHeading as="h1"
          eyebrow={<T en="Showcase" zh="案例展示" />}
          title={<T en="Explore four personal site designs" zh="查看四种个人网站设计" />}
          sub={<T en="Explore a live portfolio and three illustrative design demos. Open any preview to see the complete page." zh="查看一个真实个人网站与三个示例人物的设计演示，打开任意预览可浏览完整页面。" />}
        />
        <div className="stagger mx-auto mt-12 max-w-[1320px]">
          <CaseStudies />
        </div>
      </section>

      <section className="mx-auto max-w-[1320px] px-5 py-16 sm:py-20">
        <SectionHeading
          eyebrow={<T en="What changes" zh="生成差异" />}
          title={<T en="The output follows the person, not a template" zh="输出跟随个人，而不是模板" />}
          sub={<T en="CVUnicorn uses your materials to decide what should become a hero, a proof section, a gallery, a case study, or a quieter note." zh="CVUnicorn 会根据你的材料决定哪些内容适合成为首屏、证据板块、图库、案例或更克制的说明。" />}
        />
        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {outputDetails.map((detail, index) => (
            <article key={detail.title.en} className="card card-hover reveal p-6">
              <span className="font-display text-2xl font-light text-[#061b31]">
                {String(index + 1).padStart(2, "0")}
              </span>
              <h3 className="mt-4 font-normal text-[#061b31]">
                <T en={detail.title.en} zh={detail.title.zh} />
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-[#50617a]">
                <T en={detail.body.en} zh={detail.body.zh} />
              </p>
            </article>
          ))}
        </div>

        <div className="card reveal mt-12 bg-[#f8fafd] p-7">
          <h3 className="font-display text-2xl font-light text-[#061b31]">
            <T en="Build yours from what you already have" zh="用你已有的材料生成一个" />
          </h3>
          <p className="mt-2 max-w-md text-sm text-[#50617a]">
            <T en="Start with anything: a CV, a few links, a portfolio PDF, or just a paragraph." zh="可以从任何材料开始：简历、几个链接、作品集 PDF，甚至只是一段文字。" />
          </p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <Link href="/start" className="btn-primary px-6 py-3 text-sm">
              <T en="Build mine now" zh="生成我的网站" />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
