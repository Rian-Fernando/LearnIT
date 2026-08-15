import "server-only";
import type { Viewer } from "@/lib/auth/types";
import { getReportStore } from "@/lib/feedback/store";
import {
  listArticles,
  listFlows,
  listLinks,
  listModules,
  listResponses,
  listScenarios,
} from "@/lib/content/repository";

/**
 * Content health analytics.
 *
 * Deliberately narrow. The brief for learnIT's analytics is "what are new
 * technicians struggling with, and what documentation needs attention" — not a
 * dashboard of numbers that exist because they were easy to count.
 *
 * Everything here is *derived* from content and the report queue, so it is real
 * on day one with no tracking pixel, no event pipeline, and nothing recorded
 * about individuals. Behavioural metrics (most-searched terms, most-opened
 * articles) need an event store; the shape for that is designed in
 * docs/analytics.md and deliberately not built yet.
 */

export interface ContentHealth {
  totals: {
    articles: number;
    modules: number;
    flows: number;
    responses: number;
    scenarios: number;
    links: number;
  };
  /** Published, draft, archived across every content type. */
  byStatus: { published: number; draft: number; archived: number };
  byVisibility: { public: number; staff: number };
  /** Articles not reviewed in a long time, oldest first. */
  stale: { slug: string; title: string; updatedAt: string; days: number }[];
  /** Links an administrator has not configured yet. */
  unconfiguredLinks: { key: string; label: string }[];
  /** Coverage gaps worth acting on. */
  gaps: string[];
  reports: {
    open: number;
    reviewing: number;
    total: number;
    /** Resources flagged more than once — the strongest documentation signal. */
    repeatedlyFlagged: { slug: string; count: number }[];
    durable: boolean;
  };
  /** Onboarding shape — how much material a new technician faces. */
  onboarding: { totalSteps: number; totalMinutes: number; checks: number };
}

/** Articles older than this are surfaced for review. */
const STALE_AFTER_DAYS = 120;

export async function getContentHealth(viewer: Viewer): Promise<ContentHealth> {
  const [articles, modules, flows, responses, scenarios, links, reports] =
    await Promise.all([
      listArticles(viewer),
      listModules(viewer),
      listFlows(viewer),
      listResponses(viewer),
      listScenarios(viewer),
      listLinks(viewer),
      getReportStore().list(),
    ]);

  const everything = [...articles, ...modules, ...flows, ...responses, ...scenarios];

  const byStatus = { published: 0, draft: 0, archived: 0 };
  const byVisibility = { public: 0, staff: 0 };
  for (const record of everything) {
    byStatus[record.status] += 1;
    byVisibility[record.visibility] += 1;
  }

  const today = Date.now();
  const stale = articles
    .map((article) => ({
      slug: article.slug,
      title: article.title,
      updatedAt: article.updatedAt,
      days: Math.floor(
        (today - new Date(`${article.updatedAt}T00:00:00Z`).getTime()) / 86_400_000,
      ),
    }))
    .filter((entry) => entry.days >= STALE_AFTER_DAYS)
    .sort((a, b) => b.days - a.days);

  const unconfiguredLinks = links
    .filter((link) => link.href === "#")
    .map((link) => ({ key: link.key, label: link.label }));

  // Categories that have articles but no troubleshooting workflow, and modules
  // with no matching practice scenario — the two gaps that most often show up
  // as "I read it but froze on the call".
  const gaps: string[] = [];
  const flowCategories = new Set(flows.map((flow) => flow.category));
  const scenarioCategories = new Set(scenarios.map((scenario) => scenario.category));

  for (const trainingModule of modules) {
    if (!scenarioCategories.has(trainingModule.category)) {
      gaps.push(`"${trainingModule.title}" has no practice scenario in its category.`);
    }
  }
  const articleCategories = new Set(articles.map((article) => article.category));
  for (const category of articleCategories) {
    if (!flowCategories.has(category)) {
      gaps.push(`No troubleshooting workflow covers the ${category} category.`);
    }
  }

  const flagCounts = new Map<string, number>();
  for (const report of reports) {
    flagCounts.set(report.resourceSlug, (flagCounts.get(report.resourceSlug) ?? 0) + 1);
  }

  return {
    totals: {
      articles: articles.length,
      modules: modules.length,
      flows: flows.length,
      responses: responses.length,
      scenarios: scenarios.length,
      links: links.length,
    },
    byStatus,
    byVisibility,
    stale,
    unconfiguredLinks,
    gaps,
    reports: {
      open: reports.filter((report) => report.status === "open").length,
      reviewing: reports.filter((report) => report.status === "reviewing").length,
      total: reports.length,
      repeatedlyFlagged: [...flagCounts.entries()]
        .filter(([, count]) => count > 1)
        .map(([slug, count]) => ({ slug, count }))
        .sort((a, b) => b.count - a.count),
      durable: getReportStore().durable,
    },
    onboarding: {
      totalSteps: modules.reduce((sum, trainingModule) => sum + trainingModule.steps.length, 0),
      totalMinutes: modules.reduce(
        (sum, trainingModule) =>
          sum + trainingModule.steps.reduce((inner, step) => inner + step.minutes, 0),
        0,
      ),
      checks: modules.reduce(
        (sum, trainingModule) => sum + trainingModule.steps.filter((step) => step.check).length,
        0,
      ),
    },
  };
}
