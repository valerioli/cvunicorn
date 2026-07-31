"use client";

import type { Faq } from "@/content/faqs";
import { useLanguage } from "./i18n";

const zhFaqs: Record<string, { q: string; a: string }> = {
  "What is CVUnicorn?": {
    q: "CVUnicorn 是什么？",
    a: "CVUnicorn 是一个 AI 个人网站生成器。你可以提供简历，以及任何能讲述职业故事的材料，例如照片、项目、媒体报道、文章、演讲和推荐语。它会在几分钟内为你设计并发布一个精致的个人网站，不需要设计或写代码。",
  },
  "How much does CVUnicorn cost?": {
    q: "CVUnicorn 怎么收费？",
    a: "CVUnicorn 有两个简单选项：0.99 美元的预览通行证，可让网站上线 3 天；9.99 美元的全年版，可让网站上线一整年并包含自定义域名。没有隐藏费用，也不会强制订阅。",
  },
  "How long does it take to build my website?": {
    q: "生成网站需要多久？",
    a: "大多数网站会在你完成内容添加后的五分钟内生成。材料越多，结果越丰富；但即使只有一份简历，也能生成一个完整的网站。",
  },
  "What can I include on my personal website?": {
    q: "我的个人网站可以包含哪些内容？",
    a: "任何能代表你职业故事的材料都可以：头像、简历、个人介绍、文章、社交主页、作品、项目、奖项、案例、视频、媒体报道、推荐语、演讲、研究、专利、发布成果等。",
  },
  "Do I need to know how to design or code?": {
    q: "我需要会设计或写代码吗？",
    a: "不需要。CVUnicorn 的 AI 会自动处理布局、排版、颜色和结构。你只需要提供内容。",
  },
  "Is CVUnicorn a subscription?": {
    q: "CVUnicorn 是订阅制吗？",
    a: "不是。两个计划都是一次性付款。预览通行证 0.99 美元，可让网站上线 3 天；Unicorn Year 9.99 美元，可让网站上线 12 个月并包含自定义域名。是否续费由你决定。",
  },
  "What does the $0.99 Preview Pass include?": {
    q: "0.99 美元预览通行证包含什么？",
    a: "包含完整网站。你能获得根据材料生成的所有板块，并在可分享链接上真实上线 3 天。它的目的，是让你在购买全年版前先看到真实网站，而不是一张裁剪截图。",
  },
  "What does the $9.99 Unicorn Year include?": {
    q: "9.99 美元 Unicorn Year 包含什么？",
    a: "你的网站会上线 12 个月，包含自定义域名、不限次数的内容更新和重新生成、优先生成，以及帮助你在自己的名字下获得更好搜索呈现的 SEO 优化。",
  },
  "Can I upgrade from the Preview Pass to Unicorn Year?": {
    q: "我可以从预览通行证升级到全年版吗？",
    a: "可以，任何时候都能升级，包括预览过期后。你的网站和所有内容都会保留。",
  },
  "What payment methods do you accept?": {
    q: "支持哪些付款方式？",
    a: "通过 Stripe Checkout 支持主流信用卡和借记卡。CVUnicorn 不会看到或存储你的银行卡信息。",
  },
  "What is your refund policy?": {
    q: "退款政策是什么？",
    a: "如果网站生成失败，或我们这边的技术问题导致网站无法上线，我们会全额退款。详情可查看退款政策。",
  },
};

/** Semantic, crawlable FAQ accordion — native <details> keeps content
 *  in the DOM for search engines and AI crawlers, no JS required. */
export default function FaqList({ faqs }: { faqs: Faq[] }) {
  const { language } = useLanguage();

  return (
    <div className="max-w-3xl divide-y divide-[#e5edf5]">
      {faqs.map((f) => (
        <details key={f.q} className="group py-5">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-left text-base font-normal text-[#061b31] [&::-webkit-details-marker]:hidden">
            {language === "zh" && zhFaqs[f.q] ? zhFaqs[f.q].q : f.q}
            <svg
              className="h-5 w-5 shrink-0 text-[#533afd] transition-transform duration-300 group-open:rotate-45"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              aria-hidden="true"
            >
              <path d="M12 5v14M5 12h14" />
            </svg>
          </summary>
          <p className="mt-3 pr-9 text-sm leading-relaxed text-[#50617a]">
            {language === "zh" && zhFaqs[f.q] ? zhFaqs[f.q].a : f.a}
          </p>
        </details>
      ))}
    </div>
  );
}
