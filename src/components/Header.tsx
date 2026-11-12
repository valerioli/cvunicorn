"use client";

import Link from "next/link";
import { useState } from "react";
import Logo from "./Logo";
import { LanguageToggle, T, useLanguage } from "./i18n";

const nav = [
  { href: "/how-it-works", en: "How it works", zh: "如何运作" },
  { href: "/showcase", en: "Showcase", zh: "案例展示" },
  { href: "/pricing", en: "Pricing", zh: "价格" },
  { href: "/faq", en: "FAQ", zh: "常见问题" },
];

export default function Header() {
  const [open, setOpen] = useState(false);
  const { language } = useLanguage();

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <div className="mx-auto flex max-w-[1320px] items-center justify-between border-b border-[#e5edf5] bg-white/[0.88] px-5 py-4 shadow-[0_8px_34px_rgba(6,27,49,0.05)] backdrop-blur-xl sm:px-6">
        <Link href="/" aria-label="CVUnicorn home" className="shrink-0">
          <Logo />
        </Link>

        <nav className="hidden items-center gap-1 md:flex" aria-label="Main">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-[4px] px-3.5 py-2 text-sm text-[#061b31] transition hover:bg-[#f8fafd] hover:text-[#533afd]"
            >
              {language === "zh" ? item.zh : item.en}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-2.5 md:flex">
          <LanguageToggle />
          <Link href="/account" className="btn-ghost px-4 py-2 text-sm">
            <T en="My site" zh="我的网站" />
          </Link>
          <Link href="/start" className="btn-primary px-4.5 py-2 text-sm">
            <T en="Build my website" zh="生成网站" />
          </Link>
        </div>

        <button
          type="button"
          onClick={() => setOpen(!open)}
          onKeyDown={e => { if (e.key === "Escape") setOpen(false); }}
          aria-controls="mobile-navigation"
          aria-expanded={open}
          aria-label="Toggle menu"
          className="rounded-[4px] p-2 text-[#061b31] hover:bg-[#f8fafd] md:hidden"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            {open ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
          </svg>
        </button>
      </div>

      {open && (
        <div className="mx-auto max-w-[1320px] border-b border-[#e5edf5] bg-white/95 p-3 shadow-[0_18px_44px_rgba(6,27,49,0.08)] backdrop-blur-xl md:hidden">
          <nav id="mobile-navigation" onKeyDown={e => { if (e.key === "Escape") setOpen(false); }} className="flex flex-col" aria-label="Mobile">
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="rounded-[4px] px-4 py-3 text-[#061b31] hover:bg-[#f8fafd]"
              >
                {language === "zh" ? item.zh : item.en}
              </Link>
            ))}
            <div className="mt-2 flex flex-col gap-2 border-t border-[#e5edf5] pt-3">
              <LanguageToggle />
              <Link href="/account" onClick={() => setOpen(false)} className="btn-ghost px-4 py-2.5 text-sm">
                <T en="My site" zh="我的网站" />
              </Link>
              <Link href="/start" onClick={() => setOpen(false)} className="btn-primary px-4 py-2.5 text-sm">
                <T en="Build my website" zh="生成网站" />
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
