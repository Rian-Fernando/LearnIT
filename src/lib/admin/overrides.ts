import "server-only";
import type { Announcement, ImportantLink } from "@/lib/content/schema";

/**
 * Administrator overrides.
 *
 * The file adapter is read-only by design — procedures live in git, where they
 * get review and history. But two kinds of content genuinely must be editable
 * by leadership without a deploy:
 *
 *   • Important links, because a system moving should not break forty articles.
 *   • Announcements, because "the printer in the library is down" is useless
 *     if it takes a pull request.
 *
 * Those two are layered over the file content through this store. Everything
 * else is authored in `src/content/**` and reviewed like code — see
 * docs/content.md for the reasoning.
 *
 * The shipped implementation is in-memory: edits are live immediately and are
 * lost on restart. That is stated plainly in the admin UI rather than implied,
 * and a Postgres implementation of this same interface makes them durable.
 */

export interface OverrideStore {
  readonly durable: boolean;
  linkOverrides(): Promise<Map<string, Partial<ImportantLink>>>;
  setLinkOverride(key: string, patch: Partial<ImportantLink>): Promise<void>;
  clearLinkOverride(key: string): Promise<void>;
  extraAnnouncements(): Promise<Announcement[]>;
  addAnnouncement(announcement: Announcement): Promise<void>;
  removeAnnouncement(id: string): Promise<void>;
}

const globalForOverrides = globalThis as unknown as {
  __learnitOverrides?: {
    links: Map<string, Partial<ImportantLink>>;
    announcements: Map<string, Announcement>;
  };
};

const store = (globalForOverrides.__learnitOverrides ??= {
  links: new Map(),
  announcements: new Map(),
});

export const memoryOverrideStore: OverrideStore = {
  durable: false,

  async linkOverrides() {
    return new Map(store.links);
  },

  async setLinkOverride(key, patch) {
    store.links.set(key, { ...store.links.get(key), ...patch });
  },

  async clearLinkOverride(key) {
    store.links.delete(key);
  },

  async extraAnnouncements() {
    return [...store.announcements.values()];
  },

  async addAnnouncement(announcement) {
    store.announcements.set(announcement.id, announcement);
  },

  async removeAnnouncement(id) {
    store.announcements.delete(id);
  },
};

export function getOverrideStore(): OverrideStore {
  return memoryOverrideStore;
}
