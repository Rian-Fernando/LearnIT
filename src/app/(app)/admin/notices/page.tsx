import type { Metadata } from "next";
import { PageContainer, PageHeader } from "@/components/ui/page";
import { NoticesEditor } from "@/features/admin/notices-editor";
import { requireAdmin } from "@/lib/auth";
import { getOverrideStore } from "@/lib/admin/overrides";
import { announcements as authoredAnnouncements } from "@/content";

export const metadata: Metadata = { title: "Notices" };

export default async function AdminNoticesPage() {
  await requireAdmin({ returnTo: "/admin/notices" });
  const published = await getOverrideStore().extraAnnouncements();

  return (
    <PageContainer width="wide">
      <PageHeader
        eyebrow="Admin console"
        title="Dashboard notices"
        description="Short-lived operational messages shown at the top of every technician's dashboard."
      />
      <NoticesEditor authored={authoredAnnouncements} published={published} />
    </PageContainer>
  );
}
