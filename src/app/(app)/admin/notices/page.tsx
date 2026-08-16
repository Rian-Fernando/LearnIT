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

  // Computed here rather than in the client component so the date input's
  // `min` and `defaultValue` attributes are stable across hydration.
  const now = Date.now();
  const today = new Date(now).toISOString().slice(0, 10);
  const defaultExpiry = new Date(now + 30 * 86_400_000).toISOString().slice(0, 10);

  return (
    <PageContainer width="wide">
      <PageHeader
        eyebrow="Admin console"
        title="Dashboard notices"
        description="Short-lived operational messages shown at the top of every technician's dashboard."
      />
      <NoticesEditor
        authored={authoredAnnouncements}
        published={published}
        today={today}
        defaultExpiry={defaultExpiry}
      />
    </PageContainer>
  );
}
