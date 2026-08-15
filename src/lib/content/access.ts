import type { Viewer } from "@/lib/auth/types";
import type { ContentStatus, Visibility } from "./schema";

/**
 * Content access rules — the one place these are expressed.
 *
 * The repository applies `canView` to every record it returns, so a page that
 * forgets to filter still cannot leak staff content. UI-level checks exist only
 * to avoid rendering dead links; they are never the control.
 */

export interface Guarded {
  visibility: Visibility;
  status: ContentStatus;
}

export function canView(viewer: Viewer, record: Guarded): boolean {
  // Admins are the only role that can see unpublished work.
  if (viewer.role === "admin") return true;

  if (record.status !== "published") return false;

  // Authenticated Help Desk staff see both public and internal content.
  if (viewer.isAuthenticated) return true;

  // Anonymous visitors: sanitised public content only.
  return record.visibility === "public";
}

/** Filter helper that keeps call sites terse and consistent. */
export function visibleTo<T extends Guarded>(viewer: Viewer, records: readonly T[]): T[] {
  return records.filter((record) => canView(viewer, record));
}

/**
 * Whether a viewer may see a record *listed* (search results, indexes, related
 * links). Archived content stays reachable by direct URL for admins but is
 * always delisted, otherwise superseded procedures resurface in search.
 */
export function canList(viewer: Viewer, record: Guarded): boolean {
  if (record.status === "archived") return false;
  if (record.status === "draft") return viewer.role === "admin";
  return canView(viewer, record);
}
