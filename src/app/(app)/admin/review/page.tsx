import type { Metadata } from "next";
import { PageContainer, PageHeader } from "@/components/ui/page";
import { ReviewQueue } from "@/features/admin/review-queue";
import { requireAdmin } from "@/lib/auth";
import { getReportStore } from "@/lib/feedback/store";

export const metadata: Metadata = { title: "Review queue" };

export default async function AdminReviewPage() {
  await requireAdmin({ returnTo: "/admin/review" });

  const store = getReportStore();
  const reports = await store.list();

  return (
    <PageContainer>
      <PageHeader
        eyebrow="Admin console"
        title="Review queue"
        description="Documentation issues reported by technicians while using the platform. These are the most reliable signal you have about which procedures have drifted."
      />
      <ReviewQueue reports={reports} durable={store.durable} />
    </PageContainer>
  );
}
