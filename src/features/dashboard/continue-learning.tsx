"use client";

import Link from "next/link";
import { ArrowRight, CheckCircle2, GraduationCap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge, ProgressBar, Surface } from "@/components/ui/primitives";
import { overallCompletion, summariseModule, useProgress } from "@/lib/progress/store";

/**
 * "Continue learning" and the onboarding progress summary.
 *
 * Client-rendered because progress lives in the browser under the current
 * adapter. Both panels render a stable skeleton until storage has been read, so
 * there is no layout shift and no hydration mismatch.
 */

export interface ModuleRef {
  slug: string;
  title: string;
  summary: string;
  stepIds: string[];
  minutes: number;
}

export function ContinueLearning({
  modules,
  basePath,
}: {
  modules: ModuleRef[];
  basePath: string;
}) {
  const { state, ready } = useProgress();

  if (!ready) {
    return (
      <Surface className="p-5">
        <div className="h-[7.5rem] animate-pulse rounded-lg bg-surface-inset/60" />
      </Surface>
    );
  }

  // Pick up exactly where they were, if we know. Otherwise the first module
  // that is not finished — which for a new technician is module one.
  const lastSlug = state.lastVisited?.moduleSlug;
  const target =
    modules.find(
      (module) =>
        module.slug === lastSlug &&
        !summariseModule(state, module.slug, module.stepIds).complete,
    ) ??
    modules.find((module) => !summariseModule(state, module.slug, module.stepIds).complete);

  if (!target) {
    return (
      <Surface className="p-5">
        <div className="flex items-start gap-4">
          <span className="flex size-10 shrink-0 items-center justify-center rounded-lg border border-success/25 bg-success-soft">
            <CheckCircle2 className="size-5 text-success" aria-hidden />
          </span>
          <div className="min-w-0 flex-1">
            <h3 className="text-base font-medium text-primary">Onboarding complete</h3>
            <p className="mt-1 text-sm leading-6 text-secondary">
              You have worked through every module. Revisit any of them any time —
              procedures change, and modules show when they were last updated.
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              <Button href={`${basePath}/practice`} size="sm" variant="secondary">
                Practice a ticket
              </Button>
              <Button href={`${basePath}/training`} size="sm" variant="ghost">
                Review modules
              </Button>
            </div>
          </div>
        </div>
      </Surface>
    );
  }

  const summary = summariseModule(state, target.slug, target.stepIds);
  const started = summary.completedSteps > 0;
  const stepNumber = Math.min(summary.nextStepIndex + 1, target.stepIds.length);

  return (
    <Surface className="p-5">
      <div className="flex items-start gap-4">
        <span className="flex size-10 shrink-0 items-center justify-center rounded-lg border border-accent/25 bg-accent-soft">
          <GraduationCap className="size-5 text-accent-text" aria-hidden />
        </span>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <Badge tone={started ? "accent" : "neutral"}>
              {started ? "In progress" : "Not started"}
            </Badge>
            <span className="tabular text-xs text-tertiary">
              ~{target.minutes} min
            </span>
          </div>

          <h3 className="mt-2.5 text-base font-medium text-primary">{target.title}</h3>
          <p className="mt-1 line-clamp-2 text-sm leading-6 text-secondary">
            {target.summary}
          </p>

          <div className="mt-4">
            <div className="mb-2 flex items-center justify-between">
              <span className="tabular text-xs text-tertiary">
                Step {stepNumber} of {target.stepIds.length}
              </span>
              <span className="tabular text-xs text-tertiary">{summary.percent}%</span>
            </div>
            <ProgressBar
              value={summary.completedSteps}
              total={summary.totalSteps}
              label={`${target.title} progress`}
            />
          </div>

          <Button
            href={`${basePath}/training/${target.slug}?step=${summary.nextStepIndex}`}
            size="sm"
            className="mt-4"
          >
            {started ? "Continue" : "Start module"}
            <ArrowRight className="size-4" aria-hidden />
          </Button>
        </div>
      </div>
    </Surface>
  );
}

/* -------------------------------------------------------------------------- */

export function OnboardingProgress({
  modules,
  basePath,
}: {
  modules: ModuleRef[];
  basePath: string;
}) {
  const { state, ready } = useProgress();

  if (!ready) {
    return (
      <Surface className="p-5">
        <div className="h-32 animate-pulse rounded-lg bg-surface-inset/60" />
      </Surface>
    );
  }

  const overall = overallCompletion(state, modules);
  const scenariosDone = Object.keys(state.scenarios).length;

  return (
    <Surface className="p-5">
      <div className="flex items-baseline justify-between">
        <h3 className="text-sm font-medium text-primary">Onboarding</h3>
        <Link
          href={`${basePath}/progress`}
          className="text-xs text-tertiary transition-colors hover:text-secondary"
        >
          Details
        </Link>
      </div>

      <p className="tabular mt-4 text-3xl font-semibold tracking-tight text-primary">
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

      <dl className="mt-5 space-y-2.5">
        <div className="flex items-baseline justify-between">
          <dt className="text-sm text-secondary">Modules completed</dt>
          <dd className="tabular text-sm font-medium text-primary">
            {overall.completedModules} / {overall.totalModules}
          </dd>
        </div>
        <div className="flex items-baseline justify-between">
          <dt className="text-sm text-secondary">Scenarios practised</dt>
          <dd className="tabular text-sm font-medium text-primary">{scenariosDone}</dd>
        </div>
      </dl>
    </Surface>
  );
}
