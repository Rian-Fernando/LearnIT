import type { Metadata } from "next";
import { SystemScreen, systemStaticParams } from "@/features/reference/reference-library";
import { GuideFooter } from "@/features/guide/guide-chrome";
import { GUEST_VIEWER } from "@/lib/auth/types";
import { getSystem } from "@/lib/content/repository";

export const dynamicParams = false;

export function generateStaticParams() {
  return systemStaticParams(GUEST_VIEWER);
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const system = await getSystem(GUEST_VIEWER, slug);
  return system
    ? {
        title: system.title,
        description: system.summary,
        alternates: { canonical: `/guide/systems/${slug}` },
      }
    : { title: "System not found" };
}

export default async function GuideSystemPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return (
    <>
      <SystemScreen viewer={GUEST_VIEWER} slug={slug} basePath="/guide" />
      <GuideFooter />
    </>
  );
}
