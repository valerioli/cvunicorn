"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { plans, getPlan } from "@/content/plans";

export default function CheckoutClient() {
  const params = useSearchParams();
  const draftId = params.get("draft") ?? "";
  const initial = getPlan(params.get("plan") ?? "")?.id ?? "year";
  const [planId, setPlanId] = useState<"preview" | "year">(initial);
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const plan = getPlan(planId)!;

  async function pay() {
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ planId, draftId, email }),
      });
      const json = (await res.json()) as { redirectUrl?: string; error?: string };
      if (!res.ok || !json.redirectUrl) {
        setError(json.error ?? "Something went wrong. Please try again.");
        setBusy(false);
        return;
      }
      window.location.href = json.redirectUrl;
    } catch {
      setError("Network error — please check your connection and try again.");
      setBusy(false);
    }
  }

  return (
    <div className="mx-auto max-w-lg px-5 pb-24 pt-8">
      <h1 className="font-display text-3xl font-semibold text-white sm:text-4xl">
        Put your site live
      </h1>
      <p className="mt-2 text-sm text-ink-300">
        One-time payment. Your website goes live the moment it clears.
      </p>

      {/* plan selection */}
      <fieldset className="mt-8">
        <legend className="sr-only">Choose your plan</legend>
        <div className="grid gap-3">
          {plans.map((p) => {
            const on = planId === p.id;
            return (
              <label
                key={p.id}
                className={`card flex cursor-pointer items-center justify-between gap-4 p-4.5 transition ${
                  on ? "ring-glow border-iris-400/40" : "card-hover"
                }`}
              >
                <span className="flex items-center gap-3.5">
                  <input
                    type="radio"
                    name="plan"
                    value={p.id}
                    checked={on}
                    onChange={() => setPlanId(p.id)}
                    className="h-4 w-4"
                  />
                  <span>
                    <span className="block text-sm font-semibold text-white">
                      {p.name}
                      {p.highlight && (
                        <span className="ml-2 rounded-full bg-gradient-to-r from-iris-500 to-rose-500 px-2 py-0.5 text-[10px] font-semibold">
                          BEST VALUE
                        </span>
                      )}
                    </span>
                    <span className="mt-0.5 block text-xs text-ink-400">{p.tagline}</span>
                  </span>
                </span>
                <span className="text-right">
                  <span className="font-display text-xl font-semibold text-white">{p.priceLabel}</span>
                  <span className="block text-[11px] text-ink-400">{p.period}</span>
                </span>
              </label>
            );
          })}
        </div>
      </fieldset>

      {/* email */}
      <label className="mt-6 block">
        <span className="mb-1.5 block text-sm font-medium text-ink-100">
          Email <span className="ml-2 text-xs font-normal text-ink-400">for your receipt & site access</span>
        </span>
        <input
          type="email"
          className="field"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          autoComplete="email"
        />
      </label>

      {/* summary */}
      <div className="card mt-6 p-5">
        <div className="flex items-center justify-between text-sm">
          <span className="text-ink-300">{plan.name}</span>
          <span className="font-semibold text-white">{plan.priceLabel}</span>
        </div>
        <div className="mt-2 flex items-center justify-between text-xs text-ink-400">
          <span>Access period</span>
          <span>{plan.durationDays === 365 ? "12 months" : `${plan.durationDays} days`}</span>
        </div>
        <div className="hairline mt-3 flex items-center justify-between border-t pt-3 text-sm">
          <span className="font-medium text-ink-100">Total due today</span>
          <span className="font-display text-lg font-semibold text-white">{plan.priceLabel}</span>
        </div>
      </div>

      {error && (
        <p role="alert" className="mt-4 rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-400">
          {error}
        </p>
      )}

      <button
        type="button"
        onClick={pay}
        disabled={busy || !email}
        className="btn-primary mt-6 w-full px-6 py-3.5 text-base disabled:pointer-events-none disabled:opacity-50"
      >
        {busy ? "Preparing secure checkout…" : `Pay ${plan.priceLabel} securely`}
      </button>

      <p className="mt-4 flex items-center justify-center gap-1.5 text-center text-xs text-ink-400">
        <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
          <rect x="5" y="11" width="14" height="9" rx="2" />
          <path d="M8 11V8a4 4 0 0 1 8 0v3" />
        </svg>
        Card details are handled by our certified payment processor — they never touch our servers.
      </p>
      <p className="mt-2 text-center text-xs text-ink-400">
        By paying you agree to our{" "}
        <Link href="/legal/terms" className="underline underline-offset-2 hover:text-ink-200">Terms</Link> and{" "}
        <Link href="/legal/refunds" className="underline underline-offset-2 hover:text-ink-200">Refund Policy</Link>.
      </p>
    </div>
  );
}
