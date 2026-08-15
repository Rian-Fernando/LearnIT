import type { Metadata } from "next";
import { ProgressScreen } from "@/features/progress/progress-screen";
import type { ModuleCard } from "@/features/training/module-list";
import { GUEST_VIEWER } from "@/lib/auth/types";
import { CATEGORY_LABELS } from "@/lib/content/schema";
import { listModules, listScenarios } from "@/lib/content/repository";

export const metadata: Metadata = { title: "My progress" };

export default async function DemoProgressPage() {
  const [modules, scenarios] = await Promise.all([
    listModules(GUEST_VIEWER),
    listScenarios(GUEST_VIEWER),
  ]);

  const cards: ModuleCard[] = modules.map((module) => ({
    slug: module.slug,
    title: module.title,
    summary: module.summary,
    category: CATEGORY_LABELS[module.category],
    outcomes: module.outcomes,
    stepIds: module.steps.map((step) => step.id),
    minutes: module.steps.reduce((sum, step) => sum + step.minutes, 0),
    checkCount: module.steps.filter((step) => step.check).length,
    prerequisites: module.prerequisites,
    updatedAt: module.updatedAt,
  }));

  const scenarioTitles = Object.fromEntries(
    scenarios.map((scenario) => [scenario.slug, scenario.title]),
  );

  return (
    <ProgressScreen modules={cards} scenarioTitles={scenarioTitles} basePath="/demo" />
  );
}
