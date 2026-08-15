import { DashboardScreen } from "@/features/dashboard/dashboard-screen";
import { GUEST_VIEWER } from "@/lib/auth/types";

export default function DemoDashboardPage() {
  return <DashboardScreen viewer={GUEST_VIEWER} basePath="/demo" />;
}
