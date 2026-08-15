"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import { ArrowLeft, ArrowRight, Check, CircleCheck, ListChecks } from "lucide-react";
import { Blocks, type LinkMap } from "@/components/content/blocks";
import { Button } from "@/components/ui/button";
import { ProgressBar, Surface } from "@/components/ui/primitives";
import { cn } from "@/lib/cn";
import type { TrainingModule } from "@/lib/content/schema";
import { formatMinutes } from "@/lib/format";
import { summariseModule, useProgress } from "@/lib/progress/store";
import { KnowledgeCheck } from "./knowledge-check";

/**
 * Step-by-step module player.
 *
 * The current step lives in the URL (`?step=3`) rather than in component state,
 * so a technician can bookmark a step, share it with a colleague, and use the
 * browser's back button the way they expect. Progress is recorded as steps are
 * completed, and the module is marked done automatically once every step is.
 */
export function ModulePlayer({
  module,
  links,
  basePath,
}: {
  module: TrainingModule;
  links: LinkMap;
  basePath: string;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { state, ready, completeStep, recordCheck, markModuleComplete, noteVisit } =
    useProgress();

  const stepIds = useMemo(() => module.steps.map((step) => step.id), [module.steps]);
  const totalSteps = module.steps.length;

  const requested = Number.parseInt(searchParams.get("step") ?? "0", 10);
  const index = Number.isFinite(requested)
    ? Math.min(Math.max(requested, 0), totalSteps - 1)
    : 0;

  const step = module.steps[index]!;
  const summary = summariseModule(state, module.slug, stepIds);
  const stepDone = state.modules[module.slug]?.completedSteps.includes(step.id) ?? false;
  const answered = step.check
    ? state.modules[module.slug]?.checks[step.check.id]
    : undefined;

  const [announcement, setAnnouncement] = useState("");

  const goTo = useCallback(
    (next: number) => {
      const clamped = Math.min(Math.max(next, 0), totalSteps - 1);
      const params = new URLSearchParams(searchParams.toString());
      params.set("step", String(clamped));
      router.replace(`${pathname}?${params.toString()}`, { scroll: false });
      // Scroll the step region into view rather than the whole page, so the
      // module header and step rail stay put.
      document.getElementById("step-top")?.scrollIntoView({ block: "start" });
    },
    [pathname, router, searchParams, totalSteps],
  );

  // Remember where they were, for the dashboard's "continue" card.
  useEffect(() => {
    if (!ready) return;
    noteVisit(module.slug, step.id);
  }, [ready, module.slug, step.id, noteVisit]);

  // Mark the module complete once the last step is done.
  useEffect(() => {
    if (!ready) return;
    markModuleComplete(module.slug, totalSteps);
  }, [ready, state.modules, module.slug, totalSteps, markModuleComplete]);

  // Left/right arrows move between steps, but never while typing.
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      if (
        target &&
        (target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.isContentEditable)
      ) {
        return;
      }
      if (event.key === "ArrowRight" && index < totalSteps - 1) goTo(index + 1);
      if (event.key === "ArrowLeft" && index > 0) goTo(index - 1);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [index, totalSteps, goTo]);

  const completeAndAdvance = () => {
    completeStep(module.slug, step.id);
    if (index < totalSteps - 1) {
      goTo(index + 1);
    } else {
      setAnnouncement("Module complete.");
    }
  };

  const isLast = index === totalSteps - 1;

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_16rem]">
      {/* ------------------------------------------------------------- main */}
      <div className="min-w-0">
        <div id="step-top" className="scroll-mt-24" />

        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <p className="tabular text-sm font-medium text-secondary">
            Step {index + 1} of {totalSteps}
          </p>
          <p className="tabular text-xs text-tertiary">
            {formatMinutes(step.minutes)} · {summary.percent}% complete
          </p>
        </div>

        <ProgressBar
          value={index + 1}
          total={totalSteps}
          label={`${module.title}: step ${index + 1} of ${totalSteps}`}
          className="mb-8"
        />

        <article aria-live="polite">
          <h2 className="text-xl font-semibold tracking-tight text-primary">
            {step.title}
          </h2>
          <div className="mt-6">
            <Blocks blocks={step.body} links={links} />
          </div>
        </article>

        {step.check ? (
          <div className="mt-10">
            <KnowledgeCheck
              key={step.check.id}
              check={step.check}
              answered={answered}
              onAnswered={(correct) => recordCheck(module.slug, step.check!.id, correct)}
            />
          </div>
        ) : null}

        {/* ------------------------------------------------------ navigation */}
        <nav
          aria-label="Step navigation"
          className="mt-10 flex flex-wrap items-center justify-between gap-3 border-t border-subtle pt-6"
        >
          <Button
            variant="ghost"
            size="md"
            onClick={() => goTo(index - 1)}
            disabled={index === 0}
          >
            <ArrowLeft className="size-4" aria-hidden />
            Previous
          </Button>

          <div className="flex items-center gap-2">
            {stepDone ? (
              <span className="flex items-center gap-1.5 text-sm text-success">
                <CircleCheck className="size-4" aria-hidden />
                Completed
              </span>
            ) : null}

            {isLast && stepDone ? (
              <Button href={`${basePath}/training`} size="md">
                Back to modules
              </Button>
            ) : (
              <Button size="md" onClick={completeAndAdvance}>
                {isLast ? "Finish module" : stepDone ? "Next" : "Mark done & continue"}
                <ArrowRight className="size-4" aria-hidden />
              </Button>
            )}
          </div>
        </nav>

        <p role="status" aria-live="polite" className="sr-only">
          {announcement}
        </p>

        {summary.complete ? (
          <Surface className="mt-6 border-success/25 bg-success-soft p-5">
            <div className="flex items-start gap-3">
              <CircleCheck className="mt-0.5 size-4 shrink-0 text-success" aria-hidden />
              <div>
                <p className="text-sm font-medium text-success">Module complete</p>
                <p className="mt-1 text-sm leading-6 text-secondary">
                  Every step is done. Revisit any time — the module shows when it
                  was last updated, so you can check whether anything has changed.
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  <Button href={`${basePath}/training`} size="sm" variant="secondary">
                    Next module
                  </Button>
                  <Button href={`${basePath}/practice`} size="sm" variant="ghost">
                    Practise a ticket
                  </Button>
                </div>
              </div>
            </div>
          </Surface>
        ) : null}
      </div>

      {/* ------------------------------------------------------------- rail */}
      <aside className="lg:sticky lg:top-24 lg:self-start">
        <div className="mb-4 flex items-center gap-2">
          <ListChecks className="size-4 text-tertiary" aria-hidden />
          <h2 className="text-sm font-medium text-primary">Steps</h2>
        </div>

        <ol className="space-y-0.5">
          {module.steps.map((entry, entryIndex) => {
            const done =
              state.modules[module.slug]?.completedSteps.includes(entry.id) ?? false;
            const current = entryIndex === index;
            return (
              <li key={entry.id}>
                <button
                  type="button"
                  onClick={() => goTo(entryIndex)}
                  aria-current={current ? "step" : undefined}
                  className={cn(
                    "flex w-full items-start gap-3 rounded-lg px-2.5 py-2 text-left text-sm transition-colors",
                    current
                      ? "bg-surface-inset font-medium text-primary"
                      : "text-secondary hover:bg-surface-inset/60 hover:text-primary",
                  )}
                >
                  <span
                    aria-hidden
                    className={cn(
                      "tabular mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full border text-[0.625rem]",
                      done
                        ? "border-success/40 bg-success-soft text-success"
                        : current
                          ? "border-accent/40 bg-accent-soft text-accent-text"
                          : "border-default text-tertiary",
                    )}
                  >
                    {done ? <Check className="size-3" /> : entryIndex + 1}
                  </span>
                  <span className="min-w-0 flex-1 leading-6">{entry.title}</span>
                </button>
              </li>
            );
          })}
        </ol>

        <div className="mt-6 border-t border-subtle pt-4">
          <Link
            href={`${basePath}/training`}
            className="flex items-center gap-2 text-sm text-tertiary transition-colors hover:text-primary"
          >
            <ArrowLeft className="size-3.5" aria-hidden />
            All modules
          </Link>
        </div>
      </aside>
    </div>
  );
}
