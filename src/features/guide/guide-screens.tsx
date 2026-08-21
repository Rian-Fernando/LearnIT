import Link from "next/link";
import {
  ArrowRight,
  BookmarkPlus,
  ClipboardList,
  LayoutGrid,
  Ticket,
} from "lucide-react";
import { PageContainer, PageHeader } from "@/components/ui/page";
import { Badge, SectionHeading } from "@/components/ui/primitives";
import { GuideFooter } from "./guide-chrome";
import { GUEST_VIEWER } from "@/lib/auth/types";
import { CATEGORY_LABELS } from "@/lib/content/schema";
import { listChecklists, listSystems } from "@/lib/content/repository";

/**
 * The no-sign-in guide.
 *
 * A new technician can be sent this link on day one and get the four things
 * that matter before their first call: how a ticket is put together, what to
 * collect, which systems exist, and a bookmark file to import.
 *
 * Entirely static and entirely server-rendered — no client JavaScript beyond
 * Next's router. Someone reading this has it open as one of many tabs.
 */

export async function GuideOverviewScreen() {
  const [systems, checklists] = await Promise.all([
    listSystems(GUEST_VIEWER),
    listChecklists(GUEST_VIEWER),
  ]);

  return (
    <>
      <PageContainer>
        <PageHeader
          eyebrow="Help Desk guide"
          title="Start here"
          description="How to write a ticket properly, what to collect on a call, and the software the Help Desk runs on. No account needed — read it, bookmark it, come back to it."
        />

        {/* ------------------------------------------------------ the four */}
        <ul className="grid gap-3 sm:grid-cols-2">
          <li>
            <Link
              href="/guide/ticket-basics"
              className="group flex h-full flex-col rounded-xl border border-accent/25 bg-accent-soft p-6 transition-colors hover:border-accent/40"
            >
              <Ticket className="size-5 text-accent-text" aria-hidden />
              <h2 className="mt-4 flex items-center gap-1.5 text-base font-medium text-primary">
                How a ticket works
                <ArrowRight
                  className="size-4 text-tertiary transition-transform group-hover:translate-x-0.5"
                  aria-hidden
                />
              </h2>
              <p className="mt-1.5 text-sm leading-6 text-secondary">
                The Footprints form field by field — what goes in the title, how
                to pick a category, what the description has to contain, and who
                it should be routed to.
              </p>
            </Link>
          </li>

          <li>
            <Link
              href="/guide/checklists/call-intake"
              className="group flex h-full flex-col rounded-xl border border-subtle bg-surface-raised p-6 transition-colors hover:border-default hover:bg-surface-overlay"
            >
              <ClipboardList className="size-5 text-signal" aria-hidden />
              <h2 className="mt-4 flex items-center gap-1.5 text-base font-medium text-primary">
                What to collect on a call
                <ArrowRight
                  className="size-4 text-tertiary transition-transform group-hover:translate-x-0.5"
                  aria-hidden
                />
              </h2>
              <p className="mt-1.5 text-sm leading-6 text-secondary">
                Where, when, why, how, what — plus the identity and device
                details a ticket is useless without. Run it before you start
                fixing anything.
              </p>
            </Link>
          </li>

          <li>
            <Link
              href="/guide/systems"
              className="group flex h-full flex-col rounded-xl border border-subtle bg-surface-raised p-6 transition-colors hover:border-default hover:bg-surface-overlay"
            >
              <LayoutGrid className="size-5 text-accent-text" aria-hidden />
              <h2 className="mt-4 flex items-center gap-1.5 text-base font-medium text-primary">
                The systems we use
                <ArrowRight
                  className="size-4 text-tertiary transition-transform group-hover:translate-x-0.5"
                  aria-hidden
                />
              </h2>
              <p className="mt-1.5 text-sm leading-6 text-secondary">
                {systems.length} pieces of software, what each one is for, and
                which situation sends you there.
              </p>
            </Link>
          </li>

          <li>
            <Link
              href="/guide/bookmarks"
              className="group flex h-full flex-col rounded-xl border border-subtle bg-surface-raised p-6 transition-colors hover:border-default hover:bg-surface-overlay"
            >
              <BookmarkPlus className="size-5 text-success" aria-hidden />
              <h2 className="mt-4 flex items-center gap-1.5 text-base font-medium text-primary">
                Bookmarks for your browser
                <ArrowRight
                  className="size-4 text-tertiary transition-transform group-hover:translate-x-0.5"
                  aria-hidden
                />
              </h2>
              <p className="mt-1.5 text-sm leading-6 text-secondary">
                Download one file, import it into Chrome, and every system you
                need is on your bookmarks bar.
              </p>
            </Link>
          </li>
        </ul>

        {/* ------------------------------------------------- the principle */}
        <section className="mt-12 rounded-xl border border-subtle bg-surface-raised p-6">
          <SectionHeading
            className="mb-4"
            title="The shape of every call"
            description="Whatever the problem turns out to be, the sequence is the same."
          />
          <ol className="flex flex-wrap gap-2">
            {[
              "Ask",
              "Verify",
              "Troubleshoot",
              "Document",
              "Assign",
              "Notify",
              "Double-check",
              "Save",
            ].map((step, index) => (
              <li key={step} className="flex items-center gap-2">
                <span className="rounded-lg border border-default bg-surface-inset px-3 py-1.5 text-sm text-primary">
                  <span className="tabular mr-1.5 font-mono text-xs text-tertiary">
                    {index + 1}
                  </span>
                  {step}
                </span>
                {index < 7 ? (
                  <ArrowRight className="size-3.5 text-tertiary" aria-hidden />
                ) : null}
              </li>
            ))}
          </ol>
          <p className="mt-5 text-sm leading-6 text-secondary">
            The single most common mistake is starting at{" "}
            <span className="font-medium text-primary">Troubleshoot</span>. Almost
            all wasted Help Desk time is spent confidently fixing the wrong
            problem, and the information that would have prevented it was one
            question away.
          </p>
        </section>

        {/* --------------------------------------------------- checklists */}
        <section className="mt-12">
          <SectionHeading
            className="mb-4"
            title="Checklists"
            description="Open these while you are on a call. They are built to be scanned, not read."
          />
          <ul className="grid gap-2.5 sm:grid-cols-2">
            {checklists.map((checklist) => (
              <li key={checklist.slug}>
                <Link
                  href={`/guide/checklists/${checklist.slug}`}
                  className="group flex h-full items-start gap-3 rounded-lg border border-subtle bg-surface-raised px-4 py-3.5 transition-colors hover:border-default hover:bg-surface-overlay"
                >
                  <ClipboardList
                    className="mt-0.5 size-4 shrink-0 text-tertiary"
                    aria-hidden
                  />
                  <span className="min-w-0 flex-1">
                    <span className="block text-sm font-medium text-primary">
                      {checklist.title}
                    </span>
                    <span className="mt-0.5 block text-sm leading-6 text-tertiary">
                      {checklist.summary}
                    </span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </PageContainer>
      <GuideFooter />
    </>
  );
}

/* ========================================================================== */

export async function GuideSystemsScreen() {
  const systems = await listSystems(GUEST_VIEWER);

  return (
    <>
      <PageContainer>
        <PageHeader
          eyebrow="Guide"
          title="The systems we use"
          description="A new technician's first problem is not procedure — it is knowing which of these to open. Each one says what it is for and when it sends you there."
        />

        <ul className="space-y-2.5">
          {systems.map((system) => (
            <li key={system.slug}>
              <Link
                href={`/guide/systems/${system.slug}`}
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
                      <Badge tone="warning">Not documented yet</Badge>
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
      </PageContainer>
      <GuideFooter />
    </>
  );
}
