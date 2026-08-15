/**
 * Content validation.
 *
 * TypeScript proves the *shape* of the content set. This script proves the
 * things types cannot:
 *
 *   • every record parses against its Zod schema
 *   • slugs are unique within each collection
 *   • every cross-reference resolves (articleRef, responseRef, linkKey,
 *     related, prerequisites, flow outcome references)
 *   • every troubleshooting graph has a valid start node, no dangling `next`,
 *     and no unreachable nodes — a broken tree must never reach a technician
 *   • knowledge checks and scenario stages have at least one correct answer
 *   • public content never references staff-only content, which would produce
 *     a broken link (or an information leak) in the demo build
 *
 * Run with `npm run content:validate`. Wire it into CI before deploy.
 */

import {
  announcements,
  articles,
  flows,
  links,
  modules,
  responses,
  scenarios,
} from "../src/content";
import {
  AnnouncementSchema,
  ArticleSchema,
  ImportantLinkSchema,
  QuickResponseSchema,
  ScenarioSchema,
  TrainingModuleSchema,
  TroubleshootingFlowSchema,
  type Block,
} from "../src/lib/content/schema";
import { z } from "zod";

const problems: string[] = [];
const warnings: string[] = [];

const fail = (msg: string) => problems.push(msg);
const warn = (msg: string) => warnings.push(msg);

/* -------------------------------------------------------------------------- */
/* Schema validation                                                          */
/* -------------------------------------------------------------------------- */

function parseAll<T>(label: string, schema: z.ZodType<T>, records: unknown[]): void {
  records.forEach((record, index) => {
    const result = schema.safeParse(record);
    if (!result.success) {
      const ref = record as { slug?: string; key?: string; id?: string };
      const id = ref?.slug ?? ref?.key ?? ref?.id ?? `#${index}`;
      for (const issue of result.error.issues) {
        fail(`${label} "${id}" → ${issue.path.join(".") || "(root)"}: ${issue.message}`);
      }
    }
  });
}

/* -------------------------------------------------------------------------- */
/* Uniqueness                                                                 */
/* -------------------------------------------------------------------------- */

function assertUnique(label: string, ids: string[]): void {
  const seen = new Set<string>();
  for (const id of ids) {
    if (seen.has(id)) fail(`${label}: duplicate identifier "${id}"`);
    seen.add(id);
  }
}

/* -------------------------------------------------------------------------- */
/* Reference integrity                                                        */
/* -------------------------------------------------------------------------- */

const articleSlugs = new Set(articles.map((a) => a.slug));
const responseSlugs = new Set(responses.map((r) => r.slug));
const linkKeys = new Set(links.map((l) => l.key));
const moduleSlugs = new Set(modules.map((m) => m.slug));

const articleVisibility = new Map(articles.map((a) => [a.slug, a.visibility]));
const responseVisibility = new Map(responses.map((r) => [r.slug, r.visibility]));
const linkVisibility = new Map(links.map((l) => [l.key, l.visibility]));

/** Walk a block array and check every reference it contains. */
function checkBlocks(where: string, ownerVisibility: string, blocks: Block[]): void {
  for (const block of blocks) {
    switch (block.type) {
      case "articleRef":
        if (!articleSlugs.has(block.slug)) {
          fail(`${where}: articleRef → unknown article "${block.slug}"`);
        } else if (
          ownerVisibility === "public" &&
          articleVisibility.get(block.slug) === "staff"
        ) {
          fail(
            `${where}: public content references staff-only article "${block.slug}" — this link breaks in the demo build`,
          );
        }
        break;
      case "responseRef":
        if (!responseSlugs.has(block.slug)) {
          fail(`${where}: responseRef → unknown response "${block.slug}"`);
        } else if (
          ownerVisibility === "public" &&
          responseVisibility.get(block.slug) === "staff"
        ) {
          fail(`${where}: public content references staff-only response "${block.slug}"`);
        }
        break;
      case "link":
        if (!linkKeys.has(block.linkKey)) {
          fail(`${where}: link → unknown link key "${block.linkKey}"`);
        } else if (
          ownerVisibility === "public" &&
          linkVisibility.get(block.linkKey) === "staff"
        ) {
          fail(`${where}: public content references staff-only link "${block.linkKey}"`);
        }
        break;
      case "image":
        if (!block.alt.trim()) fail(`${where}: image block has empty alt text`);
        break;
      default:
        break;
    }
  }
}

/* -------------------------------------------------------------------------- */
/* Flow graph validation                                                      */
/* -------------------------------------------------------------------------- */

function checkFlow(flow: (typeof flows)[number]): void {
  const where = `flow "${flow.slug}"`;
  const nodeIds = new Set(flow.nodes.map((n) => n.id));

  assertUnique(
    `${where} nodes`,
    flow.nodes.map((n) => n.id),
  );

  if (!nodeIds.has(flow.startNodeId)) {
    fail(`${where}: startNodeId "${flow.startNodeId}" does not exist`);
    return;
  }

  // Dangling edges.
  for (const node of flow.nodes) {
    if (node.kind !== "question") continue;
    for (const option of node.options) {
      if (!nodeIds.has(option.next)) {
        fail(`${where}: node "${node.id}" option "${option.id}" → unknown node "${option.next}"`);
      }
    }
  }

  // Reachability from the start node.
  const reached = new Set<string>();
  const queue = [flow.startNodeId];
  while (queue.length) {
    const id = queue.shift()!;
    if (reached.has(id)) continue;
    reached.add(id);
    const node = flow.nodes.find((n) => n.id === id);
    if (node?.kind === "question") {
      for (const option of node.options) {
        if (nodeIds.has(option.next)) queue.push(option.next);
      }
    }
  }
  for (const node of flow.nodes) {
    if (!reached.has(node.id)) {
      fail(`${where}: node "${node.id}" is unreachable from the start node`);
    }
  }

  // Every path must be able to terminate.
  const hasOutcome = flow.nodes.some((n) => n.kind === "outcome");
  if (!hasOutcome) fail(`${where}: contains no outcome nodes`);

  // Outcome references.
  for (const node of flow.nodes) {
    if (node.kind !== "outcome") continue;
    checkBlocks(`${where} outcome "${node.id}"`, flow.visibility, node.body);
    for (const slug of node.articleSlugs) {
      if (!articleSlugs.has(slug)) {
        fail(`${where} outcome "${node.id}": unknown article "${slug}"`);
      }
    }
    for (const slug of node.responseSlugs) {
      if (!responseSlugs.has(slug)) {
        fail(`${where} outcome "${node.id}": unknown response "${slug}"`);
      }
    }
  }
}

/* -------------------------------------------------------------------------- */
/* Run                                                                        */
/* -------------------------------------------------------------------------- */

parseAll("article", ArticleSchema, articles);
parseAll("module", TrainingModuleSchema, modules);
parseAll("flow", TroubleshootingFlowSchema, flows);
parseAll("response", QuickResponseSchema, responses);
parseAll("scenario", ScenarioSchema, scenarios);
parseAll("link", ImportantLinkSchema, links);
parseAll("announcement", AnnouncementSchema, announcements);

assertUnique("articles", articles.map((a) => a.slug));
assertUnique("modules", modules.map((m) => m.slug));
assertUnique("flows", flows.map((f) => f.slug));
assertUnique("responses", responses.map((r) => r.slug));
assertUnique("scenarios", scenarios.map((s) => s.slug));
assertUnique("links", links.map((l) => l.key));
assertUnique("announcements", announcements.map((a) => a.id));

for (const article of articles) {
  const where = `article "${article.slug}"`;
  checkBlocks(where, article.visibility, article.body);
  for (const slug of article.related) {
    if (!articleSlugs.has(slug)) fail(`${where}: related → unknown article "${slug}"`);
    else if (article.visibility === "public" && articleVisibility.get(slug) === "staff") {
      warn(`${where}: related article "${slug}" is staff-only and will be hidden in the demo build`);
    }
  }
}

for (const trainingModule of modules) {
  const where = `module "${trainingModule.slug}"`;
  for (const slug of trainingModule.prerequisites) {
    if (!moduleSlugs.has(slug)) fail(`${where}: prerequisite → unknown trainingModule "${slug}"`);
  }
  assertUnique(`${where} steps`, trainingModule.steps.map((s) => s.id));
  for (const step of trainingModule.steps) {
    checkBlocks(`${where} step "${step.id}"`, trainingModule.visibility, step.body);
    if (step.check) {
      const correct = step.check.options.filter((o) => o.correct);
      if (correct.length === 0) {
        fail(`${where} check "${step.check.id}": no correct option`);
      }
      if (step.check.kind === "single" && correct.length > 1) {
        fail(
          `${where} check "${step.check.id}": kind is "single" but ${correct.length} options are correct`,
        );
      }
      for (const option of step.check.options) {
        if (!option.explanation) {
          warn(
            `${where} check "${step.check.id}" option "${option.id}": no explanation — the learner gets no reason why`,
          );
        }
      }
      assertUnique(`${where} check "${step.check.id}" options`, step.check.options.map((o) => o.id));
    }
  }
}

for (const flow of flows) checkFlow(flow);

for (const scenario of scenarios) {
  const where = `scenario "${scenario.slug}"`;
  checkBlocks(where, scenario.visibility, scenario.debrief);
  for (const slug of scenario.articleSlugs) {
    if (!articleSlugs.has(slug)) fail(`${where}: unknown article "${slug}"`);
  }
  assertUnique(`${where} stages`, scenario.stages.map((s) => s.id));
  for (const stage of scenario.stages) {
    const correct = stage.options.filter((o) => o.correct);
    if (correct.length === 0) fail(`${where} stage "${stage.id}": no correct option`);
    if (stage.kind === "single" && correct.length > 1) {
      fail(
        `${where} stage "${stage.id}": kind is "single" but ${correct.length} options are correct`,
      );
    }
    assertUnique(`${where} stage "${stage.id}" options`, stage.options.map((o) => o.id));
  }
}

// Placeholder tokens used in a template should be declared, or at least be one
// of the globally-supplied ones the UI fills in automatically.
const GLOBAL_PLACEHOLDERS = new Set(["name", "tech_name"]);
for (const response of responses) {
  const declared = new Set(response.placeholders.map((p) => p.key));
  const used = new Set(
    [...response.template.matchAll(/\{\{\s*([a-z][a-z0-9_]*)\s*\}\}/g)].map((m) => m[1]!),
  );
  for (const key of used) {
    if (!declared.has(key) && !GLOBAL_PLACEHOLDERS.has(key)) {
      warn(
        `response "${response.slug}": template uses {{${key}}} which is not declared — the UI will infer a label for it`,
      );
    }
  }
  for (const key of declared) {
    if (!used.has(key)) {
      warn(`response "${response.slug}": declares placeholder "${key}" that the template never uses`);
    }
  }
}

/* -------------------------------------------------------------------------- */
/* Report                                                                     */
/* -------------------------------------------------------------------------- */

const counts = [
  ["articles", articles.length],
  ["modules", modules.length],
  ["flows", flows.length],
  ["responses", responses.length],
  ["scenarios", scenarios.length],
  ["links", links.length],
  ["announcements", announcements.length],
] as const;

console.log("learnIT content validation\n");
console.log(counts.map(([label, n]) => `  ${String(n).padStart(3)} ${label}`).join("\n"));
console.log("");

if (warnings.length) {
  console.log(`${warnings.length} warning(s):`);
  for (const w of warnings) console.log(`  ! ${w}`);
  console.log("");
}

if (problems.length) {
  console.error(`${problems.length} error(s):`);
  for (const p of problems) console.error(`  ✗ ${p}`);
  process.exit(1);
}

console.log("✓ content is valid");
