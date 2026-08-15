import { AdminOverviewScreen } from "@/features/admin/admin-overview";
import { requireAdmin } from "@/lib/auth";

export default async function AdminPage() {
  const viewer = await requireAdmin({ returnTo: "/admin" });
  return <AdminOverviewScreen viewer={viewer} />;
}
