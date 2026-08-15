import type { Metadata } from "next";
import { PageContainer, PageHeader } from "@/components/ui/page";
import { LinksEditor } from "@/features/admin/links-editor";
import { requireAdmin } from "@/lib/auth";
import { listLinks } from "@/lib/content/repository";

export const metadata: Metadata = { title: "Important links" };

export default async function AdminLinksPage() {
  const viewer = await requireAdmin({ returnTo: "/admin/links" });
  const links = await listLinks(viewer);

  return (
    <PageContainer>
      <PageHeader
        eyebrow="Admin console"
        title="Important links"
        description="Articles reference these by name rather than embedding a URL, so changing an address here updates every place it appears — no article edits, no redeploy."
      />
      <LinksEditor links={links} />
    </PageContainer>
  );
}
