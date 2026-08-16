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
  backlog,
  checklists,
  flows,
  links,
  modules,
  principles,
  responses,
  scenarios,
  simulations,
  taxonomies,
  tickets,
} from "../src/content";
import {
  AnnouncementSchema,
  ArticleSchema,
  BacklogItemSchema,
  ChecklistSchema,
  PrincipleSchema,
  ReferenceTicketSchema,
  TaxonomySchema,
  TicketSimulationSchema,
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
let placeholderCount = 0;

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
const checklistSlugs = new Set(checklists.map((c) => c.slug));
const ticketSlugs = new Set(tickets.map((t) => t.slug));
const principleIds = new Set(principles.map((p) => p.id));
const backlogIds = new Set(backlog.map((b) => b.id));
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
      case "checklistRef":
        if (!checklistSlugs.has(block.slug)) {
          fail(`${where}: checklistRef → unknown checklist "${block.slug}"`);
        }
        break;
      case "ticketRef":
        if (!ticketSlugs.has(block.slug)) {
          fail(`${where}: ticketRef → unknown reference ticket "${block.slug}"`);
        }
        break;
      case "principle":
        if (!principleIds.has(block.id)) {
          fail(`${where}: principle → unknown principle "${block.id}"`);
        }
        break;
      case "placeholder":
        // A placeholder with nothing listed cannot be acted on, and quietly
        // becomes permanent.
        if (block.needs.length === 0) {
          warn(`${where}: placeholder "${block.label}" lists nothing that is needed`);
        }
        placeholderCount += 1;
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
parseAll("checklist", ChecklistSchema, checklists);
parseAll("reference ticket", ReferenceTicketSchema, tickets);
parseAll("simulation", TicketSimulationSchema, simulations);
parseAll("taxonomy", TaxonomySchema, taxonomies);
parseAll("backlog item", BacklogItemSchema, backlog);
parseAll("principle", PrincipleSchema, principles);
parseAll("module", TrainingModuleSchema, modules);
parseAll("flow", TroubleshootingFlowSchema, flows);
parseAll("response", QuickResponseSchema, responses);
parseAll("scenario", ScenarioSchema, scenarios);
parseAll("link", ImportantLinkSchema, links);
parseAll("announcement", AnnouncementSchema, announcements);

assertUnique("articles", articles.map((a) => a.slug));
assertUnique("checklists", checklists.map((c) => c.slug));
assertUnique("reference tickets", tickets.map((t) => t.slug));
assertUnique("simulations", simulations.map((s) => s.slug));
assertUnique("taxonomies", taxonomies.map((t) => t.key));
assertUnique("backlog", backlog.map((b) => b.id));
assertUnique("principles", principles.map((p) => p.id));
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

for (const checklist of checklists) {
  const where = `checklist "${checklist.slug}"`;
  assertUnique(
    `${where} items`,
    checklist.groups.flatMap((group) => group.items.map((item) => item.id)),
  );
}

for (const simulation of simulations) {
  const where = `simulation "${simulation.slug}"`;
  checkBlocks(where, simulation.visibility, simulation.debrief);
  assertUnique(`${where} rubric`, simulation.rubric.map((r) => r.id));

  for (const item of simulation.rubric) {
    // A rubric item with neither a pattern nor keywords can never be earned,
    // which silently caps the achievable score.
    if (!item.pattern && item.anyOf.length === 0 && item.target !== "notifications") {
      fail(`${where} rubric "${item.id}": has no pattern and no keywords, so it can never pass`);
    }
    if (item.pattern) {
      try {
        new RegExp(item.pattern);
      } catch {
        fail(`${where} rubric "${item.id}": invalid regular expression`);
      }
    }
    if (item.target === "notifications" && !item.expectNotification) {
      fail(`${where} rubric "${item.id}": targets notifications but declares no expected state`);
    }
  }

  // The model answer must itself score full marks — otherwise the exercise
  // teaches one thing and rewards another.
  const model = {
    title: simulation.modelAnswer.title,
    category: simulation.modelAnswer.category,
    assignee: simulation.modelAnswer.assignee,
    description: simulation.modelAnswer.description,
    notifyAssignees: simulation.modelAnswer.notifyAssignees,
    notifyContact: simulation.modelAnswer.notifyContact,
  };
  for (const item of simulation.rubric) {
    let ok = false;
    if (item.target === "notifications") {
      ok =
        !!item.expectNotification &&
        model.notifyAssignees === item.expectNotification.assignees &&
        model.notifyContact === item.expectNotification.contact;
    } else {
      const value =
        item.target === "title"
          ? model.title
          : item.target === "category"
            ? model.category
            : item.target === "assignee"
              ? model.assignee
              : model.description;
      ok = item.pattern
        ? new RegExp(item.pattern, "i").test(value)
        : item.anyOf.some((n) => value.toLowerCase().includes(n.toLowerCase()));
    }
    if (!ok) {
      fail(`${where}: the model answer fails its own rubric item "${item.id}"`);
    }
  }

  // Every option the form offers must be selectable, and the expected answer
  // must be among them.
  if (!simulation.categoryOptions.includes(simulation.modelAnswer.category)) {
    fail(`${where}: model category "${simulation.modelAnswer.category}" is not in categoryOptions`);
  }
  if (!simulation.assigneeOptions.includes(simulation.modelAnswer.assignee)) {
    fail(`${where}: model assignee "${simulation.modelAnswer.assignee}" is not in assigneeOptions`);
  }
}

for (const ticket of tickets) {
  const where = `reference ticket "${ticket.slug}"`;
  for (const slug of ticket.articleSlugs) {
    if (!articleSlugs.has(slug)) fail(`${where}: unknown article "${slug}"`);
  }
  // A worked example whose title does not follow the documented format would
  // teach the wrong thing more effectively than any prose.
  if (!/ {2}[A-Z0-9]+$/.test(ticket.fields.title)) {
    warn(
      `${where}: title "${ticket.fields.title}" does not end with two spaces and an uppercase username`,
    );
  }
}

// Every backlog item should be reachable from the content it blocks, and every
// referenced slug should exist — otherwise the backlog drifts out of step with
// the placeholders it is meant to track.
const allSlugs = new Set([
  ...articleSlugs,
  ...moduleSlugs,
  ...flows.map((f) => f.slug),
  ...responses.map((r) => r.slug),
  ...scenarios.map((s) => s.slug),
  ...checklistSlugs,
  ...ticketSlugs,
  ...links.map((l) => l.key),
  ...taxonomies.map((t) => t.key),
]);
for (const item of backlog) {
  for (const slug of item.affects) {
    if (!allSlugs.has(slug)) {
      warn(`backlog "${item.id}": affects "${slug}" which does not exist yet`);
    }
  }
}
void backlogIds;

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
  ["checklists", checklists.length],
  ["reference tickets", tickets.length],
  ["simulations", simulations.length],
  ["principles", principles.length],
  ["taxonomies", taxonomies.length],
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
console.log(
  `  ${String(placeholderCount).padStart(3)} placeholders across the content set`,
);
console.log(`  ${String(backlog.length).padStart(3)} tracked backlog items`);
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
