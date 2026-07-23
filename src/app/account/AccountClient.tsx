"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

type StatusPayload = {
  orderId: string;
  status: "pending" | "paid" | "failed" | "canceled";
  planId: "preview" | "year";
  amountCents: number;
  receiptNumber: string | null;
  paidAt: number | null;
  accessExpiresAt: number | null;
  activeAccess: boolean;
  siteSlug: string | null;
};

export default function AccountClient() {
  const params = useSearchParams();
  const orderId = params.get("order") ?? "";
  const token = params.get("t") ?? "";
  const [data, setData] = useState<StatusPayload | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [generating, setGenerating] = useState(false);
  const [siteUrl, setSiteUrl] = useState<string | null>(null);
  const [genError, setGenError] = useState<string | null>(null);

  useEffect(() => {
    if (!orderId || !token) return;
    fetch(`/api/payments/status?order=${encodeURIComponent(orderId)}&t=${encodeURIComponent(token)}`, { cache: "no-store" })
      .then(async (r) => {
        if (!r.ok) throw new Error();
        setData((await r.json()) as StatusPayload);
      })
      .catch(() => setError("We couldn't verify this link. Use the link from your receipt email."));
  }, [orderId, token]);

  useEffect(() => {
    if (data?.siteSlug) setSiteUrl(`/site/${data.siteSlug}`);
  }, [data]);

  async function generate() {
    setGenerating(true);
    setGenError(null);
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId, token }),
      });
      const json = (await res.json()) as { siteUrl?: string; error?: string };
      if (!res.ok || !json.siteUrl) {
        setGenError(json.error ?? "Generation failed — please try again.");
      } else {
        setSiteUrl(json.siteUrl);
      }
    } catch {
      setGenError("Network error — please try again.");
    } finally {
      setGenerating(false);
    }
  }

  if (!orderId || !token) {
    return (
      <Shell>
        <h1 className="font-display text-3xl font-semibold text-white">My site</h1>
        <p className="mt-3 max-w-md text-sm leading-relaxed text-ink-300">
          Open this page using the personal link from your payment
          confirmation or receipt email — it's your key, no password needed.
        </p>
        <p className="mt-4 text-sm text-ink-400">
          Can't find it? Email{" "}
          <a href="mailto:hello@cvunicorn.com" className="text-iris-300 hover:underline">hello@cvunicorn.com</a>{" "}
          from your purchase address and we'll resend it.
        </p>
        <Link href="/start" className="btn-primary mt-8 inline-flex px-6 py-3 text-sm">
          Or build a new website
        </Link>
      </Shell>
    );
  }

  if (error) {
    return (
      <Shell>
        <h1 className="font-display text-2xl font-semibold text-white">Link not valid</h1>
        <p className="mt-3 text-sm text-ink-300">{error}</p>
      </Shell>
    );
  }

  if (!data) {
    return (
      <Shell>
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-white/10 border-t-iris-400" aria-hidden="true" />
      </Shell>
    );
  }

  const expires = data.accessExpiresAt ? new Date(data.accessExpiresAt) : null;
  const daysLeft = expires ? Math.max(0, Math.ceil((expires.getTime() - Date.now()) / 86_400_000)) : 0;

  return (
    <Shell>
      <h1 className="font-display text-3xl font-semibold text-white">My site</h1>

      {/* status card */}
      <div className="card mt-8 w-full max-w-lg p-6 text-left">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-ink-100">
            {data.planId === "year" ? "Unicorn Year" : "Preview Pass"}
          </span>
          {data.activeAccess ? (
            <span className="inline-flex items-center gap-1.5 rounded-full border border-mint-400/30 bg-mint-400/10 px-2.5 py-1 text-xs font-medium text-mint-400">
              <span className="h-1.5 w-1.5 rounded-full bg-mint-400" /> Active
            </span>
          ) : data.status === "paid" ? (
            <span className="rounded-full border border-amber-300/30 bg-amber-300/10 px-2.5 py-1 text-xs font-medium text-amber-300">
              Expired
            </span>
          ) : (
            <span className="rounded-full border border-white/15 bg-white/5 px-2.5 py-1 text-xs font-medium text-ink-300">
              {data.status}
            </span>
          )}
        </div>
        {expires && (
          <p className="mt-3 text-sm text-ink-300">
            {data.activeAccess
              ? `Live until ${expires.toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" })} (${daysLeft} day${daysLeft === 1 ? "" : "s"} left)`
              : `Expired ${expires.toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" })} — renew to bring your site back exactly as it was.`}
          </p>
        )}
        <div className="mt-5 flex flex-wrap gap-2.5">
          {data.receiptNumber && (
            <Link href={`/receipt/${orderId}?t=${encodeURIComponent(token)}`} className="btn-ghost px-4 py-2 text-xs">
              View receipt
            </Link>
          )}
          {!data.activeAccess && data.status === "paid" && (
            <Link href="/checkout?plan=year" className="btn-primary px-4 py-2 text-xs">
              Renew for a year — $9.99
            </Link>
          )}
          {data.activeAccess && data.planId === "preview" && (
            <Link href="/checkout?plan=year" className="btn-primary px-4 py-2 text-xs">
              Upgrade to a full year — $9.99
            </Link>
          )}
        </div>
      </div>

      {/* website card */}
      {data.activeAccess && (
        <div className="card mt-5 w-full max-w-lg p-6 text-left">
          <h2 className="text-sm font-medium text-ink-100">Your website</h2>
          {siteUrl ? (
            <>
              <a
                href={siteUrl}
                target="_blank"
                rel="noopener"
                className="mt-3 block truncate rounded-xl border border-iris-400/30 bg-iris-500/10 px-4 py-3 text-sm font-medium text-iris-300 hover:bg-iris-500/15"
              >
                {typeof window !== "undefined" ? window.location.origin : ""}{siteUrl} ↗
              </a>
              <div className="mt-4 flex flex-wrap gap-2.5">
                <button type="button" onClick={generate} disabled={generating} className="btn-ghost px-4 py-2 text-xs disabled:opacity-50">
                  {generating ? "Regenerating…" : "Regenerate with my latest content"}
                </button>
                <Link href="/start" className="btn-ghost px-4 py-2 text-xs">
                  Edit my content
                </Link>
              </div>
            </>
          ) : (
            <>
              <p className="mt-2 text-sm text-ink-300">
                Your payment is confirmed — generate your website now. It takes
                a few minutes.
              </p>
              <button
                type="button"
                onClick={generate}
                disabled={generating}
                className="btn-primary mt-4 px-6 py-3 text-sm disabled:opacity-60"
              >
                {generating ? "Designing your website… (~2–4 min)" : "✨ Generate my website"}
              </button>
            </>
          )}
          {genError && (
            <p role="alert" className="mt-3 rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-xs text-rose-400">
              {genError}
            </p>
          )}
        </div>
      )}
    </Shell>
  );
}

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto flex max-w-2xl flex-col items-center px-5 pb-24 pt-10 text-center">
      {children}
    </div>
  );
}
