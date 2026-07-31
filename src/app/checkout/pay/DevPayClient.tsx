"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";

export default function DevPayClient() {
  const params = useSearchParams();
  const orderId = params.get("order") ?? "";
  const successUrl = params.get("success") ?? "/";
  const cancelUrl = params.get("cancel") ?? "/";
  const [busy, setBusy] = useState<"paid" | "failed" | null>(null);

  async function complete(outcome: "paid" | "failed") {
    setBusy(outcome);
    try {
      await fetch("/api/payments/dev", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId,
          outcome,
          reason: outcome === "failed" ? "Card declined (simulated)" : undefined,
        }),
      });
    } finally {
      window.location.href = outcome === "paid" ? successUrl : cancelUrl;
    }
  }

  return (
    <div className="mx-auto max-w-md px-5 pb-24 pt-10">
      <div className="mb-6 rounded-[4px] border border-[#d6d9fc] bg-[#f8fafd] px-4 py-3 text-xs font-normal uppercase tracking-[0.08em] text-[#533afd]">
        Test mode — no real payment provider configured
      </div>
      <div className="card p-7">
        <h1 className="font-display text-2xl font-light text-[#061b31]">
          Simulated checkout
        </h1>
        <p className="mt-2 text-sm text-[#50617a]">
          Order <code className="rounded bg-white/8 px-1.5 py-0.5 text-xs">{orderId}</code>
        </p>
        <div className="mt-7 space-y-3">
          <button
            type="button"
            onClick={() => complete("paid")}
            disabled={busy !== null}
            className="btn-primary w-full px-6 py-3 text-sm disabled:opacity-50"
          >
            {busy === "paid" ? "Processing…" : "Simulate successful payment"}
          </button>
          <button
            type="button"
            onClick={() => complete("failed")}
            disabled={busy !== null}
            className="btn-ghost w-full px-6 py-3 text-sm disabled:opacity-50"
          >
            {busy === "failed" ? "Processing…" : "Simulate declined card"}
          </button>
        </div>
        <p className="mt-6 text-xs leading-relaxed text-[#64748d]">
          In production, customers see Stripe's secure hosted checkout
          page here instead. Set <code className="rounded bg-white/8 px-1 py-0.5">PAYMENT_PROVIDER=stripe</code>{" "}
          with API credentials to go live.
        </p>
      </div>
    </div>
  );
}
