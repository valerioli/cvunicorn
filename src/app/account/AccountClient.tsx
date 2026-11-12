"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { SUPPORT_EMAIL, SUPPORT_MAILTO } from "@/lib/contact";

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
  siteUrl: string | null;
  needsPublish: boolean;
  published: boolean;
  draftId: string;
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
  const [preview, setPreview] = useState(false);
  const [published, setPublished] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [previewVersion, setPreviewVersion] = useState(0);
  const [savedAccess, setSavedAccess] = useState<string | null>(null);
  const editHref = `/start?order=${encodeURIComponent(orderId)}&t=${encodeURIComponent(token)}`;
  const previewHref = `/api/site-preview?order=${encodeURIComponent(orderId)}&t=${encodeURIComponent(token)}&v=${previewVersion}`;

  useEffect(() => {
    try { const value = localStorage.getItem("cvunicorn.account"); if (value?.startsWith("/account?order=") && !value.includes("\\")) setSavedAccess(value); } catch {}
  }, []);

  useEffect(() => {
    if (!orderId || !token) return;
    fetch(`/api/payments/status?order=${encodeURIComponent(orderId)}&t=${encodeURIComponent(token)}`, { cache: "no-store" })
      .then(async (r) => {
        if (!r.ok) throw new Error();
        setData((await r.json()) as StatusPayload);
      })
      .catch(() => setError("We couldn't verify this link. Use the link from your payment confirmation page."));
  }, [orderId, token]);

  useEffect(() => {
    if (data) {
      setSiteUrl(data.siteUrl); setPreview(data.needsPublish); setPublished(data.published);
      try { localStorage.setItem("cvunicorn.account", `/account?order=${encodeURIComponent(orderId)}&t=${encodeURIComponent(token)}`); } catch {}
    }
  }, [data, orderId, token]);

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
        setPreview(true);
        setPreviewVersion(v => v + 1);
      }
    } catch {
      setGenError("Network error — please try again.");
    } finally {
      setGenerating(false);
    }
  }

  async function publish() {
    setPublishing(true); setGenError(null);
    try {
      const res = await fetch("/api/site-preview", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ orderId, token }) });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Publishing failed. Please try again.");
      setSiteUrl(json.siteUrl); setPreview(false); setPublished(true);
    } catch (e) { setGenError(e instanceof Error ? e.message : "Publishing failed"); }
    finally { setPublishing(false); }
  }

  if (!orderId || !token) {
    return (
      <Shell>
        <h1 className="font-display text-3xl font-light tracking-[-0.02em] text-[#061b31]">My site</h1>
        {savedAccess && <Link href={savedAccess} className="btn-primary mt-5 inline-flex self-start px-6 py-3 text-sm">Open my saved dashboard</Link>}
        <p className="mt-3 max-w-md text-sm leading-relaxed text-[#50617a]">
          Open this page using the personal link from your payment
          confirmation page — it's your key, no password needed.
        </p>
        <p className="mt-4 text-sm text-[#64748d]">
          Can't find it? Email{" "}
          <a href={SUPPORT_MAILTO} className="text-[#533afd] underline underline-offset-4">{SUPPORT_EMAIL}</a>{" "}
          from your purchase address for help restoring access.
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
        <h1 className="font-display text-2xl font-light text-[#061b31]">Link not valid</h1>
        <p className="mt-3 text-sm text-[#50617a]">{error}</p>
      </Shell>
    );
  }

  if (!data) {
    return (
      <Shell>
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-[#e5edf5] border-t-[#533afd]" aria-hidden="true" />
      </Shell>
    );
  }

  const expires = data.accessExpiresAt ? new Date(data.accessExpiresAt) : null;
  const daysLeft = expires ? Math.max(0, Math.ceil((expires.getTime() - Date.now()) / 86_400_000)) : 0;

  return (
    <Shell>
      <h1 className="font-display text-3xl font-light tracking-[-0.02em] text-[#061b31]">My site</h1>

      {/* status card */}
      <div className="card mt-8 w-full max-w-lg p-6 text-left">
        <div className="flex items-center justify-between">
          <span className="text-sm font-normal text-[#061b31]">
            {data.planId === "year" ? "Unicorn Year" : "Preview Pass"}
          </span>
          {data.activeAccess ? (
            <span className="inline-flex items-center gap-1.5 rounded-[4px] border border-[#d6d9fc] bg-[#f8fafd] px-2.5 py-1 text-xs font-normal text-[#533afd]">
              <span className="h-1.5 w-1.5 bg-[#533afd]" /> Active
            </span>
          ) : data.status === "paid" ? (
            <span className="rounded-[4px] border border-[#d6d9fc] bg-[#f8fafd] px-2.5 py-1 text-xs font-normal text-[#533afd]">
              Expired
            </span>
          ) : (
            <span className="rounded-[4px] border border-[#e5edf5] bg-[#f8fafd] px-2.5 py-1 text-xs font-normal text-[#64748d]">
              {data.status}
            </span>
          )}
        </div>
        {expires && (
          <p className="mt-3 text-sm text-[#50617a]">
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
            <Link href={`/checkout?plan=year&order=${encodeURIComponent(orderId)}&t=${encodeURIComponent(token)}`} className="btn-primary px-4 py-2 text-xs">
              Renew for a year — $9.99
            </Link>
          )}
          {data.activeAccess && data.planId === "preview" && (
            <Link href={`/checkout?plan=year&order=${encodeURIComponent(orderId)}&t=${encodeURIComponent(token)}`} className="btn-primary px-4 py-2 text-xs">
              Upgrade to a full year — $9.99
            </Link>
          )}
        </div>
      </div>

      {/* website card */}
      {data.activeAccess && (
        <div className="card mt-5 w-full max-w-lg p-6 text-left">
          <h2 className="text-sm font-normal text-[#061b31]">Your website</h2>
          {siteUrl ? (
            <>
              {published && <a
                href={siteUrl}
                target="_blank"
                rel="noopener"
                className="mt-3 block truncate rounded-[4px] border border-[#d6d9fc] bg-[#f8fafd] px-4 py-3 text-sm font-normal text-[#533afd] hover:bg-[#e8e9ff]"
              >
                {siteUrl} ↗
              </a>}
              <div className="mt-4 flex flex-wrap gap-2.5">
                <button type="button" onClick={generate} disabled={generating} className="btn-ghost px-4 py-2 text-xs disabled:opacity-50">
                  {generating ? "Regenerating…" : "Regenerate with my latest content"}
                </button>
                <Link href={editHref} className="btn-ghost px-4 py-2 text-xs">
                  Edit my content
                </Link>
              </div>
            </>
          ) : (
            <>
              <p className="mt-2 text-sm text-[#50617a]">
                Your payment is confirmed — generate your website now. It takes
                a few minutes.
              </p>
              <button
                type="button"
                onClick={generate}
                disabled={generating}
                className="btn-primary mt-4 px-6 py-3 text-sm disabled:opacity-60"
              >
                {generating ? "Designing your website… (~2–4 min)" : "Generate my website"}
              </button>
              <Link href={editHref} className="btn-ghost mt-3 inline-flex px-4 py-2 text-xs">Review my content first</Link>
            </>
          )}
          {generating && <p role="status" className="mt-4 text-sm text-[#50617a]">Designing your preview. This can take a few minutes. Your published site stays unchanged.</p>}
          {preview && <div className="mt-6">
            <h3 className="text-lg text-[#061b31]">Review before publishing</h3>
            <p className="mt-2 text-sm text-[#50617a]">Check your text, photos and links. Edit your content or regenerate if something needs changing.</p>
            <iframe key={previewVersion} title="Your private website preview" src={previewHref} sandbox="allow-scripts allow-popups" referrerPolicy="no-referrer" className="mt-4 h-[560px] w-full rounded border border-[#e5edf5]" />
            <div className="mt-4 flex flex-wrap gap-3">
              <a href={previewHref} target="_blank" rel="noopener noreferrer" className="btn-ghost px-4 py-3 text-sm">Open full preview</a>
              <button type="button" disabled={publishing || generating} onClick={publish} className="btn-primary px-5 py-3 text-sm">{publishing ? "Publishing…" : published ? "Publish this update" : "Publish my website"}</button>
            </div>
          </div>}
          {genError && (
            <p role="alert" className="mt-3 rounded-[4px] border border-[#d6d9fc] bg-[#f8fafd] px-4 py-3 text-xs text-[#533afd]">
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
    <div className="mx-auto flex max-w-2xl flex-col px-5 pb-24 pt-10">
      {children}
    </div>
  );
}
