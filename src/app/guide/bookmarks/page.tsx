import type { Metadata } from "next";
import { BookmarkPlus, Download, ExternalLink, TriangleAlert } from "lucide-react";
import { PageContainer, PageHeader } from "@/components/ui/page";
import { Badge, Surface } from "@/components/ui/primitives";
import { GuideFooter } from "@/features/guide/guide-chrome";
import { GUEST_VIEWER } from "@/lib/auth/types";
import { listLinks } from "@/lib/content/repository";
import { isConfigured } from "@/lib/bookmarks/netscape";
import { CATEGORY_LABELS } from "@/lib/content/schema";

export const metadata: Metadata = {
  title: "Bookmarks for your browser",
  description:
    "Download every Adelphi Help Desk system as a single bookmarks file and import it into Chrome in three clicks.",
  alternates: { canonical: "/guide/bookmarks" },
};

/**
 * Bookmark download.
 *
 * The problem this solves is a new technician's first hour: eight systems, no
 * addresses, and a supervisor reciting URLs. One file, imported once, and every
 * system is on their bookmarks bar — inside their own signed-in Chrome profile,
 * so the sessions follow them.
 *
 * Links that have no real address yet are excluded from the file rather than
 * imported as dead entries. The page shows what is missing instead of quietly
 * shipping a short list.
 */
export default async function BookmarksPage() {
  const links = await listLinks(GUEST_VIEWER);
  const ready = links.filter(isConfigured);
  const pending = links.filter((link) => !isConfigured(link));

  const byCategory = new Map<string, typeof ready>();
  for (const link of ready) {
    const list = byCategory.get(link.category) ?? [];
    list.push(link);
    byCategory.set(link.category, list);
  }

  return (
    <>
      <PageContainer width="reading">
        <PageHeader
          eyebrow="Guide"
          title="Bookmarks for your browser"
          description="Every system the Help Desk uses, as one file you can import into Chrome. Takes about thirty seconds and means you never hunt for a URL again."
        />

        {/* ------------------------------------------------------ download */}
        <Surface className="p-6">
          <div className="flex flex-wrap items-start gap-4">
            <span
              aria-hidden
              className="flex size-11 shrink-0 items-center justify-center rounded-xl border border-accent/25 bg-accent-soft"
            >
              <BookmarkPlus className="size-5 text-accent-text" />
            </span>

            <div className="min-w-0 flex-1">
              <h2 className="text-base font-medium text-primary">
                Adelphi Help Desk bookmarks
              </h2>
              <p className="mt-1 text-sm leading-6 text-secondary">
                {ready.length > 0
                  ? `${ready.length} ${ready.length === 1 ? "system" : "systems"}, organised into folders.`
                  : "No systems have a configured address yet — the file would be empty."}
              </p>

              {ready.length > 0 ? (
                <a
                  href="/api/bookmarks"
                  download
                  className="mt-4 inline-flex h-10 items-center gap-2 rounded-lg bg-accent px-4 text-sm font-medium text-accent-contrast transition-colors hover:bg-accent-hover"
                >
                  <Download className="size-4" aria-hidden />
                  Download bookmarks file
                </a>
              ) : (
                <p className="mt-4 rounded-lg border border-dashed border-default px-4 py-3 text-sm text-tertiary">
                  Download will appear here once an administrator has set the
                  system addresses.
                </p>
              )}
            </div>
          </div>
        </Surface>

        {/* -------------------------------------------------------- import */}
        <section className="mt-10">
          <h2 className="text-lg font-semibold tracking-tight text-primary">
            Importing it into Chrome
          </h2>
          <ol className="mt-4 space-y-0">
            {[
              ["Download the file above", "It saves as an .html file — that is the format Chrome expects."],
              ["Make sure you are signed into Chrome", "With your own profile, so the bookmarks sync to you."],
              ["Open the Chrome menu", "The three dots, top right → Bookmarks and lists → Import bookmarks and settings."],
              ["Choose Bookmarks HTML File", "Then select the file you just downloaded."],
              ["Look for the new folder", "It appears on your bookmarks bar as “Adelphi Help Desk”. Press Ctrl+Shift+B (⌘⇧B on Mac) if the bar is hidden."],
            ].map(([title, detail], index, all) => (
              <li key={title} className="group relative flex gap-4 pb-5 last:pb-0">
                <div className="flex flex-col items-center">
                  <span className="tabular flex size-7 shrink-0 items-center justify-center rounded-full border border-default bg-surface-inset text-xs font-medium text-secondary">
                    {index + 1}
                  </span>
                  {index < all.length - 1 ? (
                    <span aria-hidden className="mt-1 w-px flex-1 bg-subtle" />
                  ) : null}
                </div>
                <div className="flex-1 pt-0.5">
                  <p className="text-[0.9375rem] font-medium leading-6 text-primary">
                    {title}
                  </p>
                  <p className="mt-1 text-sm leading-6 text-tertiary">{detail}</p>
                </div>
              </li>
            ))}
          </ol>

          <div className="mt-4 rounded-lg border border-signal/25 bg-signal-soft px-4 py-3.5">
            <p className="text-sm leading-6 text-secondary">
              Importing <span className="font-medium text-signal">adds</span> to
              your bookmarks — it does not replace what you already have.
            </p>
          </div>
        </section>

        {/* -------------------------------------------------- what is in it */}
        {ready.length > 0 ? (
          <section className="mt-10">
            <h2 className="text-lg font-semibold tracking-tight text-primary">
              What is in the file
            </h2>
            <div className="mt-4 space-y-4">
              {[...byCategory.entries()].map(([category, categoryLinks]) => (
                <div key={category}>
                  <h3 className="text-sm font-medium text-tertiary">
                    {CATEGORY_LABELS[category as keyof typeof CATEGORY_LABELS]}
                  </h3>
                  <ul className="mt-2 space-y-1.5">
                    {categoryLinks.map((link) => (
                      <li
                        key={link.key}
                        className="flex items-start gap-2 text-sm leading-6"
                      >
                        <ExternalLink
                          className="mt-1.5 size-3 shrink-0 text-tertiary"
                          aria-hidden
                        />
                        <span className="min-w-0 flex-1">
                          <span className="font-medium text-primary">{link.label}</span>
                          {link.pinned ? (
                            <Badge tone="accent" className="ml-2">
                              Every shift
                            </Badge>
                          ) : null}
                          <span className="block text-tertiary">{link.description}</span>
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>
        ) : null}

        {/* --------------------------------------------------- not yet set */}
        {pending.length > 0 ? (
          <section className="mt-10">
            <div className="flex gap-3 rounded-lg border border-warning/30 bg-warning-soft px-4 py-3.5">
              <TriangleAlert
                className="mt-0.5 size-4 shrink-0 text-warning"
                aria-hidden
              />
              <div className="min-w-0">
                <p className="text-sm font-semibold text-warning">
                  {pending.length} {pending.length === 1 ? "system has" : "systems have"}{" "}
                  no address configured yet
                </p>
                <p className="mt-1 text-sm leading-6 text-secondary">
                  These are left out of the file rather than imported as dead
                  links. An administrator sets the real addresses, and they appear
                  here automatically.
                </p>
                <ul className="mt-3 flex flex-wrap gap-1.5">
                  {pending.map((link) => (
                    <li
                      key={link.key}
                      className="rounded-md border border-subtle bg-surface-inset px-2 py-0.5 text-xs text-tertiary"
                    >
                      {link.label}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </section>
        ) : null}
      </PageContainer>
      <GuideFooter />
    </>
  );
}
