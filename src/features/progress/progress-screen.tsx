"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowRight, Check, CircleDashed, RotateCcw, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageContainer, PageHeader } from "@/components/ui/page";
import {
  Badge,
  EmptyState,
  ProgressBar,
  SectionHeading,
  Skeleton,
  Surface,
} from "@/components/ui/primitives";
import { cn } from "@/lib/cn";
import { formatMinutes } from "@/lib/format";
import { overallCompletion, summariseModule, useProgress } from "@/lib/progress/store";
import type { ModuleCard } from "@/features/training/module-list";

/**
 * Progress overview.
 *
 * Shows completion honestly and without gamification — no points, no badges,
 * no streaks. A Help Desk technician's incentive to finish onboarding is being
 * competent on the phone, and dressing that up as a game would cheapen it.
 *
 * The knowledge-check summary is framed as "worth revisiting" rather than
 * "wrong answers", because the useful action is re-reading the step.
 */
export function ProgressScreen({
  modules,
  scenarioTitles,
  basePath,
}: {
  modules: ModuleCard[];
  scenarioTitles: Record<string, string>;
  basePath: string;
}) {
  const { state, ready, reset } = useProgress();
  const [confirmingReset, setConfirmingReset] = useState(false);

  if (!ready) {
    return (
      <PageContainer>
        <PageHeader eyebrow="Progress" title="Your onboarding" />
        <div className="space-y-4">
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-64 w-full" />
        </div>
      </PageContainer>
    );
  }

  const overall = overallCompletion(state, modules);
  const scenarioResults = Object.entries(state.scenarios);

  // Checks answered incorrectly on the most recent attempt.
  const revisit = modules.flatMap((module) => {
    const entry = state.modules[module.slug];
    if (!entry) return [];
    return Object.entries(entry.checks)
      .filter(([, result]) => !result.correct)
      .map(([checkId]) => ({ module, checkId }));
  });

  const totalMinutes = modules.reduce((sum, module) => sum + module.minutes, 0);
  const remainingMinutes = modules.reduce((sum, module) => {
    const summary = summariseModule(state, module.slug, module.stepIds);
    if (summary.complete) return sum;
    const perStep = module.minutes / Math.max(module.stepIds.length, 1);
    return sum + Math.round(perStep * (summary.totalSteps - summary.completedSteps));
  }, 0);

  return (
    <PageContainer>
      <PageHeader
        eyebrow="Progress"
        title="Your onboarding"
        description="What you have worked through, and what is left. Nothing here is shared with anyone else."
      />

      {/* --------------------------------------------------------- summary */}
      <div className="mb-10 grid gap-3 sm:grid-cols-3">
        <Surface className="p-5">
          <p className="text-sm text-secondary">Overall</p>
          <p className="tabular mt-2 text-3xl font-semibold tracking-tight text-primary">
            {overall.percent}
            <span className="text-lg text-tertiary">%</span>
          </p>
          <ProgressBar
            value={overall.percent}
            total={100}
            label="Overall onboarding completion"
            tone={overall.percent === 100 ? "success" : "accent"}
            className="mt-3"
          />
        </Surface>

        <Surface className="p-5">
          <p className="text-sm text-secondary">Modules completed</p>
          <p className="tabular mt-2 text-3xl font-semibold tracking-tight text-primary">
            {overall.completedModules}
            <span className="text-lg text-tertiary">/{overall.totalModules}</span>
          </p>
          <p className="mt-3 text-xs text-tertiary">
            About {formatMinutes(totalMinutes)} of material in total
          </p>
        </Surface>

        <Surface className="p-5">
          <p className="text-sm text-secondary">Estimated remaining</p>
          <p className="tabular mt-2 text-3xl font-semibold tracking-tight text-primary">
            {remainingMinutes === 0 ? "—" : formatMinutes(remainingMinutes)}
          </p>
          <p className="mt-3 text-xs text-tertiary">
            {remainingMinutes === 0
              ? "Nothing outstanding"
              : "Based on the modules you have not finished"}
          </p>
        </Surface>
      </div>

      {/* --------------------------------------------------------- modules */}
      <section className="mb-10">
        <SectionHeading
          className="mb-4"
          title="Modules"
          description="In the order they are intended to be taken."
        />
        <Surface>
          <ul className="divide-y divide-subtle">
            {modules.map((module) => {
              const summary = summariseModule(state, module.slug, module.stepIds);
              return (
                <li key={module.slug}>
                  <Link
                    href={`${basePath}/training/${module.slug}`}
                    className="flex items-center gap-4 px-4 py-3.5 transition-colors hover:bg-surface-overlay"
                  >
                    <span
                      aria-hidden
                      className={cn(
                        "flex size-7 shrink-0 items-center justify-center rounded-full border",
                        summary.complete
                          ? "border-success/40 bg-success-soft text-success"
                          : "border-default text-tertiary",
                      )}
                    >
                      {summary.complete ? (
                        <Check className="size-3.5" />
                      ) : (
                        <CircleDashed className="size-3.5" />
                      )}
                    </span>

                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-medium text-primary">
                        {module.title}
                      </span>
                      <span className="tabular mt-0.5 block text-xs text-tertiary">
                        {summary.completedSteps} of {summary.totalSteps} steps
                      </span>
                    </span>

                    <span className="hidden w-32 shrink-0 sm:block">
                      <ProgressBar
                        value={summary.completedSteps}
                        total={summary.totalSteps}
                        label={`${module.title} progress`}
                        tone={summary.complete ? "success" : "accent"}
                      />
                    </span>

                    <span className="tabular w-10 shrink-0 text-right text-xs text-tertiary">
                      {summary.percent}%
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </Surface>
      </section>

      {/* ------------------------------------------------------- revisiting */}
      {revisit.length > 0 ? (
        <section className="mb-10">
          <SectionHeading
            className="mb-4"
            title="Worth revisiting"
            description="Knowledge checks you did not get right on your last attempt. These are usually the parts that matter most on a call."
          />
          <Surface>
            <ul className="divide-y divide-subtle">
              {revisit.map(({ module, checkId }) => (
                <li key={`${module.slug}-${checkId}`}>
                  <Link
                    href={`${basePath}/training/${module.slug}`}
                    className="flex items-center gap-3 px-4 py-3.5 transition-colors hover:bg-surface-overlay"
                  >
                    <span className="min-w-0 flex-1 truncate text-sm text-primary">
                      {module.title}
                    </span>
                    <ArrowRight className="size-3.5 shrink-0 text-tertiary" aria-hidden />
                  </Link>
                </li>
              ))}
            </ul>
          </Surface>
        </section>
      ) : null}

      {/* -------------------------------------------------------- scenarios */}
      <section className="mb-10">
        <SectionHeading
          className="mb-4"
          title="Practice scenarios"
          description="Scenarios you have worked through."
          action={
            <Link
              href={`${basePath}/practice`}
              className="flex items-center gap-1 text-sm text-secondary transition-colors hover:text-primary"
            >
              All scenarios
              <ArrowRight className="size-3.5" aria-hidden />
            </Link>
          }
        />
        {scenarioResults.length === 0 ? (
          <EmptyState
            title="No scenarios yet"
            description="Practice scenarios put the training into a realistic ticket. They are the fastest way to find out what has actually stuck."
            action={
              <Button href={`${basePath}/practice`} size="sm" variant="secondary">
                Try one
              </Button>
            }
          />
        ) : (
          <Surface>
            <ul className="divide-y divide-subtle">
              {scenarioResults.map(([slug, result]) => (
                <li
                  key={slug}
                  className="flex items-center gap-4 px-4 py-3.5"
                >
                  <span className="min-w-0 flex-1 truncate text-sm text-primary">
                    {scenarioTitles[slug] ?? slug}
                  </span>
                  <Badge tone={result.correct === result.total ? "success" : "neutral"}>
                    {result.correct}/{result.total}
                  </Badge>
                  <Link
                    href={`${basePath}/practice/${slug}`}
                    className="flex items-center gap-1 text-xs text-tertiary transition-colors hover:text-primary"
                  >
                    <RotateCcw className="size-3" aria-hidden />
                    Again
                  </Link>
                </li>
              ))}
            </ul>
          </Surface>
        )}
      </section>

      {/* ------------------------------------------------------------ reset */}
      <section className="border-t border-subtle pt-6">
        <h2 className="text-sm font-medium text-primary">Reset progress</h2>
        <p className="mt-1.5 max-w-xl text-sm leading-6 text-tertiary">
          Progress is stored in this browser only. Clearing it removes your
          completed steps, knowledge check answers, and scenario results. It cannot
          be undone.
        </p>
        {confirmingReset ? (
          <div className="mt-4 flex flex-wrap gap-2">
            <Button
              size="sm"
              variant="danger"
              onClick={() => {
                reset();
                setConfirmingReset(false);
              }}
            >
              <Trash2 className="size-3.5" aria-hidden />
              Yes, clear everything
            </Button>
            <Button size="sm" variant="ghost" onClick={() => setConfirmingReset(false)}>
              Cancel
            </Button>
          </div>
        ) : (
          <Button
            size="sm"
            variant="secondary"
            className="mt-4"
            onClick={() => setConfirmingReset(true)}
          >
            Reset my progress
          </Button>
        )}
      </section>
    </PageContainer>
  );
}
