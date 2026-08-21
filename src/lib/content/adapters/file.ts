import "server-only";
import {
  announcements,
  articles,
  backlog,
  checklists,
  flows,
  links,
  modules,
  responses,
  scenarios,
  simulations,
  systems,
  taxonomies,
  tickets,
} from "@/content";
import type { ContentSource } from "../repository";

/**
 * File-backed content adapter.
 *
 * Content is authored as typed modules under `src/content/**` and compiled into
 * the build. That gives compile-time type checking, instant reads with no
 * network hop, and a git history for every procedure change — which is a
 * genuinely good fit for documentation that must be reviewable.
 *
 * It is read-only. The admin console detects this via `writable` and renders in
 * preview mode, explaining that edits require the Postgres adapter. See
 * docs/architecture.md.
 */
export const fileAdapter: ContentSource = {
  writable: false,
  articles: async () => articles,
  checklists: async () => checklists,
  tickets: async () => tickets,
  simulations: async () => simulations,
  systems: async () => systems,
  taxonomies: async () => taxonomies,
  backlog: async () => backlog,
  modules: async () => modules,
  flows: async () => flows,
  responses: async () => responses,
  scenarios: async () => scenarios,
  links: async () => links,
  announcements: async () => announcements,
};
