import type { Metadata } from "next";
import Wizard from "@/components/wizard/Wizard";

export const metadata: Metadata = {
  title: "Build your website — add your story, we design the rest",
  description:
    "Add your CV, photos, projects, press, and achievements. Every field is optional — the more you share, the richer your AI-built personal website becomes.",
  alternates: { canonical: "/start" },
};

export default function StartPage() {
  return (
    <div className="pt-4 sm:pt-8">
      <Wizard />
    </div>
  );
}
