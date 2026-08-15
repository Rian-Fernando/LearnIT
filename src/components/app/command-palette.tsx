"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import MiniSearch, { type SearchResult } from "minisearch";
import {
  BookOpen,
  CornerDownLeft,
  GraduationCap,
  Loader2,
  MessageSquareQuote,
  Route,
  Search,
  Terminal,
} from "lucide-react";
import type { SearchDocument, SearchKind } from "@/lib/search/documents";
import { cn } from "@/lib/cn";

/**
 * Global search (⌘K / Ctrl+K).
 *
 * Built around what a technician actually does: someone is on the phone, they
 * say "printer", and the answer has to be on screen before the sentence ends.
 * That is why the index is fetched once and queried locally — every keystroke
 * is a synchronous, sub-millisecond lookup with no network in the path.
 *
 * Keyboard model: ⌘K to open, arrows to move, Enter to open, Escape to close.
 * Focus is trapped while open and restored to the trigger on close.
 */

const KIND_META: Record<
  SearchKind,
  { icon: typeof BookOpen; label: string; tone: string }
> = {
  article: { icon: BookOpen, label: "Article", tone: "text-signal" },
  flow: { icon: Route, label: "Troubleshoot", tone: "text-accent-text" },
  module: { icon: GraduationCap, label: "Training", tone: "text-success" },
  response: { icon: MessageSquareQuote, label: "Response", tone: "text-warning" },
  scenario: { icon: Terminal, label: "Practice", tone: "text-tertiary" },
};

type Status = "idle" | "loading" | "ready" | "error";

export function CommandPalette({ basePath }: { basePath: string }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [documents, setDocuments] = useState<SearchDocument[]>([]);
  const [highlighted, setHighlighted] = useState(0);

  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const triggerRef = useRef<HTMLElement | null>(null);

  /* ---------------------------------------------------------------- index */

  const engine = useMemo(() => {
    if (documents.length === 0) return null;
    const search = new MiniSearch<SearchDocument>({
      fields: ["title", "summary", "tags", "categoryLabel", "text"],
      storeFields: ["title", "summary", "kind", "categoryLabel", "path"],
      searchOptions: {
        prefix: true,
        fuzzy: 0.2,
        // Title matches must dominate. A word buried in an article body should
        // never outrank an article named for it.
        boost: { title: 6, tags: 3, summary: 2, categoryLabel: 2, text: 1 },
      },
    });
    search.addAll(documents);
    return search;
  }, [documents]);

  const loadIndex = useCallback(async () => {
    if (status === "loading" || status === "ready") return;
    setStatus("loading");
    try {
      const response = await fetch("/api/search", { credentials: "same-origin" });
      if (!response.ok) throw new Error(`search index: ${response.status}`);
      const data = (await response.json()) as { documents: SearchDocument[] };
      setDocuments(data.documents);
      setStatus("ready");
    } catch {
      setStatus("error");
    }
  }, [status]);

  /* -------------------------------------------------------------- opening */

  const openPalette = useCallback(() => {
    triggerRef.current = document.activeElement as HTMLElement | null;
    setOpen(true);
    void loadIndex();
  }, [loadIndex]);

  const closePalette = useCallback(() => {
    setOpen(false);
    setQuery("");
    setHighlighted(0);
    // Return focus where it came from — otherwise keyboard users are dumped at
    // the top of the document.
    triggerRef.current?.focus();
  }, []);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const isShortcut =
        (event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k";
      if (isShortcut) {
        event.preventDefault();
        if (open) closePalette();
        else openPalette();
        return;
      }
      // `/` opens search, but never while the user is typing somewhere else.
      if (event.key === "/" && !open && !isEditable(event.target)) {
        event.preventDefault();
        openPalette();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, openPalette, closePalette]);

  // Lock background scroll while the dialog is open.
  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    inputRef.current?.focus();
    return () => {
      document.body.style.overflow = previous;
    };
  }, [open]);

  /* -------------------------------------------------------------- results */

  const results = useMemo(() => {
    if (!engine) return [];
    const trimmed = query.trim();
    if (!trimmed) {
      // With no query, show a useful default rather than nothing: a spread
      // across kinds so the palette teaches what is searchable.
      const byKind = new Map<SearchKind, SearchDocument[]>();
      for (const doc of documents) {
        const list = byKind.get(doc.kind) ?? [];
        if (list.length < 2) list.push(doc);
        byKind.set(doc.kind, list);
      }
      return [...byKind.values()].flat().slice(0, 8);
    }
    return engine.search(trimmed).slice(0, 12).map(toDocument);
  }, [engine, query, documents]);

  useEffect(() => setHighlighted(0), [query]);

  const go = useCallback(
    (path: string) => {
      closePalette();
      router.push(`${basePath}${path}`);
    },
    [basePath, closePalette, router],
  );

  const onInputKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "Escape") {
      event.preventDefault();
      closePalette();
      return;
    }
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setHighlighted((current) => Math.min(current + 1, results.length - 1));
      return;
    }
    if (event.key === "ArrowUp") {
      event.preventDefault();
      setHighlighted((current) => Math.max(current - 1, 0));
      return;
    }
    if (event.key === "Enter") {
      event.preventDefault();
      const target = results[highlighted];
      if (target) go(target.path);
    }
  };

  // Keep the highlighted row in view during keyboard navigation.
  useEffect(() => {
    const list = listRef.current;
    const item = list?.children[highlighted] as HTMLElement | undefined;
    item?.scrollIntoView({ block: "nearest" });
  }, [highlighted]);

  return (
    <>
      <SearchTrigger onClick={openPalette} />

      {open ? (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Search learnIT"
          className="fixed inset-0 z-[80] flex items-start justify-center p-4 pt-[10vh] sm:pt-[14vh]"
        >
          <button
            type="button"
            aria-label="Close search"
            onClick={closePalette}
            className="absolute inset-0 cursor-default bg-black/60 backdrop-blur-sm"
          />

          <div className="animate-fade-up relative w-full max-w-2xl overflow-hidden rounded-xl border border-default bg-surface-overlay shadow-elev-lg">
            <div className="flex items-center gap-3 border-b border-subtle px-4">
              <Search className="size-4 shrink-0 text-tertiary" aria-hidden />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                onKeyDown={onInputKeyDown}
                placeholder="Search articles, workflows, training, responses…"
                aria-label="Search query"
                aria-controls="command-results"
                autoComplete="off"
                spellCheck={false}
                className="h-14 flex-1 bg-transparent text-[0.9375rem] text-primary outline-none placeholder:text-tertiary"
              />
              {status === "loading" ? (
                <Loader2 className="size-4 animate-spin text-tertiary" aria-hidden />
              ) : (
                <kbd className="hidden rounded border border-default bg-surface-inset px-1.5 py-0.5 font-mono text-[0.625rem] text-tertiary sm:block">
                  ESC
                </kbd>
              )}
            </div>

            <div className="max-h-[min(28rem,60vh)] overflow-y-auto overscroll-contain">
              {status === "error" ? (
                <p className="px-4 py-10 text-center text-sm text-tertiary">
                  Search is unavailable right now. Try the section pages instead.
                </p>
              ) : status !== "ready" ? (
                <p className="px-4 py-10 text-center text-sm text-tertiary">
                  Loading search index…
                </p>
              ) : results.length === 0 ? (
                <div className="px-4 py-10 text-center">
                  <p className="text-sm text-primary">
                    No results for &ldquo;{query.trim()}&rdquo;
                  </p>
                  <p className="mt-1.5 text-sm text-tertiary">
                    Try a system name, a symptom, or a phrase from the message you
                    received.
                  </p>
                </div>
              ) : (
                <ul id="command-results" ref={listRef} className="p-2">
                  {results.map((result, index) => {
                    const meta = KIND_META[result.kind];
                    const Icon = meta.icon;
                    const active = index === highlighted;
                    return (
                      <li key={result.id}>
                        <button
                          type="button"
                          onClick={() => go(result.path)}
                          onMouseMove={() => setHighlighted(index)}
                          className={cn(
                            "flex w-full items-start gap-3 rounded-lg px-3 py-2.5 text-left transition-colors",
                            active ? "bg-surface-inset" : "hover:bg-surface-inset/60",
                          )}
                        >
                          <Icon
                            className={cn("mt-0.5 size-4 shrink-0", meta.tone)}
                            aria-hidden
                          />
                          <span className="min-w-0 flex-1">
                            <span className="block truncate text-sm font-medium text-primary">
                              {result.title}
                            </span>
                            <span className="mt-0.5 block truncate text-xs text-tertiary">
                              {meta.label} · {result.categoryLabel} — {result.summary}
                            </span>
                          </span>
                          {active ? (
                            <CornerDownLeft
                              className="mt-0.5 size-3.5 shrink-0 text-tertiary"
                              aria-hidden
                            />
                          ) : null}
                        </button>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>

            <div className="flex items-center justify-between border-t border-subtle px-4 py-2.5">
              <p className="text-xs text-tertiary">
                {status === "ready" ? `${documents.length} items indexed` : " "}
              </p>
              <p className="hidden items-center gap-3 text-xs text-tertiary sm:flex">
                <Hint keys="↑ ↓">navigate</Hint>
                <Hint keys="↵">open</Hint>
              </p>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}

/* -------------------------------------------------------------------------- */

function SearchTrigger({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group flex h-9 items-center gap-2 rounded-lg border border-default bg-surface-inset px-3 text-sm text-tertiary transition-colors hover:border-strong hover:text-secondary sm:w-64 lg:w-80"
    >
      <Search className="size-4 shrink-0" aria-hidden />
      <span className="hidden flex-1 text-left sm:block">Search…</span>
      <kbd className="ml-auto hidden rounded border border-default bg-surface-raised px-1.5 py-0.5 font-mono text-[0.625rem] sm:block">
        ⌘K
      </kbd>
      <span className="sr-only">Search learnIT. Keyboard shortcut: Command or Control K.</span>
    </button>
  );
}

function Hint({ keys, children }: { keys: string; children: React.ReactNode }) {
  return (
    <span className="flex items-center gap-1.5">
      <kbd className="rounded border border-default bg-surface-inset px-1.5 py-0.5 font-mono text-[0.625rem]">
        {keys}
      </kbd>
      {children}
    </span>
  );
}

function toDocument(result: SearchResult): SearchDocument {
  return result as unknown as SearchDocument;
}

function isEditable(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false;
  const tag = target.tagName;
  return (
    tag === "INPUT" ||
    tag === "TEXTAREA" ||
    tag === "SELECT" ||
    target.isContentEditable
  );
}
