import type { Metadata } from "next";
import { TroubleshootIndexScreen } from "@/features/troubleshoot/troubleshoot-screens";
import { GUEST_VIEWER } from "@/lib/auth/types";

export const metadata: Metadata = {
  title: "Troubleshooting workflows",
  description:
    "Guided decision trees that take a Help Desk technician from a vague symptom to a specific next step, including when the correct answer is to redirect or escalate.",
  alternates: { canonical: "/demo/troubleshoot" },
};

export default function DemoTroubleshootPage() {
  return <TroubleshootIndexScreen viewer={GUEST_VIEWER} basePath="/demo" />;
}
