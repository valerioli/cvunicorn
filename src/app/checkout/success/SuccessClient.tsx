"use client";

import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

type StatusPayload = {
  status: "pending" | "paid" | "failed" | "canceled";
  planId: "preview" | "year";
  amountCents: number;
  receiptNumber: string | null;
  accessExpiresAt: number | null;
  failureReason: string | null;
};

export default function SuccessClient() {
  const params = useSearchParams();
  const orderId = params.get("order") ?? "";
  const token = params.get("t") ?? "";
  const [state, setState] = useState<StatusPayload | null>(null);
  const [timedOut, setTimedOut] = useState(false);
  const tries = useRef(0);

  useEffect(() => {
    if (!orderId || !token) return;
    let stop = false;
    async function poll() {
      while (!stop && tries.current < 30) {
        tries.current += 1;
        try {
          const res = await fetch(
            `/api/payments/status?order=${encodeURIComponent(orderId)}&t=${encodeURIComponent(token)}`,
            { cache: "no-store" },
          );
          if (res.ok) {
            const json = (await res.json()) as StatusPayload;
            setState(json);
            if (json.status === "paid" || json.status === "failed") return;
          }
        } catch {}
        await new Promise((r) => setTimeout(r, 2000));
      }
      if (!stop) setTimedOut(true);
    }
    poll();
    return () => {
      stop = true;
    };
  }, [orderId, token]);

  if (!orderId || !token) {
    return (
      <Shell>
        <h1 className="font-display text-2xl font-light text-[#061b31]">Missing order details</h1>
        <p className="mt-3 text-sm text-[#50617a]">
          This confirmation link is incomplete. Check the link from your
          receipt email, or contact us.
        </p>
      </Shell>
    );
  }

  if (state?.status === "paid") {
    const receiptHref = `/receipt/${orderId}?t=${encodeURIComponent(token)}`;
    const accountHref = `/account?order=${orderId}&t=${encodeURIComponent(token)}`;
    return (
      <Shell>
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-[4px] border border-[#d6d9fc] bg-[#f8fafd]">
          <svg className="h-6 w-6 text-[#533afd]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m5 13 4 4L19 7" /></svg>
        </div>
        <h1 className="mt-6 font-display text-3xl font-light tracking-[-0.02em] text-[#061b31]">
          Payment confirmed
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-[#50617a]">
          {state.planId === "year"
            ? "Your website is covered for the next 12 months, custom domain included."
            : "Your 3-day preview is live. Enjoy the spotlight."}
        </p>
        <dl className="card mx-auto mt-7 max-w-sm space-y-2.5 p-5 text-left text-sm">
          <div className="flex justify-between">
            <dt className="text-[#64748d]">Receipt</dt>
            <dd className="font-mono text-xs text-[#061b31]">{state.receiptNumber}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-[#64748d]">Amount</dt>
            <dd className="text-[#061b31]">${(state.amountCents / 100).toFixed(2)} USD</dd>
          </div>
          {state.accessExpiresAt && (
            <div className="flex justify-between">
              <dt className="text-[#64748d]">Live until</dt>
              <dd className="text-[#061b31]">
                {new Date(state.accessExpiresAt).toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" })}
              </dd>
            </div>
          )}
        </dl>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Link href={accountHref} className="btn-primary px-6 py-3 text-sm">
            Go to my site dashboard
          </Link>
          <Link href={receiptHref} className="btn-ghost px-6 py-3 text-sm">
            View receipt
          </Link>
        </div>
        <p className="mt-5 text-xs text-[#64748d]">
          Save this page's link — it's your key to your dashboard and receipt.
          We've also emailed it to you.
        </p>
      </Shell>
    );
  }

  if (state?.status === "failed") {
    return (
      <Shell>
        <h1 className="font-display text-2xl font-light text-[#061b31]">Payment didn't complete</h1>
        <p className="mt-3 text-sm text-[#50617a]">{state.failureReason ?? "The payment was not completed."}</p>
        <Link href="/checkout" className="btn-primary mt-7 inline-flex px-6 py-3 text-sm">
          Try again
        </Link>
      </Shell>
    );
  }

  if (timedOut) {
    return (
      <Shell>
        <h1 className="font-display text-2xl font-light text-[#061b31]">Still confirming…</h1>
        <p className="mt-3 text-sm leading-relaxed text-[#50617a]">
          Your payment is taking longer than usual to confirm. This page is
          safe to close — we'll email you the moment it clears. If you were
          charged and don't hear from us within an hour, contact
          hello@cvunicorn.com with order <code className="rounded bg-white/8 px-1.5 py-0.5 text-xs">{orderId}</code>.
        </p>
      </Shell>
    );
  }

  return (
    <Shell>
      <div className="mx-auto h-10 w-10 animate-spin rounded-full border-2 border-[#e5edf5] border-t-[#533afd]" aria-hidden="true" />
      <h1 className="mt-6 font-display text-2xl font-light text-[#061b31]">Confirming your payment…</h1>
      <p className="mt-3 text-sm text-[#50617a]">Usually takes a few seconds. Don't close this page.</p>
    </Shell>
  );
}

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto max-w-lg px-5 pb-24 pt-14">{children}</div>
  );
}
