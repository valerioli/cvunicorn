import type { Metadata } from "next";
import { Suspense } from "react";
import AccountClient from "./AccountClient";

export const metadata: Metadata = {
  title: "My site — status, receipts & access",
  robots: { index: false },
};

export default function AccountPage() {
  return (
    <Suspense fallback={<div className="flex min-h-[50vh] items-center justify-center text-ink-400">Loading…</div>}>
      <AccountClient />
    </Suspense>
  );
}
