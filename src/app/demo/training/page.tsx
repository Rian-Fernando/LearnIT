import type { Metadata } from "next";
import { TrainingIndexScreen } from "@/features/training/training-screens";
import { GUEST_VIEWER } from "@/lib/auth/types";

export const metadata: Metadata = { title: "Training" };

export default function DemoTrainingPage() {
  return <TrainingIndexScreen viewer={GUEST_VIEWER} basePath="/demo" />;
}
