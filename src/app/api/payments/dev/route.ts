import { NextResponse } from "next/server";
import { getPaymentProvider } from "@/lib/payments";
import { markOrderFailed, markOrderPaid } from "@/lib/orders";

export const runtime = "nodejs";

/** POST /api/payments/dev — completion endpoint for the dev checkout
 *  simulator ONLY. Disabled unless the dev provider is active. */
export async function POST(req: Request) {
  const provider = getPaymentProvider();
  if (provider.name !== "dev") {
    return NextResponse.json({ error: "Not available" }, { status: 404 });
  }
  const result = await provider.handleWebhook(req);
  if (result.kind === "paid") {
    const order = await markOrderPaid(result.orderId);
    return NextResponse.json({ ok: true, status: order?.status ?? "unknown" });
  }
  if (result.kind === "failed") {
    const order = await markOrderFailed(result.orderId, result.reason);
    return NextResponse.json({ ok: true, status: order?.status ?? "unknown" });
  }
  return NextResponse.json({ error: "Invalid request" }, { status: 400 });
}
