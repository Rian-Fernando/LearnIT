import "server-only";
import type { LinkMap } from "@/components/content/blocks";
import type { Viewer } from "@/lib/auth/types";
import { getOverrideStore } from "@/lib/admin/overrides";
import { isDemoMode } from "@/lib/config/env";
import { canList, canView } from "./access";
import { fileAdapter } from "./adapters/file";
import type {
  AdelphiSystem,
  Announcement,
  Article,
  BacklogItem,
  Category,
  Checklist,
  ImportantLink,
  QuickResponse,
  ReferenceTicket,
  Scenario,
  Taxonomy,
  TicketSimulation,
  TrainingModule,
  TroubleshootingFlow,
} from "./schema";

/**
 * ---------------------------------------------------------------------------
 * Content repository
 * ---------------------------------------------------------------------------
 * Pages never import content modules directly. They ask the repository, and
 * pass the Viewer. The repository is therefore the single choke point where
 * visibility, publication status, and demo-mode sanitisation are applied.
 *
 * Adapters:
 *   file     — content compiled from `src/content/**`. Read-only, zero infra,
 *              ideal for the public demo and for local development.
 *   postgres — read/write with revision history, for the internal deployment.
 *              See docs/architecture.md § "Moving to Postgres".
 *
 * Both satisfy `ContentSource`; only `getContentSource()` knows which is live.
 */

export interface ContentSource {
  articles(): Promise<Article[]>;
  checklists(): Promise<Checklist[]>;
  tickets(): Promise<ReferenceTicket[]>;
  simulations(): Promise<TicketSimulation[]>;
  systems(): Promise<AdelphiSystem[]>;
  /** Not viewer-filtered — option lists carry no user data. */
  taxonomies(): Promise<Taxonomy[]>;
  /** Admin-only. Never served to staff or guests. */
  backlog(): Promise<BacklogItem[]>;
  modules(): Promise<TrainingModule[]>;
  flows(): Promise<TroubleshootingFlow[]>;
  responses(): Promise<QuickResponse[]>;
  scenarios(): Promise<Scenario[]>;
  links(): Promise<ImportantLink[]>;
  announcements(): Promise<Announcement[]>;
  /** False for read-only adapters; the admin console renders in preview mode. */
  readonly writable: boolean;
}

function getContentSource(): ContentSource {
  // The postgres adapter is wired here once DATABASE_URL is configured; the
  // file adapter is the default and the only one the demo build needs.
  return fileAdapter;
}

/* -------------------------------------------------------------------------- */
/* Demo-mode sanitisation                                                     */
/* -------------------------------------------------------------------------- */

/**
 * In demo mode the internal content set must be unreachable even for an
 * authenticated persona — a demo sign-in is not a Help Desk credential. This
 * runs *before* viewer filtering, so it cannot be bypassed by role.
 */
function sanitize<T extends { visibility: string }>(records: T[]): T[] {
  return isDemoMode() ? records.filter((r) => r.visibility === "public") : records;
}

async function load<T extends { visibility: string }>(
  fetcher: () => Promise<T[]>,
): Promise<T[]> {
  return sanitize(await fetcher());
}

/* -------------------------------------------------------------------------- */
/* Sorting helpers                                                            */
/* -------------------------------------------------------------------------- */

const byUpdatedDesc = (a: { updatedAt: string }, b: { updatedAt: string }) =>
  b.updatedAt.localeCompare(a.updatedAt);

const byTitle = (a: { title: string }, b: { title: string }) =>
  a.title.localeCompare(b.title);

/* -------------------------------------------------------------------------- */
/* Knowledge base                                                             */
/* -------------------------------------------------------------------------- */

export interface ArticleQuery {
  category?: Category;
  tag?: string;
  featured?: boolean;
  limit?: number;
}

export async function listArticles(
  viewer: Viewer,
  query: ArticleQuery = {},
): Promise<Article[]> {
  const all = await load(() => getContentSource().articles());
  let result = all.filter((a) => canList(viewer, a));

  if (query.category) result = result.filter((a) => a.category === query.category);
  if (query.tag) result = result.filter((a) => a.tags.includes(query.tag!));
  if (query.featured !== undefined) {
    result = result.filter((a) => a.featured === query.featured);
  }

  result.sort(byTitle);
  return query.limit ? result.slice(0, query.limit) : result;
}

export async function getArticle(viewer: Viewer, slug: string): Promise<Article | null> {
  const all = await load(() => getContentSource().articles());
  const article = all.find((a) => a.slug === slug);
  return article && canView(viewer, article) ? article : null;
}

export async function recentlyUpdatedArticles(
  viewer: Viewer,
  limit = 5,
): Promise<Article[]> {
  const all = await listArticles(viewer);
  return [...all].sort(byUpdatedDesc).slice(0, limit);
}

/** Category → count, for the knowledge base index. Respects visibility. */
export async function articleCountsByCategory(
  viewer: Viewer,
): Promise<Map<Category, number>> {
  const all = await listArticles(viewer);
  const counts = new Map<Category, number>();
  for (const article of all) {
    counts.set(article.category, (counts.get(article.category) ?? 0) + 1);
  }
  return counts;
}

/* -------------------------------------------------------------------------- */
/* Training                                                                   */
/* -------------------------------------------------------------------------- */

export async function listModules(viewer: Viewer): Promise<TrainingModule[]> {
  const all = await load(() => getContentSource().modules());
  return all.filter((m) => canList(viewer, m)).sort((a, b) => a.order - b.order);
}

export async function getModule(
  viewer: Viewer,
  slug: string,
): Promise<TrainingModule | null> {
  const all = await load(() => getContentSource().modules());
  const found = all.find((m) => m.slug === slug);
  return found && canView(viewer, found) ? found : null;
}

/* -------------------------------------------------------------------------- */
/* Troubleshooting                                                            */
/* -------------------------------------------------------------------------- */

export async function listFlows(viewer: Viewer): Promise<TroubleshootingFlow[]> {
  const all = await load(() => getContentSource().flows());
  return all.filter((f) => canList(viewer, f)).sort(byTitle);
}

export async function getFlow(
  viewer: Viewer,
  slug: string,
): Promise<TroubleshootingFlow | null> {
  const all = await load(() => getContentSource().flows());
  const found = all.find((f) => f.slug === slug);
  return found && canView(viewer, found) ? found : null;
}

/* -------------------------------------------------------------------------- */
/* Quick responses                                                            */
/* -------------------------------------------------------------------------- */

export async function listResponses(viewer: Viewer): Promise<QuickResponse[]> {
  const all = await load(() => getContentSource().responses());
  return all.filter((r) => canList(viewer, r)).sort(byTitle);
}

export async function getResponse(
  viewer: Viewer,
  slug: string,
): Promise<QuickResponse | null> {
  const all = await load(() => getContentSource().responses());
  const found = all.find((r) => r.slug === slug);
  return found && canView(viewer, found) ? found : null;
}

/* -------------------------------------------------------------------------- */
/* Scenarios                                                                  */
/* -------------------------------------------------------------------------- */

const DIFFICULTY_ORDER = { intro: 0, core: 1, advanced: 2 } as const;

export async function listScenarios(viewer: Viewer): Promise<Scenario[]> {
  const all = await load(() => getContentSource().scenarios());
  return all
    .filter((s) => canList(viewer, s))
    .sort(
      (a, b) =>
        DIFFICULTY_ORDER[a.difficulty] - DIFFICULTY_ORDER[b.difficulty] ||
        a.title.localeCompare(b.title),
    );
}

export async function getScenario(
  viewer: Viewer,
  slug: string,
): Promise<Scenario | null> {
  const all = await load(() => getContentSource().scenarios());
  const found = all.find((s) => s.slug === slug);
  return found && canView(viewer, found) ? found : null;
}

/* -------------------------------------------------------------------------- */
/* Checklists                                                                 */
/* -------------------------------------------------------------------------- */

export async function listChecklists(viewer: Viewer): Promise<Checklist[]> {
  const all = await load(() => getContentSource().checklists());
  return all.filter((c) => canList(viewer, c)).sort(byTitle);
}

export async function getChecklist(
  viewer: Viewer,
  slug: string,
): Promise<Checklist | null> {
  const all = await load(() => getContentSource().checklists());
  const found = all.find((c) => c.slug === slug);
  return found && canView(viewer, found) ? found : null;
}

/* -------------------------------------------------------------------------- */
/* Reference tickets                                                          */
/* -------------------------------------------------------------------------- */

export async function listTickets(viewer: Viewer): Promise<ReferenceTicket[]> {
  const all = await load(() => getContentSource().tickets());
  return all.filter((t) => canList(viewer, t)).sort(byTitle);
}

export async function getTicket(
  viewer: Viewer,
  slug: string,
): Promise<ReferenceTicket | null> {
  const all = await load(() => getContentSource().tickets());
  const found = all.find((t) => t.slug === slug);
  return found && canView(viewer, found) ? found : null;
}

/* -------------------------------------------------------------------------- */
/* Systems directory                                                          */
/* -------------------------------------------------------------------------- */

export async function listSystems(viewer: Viewer): Promise<AdelphiSystem[]> {
  const all = await load(() => getContentSource().systems());
  return all
    .filter((s) => canList(viewer, s))
    .sort((a, b) => a.order - b.order || a.shortName.localeCompare(b.shortName));
}

export async function getSystem(
  viewer: Viewer,
  slug: string,
): Promise<AdelphiSystem | null> {
  const all = await load(() => getContentSource().systems());
  const found = all.find((s) => s.slug === slug);
  return found && canView(viewer, found) ? found : null;
}

/* -------------------------------------------------------------------------- */
/* Call simulations                                                           */
/* -------------------------------------------------------------------------- */

const SIM_DIFFICULTY = { intro: 0, core: 1, advanced: 2 } as const;

export async function listSimulations(viewer: Viewer): Promise<TicketSimulation[]> {
  const all = await load(() => getContentSource().simulations());
  return all
    .filter((s) => canList(viewer, s))
    .sort(
      (a, b) =>
        SIM_DIFFICULTY[a.difficulty] - SIM_DIFFICULTY[b.difficulty] ||
        a.title.localeCompare(b.title),
    );
}

export async function getSimulation(
  viewer: Viewer,
  slug: string,
): Promise<TicketSimulation | null> {
  const all = await load(() => getContentSource().simulations());
  const found = all.find((s) => s.slug === slug);
  return found && canView(viewer, found) ? found : null;
}

/* -------------------------------------------------------------------------- */
/* Taxonomy and backlog                                                       */
/* -------------------------------------------------------------------------- */

/** Option lists. No viewer filtering — these contain no user data. */
export async function listTaxonomies(): Promise<Taxonomy[]> {
  return getContentSource().taxonomies();
}

export async function getTaxonomy(key: string): Promise<Taxonomy | null> {
  const all = await listTaxonomies();
  return all.find((t) => t.key === key) ?? null;
}

/**
 * The content backlog.
 *
 * Admin-only: it is a candid list of what the Help Desk documentation does not
 * yet cover, which is useful to leadership and unhelpful to a technician
 * mid-call. Callers must pass an admin viewer.
 */
export async function listBacklog(viewer: Viewer): Promise<BacklogItem[]> {
  if (viewer.role !== "admin") return [];
  const order = { high: 0, medium: 1, low: 2 } as const;
  const all = await getContentSource().backlog();
  return [...all].sort((a, b) => order[a.priority] - order[b.priority]);
}

/* -------------------------------------------------------------------------- */
/* Operational content                                                        */
/* -------------------------------------------------------------------------- */

export async function listLinks(viewer: Viewer): Promise<ImportantLink[]> {
  const base = await load(() => getContentSource().links());

  // Administrator edits are layered over the authored links, so a system that
  // moves is a one-field change rather than a redeploy. See lib/admin/overrides.
  const overrides = await getOverrideStore().linkOverrides();
  const merged = base.map((link) => {
    const patch = overrides.get(link.key);
    return patch ? { ...link, ...patch } : link;
  });

  return merged.filter(
    (link) => viewer.isAuthenticated || link.visibility === "public",
  );
}

/** Resolve a `link` block's key to the centrally-managed URL. */
export async function resolveLink(
  viewer: Viewer,
  key: string,
): Promise<ImportantLink | null> {
  const all = await listLinks(viewer);
  return all.find((link) => link.key === key) ?? null;
}

/**
 * Serialisable key → link map for the block renderer.
 *
 * Built once per page render and passed down, so `<Blocks>` stays a plain
 * component that works inside client boundaries. Links this viewer may not see
 * are simply absent from the map, and the renderer omits those blocks.
 */
export async function buildLinkMap(viewer: Viewer): Promise<LinkMap> {
  const all = await listLinks(viewer);
  const map: LinkMap = {};
  for (const link of all) {
    map[link.key] = {
      label: link.label,
      description: link.description,
      href: link.href,
    };
  }
  return map;
}

export async function activeAnnouncements(viewer: Viewer): Promise<Announcement[]> {
  const today = new Date().toISOString().slice(0, 10);
  const authored = await getContentSource().announcements();
  const published = await getOverrideStore().extraAnnouncements();
  const all = sanitize([...authored, ...published]);

  return all
    .filter((a) => viewer.isAuthenticated || a.visibility === "public")
    .filter((a) => a.publishedAt <= today)
    .filter((a) => !a.expiresAt || a.expiresAt >= today)
    .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
}

/** Whether the active adapter supports admin writes. */
export function contentIsWritable(): boolean {
  return getContentSource().writable;
}
