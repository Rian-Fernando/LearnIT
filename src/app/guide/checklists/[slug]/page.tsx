import type { Metadata } from "next";
import { ChecklistScreen } from "@/features/reference/reference-screens";
import { GuideFooter } from "@/features/guide/guide-chrome";
import { GUEST_VIEWER } from "@/lib/auth/types";
import { getChecklist, listChecklists } from "@/lib/content/repository";

export const dynamicParams = false;

export async function generateStaticParams() {
  const checklists = await listChecklists(GUEST_VIEWER);
  return checklists.map((checklist) => ({ slug: checklist.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const checklist = await getChecklist(GUEST_VIEWER, slug);
  return checklist
    ? {
        title: checklist.title,
        description: checklist.summary,
        alternates: { canonical: `/guide/checklists/${slug}` },
      }
    : { title: "Checklist not found" };
}

export default async function GuideChecklistPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return (
    <>
      <ChecklistScreen viewer={GUEST_VIEWER} slug={slug} basePath="/guide" />
      <GuideFooter />
    </>
  );
}
