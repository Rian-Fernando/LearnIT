import type { Metadata } from "next";
import { FlowScreen } from "@/features/troubleshoot/troubleshoot-screens";
import { requireStaff } from "@/lib/auth";
import { getFlow } from "@/lib/content/repository";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const viewer = await requireStaff();
  const flow = await getFlow(viewer, slug);
  return flow
    ? { title: flow.title, description: flow.summary }
    : { title: "Workflow not found" };
}

export default async function FlowPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const viewer = await requireStaff({ returnTo: `/troubleshoot/${slug}` });
  return <FlowScreen viewer={viewer} slug={slug} />;
}
