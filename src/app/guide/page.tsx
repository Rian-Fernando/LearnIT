import type { Metadata } from "next";
import { GuideOverviewScreen } from "@/features/guide/guide-screens";

export const metadata: Metadata = {
  title: "Help Desk guide",
  description:
    "How to write a Help Desk ticket properly, what to collect on a call, and which systems the Adelphi Help Desk uses. No account needed.",
  alternates: { canonical: "/guide" },
};

export default function GuidePage() {
  return <GuideOverviewScreen />;
}
