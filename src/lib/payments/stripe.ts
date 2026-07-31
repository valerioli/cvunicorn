import { createHmac, timingSafeEqual } from "crypto";
import type { PaymentProvider, WebhookResult } from "./provider";

/** Stripe payment adapter — card payments via Stripe Checkout (hosted page).
 *
 *  Talks to the Stripe REST API directly (no SDK dependency), consistent
 *  with the rest of the app. Stripe branding appears only on its own hosted
 *  checkout page.
 *
 *  Flow:
 *    createCheckout → POST /v1/checkout/sessions → redirect to session.url
 *    webhook        → verify Stripe-Signature, handle checkout.session.*
 *    getRemoteStatus→ GET /v1/checkout/sessions/{id} (safety net)
 *
 *  Env:
 *    PAYMENT_PROVIDER=stripe
 *    STRIPE_SECRET_KEY=sk_test_… (test) or sk_live_… (live)
 *    STRIPE_WEBHOOK_SECRET=whsec_…  (from the webhook endpoint you create)
 *
 *  Test mode needs NO documents: create a Stripe account, copy the test
 *  keys, use card 4242 4242 4242 4242 (any future expiry / any CVC).
 */

const API = "https://api.stripe.com/v1";
const API_VERSION = "2026-02-25.clover";

function env(name: string): string {
  const v = process.env[name];
  if (!v) {
    throw new Error(
      `${name} is not set. Add your Stripe keys (dashboard.stripe.com → Developers → API keys) to the environment.`,
    );
  }
  return v;
}

/** Stripe expects application/x-www-form-urlencoded with bracketed nesting. */
function encodeForm(obj: Record<string, string | number>): string {
  return Object.entries(obj)
    .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(String(v))}`)
    .join("&");
}

async function stripeRequest(
  method: "GET" | "POST",
  path: string,
  form?: Record<string, string | number>,
  options?: { idempotencyKey?: string },
): Promise<Record<string, unknown>> {
  const res = await fetch(`${API}${path}`, {
    method,
    headers: {
      Authorization: `Bearer ${env("STRIPE_SECRET_KEY")}`,
      "Stripe-Version": API_VERSION,
      ...(form ? { "Content-Type": "application/x-www-form-urlencoded" } : {}),
      ...(options?.idempotencyKey ? { "Idempotency-Key": options.idempotencyKey } : {}),
    },
    body: form ? encodeForm(form) : undefined,
    cache: "no-store",
  });
  const text = await res.text();
  if (!res.ok) {
    throw new Error(`Stripe API ${method} ${path} failed (${res.status}): ${text.slice(0, 300)}`);
  }
  return JSON.parse(text) as Record<string, unknown>;
}

function safeCompareHex(provided: string, expected: string): boolean {
  if (provided.length !== expected.length) return false;
  if (!/^[0-9a-f]+$/i.test(provided)) return false;
  const a = Buffer.from(provided, "hex");
  const b = Buffer.from(expected, "hex");
  return a.length === b.length && timingSafeEqual(a, b);
}

export const stripeProvider: PaymentProvider = {
  name: "stripe",

  async createCheckout({ order, successUrl, cancelUrl }) {
    const desc =
      order.planId === "year"
        ? "CVUnicorn — 1 year website + custom domain"
        : "CVUnicorn — 3-day website preview";

    const success = `${successUrl}${successUrl.includes("?") ? "&" : "?"}session_id={CHECKOUT_SESSION_ID}`;
    const session = await stripeRequest("POST", "/checkout/sessions", {
      mode: "payment",
      success_url: success,
      cancel_url: cancelUrl,
      client_reference_id: order.id, // for webhook matching
      customer_email: order.email,
      "metadata[order_id]": order.id,
      "metadata[plan_id]": order.planId,
      "payment_intent_data[metadata][order_id]": order.id,
      "payment_intent_data[metadata][plan_id]": order.planId,
      "payment_intent_data[receipt_email]": order.email,
      "payment_intent_data[description]": desc,
      "line_items[0][quantity]": 1,
      "line_items[0][price_data][currency]": order.currency.toLowerCase(),
      "line_items[0][price_data][unit_amount]": order.amountCents,
      "line_items[0][price_data][product_data][name]": desc,
    }, { idempotencyKey: `checkout:${order.id}` });

    const redirectUrl = typeof session.url === "string" ? session.url : undefined;
    const providerRef = typeof session.id === "string" ? session.id : undefined;
    if (!redirectUrl) {
      throw new Error("Stripe session created but no checkout url returned");
    }
    return { redirectUrl, providerRef };
  },

  async handleWebhook(req: Request): Promise<WebhookResult> {
    const raw = await req.text();
    const sigHeader = req.headers.get("stripe-signature") ?? "";
    const secret = env("STRIPE_WEBHOOK_SECRET");

    // Stripe-Signature: "t=timestamp,v1=hexsig[,v1=…]".
    const pairs = sigHeader.split(",").map((kv) => {
      const i = kv.indexOf("=");
      return [kv.slice(0, i), kv.slice(i + 1)] as const;
    });
    const t = pairs.find(([key]) => key === "t")?.[1] ?? "";
    const signatures = pairs.filter(([key]) => key === "v1").map(([, value]) => value);

    const expected = createHmac("sha256", secret).update(`${t}.${raw}`).digest("hex");
    if (!t || !signatures.some((sig) => safeCompareHex(sig, expected))) {
      throw new Error("Invalid Stripe webhook signature");
    }
    // Replay guard (Stripe tolerance is 5 min).
    const ts = Number(t);
    if (Number.isFinite(ts) && Math.abs(Date.now() / 1000 - ts) > 300) {
      throw new Error("Stale Stripe webhook");
    }

    const event = JSON.parse(raw) as {
      type?: string;
      data?: { object?: Record<string, unknown> };
    };
    const obj = event.data?.object ?? {};
    const orderId =
      (typeof obj.client_reference_id === "string" && obj.client_reference_id) ||
      (typeof (obj.metadata as Record<string, unknown> | undefined)?.order_id === "string" &&
        ((obj.metadata as Record<string, string>).order_id)) ||
      "";
    if (!orderId || !orderId.startsWith("ord_")) return { kind: "ignored" };

    switch (event.type) {
      case "checkout.session.completed":
      case "checkout.session.async_payment_succeeded":
        // Only treat as paid once payment actually settled.
        if (obj.payment_status === "paid" || obj.payment_status === "no_payment_required") {
          return { kind: "paid", orderId };
        }
        return { kind: "ignored" };
      case "checkout.session.async_payment_failed":
      case "checkout.session.expired":
        return { kind: "failed", orderId, reason: "Payment was not completed" };
      default:
        return { kind: "ignored" };
    }
  },

  async getRemoteStatus(order) {
    if (!order.providerRef) return "pending";
    const session = await stripeRequest("GET", `/checkout/sessions/${order.providerRef}`);
    if (session.payment_status === "paid" || session.payment_status === "no_payment_required") {
      return "paid";
    }
    if (session.status === "expired") return "failed";
    return "pending";
  },
};
