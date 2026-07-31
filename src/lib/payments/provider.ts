import type { Order } from "@/lib/orders";

/** Provider-agnostic payment interface.
 *
 *  CVUnicorn is provider-neutral by design: the rest of the app only ever
 *  talks to this interface. Swapping Stripe, Infini, or another provider
 *  touches exactly one file. Provider branding never leaks outside the
 *  provider's own hosted checkout page.
 */

export type CheckoutSession = {
  /** Where to send the customer to pay. */
  redirectUrl: string;
  /** Provider-side reference, stored for reconciliation. */
  providerRef?: string;
};

export type WebhookResult =
  | { kind: "paid"; orderId: string }
  | { kind: "failed"; orderId: string; reason: string }
  | { kind: "ignored" };

export interface PaymentProvider {
  readonly name: string;
  createCheckout(input: {
    order: Order;
    successUrl: string;
    cancelUrl: string;
  }): Promise<CheckoutSession>;
  /** Parse + verify an incoming webhook. MUST verify authenticity. */
  handleWebhook(req: Request): Promise<WebhookResult>;
  /** Optional safety net: query the provider directly for an order's
   *  current status (used while an order is pending, in case webhooks
   *  are delayed or not yet configured). */
  getRemoteStatus?(order: Order): Promise<"paid" | "failed" | "pending">;
}
