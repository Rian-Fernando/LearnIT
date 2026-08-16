import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, CircleAlert, ListChecks, Ticket } from "lucide-react";
import { PageContainer, PageHeader } from "@/components/ui/page";
import { Badge, MetaLine, SectionHeading, Surface } from "@/components/ui/primitives";
import { VerificationBadge } from "@/components/content/verification-badge";
import type { Viewer } from "@/lib/auth/types";
import { CATEGORY_LABELS } from "@/lib/content/schema";
import { getChecklist, getTicket, listTickets } from "@/lib/content/repository";
import { formatDate } from "@/lib/format";

/* ========================================================================== *
 * Checklist
 * ========================================================================== */

/**
 * A checklist rendered for actual use, not for reading.
 *
 * Deliberately not interactive: this gets opened mid-call, often on a second
 * monitor, and a technician does not need state to manage on top of the call
 * they are already running. Grouped headings and conditional markers do the
 * work instead.
 */
export async function ChecklistScreen({
  viewer,
  slug,
  basePath = "",
}: {
  viewer: Viewer;
  slug: string;
  basePath?: string;
}) {
  const checklist = await getChecklist(viewer, slug);
  if (!checklist) notFound();

  const total = checklist.groups.reduce((sum, group) => sum + group.items.length, 0);

  return (
    <PageContainer width="reading">
      <Link
        href={`${basePath}/dashboard`}
        className="mb-6 inline-flex items-center gap-2 text-sm text-tertiary transition-colors hover:text-primary"
      >
        <ArrowLeft className="size-4" aria-hidden />
        Dashboard
      </Link>

      <PageHeader
        eyebrow="Checklist"
        title={checklist.title}
        description={checklist.summary}
        meta={
          <div className="flex flex-wrap items-center gap-2">
            <Badge tone="neutral">{CATEGORY_LABELS[checklist.category]}</Badge>
            <VerificationBadge
              verification={checklist.verification}
              verifiedBy={checklist.verifiedBy}
              verifiedAt={checklist.verifiedAt}
            />
            <MetaLine
              className="ml-1"
              items={[`${total} checks`, `Updated ${formatDate(checklist.updatedAt)}`]}
            />
          </div>
        }
      />

      <div className="rounded-lg border border-accent/25 bg-accent-soft px-4 py-3.5">
        <div className="flex gap-3">
          <ListChecks className="mt-0.5 size-4 shrink-0 text-accent-text" aria-hidden />
          <p className="text-sm leading-6 text-secondary">{checklist.purpose}</p>
        </div>
      </div>

      <div className="mt-8 space-y-8">
        {checklist.groups.map((group) => (
          <section key={group.label}>
            <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-tertiary">
              {group.label}
            </h2>
            <Surface>
              <ul className="divide-y divide-subtle">
                {group.items.map((item) => (
                  <li key={item.id} className="flex gap-3 px-4 py-3.5">
                    <span
                      aria-hidden
                      className="mt-1 size-4 shrink-0 rounded border border-strong"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="text-[0.9375rem] leading-6 text-primary">{item.text}</p>
                      {item.appliesWhen ? (
                        <p className="mt-1 text-xs font-medium text-accent-text">
                          Only when {item.appliesWhen}
                        </p>
                      ) : null}
                      {item.detail ? (
                        <p className="mt-1 text-sm leading-6 text-tertiary">{item.detail}</p>
                      ) : null}
                    </div>
                  </li>
                ))}
              </ul>
            </Surface>
          </section>
        ))}
      </div>
    </PageContainer>
  );
}

/* ========================================================================== *
 * Reference ticket
 * ========================================================================== */

export async function TicketIndexScreen({
  viewer,
  basePath = "",
}: {
  viewer: Viewer;
  basePath?: string;
}) {
  const tickets = await listTickets(viewer);

  return (
    <PageContainer>
      <PageHeader
        eyebrow="Reference tickets"
        title="What a good ticket actually looks like"
        description="Complete worked examples, with the fields filled in as they would be in Footprints. Every name, username, and reference below is invented."
      />

      {tickets.length === 0 ? (
        <Surface className="p-5">
          <p className="text-sm text-secondary">No reference tickets published yet.</p>
        </Surface>
      ) : (
        <ul className="grid gap-3 sm:grid-cols-2">
          {tickets.map((ticket) => (
            <li key={ticket.slug}>
              <Link
                href={`${basePath}/tickets/${ticket.slug}`}
                className="group flex h-full flex-col rounded-xl border border-subtle bg-surface-raised p-5 transition-colors hover:border-default hover:bg-surface-overlay"
              >
                <div className="flex flex-wrap items-center gap-2">
                  <Badge tone="neutral">{CATEGORY_LABELS[ticket.category]}</Badge>
                  <VerificationBadge verification={ticket.verification} />
                </div>
                <h2 className="mt-3 text-base font-medium leading-6 text-primary">
                  {ticket.title}
                </h2>
                <p className="mt-1.5 flex-1 text-sm leading-6 text-secondary">
                  {ticket.summary}
                </p>
                <p className="mt-4 font-mono text-xs text-tertiary">
                  {ticket.fields.title}
                </p>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </PageContainer>
  );
}

export async function TicketScreen({
  viewer,
  slug,
  basePath = "",
}: {
  viewer: Viewer;
  slug: string;
  basePath?: string;
}) {
  const ticket = await getTicket(viewer, slug);
  if (!ticket) notFound();

  const { fields, contact } = ticket;

  return (
    <PageContainer width="reading">
      <Link
        href={`${basePath}/tickets`}
        className="mb-6 inline-flex items-center gap-2 text-sm text-tertiary transition-colors hover:text-primary"
      >
        <ArrowLeft className="size-4" aria-hidden />
        Reference tickets
      </Link>

      <PageHeader
        eyebrow="Worked example"
        title={ticket.title}
        description={ticket.situation}
        meta={
          <div className="flex flex-wrap items-center gap-2">
            <Badge tone="neutral">{CATEGORY_LABELS[ticket.category]}</Badge>
            <VerificationBadge
              verification={ticket.verification}
              verifiedBy={ticket.verifiedBy}
              verifiedAt={ticket.verifiedAt}
            />
          </div>
        }
      />

      <div className="mb-6 flex gap-3 rounded-lg border border-signal/25 bg-signal-soft px-4 py-3.5">
        <CircleAlert className="mt-0.5 size-4 shrink-0 text-signal" aria-hidden />
        <p className="text-sm leading-6 text-secondary">
          Every detail below is fictional — the name, username, phone number, and
          room are invented for training. Real tickets are never reproduced here.
        </p>
      </div>

      {/* ---------------------------------------------------------- fields */}
      <section className="space-y-6">
        <div>
          <SectionHeading className="mb-3" title="The ticket" />
          <Surface className="overflow-hidden">
            <div className="flex items-center gap-2 border-b border-subtle px-4 py-3">
              <Ticket className="size-4 text-tertiary" aria-hidden />
              <span className="font-mono text-sm text-primary">{fields.title}</span>
            </div>
            <dl className="divide-y divide-subtle">
              {(
                [
                  ["Template", fields.template],
                  ["Priority", fields.priority],
                  ["Status", fields.status],
                  ["Inquiry", fields.inquiry],
                  ["Category", fields.category],
                  ["Subcategory", fields.subcategory],
                  ["Division", fields.division],
                  ["Location Of Work To Be Done", fields.locationOfWork],
                  ["Room", fields.room],
                  ["Property tag", fields.propertyTag],
                ] as const
              )
                .filter(([, value]) => Boolean(value))
                .map(([label, value]) => (
                  <div
                    key={label}
                    className="grid gap-1 px-4 py-2.5 sm:grid-cols-[minmax(0,15rem)_1fr] sm:gap-4"
                  >
                    <dt className="text-sm text-tertiary">{label}</dt>
                    <dd className="text-sm text-primary">{value}</dd>
                  </div>
                ))}
            </dl>
          </Surface>
        </div>

        <div>
          <SectionHeading className="mb-3" title="Contact information" />
          <Surface>
            <dl className="divide-y divide-subtle">
              {(
                [
                  ["First name", contact.firstName],
                  ["Last name", contact.lastName],
                  ["User ID", contact.userId],
                  ["Phone", contact.phone],
                  ["Department", contact.department],
                  ["Secondary email", contact.secondaryEmail],
                ] as const
              )
                .filter(([, value]) => Boolean(value))
                .map(([label, value]) => (
                  <div
                    key={label}
                    className="grid gap-1 px-4 py-2.5 sm:grid-cols-[minmax(0,15rem)_1fr] sm:gap-4"
                  >
                    <dt className="text-sm text-tertiary">{label}</dt>
                    <dd className="text-sm text-primary">{value}</dd>
                  </div>
                ))}
            </dl>
          </Surface>
        </div>

        <div>
          <SectionHeading className="mb-3" title="Description" />
          <figure className="overflow-hidden rounded-lg border border-subtle bg-surface-sunken">
            <pre className="overflow-x-auto px-4 py-3.5">
              <code className="whitespace-pre-wrap break-words font-mono text-[0.8125rem] leading-6 text-secondary">
                {ticket.description}
              </code>
            </pre>
          </figure>
        </div>

        <div>
          <SectionHeading className="mb-3" title="Assignees and notifications" />
          <Surface className="p-4">
            <p className="text-xs text-tertiary">Assignees</p>
            <ul className="mt-1.5 flex flex-wrap gap-1.5">
              {ticket.assignees.map((assignee) => (
                <li
                  key={assignee}
                  className="rounded-md border border-subtle bg-surface-inset px-2 py-0.5 font-mono text-xs text-primary"
                >
                  {assignee}
                </li>
              ))}
            </ul>
            <p className="mt-4 text-xs text-tertiary">Send email to</p>
            <ul className="mt-1.5 space-y-1 text-sm text-secondary">
              <li>
                Assignees — {ticket.notifications.assignees ? "checked" : "unchecked"}
              </li>
              <li>Contact — {ticket.notifications.contact ? "checked" : "unchecked"}</li>
              {ticket.notifications.cc ? <li>CC — {ticket.notifications.cc}</li> : null}
            </ul>
          </Surface>
        </div>
      </section>

      {/* ------------------------------------------------------- commentary */}
      <section className="mt-10 grid gap-4 sm:grid-cols-2">
        <Surface className="border-success/25 bg-success-soft p-5">
          <h2 className="text-sm font-semibold text-success">What makes it good</h2>
          <ul className="mt-3 space-y-2">
            {ticket.whatMakesItGood.map((point) => (
              <li key={point} className="flex gap-2.5 text-sm leading-6 text-secondary">
                <span
                  aria-hidden
                  className="mt-[0.6875rem] size-1 shrink-0 rounded-full bg-success"
                />
                {point}
              </li>
            ))}
          </ul>
        </Surface>

        {ticket.commonMistakes.length > 0 ? (
          <Surface className="border-danger/25 bg-danger-soft p-5">
            <h2 className="text-sm font-semibold text-danger">Common mistakes</h2>
            <ul className="mt-3 space-y-2">
              {ticket.commonMistakes.map((point) => (
                <li key={point} className="flex gap-2.5 text-sm leading-6 text-secondary">
                  <span
                    aria-hidden
                    className="mt-[0.6875rem] size-1 shrink-0 rounded-full bg-danger"
                  />
                  {point}
                </li>
              ))}
            </ul>
          </Surface>
        ) : null}
      </section>

      {ticket.articleSlugs.length > 0 ? (
        <section className="mt-10 border-t border-subtle pt-6">
          <SectionHeading className="mb-3" title="Related procedures" />
          <ul className="space-y-2">
            {ticket.articleSlugs.map((articleSlug) => (
              <li key={articleSlug}>
                <Link
                  href={`${basePath}/knowledge/${articleSlug}`}
                  className="text-sm text-accent-text underline decoration-accent/30 underline-offset-2 hover:decoration-accent"
                >
                  {articleSlug}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </PageContainer>
  );
}
