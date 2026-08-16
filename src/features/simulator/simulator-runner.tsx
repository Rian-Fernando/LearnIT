"use client";

import { useMemo, useState } from "react";
import {
  Check,
  CircleAlert,
  Headphones,
  Info,
  Phone,
  RotateCcw,
  StickyNote,
  X,
} from "lucide-react";
import { Blocks, type LinkMap } from "@/components/content/blocks";
import { Button } from "@/components/ui/button";
import { Badge, ProgressBar, SectionHeading, Surface } from "@/components/ui/primitives";
import { cn } from "@/lib/cn";
import type { TicketSimulation } from "@/lib/content/schema";
import { band, gradeTicket, type TicketDraft } from "@/lib/simulation/grade";
import { useProgress } from "@/lib/progress/store";

/**
 * The call simulator.
 *
 * Three phases: read the call, write the ticket, read the feedback. The
 * transcript stays visible while writing, deliberately — this is not a memory
 * test, it is a "did you know what mattered" test, and hiding the call would
 * measure the wrong thing.
 */

type Phase = "call" | "writing" | "graded";

const EMPTY_DRAFT: TicketDraft = {
  title: "",
  category: "",
  assignee: "",
  description: "",
  notifyAssignees: true,
  notifyContact: true,
};

export function SimulatorRunner({
  simulation,
  links,
  basePath,
}: {
  simulation: TicketSimulation;
  links: LinkMap;
  basePath: string;
}) {
  const { recordScenario } = useProgress();
  const [phase, setPhase] = useState<Phase>("call");
  const [draft, setDraft] = useState<TicketDraft>({
    ...EMPTY_DRAFT,
    category: simulation.categoryOptions[0] ?? "",
    assignee: simulation.assigneeOptions[0] ?? "",
  });
  const [showModel, setShowModel] = useState(false);

  const result = useMemo(
    () => (phase === "graded" ? gradeTicket(simulation, draft) : null),
    [phase, simulation, draft],
  );

  const set = <K extends keyof TicketDraft>(key: K, value: TicketDraft[K]) =>
    setDraft((current) => ({ ...current, [key]: value }));

  const submit = () => {
    const graded = gradeTicket(simulation, draft);
    setPhase("graded");
    recordScenario(
      simulation.slug,
      graded.items.filter((i) => i.earned).length,
      graded.items.length,
    );
  };

  const restart = () => {
    setDraft({
      ...EMPTY_DRAFT,
      category: simulation.categoryOptions[0] ?? "",
      assignee: simulation.assigneeOptions[0] ?? "",
    });
    setPhase("call");
    setShowModel(false);
  };

  const canSubmit = draft.title.trim() !== "" && draft.description.trim() !== "";

  return (
    <div className="space-y-8">
      {/* ---------------------------------------------------------- brief */}
      {phase === "call" ? (
        <div className="flex gap-3 rounded-lg border border-accent/25 bg-accent-soft px-4 py-3.5">
          <Headphones className="mt-0.5 size-4 shrink-0 text-accent-text" aria-hidden />
          <p className="text-sm leading-6 text-secondary">{simulation.brief}</p>
        </div>
      ) : null}

      {/* ----------------------------------------------------- transcript */}
      <section aria-labelledby="transcript-heading">
        <SectionHeading
          className="mb-4"
          title="The call"
          description={
            phase === "call"
              ? "Read it through. Note what matters — and what is missing."
              : "Stays visible while you write. This is not a memory test."
          }
        />
        <h2 id="transcript-heading" className="sr-only">
          Call transcript
        </h2>

        <Surface className="divide-y divide-subtle">
          {simulation.transcript.map((line, index) => (
            <div key={index} className="flex gap-3 px-4 py-3">
              {line.speaker === "note" ? (
                <StickyNote className="mt-0.5 size-4 shrink-0 text-tertiary" aria-hidden />
              ) : line.speaker === "caller" ? (
                <Phone className="mt-0.5 size-4 shrink-0 text-signal" aria-hidden />
              ) : (
                <Headphones className="mt-0.5 size-4 shrink-0 text-accent-text" aria-hidden />
              )}
              <div className="min-w-0 flex-1">
                <p className="eyebrow mb-1">
                  {line.speaker === "note"
                    ? "What happens"
                    : line.speaker === "caller"
                      ? "Caller"
                      : "You"}
                </p>
                <p
                  className={cn(
                    "text-[0.9375rem] leading-6",
                    line.speaker === "note"
                      ? "italic text-tertiary"
                      : "text-secondary",
                  )}
                >
                  {line.text}
                </p>
              </div>
            </div>
          ))}
        </Surface>

        {phase === "call" ? (
          <Button className="mt-5" onClick={() => setPhase("writing")}>
            Write the ticket
          </Button>
        ) : null}
      </section>

      {/* --------------------------------------------------------- ticket */}
      {phase !== "call" ? (
        <section aria-labelledby="ticket-heading">
          <SectionHeading
            className="mb-4"
            title="Your ticket"
            description={
              phase === "graded"
                ? "What you submitted."
                : "Write it as you would in Footprints."
            }
          />
          <h2 id="ticket-heading" className="sr-only">
            Your ticket
          </h2>

          <Surface className="space-y-4 p-5">
            <Field label="Title" hint="Remember the format for this ticket type.">
              <input
                type="text"
                value={draft.title}
                onChange={(e) => set("title", e.target.value)}
                disabled={phase === "graded"}
                placeholder="Issue Title  USERNAME"
                className="h-10 w-full rounded-lg border border-default bg-surface-inset px-3 font-mono text-sm text-primary outline-none transition-colors placeholder:text-tertiary focus:border-strong disabled:opacity-70"
              />
            </Field>

            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Category">
                <select
                  value={draft.category}
                  onChange={(e) => set("category", e.target.value)}
                  disabled={phase === "graded"}
                  className="h-10 w-full rounded-lg border border-default bg-surface-inset px-3 text-sm text-primary outline-none focus:border-strong disabled:opacity-70"
                >
                  {simulation.categoryOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </Field>

              <Field label="Assignee">
                <select
                  value={draft.assignee}
                  onChange={(e) => set("assignee", e.target.value)}
                  disabled={phase === "graded"}
                  className="h-10 w-full rounded-lg border border-default bg-surface-inset px-3 text-sm text-primary outline-none focus:border-strong disabled:opacity-70"
                >
                  {simulation.assigneeOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </Field>
            </div>

            <Field
              label="Description"
              hint="What was reported, what you verified, what you tried, and where it stands."
            >
              <textarea
                value={draft.description}
                onChange={(e) => set("description", e.target.value)}
                disabled={phase === "graded"}
                rows={12}
                placeholder="User reported…"
                className="w-full resize-y rounded-lg border border-default bg-surface-inset px-3 py-2.5 font-mono text-[0.8125rem] leading-6 text-primary outline-none transition-colors placeholder:text-tertiary focus:border-strong disabled:opacity-70"
              />
            </Field>

            <fieldset disabled={phase === "graded"}>
              <legend className="text-xs text-secondary">Send email to</legend>
              <div className="mt-2 flex flex-wrap gap-4">
                <Toggle
                  label="Assignees"
                  checked={draft.notifyAssignees}
                  onChange={(v) => set("notifyAssignees", v)}
                />
                <Toggle
                  label="Contact"
                  checked={draft.notifyContact}
                  onChange={(v) => set("notifyContact", v)}
                />
              </div>
            </fieldset>

            {phase === "writing" ? (
              <div className="flex flex-wrap items-center gap-3 pt-1">
                <Button onClick={submit} disabled={!canSubmit}>
                  Submit ticket
                </Button>
                {!canSubmit ? (
                  <p className="text-sm text-tertiary">
                    A title and description are needed before submitting.
                  </p>
                ) : null}
              </div>
            ) : null}
          </Surface>
        </section>
      ) : null}

      {/* ------------------------------------------------------- feedback */}
      {phase === "graded" && result ? (
        <section aria-labelledby="feedback-heading" aria-live="polite">
          <SectionHeading className="mb-4" title="Feedback" />
          <h2 id="feedback-heading" className="sr-only">
            Feedback
          </h2>

          <Surface className="p-5">
            <div className="flex flex-wrap items-baseline gap-3">
              <p className="tabular text-3xl font-semibold tracking-tight text-primary">
                {result.percent}%
              </p>
              <Badge tone={band(result.percent).tone}>{band(result.percent).label}</Badge>
              <span className="tabular ml-auto text-xs text-tertiary">
                {result.items.filter((i) => i.earned).length} of {result.items.length} checks
              </span>
            </div>
            <ProgressBar
              value={result.earnedWeight}
              total={result.totalWeight}
              label="Ticket quality score"
              tone={result.percent >= 85 ? "success" : "accent"}
              className="mt-3"
            />
            <p className="mt-3 text-sm leading-6 text-secondary">
              {band(result.percent).note}
            </p>
          </Surface>

          {/* Honesty about what the grader can and cannot see. */}
          <div className="mt-4 flex gap-3 rounded-lg border border-subtle bg-surface-inset px-4 py-3.5">
            <Info className="mt-0.5 size-4 shrink-0 text-tertiary" aria-hidden />
            <p className="text-sm leading-6 text-tertiary">
              This score checks whether specific facts were captured and whether
              the format and routing are right. It cannot judge how well the
              description reads — compare yours against the model answer below for
              that.
            </p>
          </div>

          <ul className="mt-4 space-y-2">
            {result.items.map((graded) => (
              <li key={graded.item.id}>
                <div
                  className={cn(
                    "rounded-lg border p-4",
                    graded.earned
                      ? "border-success/25 bg-success-soft"
                      : "border-warning/30 bg-warning-soft",
                  )}
                >
                  <div className="flex gap-3">
                    <span
                      aria-hidden
                      className={cn(
                        "mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-full",
                        graded.earned ? "bg-success" : "bg-warning",
                      )}
                    >
                      {graded.earned ? (
                        <Check className="size-3 text-inverse" />
                      ) : (
                        <X className="size-3 text-inverse" />
                      )}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-primary">
                        {graded.item.label}
                      </p>
                      <p className="mt-1 text-sm leading-6 text-secondary">
                        {graded.feedback}
                      </p>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>

          {/* ------------------------------------------------ model answer */}
          <div className="mt-6">
            {showModel ? (
              <Surface className="p-5">
                <h3 className="text-sm font-medium text-primary">Model answer</h3>
                <p className="mt-1 text-sm text-tertiary">
                  One good version — not the only one. Compare the shape and the
                  detail rather than the wording.
                </p>

                <dl className="mt-4 space-y-2 text-sm">
                  <div className="flex gap-3">
                    <dt className="w-24 shrink-0 text-tertiary">Title</dt>
                    <dd className="font-mono text-primary">
                      {simulation.modelAnswer.title}
                    </dd>
                  </div>
                  <div className="flex gap-3">
                    <dt className="w-24 shrink-0 text-tertiary">Category</dt>
                    <dd className="text-primary">{simulation.modelAnswer.category}</dd>
                  </div>
                  <div className="flex gap-3">
                    <dt className="w-24 shrink-0 text-tertiary">Assignee</dt>
                    <dd className="text-primary">{simulation.modelAnswer.assignee}</dd>
                  </div>
                  <div className="flex gap-3">
                    <dt className="w-24 shrink-0 text-tertiary">Notify</dt>
                    <dd className="text-primary">
                      Assignees {simulation.modelAnswer.notifyAssignees ? "on" : "off"},
                      Contact {simulation.modelAnswer.notifyContact ? "on" : "off"}
                    </dd>
                  </div>
                </dl>

                <figure className="mt-4 overflow-hidden rounded-lg border border-subtle bg-surface-sunken">
                  <pre className="overflow-x-auto px-4 py-3.5">
                    <code className="whitespace-pre-wrap break-words font-mono text-[0.8125rem] leading-6 text-secondary">
                      {simulation.modelAnswer.description}
                    </code>
                  </pre>
                </figure>
              </Surface>
            ) : (
              <Button variant="secondary" onClick={() => setShowModel(true)}>
                Show the model answer
              </Button>
            )}
          </div>

          {/* ---------------------------------------------------- debrief */}
          <section className="mt-10 border-t border-subtle pt-8">
            <div className="mb-4 flex items-center gap-2">
              <CircleAlert className="size-4 text-accent-text" aria-hidden />
              <h3 className="text-lg font-semibold tracking-tight text-primary">
                Debrief
              </h3>
            </div>
            <Blocks blocks={simulation.debrief} links={links} />
          </section>

          <div className="mt-8 flex flex-wrap gap-2">
            <Button variant="secondary" onClick={restart}>
              <RotateCcw className="size-4" aria-hidden />
              Run it again
            </Button>
            <Button href={`${basePath}/practice`} variant="ghost">
              Other exercises
            </Button>
          </div>
        </section>
      ) : null}
    </div>
  );
}

/* -------------------------------------------------------------------------- */

function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="block text-xs text-secondary">{label}</span>
      {hint ? <span className="mt-0.5 block text-xs text-tertiary">{hint}</span> : null}
      <span className="mt-1.5 block">{children}</span>
    </label>
  );
}

function Toggle({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <label className="flex cursor-pointer items-center gap-2 text-sm text-primary">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="sr-only"
      />
      <span
        aria-hidden
        className={cn(
          "flex size-4 items-center justify-center rounded border",
          checked ? "border-transparent bg-accent" : "border-strong",
        )}
      >
        {checked ? <Check className="size-3 text-accent-contrast" /> : null}
      </span>
      {label}
    </label>
  );
}
