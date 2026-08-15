import type { Metadata } from "next";
import { ScenarioScreen } from "@/features/practice/practice-screens";
import { requireStaff } from "@/lib/auth";
import { getScenario } from "@/lib/content/repository";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const viewer = await requireStaff();
  const scenario = await getScenario(viewer, slug);
  return scenario
    ? { title: scenario.title, description: scenario.summary }
    : { title: "Scenario not found" };
}

export default async function ScenarioPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const viewer = await requireStaff({ returnTo: `/practice/${slug}` });
  return <ScenarioScreen viewer={viewer} slug={slug} />;
}
