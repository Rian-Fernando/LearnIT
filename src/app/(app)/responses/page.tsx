import type { Metadata } from "next";
import { ResponsesScreen } from "@/features/responses/responses-screen";
import { requireStaff } from "@/lib/auth";

export const metadata: Metadata = { title: "Quick Responses" };

export default async function ResponsesPage() {
  const viewer = await requireStaff({ returnTo: "/responses" });
  return <ResponsesScreen viewer={viewer} />;
}
