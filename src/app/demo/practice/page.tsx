import type { Metadata } from "next";
import { PracticeIndexScreen } from "@/features/practice/practice-screens";
import { GUEST_VIEWER } from "@/lib/auth/types";

export const metadata: Metadata = { title: "Practice" };

export default function DemoPracticePage() {
  return <PracticeIndexScreen viewer={GUEST_VIEWER} basePath="/demo" />;
}
