import type { Metadata } from "next";
import { ScenarioScreen, practiceStaticParams } from "@/features/practice/practice-screens";
import { GUEST_VIEWER } from "@/lib/auth/types";
import { getScenario } from "@/lib/content/repository";

export const dynamicParams = false;

export function generateStaticParams() {
  return practiceStaticParams(GUEST_VIEWER);
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const scenario = await getScenario(GUEST_VIEWER, slug);
  return scenario
    ? { title: scenario.title, description: scenario.summary }
    : { title: "Scenario not found" };
}

export default async function DemoScenarioPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return <ScenarioScreen viewer={GUEST_VIEWER} slug={slug} basePath="/demo" />;
}
