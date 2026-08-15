import type { Metadata } from "next";
import { TroubleshootIndexScreen } from "@/features/troubleshoot/troubleshoot-screens";
import { GUEST_VIEWER } from "@/lib/auth/types";

export const metadata: Metadata = { title: "Troubleshoot" };

export default function DemoTroubleshootPage() {
  return <TroubleshootIndexScreen viewer={GUEST_VIEWER} basePath="/demo" />;
}
