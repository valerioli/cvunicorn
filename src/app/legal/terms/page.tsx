import type { Metadata } from "next";
import LegalPage from "@/components/LegalPage";
import { SUPPORT_EMAIL } from "@/lib/contact";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "The terms that govern your use of CVUnicorn.",
  alternates: { canonical: "/legal/terms" },
};

export default function TermsPage() {
  return (
    <LegalPage
      title="Terms of Service"
      updated="July 2026"
      sections={[
        {
          h: "1. The service",
          body: [
            "CVUnicorn generates and hosts personal websites from content you provide. You purchase time-limited hosting: 3 days with a Preview Pass or 12 months with Unicorn Year. Both are one-time payments, not subscriptions; nothing renews automatically.",
          ],
        },
        {
          h: "2. Your content",
          body: [
            "You retain all rights to the content you upload. By publishing a site you grant CVUnicorn the technical license needed to store, process, and serve that content on your behalf. You are responsible for having the rights to everything you upload and for its accuracy.",
            "You may not upload unlawful content, content that infringes others' rights, or content that impersonates another person.",
          ],
        },
        {
          h: "3. Payments and access",
          body: [
            "Payments are processed by our third-party payment provider; CVUnicorn does not store card details. Access to your published site is granted immediately after successful payment and lasts for the purchased period. When a period ends, your site goes offline but your content is retained so you can renew.",
          ],
        },
        {
          h: "4. Custom domains",
          body: [
            "Unicorn Year includes registration of one custom domain, subject to availability and registry rules. Domains are registered for one year; renewals follow whichever plan renewals you choose to make.",
          ],
        },
        {
          h: "5. Acceptable use & termination",
          body: [
            "We may remove sites or refuse service for unlawful content, abuse of the platform, or attempts to circumvent payment. If we terminate for a reason other than your breach, we refund the unused portion of your plan.",
          ],
        },
        {
          h: "6. Disclaimers",
          body: [
            "The service is provided 'as is'. To the maximum extent permitted by law, CVUnicorn's liability is limited to the amount you paid in the 12 months preceding a claim.",
          ],
        },
        {
          h: "7. Contact",
          body: [`Questions about these terms: ${SUPPORT_EMAIL}.`],
        },
      ]}
    />
  );
}
