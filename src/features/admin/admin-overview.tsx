import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  Clock,
  Database,
  Flag,
  GraduationCap,
  Link2,
  MessageSquareQuote,
  Route,
  Terminal,
  TriangleAlert,
} from "lucide-react";
import { PageContainer, PageHeader } from "@/components/ui/page";
import { Badge, SectionHeading, Surface } from "@/components/ui/primitives";
import type { Viewer } from "@/lib/auth/types";
import { getContentHealth } from "@/lib/analytics/content-health";
import { contentIsWritable } from "@/lib/content/repository";
import { getOverrideStore } from "@/lib/admin/overrides";
import { formatMinutes, relativeDate } from "@/lib/format";

/**
 * Admin overview.
 *
 * Leads with the things an administrator can act on today — the review queue,
 * unconfigured links, stale procedures — rather than a wall of counts. Every
 * number here is derived from content, so it is accurate from the first deploy
 * without any tracking infrastructure.
 */
export async function AdminOverviewScreen({ viewer }: { viewer: Viewer }) {
  const health = await getContentHealth(viewer);
  const writable = contentIsWritable();
  const overridesDurable = getOverrideStore().durable;

  const actionable =
    health.reports.open +
    health.unconfiguredLinks.length +
    health.stale.length;

  return (
    <PageContainer width="wide">
      <PageHeader
        eyebrow="Admin console"
        title="Content and onboarding health"
        description="What needs attention, and what the platform currently holds."
      />

      <PersistenceNotice writable={writable} overridesDurable={overridesDurable} />

      {/* --------------------------------------------------------- attention */}
      <section aria-labelledby="attention" className="mb-10">
        <SectionHeading
          className="mb-4"
          title="Needs attention"
          description={
            actionable === 0
              ? "Nothing outstanding."
              : `${actionable} item${actionable === 1 ? "" : "s"} an administrator can act on.`
          }
        />
        <h2 id="attention" className="sr-only">
          Needs attention
        </h2>

        <div className="grid gap-3 sm:grid-cols-3">
          <AttentionCard
            href="/admin/review"
            icon={Flag}
            count={health.reports.open}
            label="Open reports"
            detail={
              health.reports.open === 0
                ? "No documentation issues reported"
                : "Reported by technicians using the platform"
            }
            tone={health.reports.open > 0 ? "warning" : "neutral"}
          />
          <AttentionCard
            href="/admin/links"
            icon={Link2}
            count={health.unconfiguredLinks.length}
            label="Unconfigured links"
            detail={
              health.unconfiguredLinks.length === 0
                ? "Every system link is set"
                : "Placeholders showing in articles and on the dashboard"
            }
            tone={health.unconfiguredLinks.length > 0 ? "danger" : "neutral"}
          />
          <AttentionCard
            href="/admin/content"
            icon={Clock}
            count={health.stale.length}
            label="Due for review"
            detail={
              health.stale.length === 0
                ? "All procedures reviewed recently"
                : "Not reviewed in over four months"
            }
            tone={health.stale.length > 0 ? "warning" : "neutral"}
          />
        </div>
      </section>

      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_22rem]">
        <div className="space-y-8">
          {/* ------------------------------------------------------- stale */}
          {health.stale.length > 0 ? (
            <section>
              <SectionHeading
                className="mb-4"
                title="Procedures due for review"
                description="Age is not the same as inaccuracy — but a procedure nobody has looked at in months is where inaccuracy hides."
              />
              <Surface>
                <ul className="divide-y divide-subtle">
                  {health.stale.slice(0, 8).map((entry) => (
                    <li key={entry.slug}>
                      <Link
                        href={`/knowledge/${entry.slug}`}
                        className="flex items-center gap-4 px-4 py-3.5 transition-colors hover:bg-surface-overlay"
                      >
                        <span className="min-w-0 flex-1 truncate text-sm text-primary">
                          {entry.title}
                        </span>
                        <span className="tabular shrink-0 text-xs text-tertiary">
                          {relativeDate(entry.updatedAt)}
                        </span>
                        <ArrowRight
                          className="size-3.5 shrink-0 text-tertiary"
                          aria-hidden
                        />
                      </Link>
                    </li>
                  ))}
                </ul>
              </Surface>
            </section>
          ) : null}

          {/* -------------------------------------------------- repeat flags */}
          {health.reports.repeatedlyFlagged.length > 0 ? (
            <section>
              <SectionHeading
                className="mb-4"
                title="Flagged more than once"
                description="The strongest signal in the platform. Two people independently reporting the same page is rarely a coincidence."
              />
              <Surface>
                <ul className="divide-y divide-subtle">
                  {health.reports.repeatedlyFlagged.map((entry) => (
                    <li
                      key={entry.slug}
                      className="flex items-center gap-3 px-4 py-3.5"
                    >
                      <span className="min-w-0 flex-1 truncate font-mono text-sm text-primary">
                        {entry.slug}
                      </span>
                      <Badge tone="warning">{entry.count} reports</Badge>
                    </li>
                  ))}
                </ul>
              </Surface>
            </section>
          ) : null}

          {/* -------------------------------------------------------- gaps */}
          {health.gaps.length > 0 ? (
            <section>
              <SectionHeading
                className="mb-4"
                title="Coverage gaps"
                description="Where the onboarding material has a hole. These are suggestions, not faults."
              />
              <Surface className="p-5">
                <ul className="space-y-2.5">
                  {health.gaps.slice(0, 6).map((gap) => (
                    <li key={gap} className="flex gap-2.5 text-sm leading-6 text-secondary">
                      <span
                        aria-hidden
                        className="mt-[0.6875rem] size-1 shrink-0 rounded-full bg-tertiary"
                      />
                      {gap}
                    </li>
                  ))}
                </ul>
              </Surface>
            </section>
          ) : null}
        </div>

        {/* ---------------------------------------------------------- rail */}
        <aside className="space-y-6">
          <Surface className="p-5">
            <h2 className="text-sm font-medium text-primary">Content inventory</h2>
            <dl className="mt-4 space-y-2.5">
              <InventoryRow icon={BookOpen} label="Articles" value={health.totals.articles} />
              <InventoryRow icon={GraduationCap} label="Modules" value={health.totals.modules} />
              <InventoryRow icon={Route} label="Workflows" value={health.totals.flows} />
              <InventoryRow
                icon={MessageSquareQuote}
                label="Responses"
                value={health.totals.responses}
              />
              <InventoryRow icon={Terminal} label="Scenarios" value={health.totals.scenarios} />
              <InventoryRow icon={Link2} label="Links" value={health.totals.links} />
            </dl>

            <Link
              href="/admin/content"
              className="mt-4 flex items-center gap-1.5 text-sm text-accent-text transition-colors hover:text-accent"
            >
              Browse all content
              <ArrowRight className="size-3.5" aria-hidden />
            </Link>
          </Surface>

          <Surface className="p-5">
            <h2 className="text-sm font-medium text-primary">Publication</h2>
            <dl className="mt-4 space-y-2.5 text-sm">
              <div className="flex items-baseline justify-between">
                <dt className="text-secondary">Published</dt>
                <dd className="tabular font-medium text-primary">
                  {health.byStatus.published}
                </dd>
              </div>
              <div className="flex items-baseline justify-between">
                <dt className="text-secondary">Draft</dt>
                <dd className="tabular font-medium text-primary">{health.byStatus.draft}</dd>
              </div>
              <div className="flex items-baseline justify-between">
                <dt className="text-secondary">Archived</dt>
                <dd className="tabular font-medium text-primary">
                  {health.byStatus.archived}
                </dd>
              </div>
              <div className="mt-3 flex items-baseline justify-between border-t border-subtle pt-3">
                <dt className="text-secondary">Public</dt>
                <dd className="tabular font-medium text-primary">
                  {health.byVisibility.public}
                </dd>
              </div>
              <div className="flex items-baseline justify-between">
                <dt className="text-secondary">Internal only</dt>
                <dd className="tabular font-medium text-primary">
                  {health.byVisibility.staff}
                </dd>
              </div>
            </dl>
          </Surface>

          <Surface className="p-5">
            <h2 className="text-sm font-medium text-primary">Onboarding shape</h2>
            <p className="mt-3 text-sm leading-6 text-secondary">
              A new technician works through{" "}
              <span className="tabular font-medium text-primary">
                {health.onboarding.totalSteps} steps
              </span>{" "}
              across {health.totals.modules} modules — roughly{" "}
              <span className="tabular font-medium text-primary">
                {formatMinutes(health.onboarding.totalMinutes)}
              </span>{" "}
              of material, with {health.onboarding.checks} knowledge checks.
            </p>
          </Surface>
        </aside>
      </div>
    </PageContainer>
  );
}

/* -------------------------------------------------------------------------- */

/**
 * States plainly what this deployment can and cannot persist. An admin console
 * that silently discards work on restart would be worse than no console.
 */
function PersistenceNotice({
  writable,
  overridesDurable,
}: {
  writable: boolean;
  overridesDurable: boolean;
}) {
  if (writable && overridesDurable) return null;

  return (
    <div className="mb-8 flex gap-3 rounded-lg border border-warning/30 bg-warning-soft px-4 py-3.5">
      <Database className="mt-0.5 size-4 shrink-0 text-warning" aria-hidden />
      <div className="min-w-0">
        <p className="text-sm font-semibold text-warning">
          This deployment uses the file content adapter
        </p>
        <p className="mt-1 text-sm leading-6 text-secondary">
          Articles, modules, workflows, responses, and scenarios are authored in
          the repository and reviewed like code — they are read-only here.{" "}
          <span className="font-medium text-primary">
            Links and notices are editable
          </span>
          , and take effect immediately, but are held in memory and reset when the
          server restarts. Configure the Postgres adapter to make every change
          durable. See <span className="font-mono text-xs">docs/architecture.md</span>.
        </p>
      </div>
    </div>
  );
}

function AttentionCard({
  href,
  icon: Icon,
  count,
  label,
  detail,
  tone,
}: {
  href: string;
  icon: typeof Flag;
  count: number;
  label: string;
  detail: string;
  tone: "neutral" | "warning" | "danger";
}) {
  const accent =
    tone === "danger"
      ? "text-danger"
      : tone === "warning"
        ? "text-warning"
        : "text-tertiary";

  return (
    <Link
      href={href}
      className="group flex flex-col rounded-xl border border-subtle bg-surface-raised p-5 transition-colors hover:border-default hover:bg-surface-overlay"
    >
      <div className="flex items-center justify-between">
        <Icon className={`size-4 ${accent}`} aria-hidden />
        {count > 0 ? (
          <TriangleAlert className={`size-3.5 ${accent}`} aria-hidden />
        ) : null}
      </div>
      <p className="tabular mt-4 text-3xl font-semibold tracking-tight text-primary">
        {count}
      </p>
      <p className="mt-1 flex items-center gap-1.5 text-sm font-medium text-primary">
        {label}
        <ArrowRight
          className="size-3.5 text-tertiary transition-transform group-hover:translate-x-0.5"
          aria-hidden
        />
      </p>
      <p className="mt-1 text-xs leading-5 text-tertiary">{detail}</p>
    </Link>
  );
}

function InventoryRow({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof BookOpen;
  label: string;
  value: number;
}) {
  return (
    <div className="flex items-center gap-2.5">
      <Icon className="size-3.5 shrink-0 text-tertiary" aria-hidden />
      <dt className="flex-1 text-sm text-secondary">{label}</dt>
      <dd className="tabular text-sm font-medium text-primary">{value}</dd>
    </div>
  );
}
