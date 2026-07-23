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
} from "@/lib/intake";
import { TextField, TextArea, FileDrop } from "./fields";
import { professions } from "@/content/professions";

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
  const [data, setData] = useState<IntakeData>(emptyIntake);
  const [hydrated, setHydrated] = useState(false);
  // step index: 0 = essentials, 1 = module picker, 2..N = selected modules, N+1 = review
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

  const stepCount = 2 + data.selected.length + 1;
  const moduleForStep = (s: number): ModuleId | null =>
    s >= 2 && s < 2 + data.selected.length ? data.selected[s - 2] : null;
  const isReview = step === stepCount - 1;
  const canLeaveEssentials =
    data.essentials.fullName.trim().length > 0 &&
    data.essentials.headline.trim().length > 0;

  const stepTitle = useMemo(() => {
    if (step === 0) return "The essentials";
    if (step === 1) return "Choose your story modules";
    const m = moduleForStep(step);
    if (m) return getModule(m).title;
    return "Review & generate";
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step, data.selected]);

  if (!hydrated) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center text-ink-400">
        Loading your draft…
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-5 pb-24">
      {/* ——— progress + richness ——— */}
      <div className="sticky top-20 z-30 -mx-5 mb-8 border-b border-white/6 bg-ink-950/85 px-5 py-4 backdrop-blur-xl md:top-24">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="text-xs font-medium uppercase tracking-wider text-ink-400">
              Step {step + 1} / {stepCount}
            </span>
            <span className="hidden text-sm font-medium text-white sm:inline">{stepTitle}</span>
          </div>
          <div className="flex items-center gap-2.5" title={scoreDesc}>
            <span className="text-xs text-ink-400">Site richness</span>
            <div className="h-2 w-28 overflow-hidden rounded-full bg-white/8">
              <div
                className="h-full rounded-full bg-gradient-to-r from-iris-500 via-rose-500 to-amber-400 transition-all duration-700"
                style={{ width: `${score}%` }}
              />
            </div>
            <span className="text-gradient text-xs font-semibold">{scoreLabel}</span>
          </div>
        </div>
      </div>

      {/* ——— STEP 0: essentials ——— */}
      {step === 0 && (
        <section aria-label="Essentials">
          <h1 className="font-display text-3xl font-semibold text-white sm:text-4xl">
            Let's start with you
          </h1>
          <p className="mt-2 text-sm text-ink-300">
            Two required fields. Everything else is optional — but each one
            visibly improves your site.
          </p>
          <div className="mt-8 grid gap-5 sm:grid-cols-2">
            <TextField
              label="Full name"
              required
              value={data.essentials.fullName}
              onChange={(v) => update((d) => ({ ...d, essentials: { ...d.essentials, fullName: v } }))}
              placeholder="Valerio Li"
              hint="required"
            />
            <TextField
              label="Professional headline"
              required
              value={data.essentials.headline}
              onChange={(v) => update((d) => ({ ...d, essentials: { ...d.essentials, headline: v } }))}
              placeholder="Chief Marketing Officer at AInfinity"
              hint="required"
            />
            <label className="block">
              <span className="mb-1.5 block text-sm font-medium text-ink-100">
                Your field <span className="ml-2 text-xs font-normal text-ink-400">tailors your site's structure</span>
              </span>
              <select
                className="field"
                value={data.essentials.profession}
                onChange={(e) => update((d) => ({ ...d, essentials: { ...d.essentials, profession: e.target.value } }))}
              >
                <option value="">Choose (or skip)…</option>
                {professions.map((p) => (
                  <option key={p.slug} value={p.slug}>{p.plural}</option>
                ))}
                <option value="other">Something else</option>
              </select>
            </label>
            <TextField
              label="Email"
              type="email"
              value={data.essentials.email}
              onChange={(v) => update((d) => ({ ...d, essentials: { ...d.essentials, email: v } }))}
              placeholder="you@example.com"
              hint="for your receipt & site link"
            />
            <TextField
              label="Location"
              value={data.essentials.location}
              onChange={(v) => update((d) => ({ ...d, essentials: { ...d.essentials, location: v } }))}
              placeholder="Tokyo · Singapore"
            />
          </div>
          <div className="mt-5 grid gap-5 sm:grid-cols-2">
            <FileDrop
              label="Profile photo"
              hint="a real portrait outperforms a logo"
              accept="image/*"
              files={data.essentials.photo ? [data.essentials.photo] : []}
              onChange={(files) => update((d) => ({ ...d, essentials: { ...d.essentials, photo: files[0] ?? null } }))}
            />
            <FileDrop
              label="Resume / CV"
              hint="PDF or Word — the backbone of your site"
              accept=".pdf,.doc,.docx,.txt,.md"
              files={data.essentials.cv ? [data.essentials.cv] : []}
              onChange={(files) => update((d) => ({ ...d, essentials: { ...d.essentials, cv: files[0] ?? null } }))}
            />
          </div>
          <div className="mt-5">
            <TextArea
              label="Short bio or introduction"
              hint="or paste your CV text here"
              rows={5}
              value={data.essentials.bio}
              onChange={(v) => update((d) => ({ ...d, essentials: { ...d.essentials, bio: v } }))}
              placeholder="Marketing and growth leader with 15 years across luxury retail, Web3, and AI…"
            />
          </div>
        </section>
      )}

      {/* ——— STEP 1: module picker ——— */}
      {step === 1 && (
        <section aria-label="Story modules">
          <h1 className="font-display text-3xl font-semibold text-white sm:text-4xl">
            What's in your story?
          </h1>
          <p className="mt-2 max-w-xl text-sm text-ink-300">
            Pick everything that applies — each module adds a section to your
            site. Skip freely; you can always come back.{" "}
            <span className="text-ink-100">The richest inputs make Unicorn-grade sites.</span>
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
                    on ? "ring-glow border-iris-400/40" : "card-hover"
                  } p-4`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <span className="text-xl" aria-hidden="true">{m.icon}</span>
                    <span
                      className={`mt-0.5 flex h-5 w-5 items-center justify-center rounded-md border transition ${
                        on
                          ? "border-transparent bg-gradient-to-br from-iris-500 to-rose-500"
                          : "border-white/20"
                      }`}
                    >
                      {on && (
                        <svg className="h-3 w-3 text-white" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m4 10.5 4 4 8-9" /></svg>
                      )}
                    </span>
                  </div>
                  <h3 className="mt-2 text-sm font-semibold text-white">{m.title}</h3>
                  <p className="mt-1 text-xs leading-relaxed text-ink-400">{m.blurb}</p>
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
          <h1 className="font-display text-3xl font-semibold text-white sm:text-4xl">
            Ready when you are
          </h1>
          <div className="card mt-8 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-wider text-ink-400">Site richness</p>
                <p className="text-gradient font-display text-3xl font-semibold">{scoreLabel}</p>
              </div>
              <span className="font-display text-4xl font-semibold text-white">{score}<span className="text-lg text-ink-400">/100</span></span>
            </div>
            <div className="mt-3 h-2.5 overflow-hidden rounded-full bg-white/8">
              <div
                className="h-full rounded-full bg-gradient-to-r from-iris-500 via-rose-500 to-amber-400"
                style={{ width: `${score}%` }}
              />
            </div>
            <p className="mt-3 text-sm leading-relaxed text-ink-300">{scoreDesc}</p>
          </div>

          <ul className="mt-6 space-y-2">
            <ReviewRow ok={!!data.essentials.fullName} label="Name & headline" />
            <ReviewRow ok={!!(data.essentials.cv || data.essentials.cvText || data.essentials.bio)} label="CV or bio" />
            <ReviewRow ok={!!data.essentials.photo} label="Profile photo" />
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

          <div className="card mt-8 border-iris-400/25 bg-iris-500/6 p-6 text-center">
            <p className="text-sm text-ink-200">
              Next: we generate your website and show you a full preview.
              <br className="hidden sm:block" />
              You only pay when you're ready to put it live — from{" "}
              <span className="font-semibold text-white">$0.99</span>.
            </p>
            <button
              type="button"
              onClick={() => router.push("/checkout?plan=preview&draft=" + data.draftId)}
              className="btn-primary mt-5 px-8 py-3.5 text-base"
            >
              Generate my website
            </button>
            <p className="mt-3 text-xs text-ink-400">
              Takes ~4 minutes · You'll choose your plan after previewing
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
          ← Back
        </button>
        {!isReview && (
          <div className="flex items-center gap-3">
            {step >= 2 && (
              <button
                type="button"
                onClick={() => setStep((s) => s + 1)}
                className="text-sm text-ink-400 underline-offset-4 hover:text-ink-200 hover:underline"
              >
                Skip for now
              </button>
            )}
            <button
              type="button"
              onClick={() => setStep((s) => s + 1)}
              disabled={step === 0 && !canLeaveEssentials}
              className="btn-primary px-6 py-2.5 text-sm disabled:pointer-events-none disabled:opacity-40"
            >
              Continue →
            </button>
          </div>
        )}
      </div>
      {step === 0 && !canLeaveEssentials && (
        <p className="mt-3 text-right text-xs text-ink-400">
          Add your name and headline to continue.
        </p>
      )}
    </div>
  );
}

function ReviewRow({ ok, label }: { ok: boolean; label: string }) {
  return (
    <li className={`flex items-center gap-3 rounded-xl border px-4 py-3 text-sm ${ok ? "border-white/8 bg-white/3 text-ink-200" : "border-white/6 bg-transparent text-ink-400"}`}>
      {ok ? (
        <svg className="h-4 w-4 shrink-0 text-mint-400" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m4 10.5 4 4 8-9" /></svg>
      ) : (
        <span className="h-4 w-4 shrink-0 rounded-full border border-white/15" aria-hidden="true" />
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
        <span className="text-3xl" aria-hidden="true">{def.icon}</span>
        <div>
          <h1 className="font-display text-2xl font-semibold text-white sm:text-3xl">{def.title}</h1>
          <p className="mt-1 text-sm text-ink-300">{def.blurb}</p>
        </div>
      </div>
      {def.example && (
        <p className="mt-4 rounded-xl border border-amber-300/20 bg-amber-300/6 px-4 py-3 text-xs leading-relaxed text-amber-300/90">
          💡 {def.example}
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
                className="absolute right-3 top-3 rounded-md p-1.5 text-ink-400 hover:bg-white/8 hover:text-white"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><path d="M6 6l12 12M18 6L6 18" /></svg>
              </button>
            )}
            <p className="mb-4 text-xs font-semibold uppercase tracking-wider text-ink-400">
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
