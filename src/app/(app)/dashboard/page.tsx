import type { Metadata } from "next";
import { DashboardScreen } from "@/features/dashboard/dashboard-screen";
import { requireStaff } from "@/lib/auth";

export const metadata: Metadata = { title: "Dashboard" };

export default async function DashboardPage() {
  const viewer = await requireStaff();
  return <DashboardScreen viewer={viewer} />;
}
