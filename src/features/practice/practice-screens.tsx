import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, Terminal } from "lucide-react";
import { PageContainer, PageHeader } from "@/components/ui/page";
import { Badge, EmptyState, MetaLine } from "@/components/ui/primitives";
import type { Viewer } from "@/lib/auth/types";
import { CATEGORY_LABELS } from "@/lib/content/schema";
import { buildLinkMap, getScenario, listArticles, listScenarios } from "@/lib/content/repository";
import { formatDate } from "@/lib/format";
import { ScenarioRunner } from "./scenario-runner";
import { ScenarioStatus } from "./scenario-status";

const DIFFICULTY = {
  intro: { label: "Introductory", tone: "success" },
  core: { label: "Core", tone: "accent" },
  advanced: { label: "Advanced", tone: "warning" },
} as const;

/* ========================================================================== *
 * Index
 * ========================================================================== */

export async function PracticeIndexScreen({
  viewer,
  basePath = "",
}: {
  viewer: Viewer;
  basePath?: string;
}) {
  const scenarios = await listScenarios(viewer);

  return (
    <PageContainer>
      <PageHeader
        eyebrow="Practice"
        title="Realistic tickets, with feedback"
        description="Work a ticket the way you would on shift — decide what to collect, what to check, and when to escalate. Every option explains the reasoning, including the ones that are wrong."
        meta={<MetaLine items={[`${scenarios.length} scenarios`]} />}
      />

      {scenarios.length === 0 ? (
        <EmptyState
          icon={<Terminal className="size-6" aria-hidden />}
          title="No scenarios available"
          description="Practice scenarios are authored by Help Desk leadership from the admin console."
        />
      ) : (
        <ul className="grid gap-3 sm:grid-cols-2">
          {scenarios.map((scenario) => {
            const difficulty = DIFFICULTY[scenario.difficulty];
            return (
              <li key={scenario.slug}>
                <Link
                  href={`${basePath}/practice/${scenario.slug}`}
                  className="group flex h-full flex-col rounded-xl border border-subtle bg-surface-raised p-5 transition-colors hover:border-default hover:bg-surface-overlay"
                >
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge tone={difficulty.tone}>{difficulty.label}</Badge>
                    <Badge tone="neutral">{CATEGORY_LABELS[scenario.category]}</Badge>
                    <ScenarioStatus slug={scenario.slug} />
                  </div>

                  <h2 className="mt-3 flex items-start gap-1.5 text-base font-medium leading-6 text-primary">
                    <span className="min-w-0 flex-1">{scenario.title}</span>
                    <ArrowRight
                      className="mt-1 size-4 shrink-0 text-tertiary transition-transform group-hover:translate-x-0.5"
                      aria-hidden
                    />
                  </h2>

                  <p className="mt-1.5 flex-1 text-sm leading-6 text-secondary">
                    {scenario.summary}
                  </p>

                  <p className="tabular mt-4 font-mono text-xs text-tertiary">
                    {scenario.ticket.reference} · {scenario.stages.length} decisions
                  </p>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </PageContainer>
  );
}

/* ========================================================================== *
 * Scenario
 * ========================================================================== */

export async function ScenarioScreen({
  viewer,
  slug,
  basePath = "",
}: {
  viewer: Viewer;
  slug: string;
  basePath?: string;
}) {
  const scenario = await getScenario(viewer, slug);
  if (!scenario) notFound();

  const [links, articles] = await Promise.all([
    buildLinkMap(viewer),
    listArticles(viewer),
  ]);

  const articleTitles = Object.fromEntries(
    articles.map((article) => [article.slug, article.title]),
  );

  const difficulty = DIFFICULTY[scenario.difficulty];

  return (
    <PageContainer width="reading">
      <Link
        href={`${basePath}/practice`}
        className="mb-6 inline-flex items-center gap-2 text-sm text-tertiary transition-colors hover:text-primary"
      >
        <ArrowLeft className="size-4" aria-hidden />
        Practice
      </Link>

      <PageHeader
        eyebrow="Practice scenario"
        title={scenario.title}
        description={scenario.summary}
        meta={
          <div className="flex flex-wrap items-center gap-2">
            <Badge tone={difficulty.tone}>{difficulty.label}</Badge>
            <Badge tone="neutral">{CATEGORY_LABELS[scenario.category]}</Badge>
            <MetaLine className="ml-1" items={[`Updated ${formatDate(scenario.updatedAt)}`]} />
          </div>
        }
      />

      <div className="border-t border-subtle pt-8">
        <ScenarioRunner
          scenario={scenario}
          links={links}
          basePath={basePath}
          articleTitles={articleTitles}
        />
      </div>

      <p className="mt-12 border-t border-subtle pt-6 text-xs leading-6 text-tertiary">
        This scenario is fictional. Ticket references, requesters, and messages are
        invented for training and do not correspond to any real request.
      </p>
    </PageContainer>
  );
}

export async function practiceStaticParams(viewer: Viewer) {
  const scenarios = await listScenarios(viewer);
  return scenarios.map((scenario) => ({ slug: scenario.slug }));
}
