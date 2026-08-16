import type { Metadata } from "next";
import { DashboardScreen } from "@/features/dashboard/dashboard-screen";
import { GUEST_VIEWER } from "@/lib/auth/types";

export const metadata: Metadata = {
  title: "Demo dashboard",
  description:
    "A walkthrough of the learnIT Help Desk dashboard: continue-learning prompts, quick actions, operational notices, and recently updated procedures.",
  alternates: { canonical: "/demo/dashboard" },
};

export default function DemoDashboardPage() {
  return <DashboardScreen viewer={GUEST_VIEWER} basePath="/demo" />;
}
