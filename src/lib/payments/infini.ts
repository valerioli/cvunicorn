import { createHmac, createHash, timingSafeEqual } from "crypto";
import type { PaymentProvider, WebhookResult } from "./provider";

/** Infini payment adapter (business.infini.money / openapi.infini.money).
 *
 *  Infini acts purely as the underlying payment processor; its branding
 *  appears only on its own hosted checkout page.
 *
 *  Auth (per Infini docs §4): HMAC-SHA256 HTTP-Signature.
 *    signing string = `{keyId}\n{METHOD} {path?query}\ndate: {GMT}\n`
 *    The body/digest is NOT part of the signing string; the Digest header
 *    is computed separately and attached (required for requests with body).
 *    signature = base64(HMAC_SHA256(secret, signing_string))
 *
 *  Endpoints:
 *    POST /v1/acquiring/order        → create order, returns checkout_url
 *    GET  /v1/acquiring/order?order_id=… → order status (webhook safety net)
 *
 *  Webhook (per §4.6): headers X-Webhook-Timestamp, X-Webhook-Event-Id,
 *    X-Webhook-Signature. signing content = `{timestamp}.{event_id}.{body}`;
 *    expected = hex(HMAC_SHA256(webhook_secret, signing_content)).
 *
 *  Env:
 *    PAYMENT_PROVIDER=infini
 *    INFINI_API_KEY=…       (keyId)
 *    INFINI_SECRET_KEY=…    (secret, only shown once)
 *    INFINI_ENV=sandbox | production   (default sandbox)
 *    INFINI_WEBHOOK_SECRET=…           (from Developer → Webhook settings)
 */

const BASE_URLS: Record<string, string> = {
  production: "https://openapi.infini.money",
  sandbox: "https://openapi-sandbox.infini.money",
};

function env(name: string): string {
  const v = process.env[name];
  if (!v) {
    throw new Error(
      `${name} is not set. Add your Infini credentials (business.infini.money → Developer → API keys) to the environment.`,
    );
  }
  return v;
}

function baseUrl(): string {
  return BASE_URLS[process.env.INFINI_ENV ?? "sandbox"] ?? BASE_URLS.sandbox;
}

/** Infini requires request_id in UUID format. Derive one deterministically
 *  from our order id so retries stay idempotent (same order → same UUID). */
function toUuid(seed: string): string {
  const h = createHash("sha256").update(seed).digest("hex");
  return `${h.slice(0, 8)}-${h.slice(8, 12)}-${h.slice(12, 16)}-${h.slice(16, 20)}-${h.slice(20, 32)}`;
}

/** Infini HTTP-Signature headers. `pathWithQuery` is the exact request-target
 *  (including any ?query) and MUST match what is sent on the wire. */
function signHeaders(
  method: string,
  pathWithQuery: string,
  body?: string,
): Record<string, string> {
  const keyId = env("INFINI_API_KEY");
  const secret = env("INFINI_SECRET_KEY");
  const gmt = new Date().toUTCString(); // RFC 1123, e.g. "Tue, 21 Jan 2025 12:00:00 GMT"

  // Digest is NOT part of the signing string (Infini §4.2).
  const signingString = `${keyId}\n${method.toUpperCase()} ${pathWithQuery}\ndate: ${gmt}\n`;
  const signature = createHmac("sha256", secret).update(signingString).digest("base64");

  const headers: Record<string, string> = {
    Date: gmt,
    Authorization:
      `Signature keyId="${keyId}",algorithm="hmac-sha256",` +
      `headers="@request-target date",signature="${signature}"`,
  };
  if (body !== undefined) {
    const digest = createHash("sha256").update(body, "utf8").digest("base64");
    headers.Digest = `SHA-256=${digest}`;
  }
  return headers;
}

async function infiniRequest(
  method: "GET" | "POST",
  path: string,
  jsonData?: Record<string, unknown>,
  query?: Record<string, string>,
): Promise<Record<string, unknown>> {
  const body = jsonData !== undefined ? JSON.stringify(jsonData) : undefined;
  const pathWithQuery = query
    ? `${path}?${new URLSearchParams(query).toString()}`
    : path;

  const headers = signHeaders(method, pathWithQuery, body);
  if (body !== undefined) headers["Content-Type"] = "application/json";

  const res = await fetch(`${baseUrl()}${pathWithQuery}`, {
    method,
    headers,
    body,
    cache: "no-store",
  });
  const text = await res.text();
  if (!res.ok) {
    throw new Error(
      `Infini API ${method} ${path} failed (${res.status}): ${text.slice(0, 300)}`,
    );
  }
  return JSON.parse(text) as Record<string, unknown>;
}

/** Infini responses may arrive flat or wrapped in { data: … }. */
function unwrap(obj: Record<string, unknown>): Record<string, unknown> {
  if (obj && typeof obj.data === "object" && obj.data !== null) {
    return obj.data as Record<string, unknown>;
  }
  return obj;
}

function pickString(obj: Record<string, unknown>, keys: string[]): string | undefined {
  for (const k of keys) {
    const v = obj[k];
    if (typeof v === "string" && v) return v;
    if (typeof v === "number") return String(v);
  }
  return undefined;
}

const PAID_STATUSES = ["paid", "success", "succeeded", "completed", "complete", "settled"];
const FAILED_STATUSES = ["failed", "fail", "expired", "canceled", "cancelled", "closed", "declined"];

function classify(signal: string | undefined): "paid" | "failed" | "pending" {
  if (!signal) return "pending";
  const s = signal.toLowerCase();
  if (PAID_STATUSES.some((p) => s.includes(p))) return "paid";
  if (FAILED_STATUSES.some((f) => s.includes(f))) return "failed";
  return "pending";
}

export const infiniProvider: PaymentProvider = {
  name: "infini",

  async createCheckout({ order, successUrl, cancelUrl }) {
    const result = unwrap(
      await infiniRequest("POST", "/v1/acquiring/order", {
        request_id: toUuid(order.id), // Infini requires UUID format; deterministic → idempotent
        amount: (order.amountCents / 100).toFixed(2),
        currency: order.currency,
        client_reference: order.id,
        order_desc:
          order.planId === "year"
            ? "CVUnicorn — 1 year website + custom domain"
            : "CVUnicorn — 3-day website preview",
        expires_in: 3600,
        email: order.email,
        success_url: successUrl,
        failure_url: cancelUrl,
      }),
    );

    const redirectUrl = pickString(result, ["checkout_url", "checkoutUrl", "url", "payment_url"]);
    const providerRef = pickString(result, ["order_id", "orderId", "id"]);
    if (!redirectUrl) {
      throw new Error(
        `Infini order created but no checkout_url in response: ${JSON.stringify(result).slice(0, 200)}`,
      );
    }
    return { redirectUrl, providerRef };
  },

  async handleWebhook(req: Request): Promise<WebhookResult> {
    const raw = await req.text();

    const signature = req.headers.get("x-webhook-signature") ?? "";
    const timestamp = req.headers.get("x-webhook-timestamp") ?? "";
    const eventId = req.headers.get("x-webhook-event-id") ?? "";
    const secret = process.env.INFINI_WEBHOOK_SECRET || env("INFINI_SECRET_KEY");

    // Infini §4.6: signing content = "{timestamp}.{event_id}.{body}", hex HMAC.
    const signedContent = `${timestamp}.${eventId}.${raw}`;
    const expected = createHmac("sha256", secret).update(signedContent).digest("hex");
    const a = Buffer.from(signature);
    const b = Buffer.from(expected);
    if (!signature || a.length !== b.length || !timingSafeEqual(a, b)) {
      throw new Error("Invalid Infini webhook signature");
    }
    // Replay guard: reject events older than 5 min (§4.5 uses ±300s).
    const ts = Number(timestamp);
    if (Number.isFinite(ts)) {
      const ageMs = Math.abs(Date.now() - (ts > 1e12 ? ts : ts * 1000));
      if (ageMs > 5 * 60 * 1000) throw new Error("Stale Infini webhook");
    }

    const event = JSON.parse(raw) as Record<string, unknown>;
    const data = unwrap(event);

    // Our order id travels as client_reference.
    const orderId =
      pickString(data, ["client_reference", "clientReference"]) ??
      pickString(event, ["client_reference"]);
    if (!orderId || !orderId.startsWith("ord_")) return { kind: "ignored" };

    const eventType = pickString(event, ["event", "type", "event_type"]);
    const status = pickString(data, ["status", "order_status", "state"]);
    const signal = classify(status) !== "pending" ? classify(status) : classify(eventType);

    if (signal === "paid") return { kind: "paid", orderId };
    if (signal === "failed") {
      return { kind: "failed", orderId, reason: `Payment ${status ?? eventType ?? "failed"}` };
    }
    return { kind: "ignored" };
  },

  /** Webhook safety net: poll Infini directly for a pending order. */
  async getRemoteStatus(order) {
    if (!order.providerRef) return "pending";
    const result = unwrap(
      await infiniRequest("GET", "/v1/acquiring/order", undefined, {
        order_id: order.providerRef,
      }),
    );
    return classify(pickString(result, ["status", "order_status", "state"]));
  },
};
