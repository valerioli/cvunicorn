import { NextRequest, NextResponse } from "next/server";
import { getOrder, hasActiveAccess, markOrderFailed, markOrderPaid } from "@/lib/orders";
import { verifyAccessToken } from "@/lib/access";
import { getPaymentProvider } from "@/lib/payments";

export const runtime = "nodejs";

/** GET /api/payments/status?order=…&t=… — polled by the confirmation page.
 *  Requires the signed token issued at checkout, so order state is never
 *  publicly enumerable. */
export async function GET(req: NextRequest) {
  const orderId = req.nextUrl.searchParams.get("order");
  const token = req.nextUrl.searchParams.get("t");
  if (!orderId || !token) {
    return NextResponse.json({ error: "Missing parameters" }, { status: 400 });
  }
  const verified = verifyAccessToken(token);
  if (!verified || verified.orderId !== orderId) {
    return NextResponse.json({ error: "Invalid token" }, { status: 403 });
  }
  let order = await getOrder(orderId);
  if (!order) return NextResponse.json({ error: "Order not found" }, { status: 404 });

  // Webhook safety net: while pending, ask the provider directly.
  if (order.status === "pending") {
    const provider = getPaymentProvider();
    if (provider.getRemoteStatus) {
      try {
        const remote = await provider.getRemoteStatus(order);
        if (remote === "paid") order = (await markOrderPaid(order.id)) ?? order;
        else if (remote === "failed")
          order = (await markOrderFailed(order.id, "Payment was not completed")) ?? order;
      } catch (err) {
        console.warn("[status] provider poll failed:", err);
      }
    }
  }

  return NextResponse.json({
    orderId: order.id,
    status: order.status,
    planId: order.planId,
    amountCents: order.amountCents,
    currency: order.currency,
    receiptNumber: order.receiptNumber ?? null,
    failureReason: order.failureReason ?? null,
    paidAt: order.paidAt ?? null,
    accessExpiresAt: order.accessExpiresAt ?? null,
    activeAccess: hasActiveAccess(order),
    siteSlug: order.siteSlug ?? null,
  });
}
