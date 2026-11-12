import { NextRequest, NextResponse } from "next/server";
import { verifyAccessToken } from "@/lib/access";
import { getOrder, hasActiveAccess } from "@/lib/orders";
import { kvGet, kvSet } from "@/lib/storage";
import { isIntake } from "@/lib/intakeValidation";
import type { IntakeData } from "@/lib/intake";

export const runtime = "nodejs";
export async function GET(req: NextRequest) {
  const id = req.nextUrl.searchParams.get("order") ?? "";
  if (verifyAccessToken(req.nextUrl.searchParams.get("t") ?? "")?.orderId !== id) return NextResponse.json({ error: "Invalid access link" }, { status: 403 });
  const order = await getOrder(id);
  if (!order) return NextResponse.json({ error: "Order not found" }, { status: 404 });
  const draft = await kvGet<IntakeData>(`draft:${order.draftId}`);
  if (!draft) return NextResponse.json({ error: "Your draft is no longer available. Contact support with your order number." }, { status: 404 });
  return NextResponse.json(draft, { headers: { "Cache-Control": "no-store" } });
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  if (!body || typeof body.token !== "string" || verifyAccessToken(body.token)?.orderId !== body.orderId) return NextResponse.json({ error: "Invalid access link" }, { status: 403 });
  const order = await getOrder(body.orderId);
  if (!order || !hasActiveAccess(order)) return NextResponse.json({ error: "An active plan is required to edit this site" }, { status: 403 });
  if (!isIntake(body.draft) || body.draft.draftId !== order.draftId) return NextResponse.json({ error: "Draft does not belong to this site" }, { status: 400 });
  const current = await kvGet<IntakeData>(`draft:${order.draftId}`);
  if (current && current.updatedAt > body.draft.updatedAt) return NextResponse.json({ error: "A newer draft was saved elsewhere. Reload before editing." }, { status: 409 });
  await kvSet(`draft:${order.draftId}`, body.draft, 60 * 60 * 24 * 400);
  return NextResponse.json({ ok: true });
}
