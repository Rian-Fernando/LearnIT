import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Target } from "lucide-react";
import { PageContainer, PageHeader } from "@/components/ui/page";
import { Badge, MetaLine } from "@/components/ui/primitives";
import type { Viewer } from "@/lib/auth/types";
import { CATEGORY_LABELS } from "@/lib/content/schema";
import { buildLinkMap, getModule, listModules } from "@/lib/content/repository";
import { formatDate, formatMinutes, relativeDate } from "@/lib/format";
import { ReportOutdated } from "@/features/feedback/report-outdated";
import { ModuleList, type ModuleCard } from "./module-list";
import { ModulePlayer } from "./module-player";

/* ========================================================================== *
 * Index
 * ========================================================================== */

export async function TrainingIndexScreen({
  viewer,
  basePath = "",
}: {
  viewer: Viewer;
  basePath?: string;
}) {
  const modules = await listModules(viewer);

  const cards: ModuleCard[] = modules.map((trainingModule) => ({
    slug: trainingModule.slug,
    title: trainingModule.title,
    summary: trainingModule.summary,
    category: CATEGORY_LABELS[trainingModule.category],
    outcomes: trainingModule.outcomes,
    stepIds: trainingModule.steps.map((step) => step.id),
    minutes: trainingModule.steps.reduce((sum, step) => sum + step.minutes, 0),
    checkCount: trainingModule.steps.filter((step) => step.check).length,
    prerequisites: trainingModule.prerequisites,
    updatedAt: trainingModule.updatedAt,
    updatedLabel: relativeDate(trainingModule.updatedAt),
  }));

  const totalMinutes = cards.reduce((sum, card) => sum + card.minutes, 0);

  return (
    <PageContainer>
      <PageHeader
        eyebrow="Training"
        title="Your onboarding track"
        description="Modules are ordered so each one builds on the last. Work through them in sequence for your first pass — after that, come back to whichever you need."
        meta={
          <MetaLine
            items={[
              `${cards.length} modules`,
              `about ${formatMinutes(totalMinutes)} total`,
              `${cards.reduce((sum, c) => sum + c.checkCount, 0)} knowledge checks`,
            ]}
          />
        }
      />

      <ModuleList modules={cards} basePath={basePath} />
    </PageContainer>
  );
}

/* ========================================================================== *
 * Module
 * ========================================================================== */

export async function ModuleScreen({
  viewer,
  slug,
  basePath = "",
}: {
  viewer: Viewer;
  slug: string;
  basePath?: string;
}) {
  const trainingModule = await getModule(viewer, slug);
  if (!trainingModule) notFound();

  const [links, all] = await Promise.all([buildLinkMap(viewer), listModules(viewer)]);

  const prerequisites = trainingModule.prerequisites
    .map((prereq) => all.find((candidate) => candidate.slug === prereq))
    .filter((candidate): candidate is (typeof all)[number] => Boolean(candidate));

  const totalMinutes = trainingModule.steps.reduce((sum, step) => sum + step.minutes, 0);

  return (
    <PageContainer>
      <Link
        href={`${basePath}/training`}
        className="mb-6 inline-flex items-center gap-2 text-sm text-tertiary transition-colors hover:text-primary"
      >
        <ArrowLeft className="size-4" aria-hidden />
        Training
      </Link>

      <PageHeader
        title={trainingModule.title}
        description={trainingModule.summary}
        meta={
          <div className="flex flex-wrap items-center gap-2">
            <Badge tone="neutral">{CATEGORY_LABELS[trainingModule.category]}</Badge>
            <MetaLine
              className="ml-1"
              items={[
                `${trainingModule.steps.length} steps`,
                formatMinutes(totalMinutes),
                `Updated ${formatDate(trainingModule.updatedAt)}`,
              ]}
            />
          </div>
        }
      />

      <section
        aria-labelledby="outcomes"
        className="mb-8 rounded-xl border border-subtle bg-surface-raised p-5"
      >
        <div className="flex items-start gap-3">
          <Target className="mt-0.5 size-4 shrink-0 text-accent-text" aria-hidden />
          <div className="min-w-0 flex-1">
            <h2 id="outcomes" className="text-sm font-medium text-primary">
              By the end of this trainingModule you will be able to
            </h2>
            <ul className="mt-3 space-y-1.5">
              {trainingModule.outcomes.map((outcome) => (
                <li key={outcome} className="flex gap-2.5 text-sm leading-6 text-secondary">
                  <span
                    aria-hidden
                    className="mt-[0.6875rem] size-1 shrink-0 rounded-full bg-accent"
                  />
                  {outcome}
                </li>
              ))}
            </ul>

            {prerequisites.length > 0 ? (
              <p className="mt-4 text-sm text-tertiary">
                Best taken after{" "}
                {prerequisites.map((prereq, index) => (
                  <span key={prereq.slug}>
                    {index > 0 ? ", " : ""}
                    <Link
                      href={`${basePath}/training/${prereq.slug}`}
                      className="text-accent-text underline decoration-accent/30 underline-offset-2 hover:decoration-accent"
                    >
                      {prereq.title}
                    </Link>
                  </span>
                ))}
                .
              </p>
            ) : null}
          </div>
        </div>
      </section>

      <ModulePlayer module={trainingModule} links={links} basePath={basePath} />

      <ReportOutdated
        resourceType="module"
        resourceSlug={trainingModule.slug}
        resourceTitle={trainingModule.title}
        className="mt-12"
      />
    </PageContainer>
  );
}

export async function trainingStaticParams(viewer: Viewer) {
  const modules = await listModules(viewer);
  return modules.map((trainingModule) => ({ slug: trainingModule.slug }));
}
