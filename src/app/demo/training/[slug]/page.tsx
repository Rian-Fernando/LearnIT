import { Suspense } from "react";
import type { Metadata } from "next";
import { ModuleScreen, trainingStaticParams } from "@/features/training/training-screens";
import { GUEST_VIEWER } from "@/lib/auth/types";
import { getModule } from "@/lib/content/repository";

export const dynamicParams = false;

export function generateStaticParams() {
  return trainingStaticParams(GUEST_VIEWER);
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const found = await getModule(GUEST_VIEWER, slug);
  return found
    ? {
        title: found.title,
        description: found.summary,
        alternates: { canonical: `/demo/training/${slug}` },
        openGraph: {
          title: found.title,
          description: found.summary,
          url: `/demo/training/${slug}`,
          type: "article",
        },
      }
    : { title: "Module not found" };
}

export default async function DemoModulePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return (
    <Suspense>
      <ModuleScreen viewer={GUEST_VIEWER} slug={slug} basePath="/demo" />
    </Suspense>
  );
}
