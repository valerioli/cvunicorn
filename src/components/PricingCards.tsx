"use client";

import Link from "next/link";
import { plans } from "@/content/plans";
import { useLanguage } from "./i18n";

const copy = {
  preview: {
    name: { en: "Preview Pass", zh: "预览通行证" },
    period: { en: "for 3 days", zh: "3 天" },
    tagline: { en: "See yourself online before you commit.", zh: "先看看自己上线后的样子。" },
    features: {
      en: [
        "Your full website, live for 3 days",
        "Every section your content unlocks",
        "Shareable cvunicorn.com link",
        "Upgrade anytime — your site carries over",
      ],
      zh: [
        "完整网站上线 3 天",
        "根据内容自动解锁页面板块",
        "可分享的 cvunicorn.com 链接",
        "随时升级，网站内容会保留",
      ],
    },
    cta: { en: "Preview my website", zh: "预览我的网站" },
  },
  year: {
    name: { en: "Unicorn Year", zh: "独角兽全年版" },
    period: { en: "per year", zh: "每年" },
    tagline: { en: "Your career's home for a full year.", zh: "让你的职业主页稳定在线一年。" },
    features: {
      en: [
        "Website live for 12 months",
        "Custom domain included (yourname.com)",
        "Unlimited content updates & regeneration",
        "Priority generation queue",
        "SEO-optimized so you rank for your name",
      ],
      zh: [
        "网站上线 12 个月",
        "包含自定义域名（yourname.com）",
        "不限次数更新内容与重新生成",
        "优先生成队列",
        "SEO 优化，更容易搜索到你的名字",
      ],
    },
    cta: { en: "Claim my year", zh: "开启全年版" },
  },
} as const;

export default function PricingCards() {
  const { language } = useLanguage();

  return (
    <div className="grid max-w-4xl gap-5 md:grid-cols-2">
      {plans.map((plan) => (
        <div
          key={plan.id}
          className={`card card-hover reveal relative flex flex-col p-7 ${
            plan.highlight ? "ring-glow" : ""
          }`}
        >
          {plan.highlight && (
            <span className="absolute right-5 top-5 rounded-[4px] border border-[#d6d9fc] bg-[#e8e9ff] px-2.5 py-1 text-xs font-normal text-[#533afd]">
              {language === "zh" ? "最受欢迎" : "Most popular"}
            </span>
          )}
          <h3 className="text-sm font-normal uppercase tracking-[0.08em] text-[#64748d]">
            {copy[plan.id].name[language]}
          </h3>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="font-display text-5xl font-light tracking-[-0.025em] text-[#061b31]">
              {plan.priceLabel}
            </span>
            <span className="text-sm text-[#64748d]">{copy[plan.id].period[language]}</span>
          </div>
          <p className="mt-2 text-sm text-[#50617a]">{copy[plan.id].tagline[language]}</p>
          <ul className="mt-6 flex-1 space-y-3">
            {copy[plan.id].features[language].map((f) => (
              <li key={f} className="flex items-start gap-2.5 text-sm text-[#50617a]">
                <svg
                  className="mt-0.5 h-4 w-4 shrink-0 text-[#533afd]"
                  viewBox="0 0 20 20"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="m4 10.5 4 4 8-9" />
                </svg>
                {f}
              </li>
            ))}
          </ul>
          <Link
            href={`/checkout?plan=${plan.id}`}
            className={`${plan.highlight ? "btn-primary" : "btn-ghost"} mt-7 w-full px-5 py-3 text-sm`}
          >
            {copy[plan.id].cta[language]}
          </Link>
          <p className="mt-3 text-center text-xs text-ink-400">
            {language === "zh" ? "一次性付款 · 没有订阅陷阱" : "One-time payment · No subscription traps"}
          </p>
        </div>
      ))}
    </div>
  );
}
