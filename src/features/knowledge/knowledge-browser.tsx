"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ArrowRight, Search, X } from "lucide-react";
import { EmptyState, Badge } from "@/components/ui/primitives";
import { cn } from "@/lib/cn";
import { CATEGORY_LABELS, type Category } from "@/lib/content/schema";

/**
 * Knowledge base browser.
 *
 * Filtering is local and synchronous. The whole (already visibility-filtered)
 * list is handed over by the server, so narrowing by category or typing a word
 * is instant — no spinner, no round trip. That responsiveness is the difference
 * between a tool you use while someone is on the line and one you do not.
 *
 * The ⌘K palette is for finding one specific thing; this page is for browsing
 * a category when you are not sure what you are looking for yet.
 */

export interface ArticleCard {
  slug: string;
  title: string;
  summary: string;
  category: Category;
  tags: string[];
  updatedAt: string;
  /**
   * Pre-formatted on the server.
   *
   * "3 days ago" depends on the current time, so computing it here would give
   * one answer during server rendering and another at hydration — and on the
   * statically generated demo pages, where the HTML is built once and served
   * for weeks, they would diverge permanently.
   */
  updatedLabel: string;
  featured: boolean;
}

export function KnowledgeBrowser({
  articles,
  basePath,
}: {
  articles: ArticleCard[];
  basePath: string;
}) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<Category | "all">("all");

  const categories = useMemo(() => {
    const counts = new Map<Category, number>();
    for (const article of articles) {
      counts.set(article.category, (counts.get(article.category) ?? 0) + 1);
    }
    return [...counts.entries()].sort((a, b) =>
      CATEGORY_LABELS[a[0]].localeCompare(CATEGORY_LABELS[b[0]]),
    );
  }, [articles]);

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return articles.filter((article) => {
      if (category !== "all" && article.category !== category) return false;
      if (!needle) return true;
      return (
        article.title.toLowerCase().includes(needle) ||
        article.summary.toLowerCase().includes(needle) ||
        article.tags.some((tag) => tag.toLowerCase().includes(needle))
      );
    });
  }, [articles, query, category]);

  const activeFilter = category !== "all" || query.trim().length > 0;

  return (
    <div>
      {/* ------------------------------------------------------------ filter */}
      <div className="mb-6 space-y-4">
        <div className="relative">
          <Search
            className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-tertiary"
            aria-hidden
          />
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Filter articles by title, summary, or tag…"
            aria-label="Filter articles"
            className="h-11 w-full rounded-lg border border-default bg-surface-raised pl-10 pr-10 text-sm text-primary outline-none transition-colors placeholder:text-tertiary focus:border-strong"
          />
          {query ? (
            <button
              type="button"
              onClick={() => setQuery("")}
              aria-label="Clear filter"
              className="absolute right-3 top-1/2 flex size-6 -translate-y-1/2 items-center justify-center rounded text-tertiary transition-colors hover:text-primary"
            >
              <X className="size-4" aria-hidden />
            </button>
          ) : null}
        </div>

        <div className="flex flex-wrap gap-1.5">
          <FilterChip
            active={category === "all"}
            onClick={() => setCategory("all")}
            count={articles.length}
          >
            All
          </FilterChip>
          {categories.map(([value, count]) => (
            <FilterChip
              key={value}
              active={category === value}
              onClick={() => setCategory(value)}
              count={count}
            >
              {CATEGORY_LABELS[value]}
            </FilterChip>
          ))}
        </div>
      </div>

      {/* ------------------------------------------------------------ results */}
      <p aria-live="polite" className="sr-only">
        {filtered.length} article{filtered.length === 1 ? "" : "s"} shown
      </p>

      {filtered.length === 0 ? (
        <EmptyState
          icon={<Search className="size-6" aria-hidden />}
          title="No articles match"
          description="Try a broader term, or clear the category filter. The ⌘K palette also searches inside article text, not just titles."
        />
      ) : (
        <ul className="grid gap-3 sm:grid-cols-2">
          {filtered.map((article) => (
            <li key={article.slug}>
              <Link
                href={`${basePath}/knowledge/${article.slug}`}
                className="group flex h-full flex-col rounded-xl border border-subtle bg-surface-raised p-4 transition-colors hover:border-default hover:bg-surface-overlay"
              >
                <div className="flex flex-wrap items-center gap-2">
                  <Badge tone="neutral">{CATEGORY_LABELS[article.category]}</Badge>
                  {article.featured ? <Badge tone="accent">Key article</Badge> : null}
                </div>

                <h3 className="mt-3 flex items-start gap-1.5 text-[0.9375rem] font-medium leading-6 text-primary">
                  <span className="min-w-0 flex-1">{article.title}</span>
                  <ArrowRight
                    className="mt-1 size-3.5 shrink-0 text-tertiary transition-transform group-hover:translate-x-0.5"
                    aria-hidden
                  />
                </h3>

                <p className="mt-1.5 line-clamp-3 flex-1 text-sm leading-6 text-secondary">
                  {article.summary}
                </p>

                <p className="mt-3 text-xs text-tertiary">
                  Updated {article.updatedLabel}
                </p>
              </Link>
            </li>
          ))}
        </ul>
      )}

      {activeFilter ? (
        <button
          type="button"
          onClick={() => {
            setQuery("");
            setCategory("all");
          }}
          className="mt-6 text-sm text-tertiary transition-colors hover:text-primary"
        >
          Clear filters
        </button>
      ) : null}
    </div>
  );
}

/* -------------------------------------------------------------------------- */

function FilterChip({
  active,
  onClick,
  count,
  children,
}: {
  active: boolean;
  onClick: () => void;
  count: number;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-sm transition-colors",
        active
          ? "border-accent/30 bg-accent-soft text-accent-text"
          : "border-default bg-surface-raised text-secondary hover:border-strong hover:text-primary",
      )}
    >
      {children}
      <span className="tabular text-xs opacity-60">{count}</span>
    </button>
  );
}
