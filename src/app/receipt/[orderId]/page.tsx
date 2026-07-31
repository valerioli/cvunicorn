import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getOrder } from "@/lib/orders";
import { verifyAccessToken } from "@/lib/access";
import { getPlan } from "@/content/plans";
import { SITE } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Receipt",
  robots: { index: false },
};

export default async function ReceiptPage({
  params,
  searchParams,
}: {
  params: Promise<{ orderId: string }>;
  searchParams: Promise<{ t?: string }>;
}) {
  const { orderId } = await params;
  const { t } = await searchParams;
  const verified = t ? verifyAccessToken(t) : null;
  if (!verified || verified.orderId !== orderId) notFound();

  const order = await getOrder(orderId);
  if (!order || order.status !== "paid") notFound();
  const plan = getPlan(order.planId)!;

  return (
    <div className="mx-auto max-w-md px-5 pb-24 pt-10 print:pt-0">
      <div className="card p-8 print:border-none print:bg-white print:text-black">
        <div className="flex items-center justify-between">
          <h1 className="font-display text-2xl font-light text-[#061b31] print:text-black">
            Receipt
          </h1>
          <span className="font-mono text-xs text-[#64748d]">{order.receiptNumber}</span>
        </div>
        <p className="mt-1 text-xs text-[#64748d]">
          {SITE.name} · {SITE.email}
        </p>

        <dl className="mt-8 space-y-3 text-sm">
          <Row k="Date">
            {new Date(order.paidAt ?? order.createdAt).toLocaleDateString(undefined, {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </Row>
          <Row k="Billed to">{order.email}</Row>
          <Row k="Item">
            {plan.name} — {plan.durationDays === 365 ? "12 months + custom domain" : "3-day website"}
          </Row>
          <Row k="Order ID">
            <span className="font-mono text-xs">{order.id}</span>
          </Row>
          {order.accessExpiresAt && (
            <Row k="Site live until">
              {new Date(order.accessExpiresAt).toLocaleDateString(undefined, {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </Row>
          )}
        </dl>

        <div className="hairline mt-6 border-t pt-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-normal text-[#061b31] print:text-black">Total paid</span>
            <span className="font-display text-2xl font-light text-[#061b31] print:text-black">
              ${(order.amountCents / 100).toFixed(2)}{" "}
              <span className="text-sm font-normal text-[#64748d]">{order.currency}</span>
            </span>
          </div>
          <p className="mt-2 text-xs text-[#64748d]">
            One-time payment. Processed securely by our payment provider.
          </p>
        </div>
      </div>
      <p className="mt-5 text-xs text-[#64748d] print:hidden">
        Need this as a PDF? Use your browser's Print → Save as PDF.
      </p>
    </div>
  );
}

function Row({ k, children }: { k: string; children: React.ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-6">
      <dt className="shrink-0 text-[#64748d]">{k}</dt>
      <dd className="text-right text-[#061b31] print:text-black">{children}</dd>
    </div>
  );
}
