import type { Metadata } from "next";
import { TroubleshootIndexScreen } from "@/features/troubleshoot/troubleshoot-screens";
import { requireStaff } from "@/lib/auth";

export const metadata: Metadata = { title: "Troubleshoot" };

export default async function TroubleshootPage() {
  const viewer = await requireStaff({ returnTo: "/troubleshoot" });
  return <TroubleshootIndexScreen viewer={viewer} />;
}
