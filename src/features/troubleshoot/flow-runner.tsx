"use client";

import Link from "next/link";
import { useCallback, useMemo, useState } from "react";
import {
  ArrowRight,
  BookOpen,
  CircleAlert,
  CircleCheck,
  CornerDownRight,
  MessageSquareQuote,
  RotateCcw,
  ShieldAlert,
  Undo2,
} from "lucide-react";
import { Blocks, type LinkMap } from "@/components/content/blocks";
import { Button } from "@/components/ui/button";
import { Surface } from "@/components/ui/primitives";
import { cn } from "@/lib/cn";
import type { FlowNode, TroubleshootingFlow } from "@/lib/content/schema";

/**
 * Decision-tree runner.
 *
 * Entirely data-driven — this component knows nothing about printers, VPNs, or
 * accounts. It walks whatever graph the content set provides, which is what
 * lets an administrator publish a new workflow without a developer.
 *
 * The answered path stays visible above the current question. On a live call
 * that matters: a technician needs to see what they have already established,
 * and to step back one answer without restarting.
 */

interface Answer {
  nodeId: string;
  question: string;
  optionId: string;
  optionLabel: string;
}

const OUTCOME_TONES = {
  resolved: {
    icon: CircleCheck,
    wrap: "border-success/25 bg-success-soft",
    accent: "text-success",
    label: "Resolution",
  },
  escalate: {
    icon: CircleAlert,
    wrap: "border-warning/30 bg-warning-soft",
    accent: "text-warning",
    label: "Escalate",
  },
  "out-of-scope": {
    icon: ShieldAlert,
    wrap: "border-danger/30 bg-danger-soft",
    accent: "text-danger",
    label: "Out of scope",
  },
} as const;

export function FlowRunner({
  flow,
  links,
  basePath,
  articleTitles,
  responseTitles,
}: {
  flow: TroubleshootingFlow;
  links: LinkMap;
  basePath: string;
  articleTitles: Record<string, string>;
  responseTitles: Record<string, string>;
}) {
  const nodes = useMemo(() => {
    const map = new Map<string, FlowNode>();
    for (const node of flow.nodes) map.set(node.id, node);
    return map;
  }, [flow.nodes]);

  const [currentId, setCurrentId] = useState(flow.startNodeId);
  const [answers, setAnswers] = useState<Answer[]>([]);

  const current = nodes.get(currentId);

  const choose = useCallback(
    (node: Extract<FlowNode, { kind: "question" }>, optionId: string) => {
      const option = node.options.find((candidate) => candidate.id === optionId);
      if (!option) return;
      setAnswers((previous) => [
        ...previous,
        {
          nodeId: node.id,
          question: node.question,
          optionId: option.id,
          optionLabel: option.label,
        },
      ]);
      setCurrentId(option.next);
    },
    [],
  );

  const back = useCallback(() => {
    setAnswers((previous) => {
      const next = previous.slice(0, -1);
      const last = previous[previous.length - 1];
      if (last) setCurrentId(last.nodeId);
      return next;
    });
  }, []);

  const restart = useCallback(() => {
    setAnswers([]);
    setCurrentId(flow.startNodeId);
  }, [flow.startNodeId]);

  // A malformed graph is caught by `npm run content:validate` before deploy,
  // but never dead-end a technician mid-call if one slips through.
  if (!current) {
    return (
      <Surface className="p-5">
        <p className="text-sm text-primary">This workflow could not be loaded.</p>
        <Button size="sm" variant="secondary" onClick={restart} className="mt-4">
          Start over
        </Button>
      </Surface>
    );
  }

  return (
    <div>
      {/* ------------------------------------------------------ answered path */}
      {answers.length > 0 ? (
        <ol className="mb-6 space-y-1.5" aria-label="Answers so far">
          {answers.map((answer, index) => (
            <li
              key={`${answer.nodeId}-${index}`}
              className="flex items-start gap-2.5 text-sm"
            >
              <CornerDownRight
                className="mt-1 size-3.5 shrink-0 text-tertiary"
                aria-hidden
              />
              <span className="min-w-0 flex-1">
                <span className="text-tertiary">{answer.question}</span>{" "}
                <span className="font-medium text-primary">{answer.optionLabel}</span>
              </span>
            </li>
          ))}
        </ol>
      ) : null}

      {/* ------------------------------------------------------------- node */}
      {current.kind === "question" ? (
        <QuestionCard node={current} onChoose={choose} />
      ) : (
        <OutcomeCard
          node={current}
          links={links}
          basePath={basePath}
          articleTitles={articleTitles}
          responseTitles={responseTitles}
        />
      )}

      {/* ------------------------------------------------------------ controls */}
      {answers.length > 0 ? (
        <div className="mt-6 flex flex-wrap gap-2 border-t border-subtle pt-5">
          <Button size="sm" variant="ghost" onClick={back}>
            <Undo2 className="size-3.5" aria-hidden />
            Back one answer
          </Button>
          <Button size="sm" variant="ghost" onClick={restart}>
            <RotateCcw className="size-3.5" aria-hidden />
            Start over
          </Button>
        </div>
      ) : null}
    </div>
  );
}

/* -------------------------------------------------------------------------- */

function QuestionCard({
  node,
  onChoose,
}: {
  node: Extract<FlowNode, { kind: "question" }>;
  onChoose: (node: Extract<FlowNode, { kind: "question" }>, optionId: string) => void;
}) {
  return (
    <section aria-live="polite">
      <h2 className="text-xl font-semibold tracking-tight text-primary">
        {node.question}
      </h2>
      {node.help ? (
        <p className="mt-2 text-sm leading-6 text-secondary">{node.help}</p>
      ) : null}

      <ul className="mt-6 space-y-2.5">
        {node.options.map((option) => (
          <li key={option.id}>
            <button
              type="button"
              onClick={() => onChoose(node, option.id)}
              className={cn(
                "group flex w-full items-start gap-3 rounded-xl border border-subtle bg-surface-raised p-4 text-left transition-colors",
                "hover:border-accent/30 hover:bg-surface-overlay",
              )}
            >
              <span className="min-w-0 flex-1">
                <span className="block text-[0.9375rem] font-medium leading-6 text-primary">
                  {option.label}
                </span>
                {option.hint ? (
                  <span className="mt-0.5 block text-sm leading-6 text-tertiary">
                    {option.hint}
                  </span>
                ) : null}
              </span>
              <ArrowRight
                className="mt-1 size-4 shrink-0 text-tertiary transition-transform group-hover:translate-x-0.5 group-hover:text-accent-text"
                aria-hidden
              />
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}

function OutcomeCard({
  node,
  links,
  basePath,
  articleTitles,
  responseTitles,
}: {
  node: Extract<FlowNode, { kind: "outcome" }>;
  links: LinkMap;
  basePath: string;
  articleTitles: Record<string, string>;
  responseTitles: Record<string, string>;
}) {
  const tone = OUTCOME_TONES[node.tone];
  const Icon = tone.icon;

  const articles = node.articleSlugs.filter((slug) => articleTitles[slug]);
  const responses = node.responseSlugs.filter((slug) => responseTitles[slug]);

  return (
    <section aria-live="polite">
      <div className={cn("rounded-xl border p-5", tone.wrap)}>
        <div className="flex items-start gap-3">
          <Icon className={cn("mt-0.5 size-5 shrink-0", tone.accent)} aria-hidden />
          <div className="min-w-0 flex-1">
            <p className={cn("eyebrow", tone.accent)}>{tone.label}</p>
            <h2 className="mt-2 text-xl font-semibold tracking-tight text-primary">
              {node.title}
            </h2>
          </div>
        </div>
      </div>

      <div className="mt-6">
        <Blocks blocks={node.body} links={links} />
      </div>

      {articles.length > 0 || responses.length > 0 ? (
        <div className="mt-8 grid gap-3 sm:grid-cols-2">
          {articles.map((slug) => (
            <Link
              key={slug}
              href={`${basePath}/knowledge/${slug}`}
              className="group flex items-start gap-3 rounded-lg border border-subtle bg-surface-raised px-4 py-3.5 transition-colors hover:border-default hover:bg-surface-overlay"
            >
              <BookOpen className="mt-0.5 size-4 shrink-0 text-signal" aria-hidden />
              <span className="min-w-0 flex-1">
                <span className="block text-sm font-medium leading-6 text-primary">
                  {articleTitles[slug]}
                </span>
                <span className="text-xs text-tertiary">Full procedure</span>
              </span>
              <ArrowRight
                className="mt-1 size-3.5 shrink-0 text-tertiary transition-transform group-hover:translate-x-0.5"
                aria-hidden
              />
            </Link>
          ))}

          {responses.map((slug) => (
            <Link
              key={slug}
              href={`${basePath}/responses?open=${slug}`}
              className="group flex items-start gap-3 rounded-lg border border-subtle bg-surface-raised px-4 py-3.5 transition-colors hover:border-default hover:bg-surface-overlay"
            >
              <MessageSquareQuote
                className="mt-0.5 size-4 shrink-0 text-warning"
                aria-hidden
              />
              <span className="min-w-0 flex-1">
                <span className="block text-sm font-medium leading-6 text-primary">
                  {responseTitles[slug]}
                </span>
                <span className="text-xs text-tertiary">Copy-ready response</span>
              </span>
              <ArrowRight
                className="mt-1 size-3.5 shrink-0 text-tertiary transition-transform group-hover:translate-x-0.5"
                aria-hidden
              />
            </Link>
          ))}
        </div>
      ) : null}
    </section>
  );
}
