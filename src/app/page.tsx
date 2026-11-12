import Link from "next/link";
import type { Metadata } from "next";
import SiteMockup from "@/components/SiteMockup";
import CaseStudies from "@/components/CaseStudies";
import SectionHeading from "@/components/SectionHeading";
import { T } from "@/components/i18n";
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
  { en: "Photos & images", zh: "照片与图片" },
  { en: "Resume / CV", zh: "简历 / CV" },
  { en: "Bio & introduction", zh: "个人介绍" },
  { en: "Articles & publications", zh: "文章与发表内容" },
  { en: "Social profiles", zh: "社交主页" },
  { en: "Work samples & portfolio", zh: "作品与项目集" },
  { en: "Projects", zh: "项目" },
  { en: "Awards & certifications", zh: "奖项与证书" },
  { en: "Case studies", zh: "案例" },
  { en: "Videos & media", zh: "视频与媒体" },
  { en: "PR & news coverage", zh: "媒体报道" },
  { en: "Testimonials", zh: "推荐语" },
  { en: "Speaking engagements", zh: "演讲活动" },
  { en: "Research & patents", zh: "研究与专利" },
  { en: "Launches & results", zh: "发布与成果" },
  { en: "Anything else you're proud of", zh: "任何你引以为傲的材料" },
];

const steps = [
  {
    n: "01",
    title: { en: "Give us anything", zh: "给我们任意材料" },
    body: {
      en: "Start with a CV, a paragraph, a few links, or a folder of work. Your name and headline get you started; every extra detail simply gives CVUnicorn more to shape.",
      zh: "可以从一份简历、一段介绍、几个链接或一组作品开始。只需先填写姓名和职业标题；额外材料只会让生成的网站更丰富。",
    },
  },
  {
    n: "02",
    title: { en: "AI designs your site", zh: "AI 设计你的网站" },
    body: {
      en: "CVUnicorn reads your material like an editor and designs like a studio: structure, typography, galleries, and narrative — matched to your profession and content.",
      zh: "CVUnicorn 像编辑一样理解材料，像设计工作室一样组织结构、排版、图库和叙事，并匹配你的职业场景。",
    },
  },
  {
    n: "03",
    title: { en: "Go live in minutes", zh: "几分钟内上线" },
    body: {
      en: "Choose a hosting pass from $0.99, generate your site, then review it before publishing. A year costs $9.99, with support for connecting your own domain.",
      zh: "选择 0.99 美元起的方案，生成网站后先检查，再发布。年费 9.99 美元，可协助绑定你已有的域名。",
    },
  },
];

export default function HomePage() {
  return (
    <>
      <JsonLd data={[productJsonLd(), faqJsonLd(generalFaqs.slice(0, 5))]} />

      {/* ————— HERO ————— */}
      <section className="relative overflow-hidden border-b border-[#e5edf5] bg-white">
        <div aria-hidden="true" className="absolute inset-x-0 top-0 h-40 bg-[linear-gradient(180deg,rgba(232,233,255,0.72),transparent)]" />
        <div className="mx-auto grid max-w-[1320px] gap-12 px-5 pb-20 pt-14 sm:pt-20 lg:grid-cols-[minmax(0,0.9fr)_minmax(420px,0.8fr)] lg:items-center">
          <div className="relative">
          <p className="reveal inline-flex items-center gap-2 rounded-[4px] border border-[#d6d9fc] bg-[#f8fafd] px-3 py-1.5 text-xs font-normal text-[#533afd]">
            <span className="h-1.5 w-1.5 bg-[#533afd]" />
            <T en="AI-built personal websites, live in minutes" zh="AI 生成个人网站，几分钟上线" />
          </p>
          <h1 className="reveal mt-6 max-w-4xl font-display text-5xl font-light leading-[1.03] tracking-[-0.025em] text-[#061b31] sm:text-6xl md:text-7xl">
            <T en="Your career deserves" zh="你的职业经历值得" />
            <br />
            {" "}
            <span className="text-[#533afd]">
              <T en="more than a PDF." zh="不止一份 PDF。" />
            </span>
          </h1>
          <p className="reveal mt-6 max-w-xl text-base font-light leading-relaxed text-[#50617a] sm:text-xl">
            <T
              en="Start with whatever you have: a CV, photos, projects, press, links, or a few notes. CVUnicorn designs a personal website that looks commissioned — for less than a coffee."
              zh="从你手头已有的任何材料开始：简历、照片、项目、报道、链接，甚至几段笔记。CVUnicorn 会生成一个像定制设计一样的个人网站，价格还不到一杯咖啡。"
            />
          </p>
          <div className="reveal mt-8 flex flex-col gap-3 sm:flex-row">
            <Link href="/start" className="btn-primary px-7 py-3.5 text-base">
              <T en="Build my website" zh="生成我的网站" />
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M5 12h14m-6-6 6 6-6 6" />
              </svg>
            </Link>
            <Link href="/showcase" className="btn-ghost px-7 py-3.5 text-base">
              <T en="See generated sites" zh="查看生成网站案例" />
            </Link>
          </div>
          <p className="reveal mt-4 text-xs text-ink-400">
            <T
              en="From $0.99 · No account needed to start · Ready in ~4 minutes"
              zh="0.99 美元起 · 开始无需注册 · 约 4 分钟生成"
            />
          </p>
          </div>

          <div className="relative">
            <SiteMockup />
          </div>
        </div>
      </section>

      {/* ————— HOW IT WORKS ————— */}
      <section className="mx-auto max-w-[1320px] border-b border-[#e5edf5] px-5 py-20 sm:py-24" aria-labelledby="how">
        <SectionHeading
          eyebrow={<T en="How it works" zh="如何运作" />}
          title={<span id="how"><T en="Three steps between you and unforgettable" zh="三步生成令人记住的个人网站" /></span>}
          sub={<T en="No templates to fight, no drag-and-drop, no design decisions. Bring anything you already have; CVUnicorn brings the structure and style." zh="不用折腾模板，不用拖拽排版，也不用自己做设计决定。带来你已有的任何材料，CVUnicorn 负责结构和风格。" />}
        />
        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {steps.map((s) => (
            <article key={s.n} className="card card-hover reveal p-7">
              <span className="font-display text-4xl font-light text-[#061b31]">{s.n}</span>
              <h3 className="mt-4 text-lg font-normal text-[#061b31]">
                <T en={s.title.en} zh={s.title.zh} />
              </h3>
              <p className="mt-2.5 text-sm leading-relaxed text-[#50617a]">
                <T en={s.body.en} zh={s.body.zh} />
              </p>
            </article>
          ))}
        </div>
      </section>

      {/* ————— CASE STUDIES ————— */}
      <section className="mx-auto max-w-[1320px] border-b border-[#e5edf5] px-5 py-20 sm:py-24" aria-labelledby="showcase">
        <SectionHeading
          eyebrow={<T en="Showcase" zh="案例展示" />}
          title={<span id="showcase"><T en="Four websites, embedded on the page" zh="4 个网站，直接嵌入页面预览" /></span>}
          sub={<T en="A live portfolio and three illustrative design demos. Open each to explore its full layout." zh="一个真实个人网站与三个设计演示。打开查看完整布局与风格。" />}
        />
        <div className="stagger mt-12">
          <CaseStudies />
        </div>
      </section>

      {/* ————— WHAT YOU CAN INCLUDE ————— */}
      <section className="mx-auto max-w-[1320px] border-b border-[#e5edf5] px-5 py-20 sm:py-24" aria-labelledby="include">
        <SectionHeading
          eyebrow={<T en="Bring what you have" zh="带来你已有的材料" />}
          title={<span id="include"><T en="Anything can become a starting point" zh="任何材料都可以成为起点" /></span>}
          sub={<T en="A CV alone makes a clean site. Add more when you want, and CVUnicorn unlocks galleries, case studies, press sections, and richer layouts automatically." zh="只有简历也能生成干净的网站。你愿意补充更多材料时，CVUnicorn 会自动生成图库、案例、媒体报道和更丰富的页面结构。" />}
        />
        <ul className="mt-12 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {contentTypes.map((label) => (
            <li
              key={label.en}
              className="card card-hover reveal flex items-center gap-3 px-4 py-3.5 text-sm text-[#50617a]"
            >
              <span aria-hidden="true" className="h-1.5 w-1.5 bg-[#533afd]" />
              <T en={label.en} zh={label.zh} />
            </li>
          ))}
        </ul>
        <div className="reveal mt-10 text-center">
          <Link href="/start" className="btn-primary px-6 py-3 text-sm">
            <T en="Start with just a CV — add the rest anytime" zh="只用简历开始，其他材料随时补充" />
          </Link>
        </div>
      </section>

      {/* ————— FOR EVERY PROFESSION ————— */}
      <section className="border-b border-[#e5edf5] py-20 sm:py-24" aria-labelledby="professions">
        <div className="mx-auto max-w-[1320px] px-5">
          <SectionHeading
            eyebrow={<T en="Made for your field" zh="适配你的职业" />}
            title={<span id="professions"><T en="Your profession sets the stage" zh="职业不同，网站重点也不同" /></span>}
            sub={<T en="CVUnicorn adapts structure and emphasis to your line of work — publications for academics, galleries for designers, traction for founders." zh="CVUnicorn 会根据你的职业调整结构和重点：学者突出论文，设计师突出图库，创始人突出增长和融资故事。" />}
          />
          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {professions.map((p) => (
              <Link
                key={p.slug}
                href={`/for/${p.slug}`}
                className="card card-hover reveal group p-5"
              >
                <h3 className="flex items-center justify-between text-base font-normal text-[#061b31]">
                  {p.plural}
                  <svg className="h-4 w-4 text-[#533afd] transition group-hover:translate-x-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M5 12h14m-6-6 6 6-6 6" />
                  </svg>
                </h3>
                <p className="mt-2 text-xs leading-relaxed text-[#50617a]">{p.headline}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ————— PRICING ————— */}
      <section className="mx-auto max-w-[1320px] border-b border-[#e5edf5] px-5 py-20 sm:py-24" aria-labelledby="pricing">
        <SectionHeading
          eyebrow={<T en="Pricing" zh="价格" />}
          title={<span id="pricing"><T en="Less than a coffee. Looks like a retainer." zh="不到一杯咖啡，像定制服务一样精致。" /></span>}
          sub={<T en="One-time payments. No subscriptions you forget to cancel." zh="一次性付款，没有容易忘记取消的订阅。" />}
        />
        <div className="mt-12">
          <PricingCards />
        </div>
      </section>

      {/* ————— FAQ TEASER ————— */}
      <section className="mx-auto max-w-[1320px] border-b border-[#e5edf5] px-5 py-20 sm:py-24" aria-labelledby="faq">
        <SectionHeading
          eyebrow={<T en="Questions" zh="问题" />}
          title={<span id="faq"><T en="Answers, before you ask" zh="你可能想先知道这些" /></span>}
        />
        <div className="reveal mt-10">
          <FaqList faqs={generalFaqs.slice(0, 5)} />
        </div>
        <p className="reveal mt-6 text-sm text-[#50617a]">
          <T en="More questions?" zh="还有问题？" />{" "}
          <Link href="/faq" className="text-[#533afd] underline decoration-[#533afd] underline-offset-4 hover:text-[#7389ff]">
            <T en="Read the full FAQ →" zh="查看完整 FAQ →" />
          </Link>
        </p>
      </section>

      {/* ————— FINAL CTA ————— */}
      <section className="relative overflow-hidden">
        <div className="relative mx-auto max-w-[1320px] px-5 py-24">
          <h2 className="reveal max-w-3xl font-display text-4xl font-light tracking-[-0.02em] text-[#061b31] sm:text-5xl">
            <T en="Be the result people find" zh="让别人搜索你时" />
            <br />
            <T en="when they " zh="看到的是" />
            <span className="text-[#533afd]">
              <T en="Google your name." zh="真正像样的你。" />
            </span>
          </h2>
          <p className="reveal mt-5 max-w-md text-[#50617a]">
            <T en="Four minutes from now, your career could have a home it deserves." zh="几分钟后，你的职业经历就可以拥有一个配得上的主页。" />
          </p>
          <div className="reveal mt-8">
            <Link href="/start" className="btn-primary px-8 py-4 text-base">
              <T en="Build my website — from $0.99" zh="生成我的网站 — 0.99 美元起" />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
