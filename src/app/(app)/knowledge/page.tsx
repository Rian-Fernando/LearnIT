import type { Metadata } from "next";
import { KnowledgeIndexScreen } from "@/features/knowledge/knowledge-screens";
import { requireStaff } from "@/lib/auth";

export const metadata: Metadata = { title: "Knowledge Base" };

export default async function KnowledgePage() {
  const viewer = await requireStaff({ returnTo: "/knowledge" });
  return <KnowledgeIndexScreen viewer={viewer} />;
}
