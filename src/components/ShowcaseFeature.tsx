"use client";

import { featuredShowcase as site } from "@/content/showcase";
import { useLanguage } from "./i18n";

export default function ShowcaseFeature() {
  const { language } = useLanguage();

  return (
    <div className="card card-hover reveal relative max-w-4xl overflow-hidden shadow-[0_18px_58px_rgba(6,27,49,0.06)]">
      <div className="absolute right-0 top-0 h-32 w-32 bg-[radial-gradient(circle,rgba(83,58,253,0.12),transparent_68%)]" />
      <div className="grid md:grid-cols-[1fr_1.15fr]">
        <div className="relative flex flex-col justify-between border-b border-[#e5edf5] bg-[#f8fafd] p-7 sm:p-8 md:border-b-0 md:border-r">
          <div>
            <p className="text-xs font-normal uppercase tracking-[0.08em] text-[#64748d]">
              Built with CVUnicorn
            </p>
            <h3 className="mt-3 font-display text-3xl font-light tracking-[-0.02em] text-[#061b31]">
              {site.name}
            </h3>
            <p className="mt-1 text-sm text-[#50617a]">{site.role[language]}</p>
            <div className="mt-5 flex flex-wrap gap-1.5">
              {site.sections.map((s) => (
                <span
                  key={s.en}
                  className="rounded-[4px] border border-[#d6d9fc] bg-white px-2.5 py-1 text-[11px] font-normal uppercase tracking-[0.08em] text-[#533afd] transition duration-200 hover:-translate-y-0.5 hover:border-[#533afd]"
                >
                  {s[language]}
                </span>
              ))}
            </div>
          </div>
          <div className="mt-8">
            <a
              href={site.url}
              target="_blank"
              rel="noopener"
              className="btn-primary px-5 py-2.5 text-sm"
            >
              {language === "zh" ? "查看生成网站" : "View generated site"}
              <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M7 17 17 7M9 7h8v8" />
              </svg>
            </a>
            <p className="mt-3 text-xs text-[#64748d]">
              {language === "zh" ? "输入材料：" : "Input material: "}
              {site.materials[language]}
            </p>
          </div>
        </div>
        <div className="p-7 sm:p-8">
          <p className="text-sm leading-relaxed text-[#061b31]">{site.summary[language]}</p>
          <ul className="mt-6 space-y-3">
            {site.highlights.map((h) => (
              <li key={h.en} className="flex items-start gap-3 text-sm text-[#50617a]">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#533afd]" />
                {h[language]}
              </li>
            ))}
          </ul>
          <div className="mt-7 grid grid-cols-3 gap-2">
            {(language === "zh" ? ["输入", "叙事", "上线"] : ["Input", "Narrative", "Live"]).map((label, index) => (
              <div key={label} className="rounded-[4px] border border-[#e5edf5] bg-[#f8fafd] p-3">
                <div className="font-display text-xl font-light text-[#061b31]">
                  {String(index + 1).padStart(2, "0")}
                </div>
                <div className="mt-1 text-[11px] uppercase tracking-[0.08em] text-[#64748d]">
                  {label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
