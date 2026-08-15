"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  ArrowRight,
  BookOpen,
  Check,
  MessageSquare,
  RotateCcw,
  Ticket,
  X,
} from "lucide-react";
import { Blocks, type LinkMap } from "@/components/content/blocks";
import { Button } from "@/components/ui/button";
import { Badge, ProgressBar, Surface } from "@/components/ui/primitives";
import { cn } from "@/lib/cn";
import type { Scenario } from "@/lib/content/schema";
import { useProgress } from "@/lib/progress/store";

/**
 * Practice scenario runner.
 *
 * Modelled on how a ticket actually unfolds: the request arrives, and each
 * decision changes what you know. Feedback appears immediately per stage rather
 * than being withheld to the end, because the reasoning is only useful while
 * the decision is still fresh.
 *
 * Scoring is shown but deliberately understated — no grades, no streaks, no
 * leaderboard. The debrief is the point.
 */
export function ScenarioRunner({
  scenario,
  links,
  basePath,
  articleTitles,
}: {
  scenario: Scenario;
  links: LinkMap;
  basePath: string;
  articleTitles: Record<string, string>;
}) {
  const { recordScenario } = useProgress();
  const [stageIndex, setStageIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string[]>>({});
  const [revealed, setRevealed] = useState<Record<string, boolean>>({});
  const [selected, setSelected] = useState<string[]>([]);

  const stage = scenario.stages[stageIndex]!;
  const isRevealed = revealed[stage.id] ?? false;
  const isLast = stageIndex === scenario.stages.length - 1;
  const finished = Object.keys(revealed).length === scenario.stages.length && isLast && isRevealed;

  const correctIds = useMemo(
    () => stage.options.filter((option) => option.correct).map((option) => option.id),
    [stage],
  );

  const stageCorrect =
    isRevealed &&
    (answers[stage.id] ?? []).length === correctIds.length &&
    (answers[stage.id] ?? []).every((id) => correctIds.includes(id));

  const score = useMemo(() => {
    let correct = 0;
    for (const entry of scenario.stages) {
      const given = answers[entry.id];
      if (!given) continue;
      const expected = entry.options.filter((o) => o.correct).map((o) => o.id);
      if (
        given.length === expected.length &&
        given.every((id) => expected.includes(id))
      ) {
        correct += 1;
      }
    }
    return correct;
  }, [answers, scenario.stages]);

  // Record the outcome once, when the last stage has been answered.
  useEffect(() => {
    if (!finished) return;
    recordScenario(scenario.slug, score, scenario.stages.length);
  }, [finished, recordScenario, scenario.slug, scenario.stages.length, score]);

  const toggle = (id: string) => {
    if (isRevealed) return;
    setSelected((current) => {
      if (stage.kind === "multiple") {
        return current.includes(id)
          ? current.filter((value) => value !== id)
          : [...current, id];
      }
      return [id];
    });
  };

  const submit = () => {
    if (selected.length === 0) return;
    setAnswers((current) => ({ ...current, [stage.id]: selected }));
    setRevealed((current) => ({ ...current, [stage.id]: true }));
  };

  const next = () => {
    setStageIndex((index) => Math.min(index + 1, scenario.stages.length - 1));
    setSelected([]);
  };

  const restart = () => {
    setStageIndex(0);
    setAnswers({});
    setRevealed({});
    setSelected([]);
  };

  return (
    <div className="space-y-8">
      <TicketCard scenario={scenario} />

      {/* ------------------------------------------------------------ stage */}
      <div>
        <div className="mb-3 flex items-center justify-between">
          <p className="tabular text-sm font-medium text-secondary">
            Decision {stageIndex + 1} of {scenario.stages.length}
          </p>
          {Object.keys(revealed).length > 0 ? (
            <p className="tabular text-xs text-tertiary">
              {score} of {Object.keys(revealed).length} so far
            </p>
          ) : null}
        </div>

        <ProgressBar
          value={stageIndex + (isRevealed ? 1 : 0)}
          total={scenario.stages.length}
          label={`Scenario progress: decision ${stageIndex + 1} of ${scenario.stages.length}`}
          className="mb-6"
        />

        <section aria-live="polite">
          <h2 className="text-lg font-semibold leading-7 tracking-tight text-primary">
            {stage.prompt}
          </h2>
          {stage.kind === "multiple" ? (
            <p className="mt-1.5 text-sm text-tertiary">Select all that apply.</p>
          ) : null}

          <fieldset className="mt-5" disabled={isRevealed}>
            <legend className="sr-only">{stage.prompt}</legend>
            <ul className="space-y-2">
              {stage.options.map((option) => {
                const chosen = (answers[stage.id] ?? selected).includes(option.id);
                const showCorrect = isRevealed && option.correct;
                const showWrong = isRevealed && chosen && !option.correct;

                return (
                  <li key={option.id}>
                    <label
                      className={cn(
                        "flex cursor-pointer items-start gap-3 rounded-lg border p-4 transition-colors",
                        !isRevealed && chosen && "border-accent/40 bg-accent-soft",
                        !isRevealed &&
                          !chosen &&
                          "border-default bg-surface-raised hover:border-strong",
                        showCorrect && "border-success/40 bg-success-soft",
                        showWrong && "border-danger/40 bg-danger-soft",
                        isRevealed && !showCorrect && !showWrong && "border-subtle opacity-60",
                        isRevealed && "cursor-default",
                      )}
                    >
                      <input
                        type={stage.kind === "multiple" ? "checkbox" : "radio"}
                        name={`stage-${stage.id}`}
                        value={option.id}
                        checked={chosen}
                        onChange={() => toggle(option.id)}
                        className="sr-only"
                      />
                      <span
                        aria-hidden
                        className={cn(
                          "mt-0.5 flex size-4 shrink-0 items-center justify-center border",
                          stage.kind === "multiple" ? "rounded" : "rounded-full",
                          chosen || showCorrect ? "border-transparent" : "border-strong",
                          showCorrect && "bg-success",
                          showWrong && "bg-danger",
                          !isRevealed && chosen && "bg-accent",
                        )}
                      >
                        {showCorrect ? (
                          <Check className="size-3 text-inverse" />
                        ) : showWrong ? (
                          <X className="size-3 text-inverse" />
                        ) : chosen ? (
                          <Check className="size-3 text-accent-contrast" />
                        ) : null}
                      </span>

                      <span className="min-w-0 flex-1">
                        <span className="block text-sm leading-6 text-primary">
                          {option.text}
                        </span>
                        {isRevealed ? (
                          <span
                            className={cn(
                              "mt-1.5 block text-sm leading-6",
                              option.correct ? "text-success" : "text-tertiary",
                            )}
                          >
                            {option.feedback}
                          </span>
                        ) : null}
                      </span>
                    </label>
                  </li>
                );
              })}
            </ul>
          </fieldset>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            {!isRevealed ? (
              <Button onClick={submit} disabled={selected.length === 0}>
                Submit decision
              </Button>
            ) : (
              <>
                <p
                  className={cn(
                    "text-sm font-medium",
                    stageCorrect ? "text-success" : "text-warning",
                  )}
                >
                  {stageCorrect ? "Good call." : "Worth rethinking — see the notes above."}
                </p>
                {!isLast ? (
                  <Button onClick={next}>
                    Next decision
                    <ArrowRight className="size-4" aria-hidden />
                  </Button>
                ) : null}
              </>
            )}
          </div>
        </section>
      </div>

      {/* --------------------------------------------------------- debrief */}
      {finished ? (
        <section aria-labelledby="debrief" className="border-t border-subtle pt-8">
          <div className="mb-6 flex flex-wrap items-center gap-3">
            <h2 id="debrief" className="text-xl font-semibold tracking-tight text-primary">
              Debrief
            </h2>
            <Badge tone={score === scenario.stages.length ? "success" : "neutral"}>
              {score} of {scenario.stages.length} decisions
            </Badge>
          </div>

          <Blocks blocks={scenario.debrief} links={links} />

          {scenario.articleSlugs.length > 0 ? (
            <div className="mt-8 grid gap-2.5 sm:grid-cols-2">
              {scenario.articleSlugs
                .filter((slug) => articleTitles[slug])
                .map((slug) => (
                  <Link
                    key={slug}
                    href={`${basePath}/knowledge/${slug}`}
                    className="group flex items-start gap-3 rounded-lg border border-subtle bg-surface-raised px-4 py-3.5 transition-colors hover:border-default hover:bg-surface-overlay"
                  >
                    <BookOpen className="mt-0.5 size-4 shrink-0 text-signal" aria-hidden />
                    <span className="min-w-0 flex-1 text-sm font-medium leading-6 text-primary">
                      {articleTitles[slug]}
                    </span>
                    <ArrowRight
                      className="mt-1 size-3.5 shrink-0 text-tertiary transition-transform group-hover:translate-x-0.5"
                      aria-hidden
                    />
                  </Link>
                ))}
            </div>
          ) : null}

          <div className="mt-8 flex flex-wrap gap-2">
            <Button variant="secondary" onClick={restart}>
              <RotateCcw className="size-4" aria-hidden />
              Run it again
            </Button>
            <Button href={`${basePath}/practice`} variant="ghost">
              Other scenarios
            </Button>
          </div>
        </section>
      ) : null}
    </div>
  );
}

/* -------------------------------------------------------------------------- */

const REQUESTER_LABELS = {
  student: "Student",
  faculty: "Faculty",
  staff: "Staff",
  alumni: "Alumni",
  guest: "Sponsored guest",
} as const;

function TicketCard({ scenario }: { scenario: Scenario }) {
  const { ticket } = scenario;
  return (
    <Surface className="overflow-hidden">
      <div className="flex flex-wrap items-center gap-2 border-b border-subtle px-5 py-3">
        <Ticket className="size-4 text-tertiary" aria-hidden />
        <span className="tabular font-mono text-sm text-secondary">
          {ticket.reference}
        </span>
        <span aria-hidden className="text-tertiary opacity-50">
          ·
        </span>
        <span className="text-sm text-tertiary">
          {REQUESTER_LABELS[ticket.requesterType]} · {ticket.channel}
        </span>
        <Badge tone="neutral" className="ml-auto">
          {ticket.device}
        </Badge>
      </div>

      <div className="p-5">
        <h2 className="text-base font-medium text-primary">{ticket.subject}</h2>

        <blockquote className="mt-4 flex gap-3 border-l-2 border-accent/40 pl-4">
          <MessageSquare className="mt-1 size-4 shrink-0 text-tertiary" aria-hidden />
          <p className="text-[0.9375rem] leading-7 text-secondary">
            &ldquo;{ticket.message}&rdquo;
          </p>
        </blockquote>

        {ticket.context.length > 0 ? (
          <ul className="mt-4 flex flex-wrap gap-1.5">
            {ticket.context.map((item) => (
              <li
                key={item}
                className="rounded-md border border-subtle bg-surface-inset px-2 py-0.5 text-xs text-tertiary"
              >
                {item}
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    </Surface>
  );
}
