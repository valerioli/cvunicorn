import type { Metadata } from "next";
import LegalPage from "@/components/LegalPage";

export const metadata: Metadata = {
  title: "Refund Policy",
  description: "When and how CVUnicorn issues refunds.",
  alternates: { canonical: "/legal/refunds" },
};

export default function RefundsPage() {
  return (
    <LegalPage
      title="Refund Policy"
      updated="July 2026"
      sections={[
        {
          h: "Full refunds, automatically deserved",
          body: [
            "If your website fails to generate, or a fault on our side keeps your paid site offline for more than 24 hours, you get a full refund — just email us.",
          ],
        },
        {
          h: "Preview Pass ($0.99)",
          body: [
            "Because the Preview Pass exists precisely so you can evaluate the real product cheaply, it is non-refundable once your site has been generated and published, except in the failure cases above.",
          ],
        },
        {
          h: "Unicorn Year ($9.99)",
          body: [
            "Refundable in full within 14 days of purchase if you're not satisfied, provided a custom domain has not yet been registered for you. Once a domain is registered, we deduct the domain's registration cost and refund the remainder within the same 14-day window.",
          ],
        },
        {
          h: "How to request",
          body: [
            "Email hello@cvunicorn.com from the address used at checkout, with your receipt number. Refunds are returned to the original payment method within 5–10 business days.",
          ],
        },
      ]}
    />
  );
}
