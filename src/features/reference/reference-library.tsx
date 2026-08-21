import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  ClipboardList,
  ExternalLink,
  LayoutGrid,
  Ticket,
  TriangleAlert,
} from "lucide-react";
import { PageContainer, PageHeader } from "@/components/ui/page";
import { Badge, MetaLine, SectionHeading } from "@/components/ui/primitives";
import { VerificationBadge, VerificationNotice } from "@/components/content/verification-badge";
import { RichText } from "@/components/content/rich-text";
import type { Viewer } from "@/lib/auth/types";
import { CATEGORY_LABELS } from "@/lib/content/schema";
import {
  getSystem,
  listChecklists,
  listSystems,
  resolveLink,
} from "@/lib/content/repository";
import { EXPERIENCE_COPY } from "@/lib/config/experience";

/**
 * ---------------------------------------------------------------------------
 * The reference experience
 * ---------------------------------------------------------------------------
 * The same content set as the course, presented for someone who has a caller
 * on the line rather than a free afternoon.
 *
 * The organising principle is different, and deliberately so. A course answers
 * "what should I learn next?" — a sequence, with progress. This answers "which
 * of these ten things do I open, and what goes where?" — a directory, with no
 * sequence at all. Progress tracking is absent on purpose: there is nothing to
 * complete.
 */

/* ========================================================================== *
 * Index
 * ========================================================================== */

export async function ReferenceLibraryScreen({
  viewer,
  basePath = "",
}: {
  viewer: Viewer;
  basePath?: string;
}) {
  const [systems, checklists] = await Promise.all([
    listSystems(viewer),
    listChecklists(viewer),
  ]);

  const copy = EXPERIENCE_COPY.reference;

  return (
    <PageContainer>
      <PageHeader
        eyebrow="Reference"
        title={copy.areaTitle}
        description={copy.areaIntro}
        meta={
          <MetaLine
            items={[`${systems.length} systems`, `${checklists.length} checklists`]}
          />
        }
      />

      {/* --------------------------------------------------- the essentials */}
      <section className="mb-12">
        <SectionHeading
          className="mb-4"
          title="Start here"
          description="The three things worth reading before your first call."
        />
        <ul className="grid gap-3 sm:grid-cols-3">
          <li>
            <Link
              href={`${basePath}/reference/ticket-anatomy`}
              className="group flex h-full flex-col rounded-xl border border-accent/25 bg-accent-soft p-5 transition-colors hover:border-accent/40"
            >
              <Ticket className="size-4 text-accent-text" aria-hidden />
              <span className="mt-4 flex items-center gap-1.5 text-sm font-medium text-primary">
                How a ticket works
                <ArrowRight
                  className="size-3.5 text-tertiary transition-transform group-hover:translate-x-0.5"
                  aria-hidden
                />
              </span>
              <span className="mt-1.5 text-sm leading-6 text-secondary">
                The Footprints form, field by field, and what goes where.
              </span>
            </Link>
          </li>
          <li>
            <Link
              href={`${basePath}/checklists/call-intake`}
              className="group flex h-full flex-col rounded-xl border border-subtle bg-surface-raised p-5 transition-colors hover:border-default hover:bg-surface-overlay"
            >
              <ClipboardList className="size-4 text-signal" aria-hidden />
              <span className="mt-4 flex items-center gap-1.5 text-sm font-medium text-primary">
                What to collect
                <ArrowRight
                  className="size-3.5 text-tertiary transition-transform group-hover:translate-x-0.5"
                  aria-hidden
                />
              </span>
              <span className="mt-1.5 text-sm leading-6 text-secondary">
                Everything to establish on a call, before you start fixing.
              </span>
            </Link>
          </li>
          <li>
            <Link
              href={`${basePath}/checklists/ticket-quality-check`}
              className="group flex h-full flex-col rounded-xl border border-subtle bg-surface-raised p-5 transition-colors hover:border-default hover:bg-surface-overlay"
            >
              <ClipboardList className="size-4 text-warning" aria-hidden />
              <span className="mt-4 flex items-center gap-1.5 text-sm font-medium text-primary">
                Before you save
                <ArrowRight
                  className="size-3.5 text-tertiary transition-transform group-hover:translate-x-0.5"
                  aria-hidden
                />
              </span>
              <span className="mt-1.5 text-sm leading-6 text-secondary">
                The final pass that catches almost every ticket problem.
              </span>
            </Link>
          </li>
        </ul>
      </section>

      {/* ------------------------------------------------------- the systems */}
      <section>
        <SectionHeading
          className="mb-4"
          title="The systems we use"
          description="What each one is for, and when it sends you there. Open what you need."
        />

        <ul className="space-y-2.5">
          {systems.map((system) => (
            <li key={system.slug}>
              <Link
                href={`${basePath}/reference/systems/${system.slug}`}
                className="group flex items-start gap-4 rounded-xl border border-subtle bg-surface-raised p-5 transition-colors hover:border-default hover:bg-surface-overlay"
              >
                <span
                  aria-hidden
                  className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-lg border border-default bg-surface-inset"
                >
                  <LayoutGrid className="size-4 text-accent-text" />
                </span>

                <span className="min-w-0 flex-1">
                  <span className="flex flex-wrap items-center gap-2">
                    <span className="text-[0.9375rem] font-medium text-primary">
                      {system.title}
                    </span>
                    <Badge tone="neutral">{CATEGORY_LABELS[system.category]}</Badge>
                    {system.status === "draft" ? (
                      <Badge tone="warning">Not documented</Badge>
                    ) : null}
                  </span>
                  <span className="mt-1 block text-sm leading-6 text-secondary">
                    {system.summary}
                  </span>
                </span>

                <ArrowRight
                  className="mt-1 size-4 shrink-0 text-tertiary transition-transform group-hover:translate-x-0.5"
                  aria-hidden
                />
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </PageContainer>
  );
}

/* ========================================================================== *
 * A single system
 * ========================================================================== */

export async function SystemScreen({
  viewer,
  slug,
  basePath = "",
}: {
  viewer: Viewer;
  slug: string;
  basePath?: string;
}) {
  const system = await getSystem(viewer, slug);
  if (!system) notFound();

  const link = system.linkKey ? await resolveLink(viewer, system.linkKey) : null;

  return (
    <PageContainer width="reading">
      <Link
        href={`${basePath}/reference`}
        className="mb-6 inline-flex items-center gap-2 text-sm text-tertiary transition-colors hover:text-primary"
      >
        <ArrowLeft className="size-4" aria-hidden />
        Reference
      </Link>

      <PageHeader
        eyebrow="System"
        title={system.title}
        description={system.purpose}
        meta={
          <div className="flex flex-wrap items-center gap-2">
            <Badge tone="neutral">{CATEGORY_LABELS[system.category]}</Badge>
            <VerificationBadge
              verification={system.verification}
              verifiedBy={system.verifiedBy}
              verifiedAt={system.verifiedAt}
            />
          </div>
        }
      />

      <div className="space-y-8 border-t border-subtle pt-8">
        <VerificationNotice verification={system.verification} />

        {link && link.href !== "#" ? (
          <a
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 rounded-lg border border-subtle bg-surface-inset px-4 py-3.5 transition-colors hover:border-default hover:bg-surface-overlay"
          >
            <ExternalLink className="size-4 shrink-0 text-tertiary" aria-hidden />
            <span className="min-w-0 flex-1">
              <span className="block text-sm font-medium text-primary">{link.label}</span>
              <span className="mt-0.5 block text-sm text-tertiary">{link.description}</span>
            </span>
          </a>
        ) : null}

        {/* ------------------------------------------------- when you use it */}
        <section>
          <h2 className="text-lg font-semibold tracking-tight text-primary">
            When you use it
          </h2>
          <ul className="mt-3 space-y-2">
            {system.whenYouUseIt.map((item) => (
              <li key={item} className="flex gap-3 text-[0.9375rem] leading-7 text-secondary">
                <span
                  aria-hidden
                  className="mt-[0.6875rem] size-1 shrink-0 rounded-full bg-accent"
                />
                <span className="flex-1">
                  <RichText>{item}</RichText>
                </span>
              </li>
            ))}
          </ul>
        </section>

        {/* ---------------------------------------------------------- facts */}
        {system.keyFacts.length > 0 ? (
          <section>
            <h2 className="mb-3 text-lg font-semibold tracking-tight text-primary">
              Quick reference
            </h2>
            <dl className="divide-y divide-subtle overflow-hidden rounded-lg border border-subtle">
              {system.keyFacts.map((fact) => (
                <div
                  key={fact.label}
                  className="grid gap-1 px-4 py-3 sm:grid-cols-[minmax(0,12rem)_1fr] sm:gap-4"
                >
                  <dt className="text-sm font-medium text-primary">{fact.label}</dt>
                  <dd className="text-sm leading-6 text-secondary">
                    <RichText>{fact.value}</RichText>
                  </dd>
                </div>
              ))}
            </dl>
          </section>
        ) : null}

        {/* ------------------------------------------------------ watch out */}
        {system.watchOut.length > 0 ? (
          <section>
            <div className="rounded-lg border border-warning/30 bg-warning-soft p-5">
              <div className="flex gap-3">
                <TriangleAlert className="mt-0.5 size-4 shrink-0 text-warning" aria-hidden />
                <div className="min-w-0 flex-1">
                  <h2 className="text-sm font-semibold text-warning">Watch out for</h2>
                  <ul className="mt-3 space-y-2">
                    {system.watchOut.map((item) => (
                      <li key={item} className="flex gap-2.5 text-sm leading-6 text-secondary">
                        <span
                          aria-hidden
                          className="mt-[0.6875rem] size-1 shrink-0 rounded-full bg-warning"
                        />
                        <span className="flex-1">
                          <RichText>{item}</RichText>
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </section>
        ) : null}

        {/* --------------------------------------------------------- deeper */}
        {system.articleSlugs.length > 0 || system.moduleSlug ? (
          <section className="border-t border-subtle pt-6">
            <SectionHeading className="mb-3" title="Go deeper" />
            <ul className="space-y-2">
              {system.articleSlugs.map((articleSlug) => (
                <li key={articleSlug}>
                  <Link
                    href={`${basePath}/knowledge/${articleSlug}`}
                    className="group flex items-center gap-2 rounded-lg border border-subtle bg-surface-raised px-4 py-3 text-sm text-primary transition-colors hover:border-default hover:bg-surface-overlay"
                  >
                    <span className="min-w-0 flex-1">{articleSlug}</span>
                    <ArrowRight
                      className="size-3.5 shrink-0 text-tertiary transition-transform group-hover:translate-x-0.5"
                      aria-hidden
                    />
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ) : null}
      </div>
    </PageContainer>
  );
}

export async function systemStaticParams(viewer: Viewer) {
  const systems = await listSystems(viewer);
  return systems.map((system) => ({ slug: system.slug }));
}
