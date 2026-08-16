import type { Metadata } from "next";
import { KnowledgeIndexScreen } from "@/features/knowledge/knowledge-screens";
import { GUEST_VIEWER } from "@/lib/auth/types";

export const metadata: Metadata = {
  title: "Knowledge Base",
  description:
    "Searchable Help Desk procedures covering accounts, VPN, printing, networks, remote support, ticketing, and communication. Every article shows when it was last reviewed and by whom.",
  alternates: { canonical: "/demo/knowledge" },
};

export default function DemoKnowledgePage() {
  return <KnowledgeIndexScreen viewer={GUEST_VIEWER} basePath="/demo" />;
}
