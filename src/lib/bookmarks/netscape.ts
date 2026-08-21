import type { ImportantLink } from "@/lib/content/schema";
import { CATEGORY_LABELS, type Category } from "@/lib/content/schema";

/**
 * ---------------------------------------------------------------------------
 * Chrome bookmark export
 * ---------------------------------------------------------------------------
 * Generates a Netscape Bookmark File — the format every browser has imported
 * since 1994, and the one Chrome expects from
 * Bookmarks → Import bookmarks and settings → Bookmarks HTML File.
 *
 * The point is a new technician's first hour. Instead of hunting for eight
 * system URLs one at a time, they download one file, import it, and every
 * system they need is in a folder on their bookmarks bar — already signed in,
 * because it lands in their own Chrome profile.
 *
 * The format is ancient and fussy: unclosed `<DT>` tags, a `<p>` after each
 * `<DL>`, and uppercase tags. Browsers are lenient, but staying close to the
 * original spec avoids surprises in whatever the user is running.
 */

/** Links with no real address yet would import as dead entries. */
export function isConfigured(link: ImportantLink): boolean {
  return link.href !== "#" && link.href.trim() !== "";
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/** Seconds since the epoch, which is what the format expects. */
function timestamp(iso: string): number {
  const parsed = Date.parse(`${iso}T00:00:00Z`);
  return Number.isNaN(parsed) ? Math.floor(Date.now() / 1000) : Math.floor(parsed / 1000);
}

export interface BookmarkExportOptions {
  /** Top-level folder name in the user's bookmarks. */
  folderName?: string;
  /** Group links into subfolders by category. */
  groupByCategory?: boolean;
}

export function buildBookmarkFile(
  links: ImportantLink[],
  { folderName = "Adelphi Help Desk", groupByCategory = true }: BookmarkExportOptions = {},
): string {
  const usable = links.filter(isConfigured);
  const now = Math.floor(Date.now() / 1000);

  const lines: string[] = [
    "<!DOCTYPE NETSCAPE-Bookmark-file-1>",
    "<!-- This is an automatically generated file.",
    "     It will be read and overwritten.",
    "     DO NOT EDIT! -->",
    '<META HTTP-EQUIV="Content-Type" CONTENT="text/html; charset=UTF-8">',
    "<TITLE>Bookmarks</TITLE>",
    "<H1>Bookmarks</H1>",
    "<DL><p>",
    `    <DT><H3 ADD_DATE="${now}" LAST_MODIFIED="${now}">${escapeHtml(folderName)}</H3>`,
    "    <DL><p>",
  ];

  const entry = (link: ImportantLink, indent: string) => {
    const added = timestamp(link.updatedAt);
    // The description becomes the bookmark's tooltip in most browsers.
    lines.push(
      `${indent}<DT><A HREF="${escapeHtml(link.href)}" ADD_DATE="${added}">${escapeHtml(link.label)}</A>`,
      `${indent}<DD>${escapeHtml(link.description)}`,
    );
  };

  if (groupByCategory) {
    // Pinned links get their own folder and are then excluded from the
    // category folders. Importing the same bookmark twice leaves a duplicate
    // in the user's browser, which is exactly the clutter this is meant to
    // save them.
    const pinned = usable.filter((link) => link.pinned);
    const rest = usable.filter((link) => !link.pinned);

    const byCategory = new Map<Category, ImportantLink[]>();
    for (const link of rest) {
      const list = byCategory.get(link.category) ?? [];
      list.push(link);
      byCategory.set(link.category, list);
    }

    if (pinned.length > 0) {
      lines.push(
        `        <DT><H3 ADD_DATE="${now}" LAST_MODIFIED="${now}">Every shift</H3>`,
        "        <DL><p>",
      );
      for (const link of pinned) entry(link, "            ");
      lines.push("        </DL><p>");
    }

    for (const [category, categoryLinks] of [...byCategory.entries()].sort((a, b) =>
      CATEGORY_LABELS[a[0]].localeCompare(CATEGORY_LABELS[b[0]]),
    )) {
      lines.push(
        `        <DT><H3 ADD_DATE="${now}" LAST_MODIFIED="${now}">${escapeHtml(
          CATEGORY_LABELS[category],
        )}</H3>`,
        "        <DL><p>",
      );
      for (const link of categoryLinks) entry(link, "            ");
      lines.push("        </DL><p>");
    }
  } else {
    for (const link of usable) entry(link, "        ");
  }

  lines.push("    </DL><p>", "</DL><p>", "");
  return lines.join("\n");
}

/** Suggested filename. Dated so successive downloads do not overwrite. */
export function bookmarkFilename(): string {
  return `adelphi-help-desk-bookmarks-${new Date().toISOString().slice(0, 10)}.html`;
}
