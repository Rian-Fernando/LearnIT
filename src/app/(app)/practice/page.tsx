import type { Metadata } from "next";
import { PracticeIndexScreen } from "@/features/practice/practice-screens";
import { requireStaff } from "@/lib/auth";

export const metadata: Metadata = { title: "Practice" };

export default async function PracticePage() {
  const viewer = await requireStaff({ returnTo: "/practice" });
  return <PracticeIndexScreen viewer={viewer} />;
}
