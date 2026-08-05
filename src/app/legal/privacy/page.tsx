import type { Metadata } from "next";
import LegalPage from "@/components/LegalPage";
import { SUPPORT_EMAIL } from "@/lib/contact";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How CVUnicorn handles your data and uploads.",
  alternates: { canonical: "/legal/privacy" },
};

export default function PrivacyPage() {
  return (
    <LegalPage
      title="Privacy Policy"
      updated="July 2026"
      sections={[
        {
          h: "1. What we collect",
          body: [
            "Content you upload to build your website (files, text, links, images), your email address for receipts and site management, and standard technical logs. Payment details are collected and processed by our payment provider, never by us.",
          ],
        },
        {
          h: "2. How we use it",
          body: [
            "Your uploads are used solely to generate and host your website. Your email is used for receipts, access links, and essential service messages. We do not sell your data or use your content to advertise to you.",
          ],
        },
        {
          h: "3. AI processing",
          body: [
            "Website generation uses AI models to analyze and structure the content you provide. Your content is transmitted to our AI processing providers only for the purpose of building your site.",
          ],
        },
        {
          h: "4. Public by design — where you choose",
          body: [
            "Your published website is public. Only content you include in it is published; drafts and unused uploads stay private.",
          ],
        },
        {
          h: "5. Retention & deletion",
          body: [
            `Expired sites go offline but content is retained so you can renew. You can request deletion of your content and data at any time at ${SUPPORT_EMAIL}, and we will remove it within 30 days.`,
          ],
        },
        {
          h: "6. Contact",
          body: [`Privacy questions: ${SUPPORT_EMAIL}.`],
        },
      ]}
    />
  );
}
