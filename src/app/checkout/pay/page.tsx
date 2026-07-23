import type { Metadata } from "next";
import { Suspense } from "react";
import DevPayClient from "./DevPayClient";

export const metadata: Metadata = {
  title: "Test checkout",
  robots: { index: false },
};

/** Dev-provider simulated checkout. In production with
 *  PAYMENT_PROVIDER=infinimoney, customers go to the provider's hosted
 *  page instead and never see this route. */
export default function DevPayPage() {
  return (
    <Suspense fallback={null}>
      <DevPayClient />
    </Suspense>
  );
}
