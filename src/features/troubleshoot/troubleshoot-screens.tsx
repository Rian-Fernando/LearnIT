import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  Key,
  Monitor,
  Printer,
  Shield,
  Wrench,
} from "lucide-react";
import { PageContainer, PageHeader } from "@/components/ui/page";
import { Badge, EmptyState, MetaLine } from "@/components/ui/primitives";
import type { Viewer } from "@/lib/auth/types";
import { CATEGORY_LABELS } from "@/lib/content/schema";
import {
  buildLinkMap,
  getFlow,
  listArticles,
  listFlows,
  listResponses,
} from "@/lib/content/repository";
import { formatDate } from "@/lib/format";
import { ReportOutdated } from "@/features/feedback/report-outdated";
import { FlowRunner } from "./flow-runner";

/** Content declares an icon name; the mapping to a component lives here so the
 *  content model stays free of UI dependencies. */
const ICONS: Record<string, typeof Wrench> = {
  printer: Printer,
  shield: Shield,
  key: Key,
  monitor: Monitor,
  wrench: Wrench,
};

/* ========================================================================== *
 * Index
 * ========================================================================== */

export async function TroubleshootIndexScreen({
  viewer,
  basePath = "",
}: {
  viewer: Viewer;
  basePath?: string;
}) {
  const flows = await listFlows(viewer);

  return (
    <PageContainer>
      <PageHeader
        eyebrow="Troubleshoot"
        title="What are you helping someone with?"
        description="Answer a few questions and learnIT walks you to a next step — including when the right answer is to redirect or escalate."
      />

      {flows.length === 0 ? (
        <EmptyState
          icon={<Wrench className="size-6" aria-hidden />}
          title="No workflows available"
          description="Troubleshooting workflows are published by Help Desk leadership from the admin console."
        />
      ) : (
        <ul className="grid gap-3 sm:grid-cols-2">
          {flows.map((flow) => {
            const Icon = ICONS[flow.icon] ?? Wrench;
            return (
              <li key={flow.slug}>
                <Link
                  href={`${basePath}/troubleshoot/${flow.slug}`}
                  className="group flex h-full flex-col rounded-xl border border-subtle bg-surface-raised p-5 transition-colors hover:border-default hover:bg-surface-overlay"
                >
                  <span className="flex size-10 items-center justify-center rounded-lg border border-accent/25 bg-accent-soft">
                    <Icon className="size-5 text-accent-text" aria-hidden />
                  </span>

                  <h2 className="mt-4 flex items-start gap-1.5 text-base font-medium leading-6 text-primary">
                    <span className="min-w-0 flex-1">{flow.entryLabel}</span>
                    <ArrowRight
                      className="mt-1 size-4 shrink-0 text-tertiary transition-transform group-hover:translate-x-0.5"
                      aria-hidden
                    />
                  </h2>

                  <p className="mt-1.5 flex-1 text-sm leading-6 text-secondary">
                    {flow.summary}
                  </p>

                  <p className="tabular mt-4 text-xs text-tertiary">
                    {flow.nodes.filter((node) => node.kind === "question").length}{" "}
                    questions · {flow.nodes.filter((node) => node.kind === "outcome").length}{" "}
                    outcomes
                  </p>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </PageContainer>
  );
}

/* ========================================================================== *
 * Flow
 * ========================================================================== */

export async function FlowScreen({
  viewer,
  slug,
  basePath = "",
}: {
  viewer: Viewer;
  slug: string;
  basePath?: string;
}) {
  const flow = await getFlow(viewer, slug);
  if (!flow) notFound();

  const [links, articles, responses] = await Promise.all([
    buildLinkMap(viewer),
    listArticles(viewer),
    listResponses(viewer),
  ]);

  // Titles are resolved server-side and passed down, so the runner can render
  // reference cards without shipping the whole content set to the client — and
  // so a reference this viewer cannot open simply never appears.
  const articleTitles = Object.fromEntries(
    articles.map((article) => [article.slug, article.title]),
  );
  const responseTitles = Object.fromEntries(
    responses.map((response) => [response.slug, response.title]),
  );

  return (
    <PageContainer width="reading">
      <Link
        href={`${basePath}/troubleshoot`}
        className="mb-6 inline-flex items-center gap-2 text-sm text-tertiary transition-colors hover:text-primary"
      >
        <ArrowLeft className="size-4" aria-hidden />
        Troubleshoot
      </Link>

      <PageHeader
        eyebrow="Guided workflow"
        title={flow.title}
        description={flow.summary}
        meta={
          <div className="flex flex-wrap items-center gap-2">
            <Badge tone="neutral">{CATEGORY_LABELS[flow.category]}</Badge>
            <MetaLine
              className="ml-1"
              items={[`Updated ${formatDate(flow.updatedAt)}`, flow.updatedBy]}
            />
          </div>
        }
      />

      <div className="border-t border-subtle pt-8">
        <FlowRunner
          flow={flow}
          links={links}
          basePath={basePath}
          articleTitles={articleTitles}
          responseTitles={responseTitles}
        />
      </div>

      <ReportOutdated
        resourceType="flow"
        resourceSlug={flow.slug}
        resourceTitle={flow.title}
        className="mt-12"
      />
    </PageContainer>
  );
}

export async function troubleshootStaticParams(viewer: Viewer) {
  const flows = await listFlows(viewer);
  return flows.map((flow) => ({ slug: flow.slug }));
}
