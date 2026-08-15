import type { Metadata } from "next";
import { TrainingIndexScreen } from "@/features/training/training-screens";
import { requireStaff } from "@/lib/auth";

export const metadata: Metadata = { title: "Training" };

export default async function TrainingPage() {
  const viewer = await requireStaff({ returnTo: "/training" });
  return <TrainingIndexScreen viewer={viewer} />;
}
