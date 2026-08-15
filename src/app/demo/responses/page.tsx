import type { Metadata } from "next";
import { ResponsesScreen } from "@/features/responses/responses-screen";
import { GUEST_VIEWER } from "@/lib/auth/types";

export const metadata: Metadata = { title: "Quick Responses" };

export default function DemoResponsesPage() {
  return <ResponsesScreen viewer={GUEST_VIEWER} basePath="/demo" />;
}
