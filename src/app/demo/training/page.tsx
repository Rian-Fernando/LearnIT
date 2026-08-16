import type { Metadata } from "next";
import { TrainingIndexScreen } from "@/features/training/training-screens";
import { GUEST_VIEWER } from "@/lib/auth/types";

export const metadata: Metadata = {
  title: "Training modules",
  description:
    "Structured onboarding modules for new Help Desk technicians, with step-by-step instructions and knowledge checks that explain the reasoning behind every answer.",
  alternates: { canonical: "/demo/training" },
};

export default function DemoTrainingPage() {
  return <TrainingIndexScreen viewer={GUEST_VIEWER} basePath="/demo" />;
}
