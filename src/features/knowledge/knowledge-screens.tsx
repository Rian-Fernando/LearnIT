import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, Lock } from "lucide-react";
import { Blocks } from "@/components/content/blocks";
import { PageContainer, PageHeader } from "@/components/ui/page";
import { Badge, MetaLine, SectionHeading, Surface } from "@/components/ui/primitives";
import type { Viewer } from "@/lib/auth/types";
import { isDemoMode } from "@/lib/config/env";
import { CATEGORY_LABELS } from "@/lib/content/schema";
import { buildLinkMap, getArticle, listArticles } from "@/lib/content/repository";
import { formatDate, relativeDate } from "@/lib/format";
import { ReportOutdated } from "@/features/feedback/report-outdated";
import { KnowledgeBrowser, type ArticleCard } from "./knowledge-browser";

/* ========================================================================== *
 * Index
 * ========================================================================== */

export async function KnowledgeIndexScreen({
  viewer,
  basePath = "",
}: {
  viewer: Viewer;
  basePath?: string;
}) {
  const articles = await listArticles(viewer);

  const cards: ArticleCard[] = articles.map((article) => ({
    slug: article.slug,
    title: article.title,
    summary: article.summary,
    category: article.category,
    tags: article.tags,
    updatedAt: article.updatedAt,
    updatedLabel: relativeDate(article.updatedAt),
    featured: article.featured,
  }));

  return (
    <PageContainer>
      <PageHeader
        eyebrow="Knowledge Base"
        title="Every procedure, in one place"
        description="Browse by category, or press ⌘K to search inside article text from anywhere in learnIT."
      />

      <KnowledgeBrowser articles={cards} basePath={basePath} />

      {isDemoMode() ? <InternalContentNotice /> : null}
    </PageContainer>
  );
}

/**
 * Explains the gap in the demo build without disclosing anything about what is
 * missing — no titles, no counts, no categories.
 */
function InternalContentNotice() {
  return (
    <Surface className="mt-8 p-5">
      <div className="flex gap-3">
        <Lock className="mt-0.5 size-4 shrink-0 text-tertiary" aria-hidden />
        <div>
          <h2 className="text-sm font-medium text-primary">
            Internal procedures are not in this build
          </h2>
          <p className="mt-1.5 text-sm leading-6 text-secondary">
            learnIT also hosts internal-only Help Desk documentation — escalation
            paths, security procedures, and operational detail that should not be
            public. That content is excluded from the demonstration build entirely
            rather than hidden in the interface.
          </p>
        </div>
      </div>
    </Surface>
  );
}

/* ========================================================================== *
 * Article
 * ========================================================================== */

export async function ArticleScreen({
  viewer,
  slug,
  basePath = "",
}: {
  viewer: Viewer;
  slug: string;
  basePath?: string;
}) {
  const article = await getArticle(viewer, slug);
  if (!article) notFound();

  const [links, all] = await Promise.all([
    buildLinkMap(viewer),
    listArticles(viewer),
  ]);

  // Only surface related articles this viewer can actually open.
  const related = article.related
    .map((relatedSlug) => all.find((candidate) => candidate.slug === relatedSlug))
    .filter((candidate): candidate is (typeof all)[number] => Boolean(candidate));

  const sameCategory = all
    .filter((candidate) => candidate.category === article.category)
    .filter((candidate) => candidate.slug !== article.slug)
    .filter((candidate) => !related.some((r) => r.slug === candidate.slug))
    .slice(0, 3);

  return (
    <PageContainer width="reading">
      <Link
        href={`${basePath}/knowledge`}
        className="mb-6 inline-flex items-center gap-2 text-sm text-tertiary transition-colors hover:text-primary"
      >
        <ArrowLeft className="size-4" aria-hidden />
        Knowledge Base
      </Link>

      <PageHeader
        title={article.title}
        description={article.summary}
        meta={
          <div className="flex flex-wrap items-center gap-2">
            <Badge tone="neutral">{CATEGORY_LABELS[article.category]}</Badge>
            {article.status !== "published" ? (
              <Badge tone="warning">
                {article.status === "draft" ? "Draft" : "Archived"}
              </Badge>
            ) : null}
            {article.visibility === "staff" ? <Badge tone="signal">Internal</Badge> : null}
            <MetaLine
              className="ml-1"
              items={[
                `Updated ${formatDate(article.updatedAt)}`,
                article.updatedBy,
                `Revision ${article.revision}`,
              ]}
            />
          </div>
        }
      />

      <article className="border-t border-subtle pt-8">
        <Blocks blocks={article.body} links={links} />
      </article>

      {article.tags.length > 0 ? (
        <div className="mt-10 flex flex-wrap items-center gap-2 border-t border-subtle pt-6">
          <span className="eyebrow">Tags</span>
          {article.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-md border border-subtle bg-surface-inset px-2 py-0.5 font-mono text-xs text-tertiary"
            >
              {tag}
            </span>
          ))}
        </div>
      ) : null}

      <ReportOutdated
        resourceType="article"
        resourceSlug={article.slug}
        resourceTitle={article.title}
        className="mt-8"
      />

      {related.length > 0 || sameCategory.length > 0 ? (
        <section className="mt-12 border-t border-subtle pt-8">
          <SectionHeading
            className="mb-4"
            title="Related"
            description="Procedures that usually come up alongside this one."
          />
          <ul className="grid gap-2.5 sm:grid-cols-2">
            {[...related, ...sameCategory].map((candidate) => (
              <li key={candidate.slug}>
                <Link
                  href={`${basePath}/knowledge/${candidate.slug}`}
                  className="group flex h-full items-start gap-2 rounded-lg border border-subtle bg-surface-raised px-4 py-3 transition-colors hover:border-default hover:bg-surface-overlay"
                >
                  <span className="min-w-0 flex-1">
                    <span className="block text-sm font-medium leading-6 text-primary">
                      {candidate.title}
                    </span>
                    <span className="mt-0.5 block text-xs text-tertiary">
                      Updated {relativeDate(candidate.updatedAt)}
                    </span>
                  </span>
                  <ArrowRight
                    className="mt-1 size-3.5 shrink-0 text-tertiary transition-transform group-hover:translate-x-0.5"
                    aria-hidden
                  />
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </PageContainer>
  );
}

/** Pre-render every article the public may see. */
export async function knowledgeStaticParams(viewer: Viewer) {
  const articles = await listArticles(viewer);
  return articles.map((article) => ({ slug: article.slug }));
}
