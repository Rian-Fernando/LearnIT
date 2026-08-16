import type { Metadata } from "next";
import { ChecklistScreen } from "@/features/reference/reference-screens";
import { requireStaff } from "@/lib/auth";
import { getChecklist } from "@/lib/content/repository";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const viewer = await requireStaff();
  const checklist = await getChecklist(viewer, slug);
  return checklist
    ? { title: checklist.title, description: checklist.summary }
    : { title: "Checklist not found" };
}

export default async function ChecklistPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const viewer = await requireStaff({ returnTo: `/checklists/${slug}` });
  return <ChecklistScreen viewer={viewer} slug={slug} />;
}
