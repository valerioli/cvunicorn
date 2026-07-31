import type { Metadata } from "next";
import Link from "next/link";
import SectionHeading from "@/components/SectionHeading";
import { T } from "@/components/i18n";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbJsonLd } from "@/lib/seo";

export const metadata: Metadata = {
  title: "How it works — from CV to live website in four steps",
  description:
    "How CVUnicorn works: upload your CV and career materials, choose a visual style, AI designs your personal website, and you're live in about four minutes.",
  alternates: { canonical: "/how-it-works" },
};

const howToJsonLd = {
  "@context": "https://schema.org",
  "@type": "HowTo",
  name: "How to build a personal website with CVUnicorn",
  description:
    "Turn a resume, career materials, and a chosen visual style into a live personal website in about four minutes.",
  totalTime: "PT5M",
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
      name: "Choose a visual style",
      text: "Pick a visual direction such as Modern Editorial, Resend Minimal, Mercury Fintech, Notion Workspace, or Active Theory Cinematic.",
    },
    {
      "@type": "HowToStep",
      position: 3,
      name: "Let AI design your site",
      text: "CVUnicorn analyzes your material and profession, then designs the structure, sections, typography, and layout of your personal website automatically.",
    },
    {
      "@type": "HowToStep",
      position: 4,
      name: "Preview and publish",
      text: "Review your finished website, publish it live for $0.99 for 3 days, or keep it for a year with a custom domain for $9.99.",
    },
  ],
};

const details = [
  {
    step: { en: "Step 1", zh: "第 1 步" },
    title: {
      en: "Add your content — as little or as much as you want",
      zh: "添加你的材料，可以很少，也可以很多",
    },
    points: [
      {
        en: "Start with a single file: your resume or CV. That alone produces a complete site.",
        zh: "可以只从一个文件开始：你的简历或 CV。仅凭它也能生成一个完整网站。",
      },
      {
        en: "Add profile photos, work samples, project write-ups, articles, social links, press coverage, testimonials, talks, research, or launches when you have them.",
        zh: "如果你愿意，也可以继续加入头像、作品、项目说明、文章、社交链接、媒体报道、推荐语、演讲、研究或发布成果。",
      },
      {
        en: "Everything is optional and organized into small, skippable steps — you're never staring at one giant form.",
        zh: "所有内容都是可选的，并被拆成小步骤；你不会面对一个巨大的表单。",
      },
      {
        en: "The more you add, the more sections, galleries, and pages your site earns.",
        zh: "你添加得越多，网站就越容易生成更丰富的板块、图库和页面。",
      },
    ],
  },
  {
    step: { en: "Step 2", zh: "第 2 步" },
    title: {
      en: "Choose the visual direction",
      zh: "选择网站的视觉方向",
    },
    points: [
      {
        en: "Pick from distinct styles: Modern Editorial, Resend Minimal, Mercury Fintech, Notion Workspace, and Active Theory Cinematic.",
        zh: "可以选择不同风格：Modern Editorial、Resend Minimal、Mercury Fintech、Notion Workspace 和 Active Theory Cinematic。",
      },
      {
        en: "Modern Editorial follows the sharp personal-site language of Valerio's portfolio: paper texture, mono labels, huge serif type, bold rules, and editorial rhythm.",
        zh: "Modern Editorial 参考 Valerio 个人站的鲜明语言：纸张质感、等宽标签、超大 serif 标题、粗线条和杂志节奏。",
      },
      {
        en: "The style changes the site's first impression without changing your underlying content.",
        zh: "风格会改变网站第一印象，但不会改变你的底层内容。",
      },
    ],
  },
  {
    step: { en: "Step 3", zh: "第 3 步" },
    title: {
      en: "AI reads like an editor, designs like a studio",
      zh: "AI 像编辑一样理解，像工作室一样设计",
    },
    points: [
      {
        en: "Your material is analyzed for what makes it strong: numbers, narratives, visuals, credentials.",
        zh: "系统会分析材料中的亮点：数字、故事、视觉内容和可信资质。",
      },
      {
        en: "Structure adapts to your profession — publications for academics, case studies for consultants, galleries for designers.",
        zh: "网站结构会适配职业：学者突出论文，顾问突出案例，设计师突出图库。",
      },
      {
        en: "Typography, spacing, color, and hierarchy follow the standards of high-end personal sites.",
        zh: "排版、间距、颜色和层级会按高质量个人站的标准生成。",
      },
      {
        en: "Nothing generic: your content determines the layout, not a template.",
        zh: "不会套一个通用模板；你的内容会决定页面结构。",
      },
    ],
  },
  {
    step: { en: "Step 4", zh: "第 4 步" },
    title: { en: "Preview, publish, own it", zh: "预览、发布、拥有它" },
    points: [
      {
        en: "See your complete website before paying a cent of the yearly price.",
        zh: "在支付全年费用前，你可以先看到完整网站。",
      },
      {
        en: "$0.99 puts it live for 3 days on a shareable link — the real site, not a demo.",
        zh: "0.99 美元可让真实网站上线 3 天，并获得可分享链接，不是截图 demo。",
      },
      {
        en: "$9.99 keeps it live for a year with a custom domain and unlimited updates.",
        zh: "9.99 美元可让网站上线一年，包含自定义域名和不限次数更新。",
      },
      {
        en: "Renew only if you want to. Your content is never held hostage.",
        zh: "是否续费由你决定。你的内容不会被锁住。",
      },
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
      <section className="border-b border-[#e5edf5] bg-white px-5 pb-4 pt-10 sm:pt-16">
        <SectionHeading
          eyebrow={<T en="How it works" zh="如何运作" />}
          title={<T en="Four steps, honestly spent" zh="四步完成，一个像样的网站" />}
          sub={<T en="Add your material, choose a style, let the AI build, then preview and publish the real site." zh="添加材料、选择风格、交给 AI 生成，然后预览并发布真实网站。" />}
        />
      </section>
      <section className="mx-auto max-w-[1320px] px-5 py-12 sm:py-16">
        <div className="space-y-6">
          {details.map((d) => (
            <article key={d.step.en} className="card card-hover reveal p-7">
              <p className="text-xs font-normal uppercase tracking-[0.08em] text-[#64748d]">
                <T en={d.step.en} zh={d.step.zh} />
              </p>
              <h2 className="mt-2 font-display text-2xl font-light text-[#061b31]">
                <T en={d.title.en} zh={d.title.zh} />
              </h2>
              <ul className="mt-4 space-y-2.5">
                {d.points.map((p) => (
                  <li key={p.en} className="flex items-start gap-2.5 text-sm leading-relaxed text-[#50617a]">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#533afd]" />
                    <T en={p.en} zh={p.zh} />
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
        <div className="reveal mt-12">
          <Link href="/start" className="btn-primary px-7 py-3.5 text-base">
            <T en="Start step one now" zh="现在开始第一步" />
          </Link>
          <p className="mt-3 text-xs text-[#64748d]">
            <T en="Takes about 4 minutes · From $0.99" zh="约 4 分钟 · 0.99 美元起" />
          </p>
        </div>
      </section>
    </>
  );
}
