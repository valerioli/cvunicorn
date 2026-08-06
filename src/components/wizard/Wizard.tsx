"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  emptyIntake,
  getModule,
  modules,
  richnessLabel,
  richnessScore,
  type Entry,
  type IntakeData,
  type ModuleId,
  type SiteStyleId,
} from "@/lib/intake";
import { TextField, TextArea, FileDrop } from "./fields";
import { professions } from "@/content/professions";
import { siteStyleOptions } from "@/content/showcase";
import { useLanguage } from "@/components/i18n";

const STORAGE_KEY = "cvunicorn.intake.v1";

function newEntry(): Entry {
  return {
    id: `e_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    values: {},
    files: [],
  };
}

export default function Wizard() {
  const router = useRouter();
  const { language } = useLanguage();
  const [data, setData] = useState<IntakeData>(emptyIntake);
  const [hydrated, setHydrated] = useState(false);
  // step index: 0 = essentials, 1 = style, 2 = module picker, 3..N = selected modules, N+1 = review
  const [step, setStep] = useState(0);
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  /* ——— restore draft ——— */
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setData(JSON.parse(raw) as IntakeData);
    } catch {}
    setHydrated(true);
  }, []);

  /* ——— autosave (local + server, debounced) ——— */
  const persist = useCallback((d: IntakeData) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(d));
    } catch {}
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => {
      fetch("/api/intake", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(d),
      }).catch(() => {});
    }, 900);
  }, []);

  const update = useCallback(
    (fn: (d: IntakeData) => IntakeData) => {
      setData((prev) => {
        const next = { ...fn(prev), updatedAt: Date.now() };
        persist(next);
        return next;
      });
    },
    [persist],
  );

  const score = richnessScore(data);
  const { label: scoreLabel, desc: scoreDesc } = richnessLabel(score);

  const currentStyle = data.style ?? "valerio";
  const styleName = siteStyleOptions.find((style) => style.id === currentStyle)?.name ?? "Modern Editorial";
  const stepCount = 3 + data.selected.length + 1;
  const moduleForStep = (s: number): ModuleId | null =>
    s >= 3 && s < 3 + data.selected.length ? data.selected[s - 3] : null;
  const isReview = step === stepCount - 1;
  const canLeaveEssentials =
    data.essentials.fullName.trim().length > 0 &&
    data.essentials.headline.trim().length > 0;

  const stepTitle = useMemo(() => {
    if (step === 0) return language === "zh" ? "基础信息" : "The essentials";
    if (step === 1) return language === "zh" ? "选择风格" : "Choose a style";
    if (step === 2) return language === "zh" ? "选择故事模块" : "Choose your story modules";
    const m = moduleForStep(step);
    if (m) return getModule(m).title;
    return language === "zh" ? "确认并生成" : "Review & generate";
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step, data.selected, language]);

  const localizedScore =
    language === "zh"
      ? {
          Starter: "起步",
          Solid: "扎实",
          Impressive: "丰富",
          Unicorn: "完整",
        }[scoreLabel] ?? scoreLabel
      : scoreLabel;

  if (!hydrated) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center text-ink-400">
        {language === "zh" ? "正在加载你的草稿…" : "Loading your draft…"}
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-5 pb-24">
      {/* ——— progress + richness ——— */}
      <div className="sticky top-16 z-30 -mx-5 mb-8 border-b border-[#e5edf5] bg-white px-5 py-4 md:top-20">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="text-xs font-normal uppercase tracking-[0.08em] text-[#64748d]">
              {language === "zh" ? `第 ${step + 1} / ${stepCount} 步` : `Step ${step + 1} / ${stepCount}`}
            </span>
            <span className="hidden text-sm font-normal text-[#061b31] sm:inline">{stepTitle}</span>
          </div>
          <div className="flex items-center gap-2.5" title={scoreDesc}>
            <span className="text-xs text-[#64748d]">{language === "zh" ? "网站丰富度" : "Site richness"}</span>
            <div className="h-2 w-28 overflow-hidden rounded-[2px] bg-[#e5edf5]">
              <div
                className="h-full rounded-[2px] bg-[#533afd] transition-all duration-700"
                style={{ width: `${score}%` }}
              />
            </div>
            <span className="text-xs font-normal text-[#533afd]">{localizedScore}</span>
          </div>
        </div>
      </div>

      {/* ——— STEP 0: essentials ——— */}
      {step === 0 && (
        <section aria-label="Essentials">
          <h1 className="font-display text-3xl font-light tracking-[-0.02em] text-[#061b31] sm:text-4xl">
            {language === "zh" ? "先从你开始" : "Let's start with you"}
          </h1>
          <p className="mt-2 text-sm text-[#50617a]">
            {language === "zh"
              ? "只有姓名和职业标题必填。其他都可以跳过，但每多一项，网站都会更丰富。"
              : "Two required fields. Everything else is optional — but each one visibly improves your site."}
          </p>
          <div className="mt-8 grid gap-5 sm:grid-cols-2">
            <TextField
              label={language === "zh" ? "姓名" : "Full name"}
              required
              value={data.essentials.fullName}
              onChange={(v) => update((d) => ({ ...d, essentials: { ...d.essentials, fullName: v } }))}
              placeholder="Maya Chen"
              hint={language === "zh" ? "必填" : "required"}
            />
            <TextField
              label={language === "zh" ? "职业标题" : "Professional headline"}
              required
              value={data.essentials.headline}
              onChange={(v) => update((d) => ({ ...d, essentials: { ...d.essentials, headline: v } }))}
              placeholder="Fractional CFO for climate startups"
              hint={language === "zh" ? "必填" : "required"}
            />
            <label className="block">
              <span className="mb-1.5 block text-sm font-normal text-[#061b31]">
                {language === "zh" ? "你的领域" : "Your field"} <span className="ml-2 text-xs font-normal text-[#64748d]">{language === "zh" ? "用于调整网站结构" : "tailors your site's structure"}</span>
              </span>
              <select
                className="field"
                value={data.essentials.profession}
                onChange={(e) => update((d) => ({ ...d, essentials: { ...d.essentials, profession: e.target.value } }))}
              >
                <option value="">{language === "zh" ? "选择，也可以跳过…" : "Choose (or skip)…"}</option>
                {professions.map((p) => (
                  <option key={p.slug} value={p.slug}>{p.plural}</option>
                ))}
                <option value="other">Something else</option>
              </select>
            </label>
            <TextField
              label={language === "zh" ? "邮箱" : "Email"}
              type="email"
              value={data.essentials.email}
              onChange={(v) => update((d) => ({ ...d, essentials: { ...d.essentials, email: v } }))}
              placeholder="you@example.com"
              hint={language === "zh" ? "用于收据和网站链接" : "for your receipt & site link"}
            />
            <TextField
              label={language === "zh" ? "所在地" : "Location"}
              value={data.essentials.location}
              onChange={(v) => update((d) => ({ ...d, essentials: { ...d.essentials, location: v } }))}
              placeholder="Tokyo · Singapore"
            />
          </div>
          <div className="mt-5 grid gap-5 sm:grid-cols-2">
            <FileDrop
              label={language === "zh" ? "个人照片" : "Profile photo"}
              hint={language === "zh" ? "真实头像通常比 logo 更有效" : "a real portrait outperforms a logo"}
              accept="image/*"
              files={data.essentials.photo ? [data.essentials.photo] : []}
              onChange={(files) => update((d) => ({ ...d, essentials: { ...d.essentials, photo: files[0] ?? null } }))}
            />
            <FileDrop
              label={language === "zh" ? "简历 / CV" : "Resume / CV"}
              hint={language === "zh" ? "PDF 或 Word，这是网站的骨架" : "PDF or Word — the backbone of your site"}
              accept=".pdf,.doc,.docx,.txt,.md"
              files={data.essentials.cv ? [data.essentials.cv] : []}
              onChange={(files) =>
                update((d) => {
                  const cv = files[0] ?? null;
                  return {
                    ...d,
                    essentials: {
                      ...d.essentials,
                      cv,
                      cvText: cv?.extractedText ?? "",
                    },
                  };
                })
              }
            />
          </div>
          {data.essentials.cv && (
            <p className="mt-3 text-xs leading-relaxed text-[#64748d]">
              {data.essentials.cv.extractedCharCount
                ? language === "zh"
                  ? `已从简历中提取 ${data.essentials.cv.extractedCharCount.toLocaleString()} 个字符，会用于生成网站内容。`
                  : `Extracted ${data.essentials.cv.extractedCharCount.toLocaleString()} characters from your resume for site generation.`
                : language === "zh"
                  ? "没有从这份简历中提取到可读文本。扫描版 PDF 或旧 .doc 建议转成 PDF/DOCX，或把简历文字粘贴到下面。"
                  : "No readable text was extracted. For scanned PDFs or legacy .doc files, export as PDF/DOCX or paste the resume text below."}
            </p>
          )}
          <div className="mt-5">
            <TextArea
              label={language === "zh" ? "简短介绍" : "Short bio or introduction"}
              hint={language === "zh" ? "也可以直接粘贴简历文字" : "or paste your CV text here"}
              rows={5}
              value={data.essentials.bio}
              onChange={(v) => update((d) => ({ ...d, essentials: { ...d.essentials, bio: v } }))}
              placeholder="Finance operator helping climate founders turn runway, fundraising, and board reporting into clearer decisions…"
            />
          </div>
        </section>
      )}

      {/* ——— STEP 1: module picker ——— */}
      {step === 1 && (
        <section aria-label="Site style">
          <h1 className="font-display text-3xl font-light tracking-[-0.02em] text-[#061b31] sm:text-4xl">
            {language === "zh" ? "选择网站风格" : "Choose your site style"}
          </h1>
          <p className="mt-2 max-w-xl text-sm text-[#50617a]">
            {language === "zh"
              ? "这一步决定生成网站的第一印象。之后你仍然可以重新生成或换风格。"
              : "This sets the first impression of the generated site. You can still regenerate or switch styles later."}
          </p>
          <div className="mt-8 grid gap-3 sm:grid-cols-2">
            {siteStyleOptions.map((style) => {
              const on = currentStyle === style.id;
              return (
                <button
                  type="button"
                  key={style.id}
                  aria-pressed={on}
                  onClick={() => update((d) => ({ ...d, style: style.id as SiteStyleId }))}
                  className={`card text-left transition ${on ? "ring-glow" : "card-hover"} p-4`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <span className="text-xs font-normal uppercase tracking-[0.08em] text-[#64748d]">
                      {style.source}
                    </span>
                    <span
                      className={`mt-0.5 flex h-5 w-5 items-center justify-center rounded-[4px] border transition ${
                        on ? "border-[#533afd] bg-[#533afd]" : "border-[#d6d9fc]"
                      }`}
                    >
                      {on && (
                        <svg className="h-3 w-3 text-white" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m4 10.5 4 4 8-9" /></svg>
                      )}
                    </span>
                  </div>
                  <h3 className="mt-3 text-base font-normal text-[#061b31]">{style.name}</h3>
                  <p className="mt-2 text-xs leading-relaxed text-[#50617a]">{style.description[language]}</p>
                </button>
              );
            })}
          </div>
        </section>
      )}

      {/* ——— STEP 2: module picker ——— */}
      {step === 2 && (
        <section aria-label="Story modules">
          <h1 className="font-display text-3xl font-light tracking-[-0.02em] text-[#061b31] sm:text-4xl">
            {language === "zh" ? "你的故事里有什么？" : "What's in your story?"}
          </h1>
          <p className="mt-2 max-w-xl text-sm text-[#50617a]">
            {language === "zh"
              ? "选择适合你的模块，每个模块都会为网站增加一个板块。可以跳过，之后也能回来补充。"
              : "Pick everything that applies — each module adds a section to your site. Skip freely; you can always come back."}{" "}
            <span className="text-[#061b31]">
              {language === "zh" ? "材料越丰富，网站越有力量。" : "The richest inputs make stronger sites."}
            </span>
          </p>
          <div className="mt-8 grid gap-3 sm:grid-cols-2">
            {modules.map((m) => {
              const on = data.selected.includes(m.id);
              return (
                <button
                  type="button"
                  key={m.id}
                  aria-pressed={on}
                  onClick={() =>
                    update((d) => ({
                      ...d,
                      selected: on
                        ? d.selected.filter((x) => x !== m.id)
                        : [...d.selected, m.id],
                    }))
                  }
                  className={`card text-left transition ${
                    on ? "ring-glow" : "card-hover"
                  } p-4`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <span className="text-xs font-normal uppercase tracking-[0.08em] text-[#64748d]" aria-hidden="true">
                      {m.id}
                    </span>
                    <span
                      className={`mt-0.5 flex h-5 w-5 items-center justify-center rounded-[4px] border transition ${
                        on
                          ? "border-[#533afd] bg-[#533afd]"
                          : "border-[#d6d9fc]"
                      }`}
                    >
                      {on && (
                        <svg className="h-3 w-3 text-white" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m4 10.5 4 4 8-9" /></svg>
                      )}
                    </span>
                  </div>
                  <h3 className="mt-2 text-sm font-normal text-[#061b31]">{m.title}</h3>
                  <p className="mt-1 text-xs leading-relaxed text-[#50617a]">{m.blurb}</p>
                </button>
              );
            })}
          </div>
        </section>
      )}

      {/* ——— STEPS 2..N: module detail ——— */}
      {moduleForStep(step) && (
        <ModuleStep
          moduleId={moduleForStep(step)!}
          entries={data.entries[moduleForStep(step)!] ?? []}
          onChange={(entries) =>
            update((d) => ({
              ...d,
              entries: { ...d.entries, [moduleForStep(step)!]: entries },
            }))
          }
        />
      )}

      {/* ——— REVIEW ——— */}
      {isReview && (
        <section aria-label="Review">
          <h1 className="font-display text-3xl font-light tracking-[-0.02em] text-[#061b31] sm:text-4xl">
            {language === "zh" ? "准备好了就生成" : "Ready when you are"}
          </h1>
          <div className="card mt-8 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.08em] text-[#64748d]">{language === "zh" ? "网站丰富度" : "Site richness"}</p>
                <p className="font-display text-3xl font-light text-[#061b31]">{localizedScore}</p>
              </div>
              <span className="font-display text-4xl font-light text-[#061b31]">{score}<span className="text-lg text-[#64748d]">/100</span></span>
            </div>
            <div className="mt-3 h-2.5 overflow-hidden rounded-[2px] bg-[#e5edf5]">
              <div
                className="h-full rounded-[2px] bg-[#533afd]"
                style={{ width: `${score}%` }}
              />
            </div>
            <p className="mt-3 text-sm leading-relaxed text-[#50617a]">
              {language === "zh" ? "我们会根据你提供的材料生成完整网站。继续加入照片、项目、文章或案例，效果会更完整。" : scoreDesc}
            </p>
          </div>

          <ul className="mt-6 space-y-2">
            <ReviewRow ok={!!data.essentials.fullName} label={language === "zh" ? "姓名和职业标题" : "Name & headline"} />
            <ReviewRow ok label={`${language === "zh" ? "视觉风格" : "Visual style"} — ${styleName}`} />
            <ReviewRow ok={!!(data.essentials.cv || data.essentials.cvText || data.essentials.bio)} label={language === "zh" ? "简历或简介" : "CV or bio"} />
            <ReviewRow ok={!!data.essentials.photo} label={language === "zh" ? "个人照片" : "Profile photo"} />
            {data.selected.map((id) => {
              const n = (data.entries[id] ?? []).filter(
                (e) => Object.values(e.values).some((v) => v.trim()) || e.files.length > 0,
              ).length;
              return (
                <ReviewRow
                  key={id}
                  ok={n > 0}
                  label={`${getModule(id).title} — ${n} ${n === 1 ? getModule(id).entryNoun : getModule(id).entryNoun + "s"}`}
                />
              );
            })}
          </ul>

          <div className="card mt-8 bg-[#f8fafd] p-6">
            <p className="text-sm text-[#50617a]">
              {language === "zh" ? "下一步：我们会生成你的网站，并展示完整预览。" : "Next: we generate your website and show you a full preview."}
              <br className="hidden sm:block" />
              {language === "zh" ? "只有当你准备上线时才需要付费，价格从 " : "You only pay when you're ready to put it live — from "}
              <span className="font-normal text-[#061b31]">$0.99</span>.
            </p>
            <button
              type="button"
              onClick={() => router.push("/checkout?plan=preview&draft=" + data.draftId)}
              className="btn-primary mt-5 px-8 py-3.5 text-base"
            >
              {language === "zh" ? "生成我的网站" : "Generate my website"}
            </button>
            <p className="mt-3 text-xs text-[#64748d]">
              {language === "zh" ? "约 4 分钟 · 预览后再选择付费计划" : "Takes ~4 minutes · You'll choose your plan after previewing"}
            </p>
          </div>
        </section>
      )}

      {/* ——— nav ——— */}
      <div className="mt-10 flex items-center justify-between">
        <button
          type="button"
          onClick={() => setStep((s) => Math.max(0, s - 1))}
          disabled={step === 0}
          className="btn-ghost px-5 py-2.5 text-sm disabled:pointer-events-none disabled:opacity-40"
        >
          {language === "zh" ? "← 返回" : "← Back"}
        </button>
        {!isReview && (
          <div className="flex items-center gap-3">
            {step >= 2 && (
              <button
                type="button"
                onClick={() => setStep((s) => s + 1)}
                className="text-sm text-[#64748d] underline-offset-4 hover:text-[#533afd] hover:underline"
              >
                {language === "zh" ? "暂时跳过" : "Skip for now"}
              </button>
            )}
            <button
              type="button"
              onClick={() => setStep((s) => s + 1)}
              disabled={step === 0 && !canLeaveEssentials}
              className="btn-primary px-6 py-2.5 text-sm disabled:pointer-events-none disabled:opacity-40"
            >
              {language === "zh" ? "继续 →" : "Continue →"}
            </button>
          </div>
        )}
      </div>
      {step === 0 && !canLeaveEssentials && (
        <p className="mt-3 text-right text-xs text-[#64748d]">
          {language === "zh" ? "填写姓名和职业标题后继续。" : "Add your name and headline to continue."}
        </p>
      )}
    </div>
  );
}

function ReviewRow({ ok, label }: { ok: boolean; label: string }) {
  return (
    <li className={`flex items-center gap-3 rounded-[4px] border px-4 py-3 text-sm ${ok ? "border-[#e5edf5] bg-[#f8fafd] text-[#061b31]" : "border-[#e5edf5] bg-transparent text-[#64748d]"}`}>
      {ok ? (
        <svg className="h-4 w-4 shrink-0 text-[#533afd]" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m4 10.5 4 4 8-9" /></svg>
      ) : (
        <span className="h-4 w-4 shrink-0 rounded-[4px] border border-[#d6d9fc]" aria-hidden="true" />
      )}
      {label}
    </li>
  );
}

function ModuleStep({
  moduleId,
  entries,
  onChange,
}: {
  moduleId: ModuleId;
  entries: Entry[];
  onChange: (entries: Entry[]) => void;
}) {
  const def = getModule(moduleId);
  const list = entries.length > 0 ? entries : [newEntry()];

  // ensure at least one entry exists in state
  useEffect(() => {
    if (entries.length === 0) onChange([newEntry()]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [moduleId]);

  function patch(id: string, fn: (e: Entry) => Entry) {
    onChange(list.map((e) => (e.id === id ? fn(e) : e)));
  }

  return (
    <section aria-label={def.title}>
      <div className="flex items-center gap-3">
        <span className="rounded-[4px] border border-[#d6d9fc] bg-[#f8fafd] px-2 py-1 text-xs font-normal uppercase tracking-[0.08em] text-[#533afd]" aria-hidden="true">
          {moduleId}
        </span>
        <div>
          <h1 className="font-display text-2xl font-light tracking-[-0.02em] text-[#061b31] sm:text-3xl">{def.title}</h1>
          <p className="mt-1 text-sm text-[#50617a]">{def.blurb}</p>
        </div>
      </div>
      {def.example && (
        <p className="mt-4 rounded-[4px] border border-[#e5edf5] bg-[#f8fafd] px-4 py-3 text-xs leading-relaxed text-[#50617a]">
          {def.example}
        </p>
      )}

      <div className="mt-6 space-y-5">
        {list.map((entry, idx) => (
          <div key={entry.id} className="card relative p-5">
            {list.length > 1 && (
              <button
                type="button"
                aria-label={`Remove ${def.entryNoun} ${idx + 1}`}
                onClick={() => onChange(list.filter((e) => e.id !== entry.id))}
                className="absolute right-3 top-3 rounded-[4px] p-1.5 text-[#64748d] hover:bg-[#f8fafd] hover:text-[#533afd]"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><path d="M6 6l12 12M18 6L6 18" /></svg>
              </button>
            )}
            <p className="mb-4 text-xs font-normal uppercase tracking-[0.08em] text-[#64748d]">
              {def.entryNoun} {idx + 1}
            </p>
            <div className="grid gap-4">
              {def.fields.map((f) =>
                f.type === "textarea" ? (
                  <TextArea
                    key={f.key}
                    label={f.label}
                    value={entry.values[f.key] ?? ""}
                    placeholder={f.placeholder}
                    onChange={(v) => patch(entry.id, (e) => ({ ...e, values: { ...e.values, [f.key]: v } }))}
                  />
                ) : (
                  <TextField
                    key={f.key}
                    label={f.label}
                    type={f.type === "url" ? "url" : "text"}
                    required={f.required}
                    value={entry.values[f.key] ?? ""}
                    placeholder={f.placeholder}
                    hint={f.required ? "required" : undefined}
                    onChange={(v) => patch(entry.id, (e) => ({ ...e, values: { ...e.values, [f.key]: v } }))}
                  />
                ),
              )}
              {def.allowFiles && (
                <FileDrop
                  label="Attachments"
                  hint={def.fileHint}
                  accept="image/*,.pdf"
                  multiple
                  files={entry.files}
                  onChange={(files) => patch(entry.id, (e) => ({ ...e, files }))}
                />
              )}
            </div>
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={() => onChange([...list, newEntry()])}
        className="btn-ghost mt-5 px-5 py-2.5 text-sm"
      >
        + Add another {def.entryNoun}
      </button>
    </section>
  );
}
