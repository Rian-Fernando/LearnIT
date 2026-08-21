import type { Metadata } from "next";
import { SystemScreen } from "@/features/reference/reference-library";
import { requireStaff } from "@/lib/auth";
import { getSystem } from "@/lib/content/repository";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const viewer = await requireStaff();
  const system = await getSystem(viewer, slug);
  return system
    ? { title: system.title, description: system.summary }
    : { title: "System not found" };
}

export default async function SystemPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const viewer = await requireStaff({ returnTo: `/reference/systems/${slug}` });
  return <SystemScreen viewer={viewer} slug={slug} />;
}
