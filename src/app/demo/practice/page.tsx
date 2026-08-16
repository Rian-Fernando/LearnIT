import type { Metadata } from "next";
import { PracticeIndexScreen } from "@/features/practice/practice-screens";
import { GUEST_VIEWER } from "@/lib/auth/types";

export const metadata: Metadata = {
  title: "Practice scenarios",
  description:
    "Realistic Help Desk support tickets where a technician makes decisions and receives feedback on each one, covering VPN failures, printing scope, account transitions, and security escalations.",
  alternates: { canonical: "/demo/practice" },
};

export default function DemoPracticePage() {
  return <PracticeIndexScreen viewer={GUEST_VIEWER} basePath="/demo" />;
}
