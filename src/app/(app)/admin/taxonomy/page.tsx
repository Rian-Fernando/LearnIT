import type { Metadata } from "next";
import { TaxonomyScreen } from "@/features/admin/taxonomy-screen";
import { requireAdmin } from "@/lib/auth";

export const metadata: Metadata = { title: "Option lists" };

export default async function AdminTaxonomyPage() {
  await requireAdmin({ returnTo: "/admin/taxonomy" });
  return <TaxonomyScreen />;
}
