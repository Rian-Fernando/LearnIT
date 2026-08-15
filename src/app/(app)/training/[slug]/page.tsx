import { Suspense } from "react";
import type { Metadata } from "next";
import { ModuleScreen } from "@/features/training/training-screens";
import { requireStaff } from "@/lib/auth";
import { getModule } from "@/lib/content/repository";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const viewer = await requireStaff();
  const found = await getModule(viewer, slug);
  return found
    ? { title: found.title, description: found.summary }
    : { title: "Module not found" };
}

export default async function ModulePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const viewer = await requireStaff({ returnTo: `/training/${slug}` });
  return (
    <Suspense>
      <ModuleScreen viewer={viewer} slug={slug} />
    </Suspense>
  );
}
