import type { Metadata } from "next";
import { ResponsesScreen } from "@/features/responses/responses-screen";
import { GUEST_VIEWER } from "@/lib/auth/types";

export const metadata: Metadata = {
  title: "Quick responses",
  description:
    "Copy-ready Help Desk messages with fill-in placeholders, for the situations that come up every shift: office hours, remote support invitations, escalations, and redirects.",
  alternates: { canonical: "/demo/responses" },
};

export default function DemoResponsesPage() {
  return <ResponsesScreen viewer={GUEST_VIEWER} basePath="/demo" />;
}
