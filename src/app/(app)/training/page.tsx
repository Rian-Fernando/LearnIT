import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { TrainingIndexScreen } from "@/features/training/training-screens";
import { requireStaff } from "@/lib/auth";
import { isReferenceMode } from "@/lib/config/experience";

export const metadata: Metadata = { title: "Training" };

export default async function TrainingPage() {
  // The reference build has no course. Send stale links to the equivalent area
  // rather than showing a page this deployment does not offer.
  if (isReferenceMode()) redirect("/reference");
  const viewer = await requireStaff({ returnTo: "/training" });
  return <TrainingIndexScreen viewer={viewer} />;
}
