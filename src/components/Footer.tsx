"use client";

import Link from "next/link";
import Logo from "./Logo";
import { SITE } from "@/lib/seo";
import { T, useLanguage } from "./i18n";

const columns: {
  en: string;
  zh: string;
  links: { href: string; en: string; zh: string }[];
}[] = [
  {
    en: "Product",
    zh: "产品",
    links: [
      { href: "/how-it-works", en: "How it works", zh: "如何运作" },
      { href: "/showcase", en: "Showcase", zh: "案例展示" },
      { href: "/pricing", en: "Pricing", zh: "价格" },
      { href: "/start", en: "Build my website", zh: "生成网站" },
    ],
  },
  {
    en: "For professionals",
    zh: "适合人群",
    links: [
      { href: "/for/founders", en: "Founders", zh: "创始人" },
      { href: "/for/executives", en: "Executives", zh: "高管" },
      { href: "/for/designers", en: "Designers", zh: "设计师" },
      { href: "/for/developers", en: "Developers", zh: "开发者" },
      { href: "/for/academics", en: "Academics", zh: "学者" },
      { href: "/for/creators", en: "Creators", zh: "创作者" },
    ],
  },
  {
    en: "Company",
    zh: "公司",
    links: [
      { href: "/faq", en: "FAQ", zh: "常见问题" },
      { href: "/legal/terms", en: "Terms of Service", zh: "服务条款" },
      { href: "/legal/privacy", en: "Privacy Policy", zh: "隐私政策" },
      { href: "/legal/refunds", en: "Refund Policy", zh: "退款政策" },
    ],
  },
];

export default function Footer() {
  const { language } = useLanguage();

  return (
    <footer className="border-t border-[#e5edf5] bg-[#f8fafd]">
      <div className="mx-auto max-w-[1320px] px-5 py-14">
        <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <Logo />
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-[#50617a]">
              <T
                en={`${SITE.tagline}. Turn your CV, work, and story into a personal website that looks like it cost thousands — live in minutes.`}
                zh="把你的简历、作品和职业故事变成一个像定制设计一样的个人网站，几分钟即可上线。"
              />
            </p>
          </div>
          {columns.map((col) => (
            <nav key={col.en} aria-label={language === "zh" ? col.zh : col.en}>
              <h3 className="text-sm font-normal text-[#061b31]">
                {language === "zh" ? col.zh : col.en}
              </h3>
              <ul className="mt-4 space-y-2.5">
                {col.links.map((l) => (
                  <li key={l.href}>
                    <Link
                      href={l.href}
                      className="text-sm text-[#50617a] transition hover:text-[#533afd]"
                    >
                      {language === "zh" ? l.zh : l.en}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>
        <div className="mt-12 flex flex-col items-start justify-between gap-3 border-t border-[#e5edf5] pt-6 text-xs text-[#64748d] sm:flex-row sm:items-center">
          <p>
            © {new Date().getFullYear()} {SITE.name}. All rights reserved.
          </p>
          <p>
            <T
              en="Made for people whose work deserves better than a PDF."
              zh="为那些值得拥有更好展示方式的人而做。"
            />{" "}
            <a href={`mailto:${SITE.email}`} className="underline decoration-[#533afd] underline-offset-2 hover:text-[#533afd]">
              {SITE.email}
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
