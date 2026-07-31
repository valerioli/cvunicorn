import type { Metadata } from "next";
import Link from "next/link";
import SectionHeading from "@/components/SectionHeading";
import ShowcaseFeature from "@/components/ShowcaseFeature";
import CaseStudies from "@/components/CaseStudies";
import { T } from "@/components/i18n";
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
    title: { en: "Work — a career told as chapters", zh: "工作经历 — 像章节一样讲述职业" },
    body: {
      en: "Fifteen years across luxury retail, Web3, and AI, organized as a narrative with quantified wins — $30M year-one digital revenue, 50,000+ users scaled — instead of bullet points.",
      zh: "横跨奢侈品、Web3 与 AI 的 15 年经历，被组织成有数据支撑的叙事，而不是一串简历条目。",
    },
  },
  {
    title: { en: "Field — proof you show up", zh: "现场 — 证明你真的在场" },
    body: {
      en: "Keynotes, brand activations, and corporate events as a visual diary. Photos become an art-directed gallery that says 'operator', not 'attendee'.",
      zh: "演讲、品牌活动和公司现场被整理成视觉日记。照片不只是图库，而是证明你是操盘者。",
    },
  },
  {
    title: { en: "Vibe Coding — side projects as range", zh: "AI 实验 — 副项目展示你的边界" },
    body: {
      en: "AI prototypes and experiments presented as a lab. Side projects signal curiosity and momentum — CVUnicorn gives them their own stage.",
      zh: "AI 原型和实验被呈现为一个实验室。副项目展示好奇心和行动力，CVUnicorn 会给它们单独的舞台。",
    },
  },
  {
    title: { en: "Writings & Fiction — a voice, not just a title", zh: "文章与小说 — 不只是职位，还有声音" },
    body: {
      en: "Thought leadership on Pay-Fi and AI-crypto markets next to speculative fiction. Writing unlocks a publication-grade reading experience.",
      zh: "Pay-Fi 与 AI 加密市场文章，和小说写作并列呈现。写作内容会生成接近出版物的阅读体验。",
    },
  },
  {
    title: { en: "About — the close", zh: "关于 — 最后的转化" },
    body: {
      en: "A professional summary and contact that converts: after five sections of proof, the ask feels earned.",
      zh: "最后用专业简介和联系方式完成转化：前面的证据足够充分，联系就显得自然。",
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
        <SectionHeading
          eyebrow={<T en="Showcase" zh="案例展示" />}
          title={<T en="Rich input, rich output" zh="输入越具体，输出越完整" />}
          sub={<T en="CVUnicorn scales with what you give it. Start with anything, then add more material when you want a richer site." zh="CVUnicorn 会随着你的材料丰富度扩展。可以从任何材料开始，想要更完整的网站时再继续补充。" />}
        />
        <div className="mx-auto mt-12 max-w-[1320px]">
          <ShowcaseFeature />
        </div>
      </section>

      <section className="border-b border-[#e5edf5] bg-white px-5 py-16 sm:py-20" aria-labelledby="case-studies">
        <div className="mx-auto max-w-[1320px]">
          <SectionHeading
            eyebrow={<T en="Generated sites" zh="生成网站案例" />}
            title={<span id="case-studies"><T en="Four embedded websites, side by side" zh="4 个嵌入式网站，并列展示" /></span>}
            sub={<T en="Valerio plus three fictional generated sites. Each preview below is a real internal website rendered directly on this page." zh="Valerio 加上三个虚拟生成网站。下面每个预览都是真实内部网页，直接在本页渲染。" />}
          />
          <div className="stagger mt-12">
            <CaseStudies />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1320px] px-5 py-16 sm:py-20">
        <SectionHeading
          eyebrow={<T en="Anatomy of the site" zh="网站结构拆解" />}
          title={<T en="What each input unlocked" zh="每类输入会解锁什么页面" />}
          sub={<T en={`A walkthrough of ${featuredShowcase.name.split(" ")[0]}'s six sections — and the material behind each one.`} zh={`拆解 ${featuredShowcase.name.split(" ")[0]} 的六个板块，以及每个板块背后的材料。`} />}
        />
        <ol className="mt-12 space-y-5">
          {anatomy.map((a, i) => (
            <li key={a.title.en} className="card card-hover reveal flex gap-5 p-6">
              <span className="font-display text-2xl font-light text-[#061b31]">
                {String(i + 1).padStart(2, "0")}
              </span>
              <div>
                <h3 className="font-normal text-[#061b31]">
                  <T en={a.title.en} zh={a.title.zh} />
                </h3>
                <p className="mt-1.5 text-sm leading-relaxed text-[#50617a]">
                  <T en={a.body.en} zh={a.body.zh} />
                </p>
              </div>
            </li>
          ))}
        </ol>

        <div className="card reveal mt-12 bg-[#f8fafd] p-7">
          <h3 className="font-display text-2xl font-light text-[#061b31]">
            <T en="Your story could look like this" zh="你的故事也可以这样呈现" />
          </h3>
          <p className="mt-2 max-w-md text-sm text-[#50617a]">
            <T en="Start with anything you already have. Every photo, article, and win gives the AI more to design with." zh="从你已有的任何材料开始。每张照片、每篇文章、每个成果都会给 AI 更多设计素材。" />
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
