import type { PaymentProvider, WebhookResult } from "./provider";

/** Development provider — a fully working end-to-end flow with a local
 *  simulated checkout page. Lets the entire purchase → confirmation →
 *  receipt → access pipeline be built and tested with zero external setup.
 *  Never enable in production: set PAYMENT_PROVIDER=stripe there. */
export const devProvider: PaymentProvider = {
  name: "dev",

  async createCheckout({ order, successUrl, cancelUrl }) {
    const params = new URLSearchParams({
      order: order.id,
      success: successUrl,
      cancel: cancelUrl,
    });
    return { redirectUrl: `/checkout/pay?${params.toString()}` };
  },

  async handleWebhook(req: Request): Promise<WebhookResult> {
    // Dev "webhook" is called by our own simulator page.
    const body = (await req.json().catch(() => null)) as {
      orderId?: string;
      outcome?: "paid" | "failed";
      reason?: string;
    } | null;
    if (!body?.orderId || !body.outcome) return { kind: "ignored" };
    if (body.outcome === "paid") return { kind: "paid", orderId: body.orderId };
    return {
      kind: "failed",
      orderId: body.orderId,
      reason: body.reason || "Card declined (simulated)",
    };
  },
};
