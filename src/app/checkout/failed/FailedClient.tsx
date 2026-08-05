"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { SUPPORT_EMAIL } from "@/lib/contact";

export default function FailedClient() {
  const params = useSearchParams();
  const orderId = params.get("order") ?? "";
  const token = params.get("t") ?? "";
  const [reason, setReason] = useState<string | null>(null);

  useEffect(() => {
    if (!orderId || !token) return;
    fetch(`/api/payments/status?order=${encodeURIComponent(orderId)}&t=${encodeURIComponent(token)}`, { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : null))
      .then((j: { failureReason?: string | null } | null) => setReason(j?.failureReason ?? null))
      .catch(() => {});
  }, [orderId, token]);

  return (
    <div className="mx-auto max-w-lg px-5 pb-24 pt-14">
      <div className="flex h-12 w-12 items-center justify-center rounded-[4px] border border-[#d6d9fc] bg-[#f8fafd]">
        <svg className="h-6 w-6 text-[#533afd]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18" /></svg>
      </div>
      <h1 className="mt-6 font-display text-3xl font-light tracking-[-0.02em] text-[#061b31]">
        That payment didn't go through
      </h1>
      <p className="mt-3 text-sm leading-relaxed text-[#50617a]">
        {reason ?? "No money left your account — the payment was canceled or declined."}{" "}
        Your website draft is saved and waiting; nothing is lost.
      </p>
      <div className="card mt-7 max-w-sm p-5 text-left text-sm text-[#50617a]">
        <p className="font-normal text-[#061b31]">Common quick fixes:</p>
        <ul className="mt-2.5 list-inside list-disc space-y-1.5 text-xs leading-relaxed">
          <li>Double-check the card number, expiry, and CVC</li>
          <li>Try a different card — some banks block small online charges</li>
          <li>Make sure online / international payments are enabled</li>
        </ul>
      </div>
      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <Link href="/checkout" className="btn-primary px-6 py-3 text-sm">
          Try payment again
        </Link>
        <Link href="/start" className="btn-ghost px-6 py-3 text-sm">
          Back to my draft
        </Link>
      </div>
      <p className="mt-5 text-xs text-[#64748d]">
        Stuck? Email {SUPPORT_EMAIL}{orderId && <> and mention order <code className="rounded bg-white/8 px-1 py-0.5">{orderId}</code></>}.
      </p>
    </div>
  );
}
