import { NextResponse } from "next/server";
import { getViewer } from "@/lib/auth";
import { buildSearchDocuments } from "@/lib/search/documents";

/**
 * Serves the search index for the current viewer.
 *
 * Fetched lazily the first time the command palette opens, so the index is not
 * part of any page's initial payload. The response is viewer-specific — the
 * repository has already applied visibility filtering — which is why it must
 * never be shared in a public cache.
 */
export async function GET() {
  const viewer = await getViewer();
  const documents = await buildSearchDocuments(viewer);

  return NextResponse.json(
    { documents },
    {
      headers: {
        // `private` is the important part: a shared cache must never hand a
        // staff index to an anonymous visitor.
        "cache-control": "private, max-age=60",
      },
    },
  );
}
