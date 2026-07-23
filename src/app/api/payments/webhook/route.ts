import { NextResponse } from "next/server";
import { getPaymentProvider } from "@/lib/payments";
import { markOrderFailed, markOrderPaid } from "@/lib/orders";

export const runtime = "nodejs";

/** POST /api/payments/webhook — the provider notifies us here.
 *  This is the single source of truth for payment state. */
export async function POST(req: Request) {
  const provider = getPaymentProvider();
  try {
    const result = await provider.handleWebhook(req);
    switch (result.kind) {
      case "paid":
        await markOrderPaid(result.orderId);
        break;
      case "failed":
        await markOrderFailed(result.orderId, result.reason);
        break;
      case "ignored":
        break;
    }
    return NextResponse.json({ received: true });
  } catch (err) {
    console.error("[webhook] rejected:", err);
    return NextResponse.json({ error: "Webhook rejected" }, { status: 400 });
  }
}
