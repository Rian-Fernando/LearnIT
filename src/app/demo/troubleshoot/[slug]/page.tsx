import type { Metadata } from "next";
import { FlowScreen, troubleshootStaticParams } from "@/features/troubleshoot/troubleshoot-screens";
import { GUEST_VIEWER } from "@/lib/auth/types";
import { getFlow } from "@/lib/content/repository";

export const dynamicParams = false;

export function generateStaticParams() {
  return troubleshootStaticParams(GUEST_VIEWER);
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const flow = await getFlow(GUEST_VIEWER, slug);
  return flow
    ? {
        title: flow.title,
        description: flow.summary,
        alternates: { canonical: `/demo/troubleshoot/${slug}` },
        openGraph: {
          title: flow.title,
          description: flow.summary,
          url: `/demo/troubleshoot/${slug}`,
          type: "article",
        },
      }
    : { title: "Workflow not found" };
}

export default async function DemoFlowPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return <FlowScreen viewer={GUEST_VIEWER} slug={slug} basePath="/demo" />;
}
