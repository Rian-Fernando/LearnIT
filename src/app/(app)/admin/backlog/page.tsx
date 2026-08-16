import type { Metadata } from "next";
import { BacklogScreen } from "@/features/admin/backlog-screen";
import { requireAdmin } from "@/lib/auth";

export const metadata: Metadata = { title: "Content backlog" };

export default async function AdminBacklogPage() {
  const viewer = await requireAdmin({ returnTo: "/admin/backlog" });
  return <BacklogScreen viewer={viewer} />;
}
