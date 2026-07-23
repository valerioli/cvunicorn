import type { Metadata } from "next";
import { Suspense } from "react";
import SuccessClient from "./SuccessClient";

export const metadata: Metadata = {
  title: "Payment confirmation",
  robots: { index: false },
};

export default function SuccessPage() {
  return (
    <Suspense fallback={<div className="flex min-h-[50vh] items-center justify-center text-ink-400">Confirming your payment…</div>}>
      <SuccessClient />
    </Suspense>
  );
}
