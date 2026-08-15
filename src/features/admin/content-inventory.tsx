import Link from "next/link";
import { ArrowUpRight, FileCode2 } from "lucide-react";
import { PageContainer, PageHeader } from "@/components/ui/page";
import { Badge, SectionHeading, Surface } from "@/components/ui/primitives";
import type { Viewer } from "@/lib/auth/types";
import { CATEGORY_LABELS, type ContentStatus, type Visibility } from "@/lib/content/schema";
import {
  contentIsWritable,
  listArticles,
  listFlows,
  listModules,
  listResponses,
  listScenarios,
} from "@/lib/content/repository";
import { formatDate } from "@/lib/format";

/**
 * Content inventory.
 *
 * A single view of everything the platform holds, with the two fields that
 * actually matter operationally — publication status and visibility — plus when
 * it was last reviewed and by whom.
 *
 * Under the file adapter this is read-only, and says so. It still earns its
 * place: it is the only screen that shows the whole content set at once, which
 * is exactly what you want before a semester starts.
 */

interface Row {
  slug: string;
  title: string;
  kind: string;
  category: string;
  status: ContentStatus;
  visibility: Visibility;
  updatedAt: string;
  updatedBy: string;
  href: string | null;
  /** Where the record is authored, for the file adapter. */
  source: string;
}

const STATUS_TONE = {
  published: "success",
  draft: "warning",
  archived: "neutral",
} as const;

export async function ContentInventoryScreen({ viewer }: { viewer: Viewer }) {
  const [articles, modules, flows, responses, scenarios] = await Promise.all([
    listArticles(viewer),
    listModules(viewer),
    listFlows(viewer),
    listResponses(viewer),
    listScenarios(viewer),
  ]);

  const rows: Row[] = [
    ...articles.map((record) => ({
      slug: record.slug,
      title: record.title,
      kind: "Article",
      category: CATEGORY_LABELS[record.category],
      status: record.status,
      visibility: record.visibility,
      updatedAt: record.updatedAt,
      updatedBy: record.updatedBy,
      href: `/knowledge/${record.slug}`,
      source: "src/content/articles/",
    })),
    ...modules.map((record) => ({
      slug: record.slug,
      title: record.title,
      kind: "Module",
      category: CATEGORY_LABELS[record.category],
      status: record.status,
      visibility: record.visibility,
      updatedAt: record.updatedAt,
      updatedBy: record.updatedBy,
      href: `/training/${record.slug}`,
      source: "src/content/modules/",
    })),
    ...flows.map((record) => ({
      slug: record.slug,
      title: record.title,
      kind: "Workflow",
      category: CATEGORY_LABELS[record.category],
      status: record.status,
      visibility: record.visibility,
      updatedAt: record.updatedAt,
      updatedBy: record.updatedBy,
      href: `/troubleshoot/${record.slug}`,
      source: "src/content/flows.ts",
    })),
    ...responses.map((record) => ({
      slug: record.slug,
      title: record.title,
      kind: "Response",
      category: CATEGORY_LABELS[record.category],
      status: record.status,
      visibility: record.visibility,
      updatedAt: record.updatedAt,
      updatedBy: record.updatedBy,
      href: `/responses?open=${record.slug}`,
      source: "src/content/responses.ts",
    })),
    ...scenarios.map((record) => ({
      slug: record.slug,
      title: record.title,
      kind: "Scenario",
      category: CATEGORY_LABELS[record.category],
      status: record.status,
      visibility: record.visibility,
      updatedAt: record.updatedAt,
      updatedBy: record.updatedBy,
      href: `/practice/${record.slug}`,
      source: "src/content/scenarios.ts",
    })),
  ].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));

  const writable = contentIsWritable();

  return (
    <PageContainer width="wide">
      <PageHeader
        eyebrow="Admin console"
        title="Content inventory"
        description="Everything learnIT holds, most recently reviewed first."
      />

      {!writable ? (
        <div className="mb-6 flex gap-3 rounded-lg border border-subtle bg-surface-raised px-4 py-3.5">
          <FileCode2 className="mt-0.5 size-4 shrink-0 text-tertiary" aria-hidden />
          <p className="text-sm leading-6 text-secondary">
            Content is authored in the repository under{" "}
            <span className="font-mono text-xs text-primary">src/content/</span> and
            validated by{" "}
            <span className="font-mono text-xs text-primary">npm run content:validate</span>{" "}
            before deploy — so every procedure change gets review and a history. See{" "}
            <span className="font-mono text-xs text-primary">docs/content.md</span> for
            how to add or revise a record, and{" "}
            <span className="font-mono text-xs text-primary">docs/architecture.md</span>{" "}
            for enabling in-app editing.
          </p>
        </div>
      ) : null}

      <SectionHeading
        className="mb-4"
        title={`${rows.length} records`}
        description="Status and visibility are the two fields that determine who can see a record."
      />

      <Surface className="overflow-hidden">
        {/* Horizontal scroll is contained here — the page body never scrolls
            sideways on a narrow screen. */}
        <div className="overflow-x-auto">
          <table className="w-full min-w-[52rem] border-collapse text-sm">
            <caption className="sr-only">
              All learnIT content records with status, visibility, and last review date
            </caption>
            <thead>
              <tr className="border-b border-subtle text-left">
                <th scope="col" className="px-4 py-3 font-medium text-tertiary">
                  Title
                </th>
                <th scope="col" className="px-4 py-3 font-medium text-tertiary">
                  Type
                </th>
                <th scope="col" className="px-4 py-3 font-medium text-tertiary">
                  Category
                </th>
                <th scope="col" className="px-4 py-3 font-medium text-tertiary">
                  Status
                </th>
                <th scope="col" className="px-4 py-3 font-medium text-tertiary">
                  Visibility
                </th>
                <th scope="col" className="px-4 py-3 font-medium text-tertiary">
                  Reviewed
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-subtle">
              {rows.map((row) => (
                <tr key={`${row.kind}-${row.slug}`} className="hover:bg-surface-overlay">
                  <td className="px-4 py-3">
                    {row.href ? (
                      <Link
                        href={row.href}
                        className="group flex items-center gap-1.5 font-medium text-primary"
                      >
                        <span className="truncate">{row.title}</span>
                        <ArrowUpRight
                          className="size-3.5 shrink-0 text-tertiary transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                          aria-hidden
                        />
                      </Link>
                    ) : (
                      <span className="font-medium text-primary">{row.title}</span>
                    )}
                    <span className="mt-0.5 block font-mono text-xs text-tertiary">
                      {row.slug}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-secondary">{row.kind}</td>
                  <td className="px-4 py-3 text-secondary">{row.category}</td>
                  <td className="px-4 py-3">
                    <Badge tone={STATUS_TONE[row.status]}>{row.status}</Badge>
                  </td>
                  <td className="px-4 py-3">
                    <Badge tone={row.visibility === "staff" ? "signal" : "neutral"}>
                      {row.visibility === "staff" ? "Internal" : "Public"}
                    </Badge>
                  </td>
                  <td className="px-4 py-3">
                    <span className="tabular block text-secondary">
                      {formatDate(row.updatedAt)}
                    </span>
                    <span className="mt-0.5 block text-xs text-tertiary">
                      {row.updatedBy}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Surface>
    </PageContainer>
  );
}
