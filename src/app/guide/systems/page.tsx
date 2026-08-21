import type { Metadata } from "next";
import { GuideSystemsScreen } from "@/features/guide/guide-screens";

export const metadata: Metadata = {
  title: "The systems we use",
  description:
    "The software an Adelphi Help Desk technician uses day to day — what each one is for and when it sends you there.",
  alternates: { canonical: "/guide/systems" },
};

export default function GuideSystemsPage() {
  return <GuideSystemsScreen />;
}
