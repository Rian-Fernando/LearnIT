import type { Metadata } from "next";
import { ContentInventoryScreen } from "@/features/admin/content-inventory";
import { requireAdmin } from "@/lib/auth";

export const metadata: Metadata = { title: "Content inventory" };

export default async function AdminContentPage() {
  const viewer = await requireAdmin({ returnTo: "/admin/content" });
  return <ContentInventoryScreen viewer={viewer} />;
}
