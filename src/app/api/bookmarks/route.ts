import { getViewer } from "@/lib/auth";
import { listLinks } from "@/lib/content/repository";
import { buildBookmarkFile, bookmarkFilename } from "@/lib/bookmarks/netscape";

/**
 * Serves the bookmark file Chrome can import.
 *
 * Viewer-filtered like every other content read: an anonymous visitor gets the
 * public systems, a signed-in technician additionally gets the internal ones.
 * The same route serves both — the repository decides what is in it.
 *
 * `Content-Disposition: attachment` is what makes the browser save it rather
 * than render it, and the filename is what the user sees in their downloads.
 */
export async function GET() {
  const viewer = await getViewer();
  const links = await listLinks(viewer);

  const file = buildBookmarkFile(links);

  return new Response(file, {
    headers: {
      "content-type": "text/html; charset=utf-8",
      "content-disposition": `attachment; filename="${bookmarkFilename()}"`,
      // Per-viewer content must never sit in a shared cache.
      "cache-control": "private, no-store",
    },
  });
}
