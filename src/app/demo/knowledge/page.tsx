import type { Metadata } from "next";
import { KnowledgeIndexScreen } from "@/features/knowledge/knowledge-screens";
import { GUEST_VIEWER } from "@/lib/auth/types";

export const metadata: Metadata = { title: "Knowledge Base" };

export default function DemoKnowledgePage() {
  return <KnowledgeIndexScreen viewer={GUEST_VIEWER} basePath="/demo" />;
}
