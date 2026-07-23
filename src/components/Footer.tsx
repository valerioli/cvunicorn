import Link from "next/link";
import Logo from "./Logo";
import { SITE } from "@/lib/seo";

const columns: { title: string; links: { href: string; label: string }[] }[] = [
  {
    title: "Product",
    links: [
      { href: "/how-it-works", label: "How it works" },
      { href: "/showcase", label: "Showcase" },
      { href: "/pricing", label: "Pricing" },
      { href: "/start", label: "Build my website" },
    ],
  },
  {
    title: "For professionals",
    links: [
      { href: "/for/founders", label: "Founders" },
      { href: "/for/executives", label: "Executives" },
      { href: "/for/designers", label: "Designers" },
      { href: "/for/developers", label: "Developers" },
      { href: "/for/academics", label: "Academics" },
      { href: "/for/creators", label: "Creators" },
    ],
  },
  {
    title: "Company",
    links: [
      { href: "/faq", label: "FAQ" },
      { href: "/legal/terms", label: "Terms of Service" },
      { href: "/legal/privacy", label: "Privacy Policy" },
      { href: "/legal/refunds", label: "Refund Policy" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="hairline border-t">
      <div className="mx-auto max-w-6xl px-5 py-14">
        <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <Logo />
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-ink-300">
              {SITE.tagline}. Turn your CV, work, and story into a personal
              website that looks like it cost thousands — live in minutes.
            </p>
          </div>
          {columns.map((col) => (
            <nav key={col.title} aria-label={col.title}>
              <h3 className="text-sm font-semibold text-white">{col.title}</h3>
              <ul className="mt-4 space-y-2.5">
                {col.links.map((l) => (
                  <li key={l.href}>
                    <Link
                      href={l.href}
                      className="text-sm text-ink-300 transition hover:text-white"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>
        <div className="hairline mt-12 flex flex-col items-start justify-between gap-3 border-t pt-6 text-xs text-ink-400 sm:flex-row sm:items-center">
          <p>
            © {new Date().getFullYear()} {SITE.name}. All rights reserved.
          </p>
          <p>
            Made for people whose work deserves better than a PDF.{" "}
            <a href={`mailto:${SITE.email}`} className="underline decoration-ink-600 underline-offset-2 hover:text-ink-200">
              {SITE.email}
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
