import "server-only";
import type { Viewer } from "@/lib/auth/types";
import type { Block } from "@/lib/content/schema";
import { CATEGORY_LABELS } from "@/lib/content/schema";
import {
  listArticles,
  listFlows,
  listModules,
  listResponses,
  listScenarios,
} from "@/lib/content/repository";

/**
 * Search document construction.
 *
 * The index is built per-viewer from the repository, so it inherits visibility
 * filtering for free — a guest's index physically cannot contain staff-only
 * content, rather than containing it and hiding it in the UI.
 *
 * Searching happens client-side (MiniSearch) because the corpus is small,
 * bounded, and entirely non-sensitive once filtered. That buys instant,
 * keystroke-latency results with no round trip, which is what makes this usable
 * while someone is on the phone.
 *
 * If the corpus outgrows client-side search — thousands of articles — the
 * replacement is a server-side query behind this same document shape. Nothing
 * in the UI would change.
 */

export type SearchKind = "article" | "module" | "flow" | "response" | "scenario";

export interface SearchDocument {
  id: string;
  kind: SearchKind;
  title: string;
  summary: string;
  /** Concatenated body text — weighted lowest at query time. */
  text: string;
  tags: string[];
  category: string;
  categoryLabel: string;
  /** Path relative to the current base (`/knowledge/...`). */
  path: string;
}

/** Flatten a block array into plain searchable text. */
export function blocksToText(blocks: Block[]): string {
  const parts: string[] = [];

  for (const block of blocks) {
    switch (block.type) {
      case "paragraph":
      case "heading":
        parts.push(block.text);
        break;
      case "list":
        parts.push(...block.items);
        break;
      case "steps":
        for (const item of block.items) {
          parts.push(item.title);
          if (item.detail) parts.push(item.detail);
        }
        break;
      case "callout":
        if (block.title) parts.push(block.title);
        parts.push(block.text);
        break;
      case "fields":
        for (const item of block.items) parts.push(item.label, item.value);
        break;
      case "code":
        if (block.caption) parts.push(block.caption);
        break;
      case "image":
        parts.push(block.alt);
        if (block.caption) parts.push(block.caption);
        break;
      // Reference blocks contribute no text of their own — the referenced
      // record is indexed separately.
      case "link":
      case "articleRef":
      case "responseRef":
      case "divider":
        break;
    }
  }

  // Strip the inline markup subset so `**bold**` does not pollute the index.
  return parts
    .join(" ")
    .replace(/\*\*/g, "")
    .replace(/`/g, "")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1");
}

export async function buildSearchDocuments(viewer: Viewer): Promise<SearchDocument[]> {
  const [articles, modules, flows, responses, scenarios] = await Promise.all([
    listArticles(viewer),
    listModules(viewer),
    listFlows(viewer),
    listResponses(viewer),
    listScenarios(viewer),
  ]);

  const documents: SearchDocument[] = [];

  for (const article of articles) {
    documents.push({
      id: `article:${article.slug}`,
      kind: "article",
      title: article.title,
      summary: article.summary,
      text: blocksToText(article.body),
      tags: article.tags,
      category: article.category,
      categoryLabel: CATEGORY_LABELS[article.category],
      path: `/knowledge/${article.slug}`,
    });
  }

  for (const trainingModule of modules) {
    documents.push({
      id: `module:${trainingModule.slug}`,
      kind: "module",
      title: trainingModule.title,
      summary: trainingModule.summary,
      text: [
        ...trainingModule.outcomes,
        ...trainingModule.steps.map((step) => `${step.title} ${blocksToText(step.body)}`),
      ].join(" "),
      tags: [],
      category: trainingModule.category,
      categoryLabel: CATEGORY_LABELS[trainingModule.category],
      path: `/training/${trainingModule.slug}`,
    });
  }

  for (const flow of flows) {
    documents.push({
      id: `flow:${flow.slug}`,
      kind: "flow",
      title: flow.title,
      summary: flow.summary,
      text: flow.nodes
        .map((node) =>
          node.kind === "question"
            ? `${node.question} ${node.options.map((o) => o.label).join(" ")}`
            : `${node.title} ${blocksToText(node.body)}`,
        )
        .join(" "),
      tags: [flow.entryLabel],
      category: flow.category,
      categoryLabel: CATEGORY_LABELS[flow.category],
      path: `/troubleshoot/${flow.slug}`,
    });
  }

  for (const response of responses) {
    documents.push({
      id: `response:${response.slug}`,
      kind: "response",
      title: response.title,
      summary: response.summary,
      // The template itself is highly searchable — technicians remember a
      // phrase from a message far more often than they remember its title.
      text: `${response.template} ${response.usage ?? ""}`,
      tags: response.tags,
      category: response.category,
      categoryLabel: CATEGORY_LABELS[response.category],
      path: `/responses?open=${response.slug}`,
    });
  }

  for (const scenario of scenarios) {
    documents.push({
      id: `scenario:${scenario.slug}`,
      kind: "scenario",
      title: scenario.title,
      summary: scenario.summary,
      text: `${scenario.ticket.subject} ${scenario.ticket.message}`,
      tags: [scenario.difficulty],
      category: scenario.category,
      categoryLabel: CATEGORY_LABELS[scenario.category],
      path: `/practice/${scenario.slug}`,
    });
  }

  return documents;
}
