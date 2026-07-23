import type { Metadata } from "next";
import { Suspense } from "react";
import FailedClient from "./FailedClient";

export const metadata: Metadata = {
  title: "Payment not completed",
  robots: { index: false },
};

export default function FailedPage() {
  return (
    <Suspense fallback={null}>
      <FailedClient />
    </Suspense>
  );
}
