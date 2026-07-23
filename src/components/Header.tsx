"use client";

import Link from "next/link";
import { useState } from "react";
import Logo from "./Logo";

const nav = [
  { href: "/how-it-works", label: "How it works" },
  { href: "/showcase", label: "Showcase" },
  { href: "/pricing", label: "Pricing" },
  { href: "/faq", label: "FAQ" },
];

export default function Header() {
  const [open, setOpen] = useState(false);
  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <div className="mx-auto mt-3 flex max-w-6xl items-center justify-between rounded-2xl border border-white/8 bg-ink-950/70 px-4 py-2.5 backdrop-blur-xl sm:px-5 md:mt-4">
        <Link href="/" aria-label="CVUnicorn home" className="shrink-0">
          <Logo />
        </Link>

        <nav className="hidden items-center gap-1 md:flex" aria-label="Main">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-full px-3.5 py-2 text-sm text-ink-200 transition hover:bg-white/6 hover:text-white"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-2.5 md:flex">
          <Link href="/account" className="btn-ghost px-4 py-2 text-sm">
            My site
          </Link>
          <Link href="/start" className="btn-primary px-4.5 py-2 text-sm">
            Build my website
          </Link>
        </div>

        <button
          type="button"
          onClick={() => setOpen(!open)}
          aria-expanded={open}
          aria-label="Toggle menu"
          className="rounded-lg p-2 text-ink-200 hover:bg-white/6 md:hidden"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            {open ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
          </svg>
        </button>
      </div>

      {open && (
        <div className="mx-auto mt-2 max-w-6xl rounded-2xl border border-white/8 bg-ink-950/95 p-3 backdrop-blur-xl md:hidden">
          <nav className="flex flex-col" aria-label="Mobile">
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="rounded-xl px-4 py-3 text-ink-100 hover:bg-white/6"
              >
                {item.label}
              </Link>
            ))}
            <div className="mt-2 flex flex-col gap-2 border-t border-white/8 pt-3">
              <Link href="/account" onClick={() => setOpen(false)} className="btn-ghost px-4 py-2.5 text-sm">
                My site
              </Link>
              <Link href="/start" onClick={() => setOpen(false)} className="btn-primary px-4 py-2.5 text-sm">
                Build my website
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
