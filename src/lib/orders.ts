import { kvGet, kvSet } from "./storage";
import { getPlan } from "@/content/plans";

export type OrderStatus = "pending" | "paid" | "failed" | "canceled";

export type Order = {
  id: string;
  planId: "preview" | "year";
  draftId: string;
  email: string;
  amountCents: number;
  currency: "USD";
  status: OrderStatus;
  receiptNumber?: string;
  failureReason?: string;
  createdAt: number;
  paidAt?: number;
  /** Access window for the published site (starts at payment). */
  accessExpiresAt?: number;
  siteSlug?: string;
  /** Provider-side order reference (e.g. Stripe Checkout Session ID). */
  providerRef?: string;
};

const ORDER_TTL = 60 * 60 * 24 * 400; // keep records ~13 months

export async function createOrder(input: {
  planId: "preview" | "year";
  draftId: string;
  email: string;
}): Promise<Order> {
  const plan = getPlan(input.planId);
  if (!plan) throw new Error("Unknown plan");
  const order: Order = {
    id: `ord_${crypto.randomUUID().replaceAll("-", "").slice(0, 20)}`,
    planId: plan.id,
    draftId: input.draftId,
    email: input.email.toLowerCase().trim(),
    amountCents: plan.priceCents,
    currency: "USD",
    status: "pending",
    createdAt: Date.now(),
  };
  await kvSet(`order:${order.id}`, order, ORDER_TTL);
  await indexOrderByEmail(order.email, order.id);
  return order;
}

export async function getOrder(id: string): Promise<Order | null> {
  return kvGet<Order>(`order:${id}`);
}

export async function saveOrder(order: Order): Promise<void> {
  await kvSet(`order:${order.id}`, order, ORDER_TTL);
}

export async function markOrderPaid(id: string): Promise<Order | null> {
  const order = await getOrder(id);
  if (!order) return null;
  if (order.status === "paid") return order; // idempotent
  const plan = getPlan(order.planId)!;
  order.status = "paid";
  order.paidAt = Date.now();
  order.accessExpiresAt = Date.now() + plan.durationDays * 24 * 60 * 60 * 1000;
  order.receiptNumber = `CVU-${new Date().getFullYear()}-${order.id.slice(-8).toUpperCase()}`;
  await saveOrder(order);
  return order;
}

export async function markOrderFailed(id: string, reason: string): Promise<Order | null> {
  const order = await getOrder(id);
  if (!order) return null;
  if (order.status === "paid") return order; // never downgrade a paid order
  order.status = "failed";
  order.failureReason = reason;
  await saveOrder(order);
  return order;
}

/** Is this order currently entitled to a live site? */
export function hasActiveAccess(order: Order): boolean {
  return (
    order.status === "paid" &&
    typeof order.accessExpiresAt === "number" &&
    order.accessExpiresAt > Date.now()
  );
}

/* ——— email → orders index (for /account lookup) ——— */

async function indexOrderByEmail(email: string, orderId: string) {
  const key = `orders-by-email:${email}`;
  const list = (await kvGet<string[]>(key)) ?? [];
  if (!list.includes(orderId)) list.push(orderId);
  await kvSet(key, list, ORDER_TTL);
}

export async function getOrdersByEmail(email: string): Promise<Order[]> {
  const ids =
    (await kvGet<string[]>(`orders-by-email:${email.toLowerCase().trim()}`)) ?? [];
  const orders = await Promise.all(ids.map((id) => getOrder(id)));
  return orders
    .filter((o): o is Order => o !== null)
    .sort((a, b) => b.createdAt - a.createdAt);
}
