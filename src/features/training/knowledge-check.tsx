"use client";

import { useState } from "react";
import { Check, CircleHelp, RotateCcw, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/cn";
import type { KnowledgeCheck as Check_ } from "@/lib/content/schema";

/**
 * Knowledge check.
 *
 * Two design decisions worth stating:
 *
 *   1. Explanations show for *every* option after answering, not just the one
 *      chosen. Understanding why the other three are wrong is most of the
 *      learning, and it is where Help Desk judgement actually lives.
 *
 *   2. A wrong answer is not punished or hidden. It can be retried, and nothing
 *      is scored. The purpose is comprehension, not assessment — the moment
 *      this feels like a test, people start optimising for the test.
 */
export function KnowledgeCheck({
  check,
  onAnswered,
  answered,
}: {
  check: Check_;
  onAnswered?: (correct: boolean) => void;
  answered?: { correct: boolean } | undefined;
}) {
  const [selected, setSelected] = useState<string[]>([]);
  const [submitted, setSubmitted] = useState(false);

  const multiple = check.kind === "multiple";
  const correctIds = check.options.filter((option) => option.correct).map((o) => o.id);

  const isCorrect =
    selected.length === correctIds.length &&
    selected.every((id) => correctIds.includes(id));

  const toggle = (id: string) => {
    if (submitted) return;
    setSelected((current) => {
      if (multiple) {
        return current.includes(id)
          ? current.filter((value) => value !== id)
          : [...current, id];
      }
      return [id];
    });
  };

  const submit = () => {
    if (selected.length === 0) return;
    setSubmitted(true);
    onAnswered?.(isCorrect);
  };

  const retry = () => {
    setSubmitted(false);
    setSelected([]);
  };

  return (
    <section
      aria-labelledby={`check-${check.id}`}
      className="rounded-xl border border-subtle bg-surface-raised p-5"
    >
      <div className="flex items-start gap-3">
        <CircleHelp className="mt-0.5 size-4 shrink-0 text-accent-text" aria-hidden />
        <div className="min-w-0 flex-1">
          <p className="eyebrow">Knowledge check</p>
          <h3 id={`check-${check.id}`} className="mt-2 text-base font-medium leading-6 text-primary">
            {check.prompt}
          </h3>
          {multiple ? (
            <p className="mt-1.5 text-sm text-tertiary">Select all that apply.</p>
          ) : null}
          {answered && !submitted ? (
            <p className="mt-1.5 text-sm text-tertiary">
              You answered this before —{" "}
              {answered.correct ? "correctly" : "incorrectly"}. Worth another look.
            </p>
          ) : null}
        </div>
      </div>

      <fieldset className="mt-5" disabled={submitted}>
        <legend className="sr-only">{check.prompt}</legend>
        <ul className="space-y-2">
          {check.options.map((option) => {
            const chosen = selected.includes(option.id);
            const reveal = submitted;
            const showCorrect = reveal && option.correct;
            const showWrong = reveal && chosen && !option.correct;

            return (
              <li key={option.id}>
                <label
                  className={cn(
                    "flex cursor-pointer items-start gap-3 rounded-lg border p-3.5 transition-colors",
                    !reveal && chosen && "border-accent/40 bg-accent-soft",
                    !reveal && !chosen && "border-default bg-surface-inset hover:border-strong",
                    showCorrect && "border-success/40 bg-success-soft",
                    showWrong && "border-danger/40 bg-danger-soft",
                    reveal && !showCorrect && !showWrong && "border-subtle opacity-60",
                    submitted && "cursor-default",
                  )}
                >
                  <input
                    type={multiple ? "checkbox" : "radio"}
                    name={`check-${check.id}`}
                    value={option.id}
                    checked={chosen}
                    onChange={() => toggle(option.id)}
                    className="sr-only"
                  />

                  <span
                    aria-hidden
                    className={cn(
                      "mt-0.5 flex size-4 shrink-0 items-center justify-center border",
                      multiple ? "rounded" : "rounded-full",
                      chosen || showCorrect
                        ? "border-transparent"
                        : "border-strong bg-transparent",
                      showCorrect && "bg-success",
                      showWrong && "bg-danger",
                      !reveal && chosen && "bg-accent",
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
                    {reveal && option.explanation ? (
                      <span
                        className={cn(
                          "mt-1.5 block text-sm leading-6",
                          option.correct ? "text-success" : "text-tertiary",
                        )}
                      >
                        {option.explanation}
                      </span>
                    ) : null}
                  </span>
                </label>
              </li>
            );
          })}
        </ul>
      </fieldset>

      <div className="mt-5 flex flex-wrap items-center gap-3">
        {!submitted ? (
          <Button size="sm" onClick={submit} disabled={selected.length === 0}>
            Check answer
          </Button>
        ) : (
          <>
            <p
              role="status"
              className={cn(
                "text-sm font-medium",
                isCorrect ? "text-success" : "text-warning",
              )}
            >
              {isCorrect ? "Correct." : "Not quite — read the explanations above."}
            </p>
            <Button size="sm" variant="ghost" onClick={retry}>
              <RotateCcw className="size-3.5" aria-hidden />
              Try again
            </Button>
          </>
        )}
      </div>
    </section>
  );
}
