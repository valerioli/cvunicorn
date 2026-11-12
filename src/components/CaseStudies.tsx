"use client";

import { useState } from "react";
import Link from "next/link";
import { caseStudySites, siteStyleOptions, type SiteStyleOption } from "@/content/showcase";
import { useLanguage } from "./i18n";

type StyleChoice = "auto" | SiteStyleOption["id"];

const generatedSitePaths: Record<string, string> = {
  "valerio-li": "https://valerio.cvunicorn.com",
  "maya-chen": "https://mayachen.cvunicorn.com",
  "noah-rivera": "https://noahrivera.cvunicorn.com",
  "ari-okafor": "https://ariokafor.cvunicorn.com",
};

export default function CaseStudies() {
  const { language } = useLanguage();
  const [styleChoice, setStyleChoice] = useState<StyleChoice>("auto");

  const styleById = Object.fromEntries(siteStyleOptions.map((style) => [style.id, style])) as Record<
    SiteStyleOption["id"],
    SiteStyleOption
  >;

  return (
    <div>
      <div className="reveal mb-6 border-y border-[#e5edf5] py-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-2xl">
            <p className="text-xs font-normal uppercase tracking-[0.08em] text-[#64748d]">
              {language === "zh" ? "生成网站风格" : "Generated site styles"}
            </p>
            <p className="mt-1 text-sm leading-relaxed text-[#50617a]">
              {language === "zh"
                ? "Valerio 为真实个人网站；其余为示例人物的设计演示。选择风格可切换演示，Valerio 原站保持不变。"
                : "Valerio is a live personal portfolio. The other profiles are illustrative design demos. Style changes apply to the demos; Valerio’s original site stays unchanged."}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setStyleChoice("auto")}
              aria-pressed={styleChoice === "auto"}
              className={`rounded-[4px] border px-3 py-2 text-xs transition ${
                styleChoice === "auto"
                  ? "border-[#061b31] bg-[#061b31] text-white"
                  : "border-[#d6d9fc] bg-white text-[#50617a] hover:border-[#533afd] hover:text-[#533afd]"
              }`}
            >
              {language === "zh" ? "自动混排" : "Auto mix"}
            </button>
            {siteStyleOptions.map((style) => (
              <button
                type="button"
                key={style.id}
                onClick={() => setStyleChoice(style.id)}
                aria-pressed={styleChoice === style.id}
                title={`${style.source}: ${style.description[language]}`}
                className={`rounded-[4px] border px-3 py-2 text-xs transition ${
                  styleChoice === style.id
                    ? "border-[#061b31] bg-[#061b31] text-white"
                    : "border-[#d6d9fc] bg-white text-[#50617a] hover:border-[#533afd] hover:text-[#533afd]"
                }`}
              >
                {style.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        {caseStudySites.map((study) => {
          const isValerio = study.slug === "valerio-li";
          const activeStyleId = styleChoice === "auto" || isValerio ? study.style : styleChoice;
          const activeStyle = styleById[activeStyleId];
          const generatedUrl = isValerio
            ? generatedSitePaths[study.slug]
            : styleChoice === "auto"
              ? generatedSitePaths[study.slug]
              : `/case-study-sites/${study.slug}?lang=${language}&style=${activeStyleId}`;
          const previewUrl = isValerio
            ? "/valerio-original"
            : `/case-study-sites/${study.slug}?lang=${language}&embed=1&style=${activeStyleId}`;

          return (
            <article
              key={study.slug}
              className="card card-hover reveal group relative flex min-h-[620px] flex-col overflow-hidden"
            >
              <div className="relative h-80 overflow-hidden border-b border-[#e5edf5] bg-[#f8fafd]">
                <iframe
                  title={`${study.name} website preview`}
                  tabIndex={-1}
                  sandbox="allow-scripts"
                  src={previewUrl}
                  className="pointer-events-none h-[640px] w-[200%] origin-top-left scale-50 border-0 bg-white"
                  loading="lazy"
                />
                <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-white to-transparent" />
                <div className="absolute left-3 top-3 rounded-[4px] border border-black/10 bg-white/90 px-2.5 py-1 text-[10px] font-normal uppercase tracking-[0.08em] text-[#061b31] shadow-[0_10px_30px_rgba(6,27,49,0.08)] backdrop-blur">
                  {activeStyle.name}
                </div>
              </div>

              <div className="flex flex-1 flex-col p-5">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-xs font-normal uppercase tracking-[0.08em] text-[#64748d]">
                      {study.industry[language]}
                    </p>
                    <h3 className="mt-3 font-display text-2xl font-light tracking-[-0.02em] text-[#061b31]">
                      {study.name}
                    </h3>
                  </div>
                  <span
                    aria-hidden="true"
                    className="mt-1 h-3 w-3 shrink-0 rounded-full"
                    style={{ backgroundColor: study.accent }}
                  />
                </div>

                <p className="mt-2 text-sm text-[#50617a]">{study.role[language]}</p>

                <div className="mt-5 rounded-[4px] border border-[#e5edf5] bg-[#f8fafd] p-3">
                  <p className="text-[11px] uppercase tracking-[0.08em] text-[#64748d]">
                    {language === "zh" ? "风格 / 结果" : "Style / Outcome"}
                  </p>
                  <p className="mt-1 text-xs text-[#533afd]">{activeStyle.name}</p>
                  <p className="mt-1 font-display text-xl font-light text-[#061b31]">
                    {study.metric[language]}
                  </p>
                </div>

                <p className="mt-4 flex-1 text-sm leading-relaxed text-[#50617a]">
                  {study.result[language]}
                </p>

                <div className="mt-5 flex flex-wrap gap-1.5">
                  {study.sections.slice(0, 3).map((section) => (
                    <span
                      key={section.en}
                      className="rounded-[4px] border border-[#d6d9fc] bg-white px-2.5 py-1 text-[11px] uppercase tracking-[0.08em] text-[#533afd]"
                    >
                      {section[language]}
                    </span>
                  ))}
                </div>

                <Link
                  href={generatedUrl}
                  target="_blank"
                  className="mt-5 inline-flex w-full items-center justify-center rounded-[4px] border border-[#061b31] bg-white px-4 py-2.5 text-sm font-normal text-[#061b31] shadow-[0_10px_28px_rgba(6,27,49,0.12)] transition hover:-translate-y-0.5 hover:bg-[#061b31] hover:text-white"
                >
                  {language === "zh" ? (isValerio ? "查看真实网站" : "打开风格演示") : (isValerio ? "View live portfolio" : "Open design demo")}
                </Link>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
