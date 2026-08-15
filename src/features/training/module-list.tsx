"use client";

import Link from "next/link";
import { ArrowRight, CircleCheck, CircleDashed, CirclePlay } from "lucide-react";
import { Badge, ProgressBar, Surface } from "@/components/ui/primitives";
import { cn } from "@/lib/cn";
import { formatMinutes, relativeDate } from "@/lib/format";
import { summariseModule, useProgress } from "@/lib/progress/store";

/**
 * The onboarding track.
 *
 * Rendered as an ordered, connected list rather than a grid of cards — the
 * order is the meaning here. Each module builds on the last, and a grid quietly
 * suggests they are interchangeable.
 */

export interface ModuleCard {
  slug: string;
  title: string;
  summary: string;
  category: string;
  outcomes: string[];
  stepIds: string[];
  minutes: number;
  checkCount: number;
  prerequisites: string[];
  updatedAt: string;
}

export function ModuleList({
  modules,
  basePath,
}: {
  modules: ModuleCard[];
  basePath: string;
}) {
  const { state, ready } = useProgress();

  return (
    <ol className="space-y-3">
      {modules.map((module, index) => {
        const summary = ready
          ? summariseModule(state, module.slug, module.stepIds)
          : null;
        const complete = summary?.complete ?? false;
        const started = (summary?.completedSteps ?? 0) > 0;

        const Icon = complete ? CircleCheck : started ? CirclePlay : CircleDashed;

        return (
          <li key={module.slug} className="group relative flex gap-4">
            {/* Connector line down the track. */}
            <div className="flex flex-col items-center">
              <span
                className={cn(
                  "flex size-9 shrink-0 items-center justify-center rounded-full border transition-colors",
                  complete
                    ? "border-success/40 bg-success-soft text-success"
                    : started
                      ? "border-accent/40 bg-accent-soft text-accent-text"
                      : "border-default bg-surface-inset text-tertiary",
                )}
              >
                <Icon className="size-4" aria-hidden />
              </span>
              <span
                aria-hidden
                className="mt-1 w-px flex-1 bg-subtle group-last:hidden"
              />
            </div>

            <Surface interactive as="div" className="mb-3 min-w-0 flex-1 p-5">
              <Link
                href={`${basePath}/training/${module.slug}`}
                className="block focus-visible:outline-2 focus-visible:outline-offset-4"
              >
                <div className="flex flex-wrap items-center gap-2">
                  <span className="tabular font-mono text-xs text-tertiary">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <Badge tone="neutral">{module.category}</Badge>
                  {complete ? <Badge tone="success">Complete</Badge> : null}
                  {!complete && started ? <Badge tone="accent">In progress</Badge> : null}
                </div>

                <h3 className="mt-3 flex items-start gap-1.5 text-base font-medium leading-6 text-primary">
                  <span className="min-w-0 flex-1">{module.title}</span>
                  <ArrowRight
                    className="mt-1 size-4 shrink-0 text-tertiary transition-transform group-hover:translate-x-0.5"
                    aria-hidden
                  />
                </h3>

                <p className="mt-1.5 text-sm leading-6 text-secondary">{module.summary}</p>

                <p className="tabular mt-3 text-xs text-tertiary">
                  {module.stepIds.length} steps · {formatMinutes(module.minutes)}
                  {module.checkCount > 0
                    ? ` · ${module.checkCount} knowledge check${module.checkCount === 1 ? "" : "s"}`
                    : ""}{" "}
                  · updated {relativeDate(module.updatedAt)}
                </p>
              </Link>

              {summary && started && !complete ? (
                <div className="mt-4">
                  <div className="mb-2 flex items-center justify-between">
                    <span className="tabular text-xs text-tertiary">
                      {summary.completedSteps} of {summary.totalSteps} steps
                    </span>
                    <span className="tabular text-xs text-tertiary">
                      {summary.percent}%
                    </span>
                  </div>
                  <ProgressBar
                    value={summary.completedSteps}
                    total={summary.totalSteps}
                    label={`${module.title} progress`}
                  />
                </div>
              ) : null}
            </Surface>
          </li>
        );
      })}
    </ol>
  );
}
