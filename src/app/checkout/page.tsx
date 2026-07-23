import type { Metadata } from "next";
import { Suspense } from "react";
import CheckoutClient from "./CheckoutClient";

export const metadata: Metadata = {
  title: "Checkout",
  description: "Put your personal website live — from $0.99.",
  robots: { index: false },
};

export default function CheckoutPage() {
  return (
    <Suspense fallback={<div className="flex min-h-[50vh] items-center justify-center text-ink-400">Loading checkout…</div>}>
      <CheckoutClient />
    </Suspense>
  );
}
