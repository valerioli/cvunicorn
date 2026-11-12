import { NextRequest, NextResponse } from "next/server";
import { createOrder, saveOrder, getOrder } from "@/lib/orders";
import { getPaymentProvider } from "@/lib/payments";
import { createAccessToken, verifyAccessToken } from "@/lib/access";
import { kvGet, kvSet } from "@/lib/storage";
import { isIntake } from "@/lib/intakeValidation";
import { getPlan } from "@/content/plans";

export const runtime = "nodejs";

/** POST /api/checkout — create an order + provider checkout session. */
export async function POST(req: NextRequest) {
  const body = (await req.json().catch(() => null)) as {
    planId?: string;
    draftId?: string;
    email?: string;
    orderId?: string;
    token?: string;
  } | null;

  const plan = body?.planId ? getPlan(body.planId) : undefined;
  if (!plan) {
    return NextResponse.json({ error: "Please choose a valid plan." }, { status: 400 });
  }
  const email = typeof body?.email === "string" ? body.email.trim() : "";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json(
      { error: "A valid email is required for your receipt and site access." },
      { status: 400 },
    );
  }

  try {
    let previous = null;
    if (body?.orderId) {
      if (typeof body.token !== "string" || verifyAccessToken(body.token)?.orderId !== body.orderId) return NextResponse.json({ error: "Invalid renewal link" }, { status: 403 });
      previous = await getOrder(body.orderId);
      if (!previous || previous.status !== "paid" || previous.email !== email.toLowerCase()) return NextResponse.json({ error: "Use the email address from your original purchase." }, { status: 400 });
    }
    const draftId = previous?.draftId ?? body?.draftId ?? "";
    const draft = await kvGet(`draft:${draftId}`);
    if (!previous && (!isIntake(draft) || !draft.essentials.fullName.trim() || !draft.essentials.headline.trim())) return NextResponse.json({ error: "Add your content at /start before choosing a pass." }, { status: 400 });
    if (isIntake(draft)) await kvSet(`draft:${draftId}`, draft, 60 * 60 * 24 * 400);
    const order = await createOrder({
      planId: plan.id,
      draftId,
      email,
      renewalOf: previous?.id,
    });
    const token = createAccessToken(order.id);
    const provider = getPaymentProvider();
    const origin =
      process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") || req.nextUrl.origin;
    const session = await provider.createCheckout({
      order,
      successUrl: `${origin}/checkout/success?order=${order.id}&t=${token}`,
      cancelUrl: `${origin}/checkout/failed?order=${order.id}&t=${token}`,
    });
    if (session.providerRef) {
      order.providerRef = session.providerRef;
      await saveOrder(order);
    }
    return NextResponse.json({ orderId: order.id, redirectUrl: session.redirectUrl, token });
  } catch (err) {
    console.error("[checkout] failed:", err);
    return NextResponse.json(
      { error: "We couldn't start the payment. Please try again in a moment." },
      { status: 502 },
    );
  }
}
