import { NextRequest, NextResponse } from "next/server";
import { createOrder, saveOrder } from "@/lib/orders";
import { getPaymentProvider } from "@/lib/payments";
import { createAccessToken } from "@/lib/access";
import { getPlan } from "@/content/plans";

export const runtime = "nodejs";

/** POST /api/checkout — create an order + provider checkout session. */
export async function POST(req: NextRequest) {
  const body = (await req.json().catch(() => null)) as {
    planId?: string;
    draftId?: string;
    email?: string;
  } | null;

  const plan = body?.planId ? getPlan(body.planId) : undefined;
  if (!plan) {
    return NextResponse.json({ error: "Please choose a valid plan." }, { status: 400 });
  }
  const email = (body?.email ?? "").trim();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json(
      { error: "A valid email is required for your receipt and site access." },
      { status: 400 },
    );
  }

  try {
    const order = await createOrder({
      planId: plan.id,
      draftId: body?.draftId ?? "",
      email,
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
