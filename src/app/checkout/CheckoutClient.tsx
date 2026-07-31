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
  const accessLabel = plan.durationDays === 365 ? "12 months" : `${plan.durationDays} days`;

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
      setError("Network error. Please check your connection and try again.");
      setBusy(false);
    }
  }

  return (
    <section className="min-h-[calc(100vh-5rem)] bg-[#ffffff] px-5 pb-20 pt-8 text-[#061b31] sm:pt-12">
      <div className="mx-auto max-w-[1120px]">
        <div className="border-b border-[#e5edf5] pb-8">
          <p className="text-xs font-normal uppercase text-[#64748d]">CVUnicorn Checkout</p>
          <h1 className="mt-4 max-w-2xl text-4xl font-light leading-[1.05] text-[#061b31] sm:text-5xl">
            Put your personal website live with card payment.
          </h1>
          <p className="mt-5 max-w-2xl text-lg font-light leading-relaxed text-[#50617a]">
            Choose a one-time hosting pass, enter the email for your receipt, then continue to Stripe's secure hosted checkout.
          </p>
        </div>

        <div className="grid gap-8 border-b border-[#e5edf5] py-8 lg:grid-cols-[minmax(0,1fr)_360px] lg:gap-12">
          <div>
            <fieldset>
              <legend className="text-sm font-normal text-[#061b31]">Plan</legend>
              <div className="mt-3 grid gap-3">
                {plans.map((p) => {
                  const on = planId === p.id;
                  return (
                    <label
                      key={p.id}
                      className={`grid cursor-pointer gap-4 rounded-[4px] border p-5 transition sm:grid-cols-[1fr_auto] ${
                        on
                          ? "border-[#533afd] bg-[#f8fafd]"
                          : "border-[#e5edf5] bg-white hover:border-[#b9b9f9]"
                      }`}
                    >
                      <span className="flex items-start gap-3">
                        <input
                          type="radio"
                          name="plan"
                          value={p.id}
                          checked={on}
                          onChange={() => setPlanId(p.id)}
                          className="mt-1 h-4 w-4"
                        />
                        <span>
                          <span className="flex flex-wrap items-center gap-2 text-base font-normal text-[#061b31]">
                            {p.name}
                            {p.highlight && (
                              <span className="rounded-[4px] border border-[#d6d9fc] bg-[#e8e9ff] px-2 py-0.5 text-xs text-[#533afd]">
                                Best value
                              </span>
                            )}
                          </span>
                          <span className="mt-1 block text-sm leading-relaxed text-[#50617a]">{p.tagline}</span>
                        </span>
                      </span>
                      <span className="text-left sm:text-right">
                        <span className="block text-2xl font-light text-[#061b31]">{p.priceLabel}</span>
                        <span className="block text-sm text-[#64748d]">{p.period}</span>
                      </span>
                    </label>
                  );
                })}
              </div>
            </fieldset>

            <label className="mt-7 block">
              <span className="block text-sm font-normal text-[#061b31]">Receipt email</span>
              <span className="mt-1 block text-sm text-[#50617a]">Your dashboard and receipt link are tied to this address.</span>
              <input
                type="email"
                className="mt-3 w-full rounded-[4px] border border-[#e5edf5] bg-white px-4 py-3 text-base text-[#061b31] outline-none transition placeholder:text-[#839bc8] focus:border-[#533afd] focus:ring-2 focus:ring-[#e8e9ff]"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                autoComplete="email"
              />
            </label>

            {error && (
              <p role="alert" className="mt-5 rounded-[4px] border border-[#d6d9fc] bg-[#f8fafd] px-4 py-3 text-sm text-[#061b31]">
                {error}
              </p>
            )}

            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={pay}
                disabled={busy || !email}
                className="inline-flex min-h-12 items-center justify-center rounded-[4px] bg-[#533afd] px-6 py-3 text-sm font-normal text-white transition hover:bg-[#7389ff] disabled:pointer-events-none disabled:opacity-50"
              >
                {busy ? "Preparing Stripe Checkout..." : `Pay ${plan.priceLabel} securely`}
              </button>
              <Link
                href="/pricing"
                className="inline-flex min-h-12 items-center justify-center rounded-[4px] border border-[#b9b9f9] px-6 py-3 text-sm font-normal text-[#533afd] transition hover:bg-[#f8fafd]"
              >
                Compare plans
              </Link>
            </div>

            <p className="mt-4 flex items-start gap-2 text-sm leading-relaxed text-[#50617a]">
              <LockIcon />
              Card details are collected by Stripe Checkout. CVUnicorn never sees or stores your card number.
            </p>
          </div>

          <aside className="h-fit rounded-[4px] border border-[#e5edf5] bg-[#f8fafd] p-6">
            <p className="text-xs font-normal uppercase text-[#64748d]">Order summary</p>
            <div className="mt-6 border-b border-[#e5edf5] pb-5">
              <div className="flex items-start justify-between gap-5">
                <div>
                  <p className="text-base font-normal text-[#061b31]">{plan.name}</p>
                  <p className="mt-1 text-sm text-[#50617a]">{accessLabel} of live hosting</p>
                </div>
                <p className="text-2xl font-light text-[#061b31]">{plan.priceLabel}</p>
              </div>
            </div>

            <dl className="space-y-3 border-b border-[#e5edf5] py-5 text-sm">
              <div className="flex justify-between gap-4">
                <dt className="text-[#50617a]">Subtotal</dt>
                <dd className="text-[#061b31]">{plan.priceLabel}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-[#50617a]">Renewal</dt>
                <dd className="text-[#061b31]">None</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-[#50617a]">Currency</dt>
                <dd className="text-[#061b31]">USD</dd>
              </div>
            </dl>

            <div className="flex items-end justify-between gap-4 py-5">
              <p className="text-sm font-normal text-[#061b31]">Total due today</p>
              <p className="text-4xl font-light text-[#061b31]">{plan.priceLabel}</p>
            </div>

            <div className="grid gap-3 border-t border-[#e5edf5] pt-5 text-sm text-[#50617a]">
              <p className="flex items-center gap-2">
                <CheckIcon />
                One-time payment
              </p>
              <p className="flex items-center gap-2">
                <CheckIcon />
                Hosted checkout with 3D Secure support
              </p>
              <p className="flex items-center gap-2">
                <CheckIcon />
                Access opens after payment confirmation
              </p>
            </div>
          </aside>
        </div>

        <p className="pt-5 text-sm text-[#50617a]">
          By paying you agree to our{" "}
          <Link href="/legal/terms" className="text-[#533afd] underline underline-offset-2">
            Terms
          </Link>{" "}
          and{" "}
          <Link href="/legal/refunds" className="text-[#533afd] underline underline-offset-2">
            Refund Policy
          </Link>
          .
        </p>
      </div>
    </section>
  );
}

function CheckIcon() {
  return (
    <svg className="h-4 w-4 shrink-0 text-[#533afd]" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="m4 10.5 4 4 8-9" />
    </svg>
  );
}

function LockIcon() {
  return (
    <svg className="mt-0.5 h-4 w-4 shrink-0 text-[#533afd]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="5" y="11" width="14" height="9" rx="2" />
      <path d="M8 11V8a4 4 0 0 1 8 0v3" />
    </svg>
  );
}
