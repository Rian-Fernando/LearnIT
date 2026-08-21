import Link from "next/link";
import { ArrowLeft, TriangleAlert } from "lucide-react";
import { PageContainer, PageHeader } from "@/components/ui/page";
import { Badge, SectionHeading, Surface } from "@/components/ui/primitives";
import { RichText } from "@/components/content/rich-text";
import type { Viewer } from "@/lib/auth/types";
import { listTaxonomies } from "@/lib/content/repository";

/**
 * Ticket anatomy — "how the ticket works and what goes where".
 *
 * The reference counterpart to the Footprints module. Same underlying facts,
 * but laid out as a map of the form rather than a walkthrough: a technician
 * looking at a half-filled ticket wants to know what belongs in the field they
 * are staring at, not to be taken through six steps.
 */

const TABS = [
  {
    name: "Contact Information",
    required: true,
    purpose: "Who the ticket is for.",
    fields: [
      ["Last name / First name", "Required. Check both — there is more than one Mark."],
      ["User ID", "The definitive field. Verify it rather than inferring from the name."],
      ["Phone", "A callback number. Ask for a second one if only an office line is on file."],
      ["Department", "Helps distinguish people with similar names."],
      ["Email / Secondary email", "Secondary matters most on alumni tickets — it may be the only address that still works."],
      ["Location", "Where the person is."],
    ],
  },
  {
    name: "Issue Information",
    required: true,
    purpose: "How the ticket is classified and routed.",
    fields: [
      ["Inquiry", "How the request reached you. Defaults to Phone."],
      ["Category", "Required. Can change which team receives the ticket, so it is part of troubleshooting."],
      ["Division", "Required. Defaults to OITR."],
      ["Location Of Work To Be Done", "**Required for classroom and physical hardware issues** — Footprints says so on the form."],
      ["Room", "Alongside the location."],
      ["Primary Assignee", "Can be set here as well as on the Assignees tab."],
    ],
  },
  {
    name: "Description",
    required: true,
    purpose: "The account of what happened. This is the ticket; everything else is metadata.",
    fields: [
      ["What the user reported", "In their words, with the error text verbatim."],
      ["What you verified", "Account type, device, network — facts, not impressions."],
      ["What you tried", "And the result of each attempt, including failures."],
      ["Where it stands", "Resolved, blocked on something named, or escalated."],
      ["Insert Quick Description", "Drops in a saved block of text."],
      ["Search Knowledge Base", "Searches documented solutions without leaving the ticket."],
    ],
  },
  {
    name: "Assignees and Notifications",
    required: false,
    purpose: "Who works it, and who gets emailed.",
    fields: [
      ["Workspace Members → Assignees", "Move the owning group across. Groups are prefixed with `+`."],
      ["Send Email To — Assignees", "The group picking it up."],
      ["Send Email To — Contact", "The user. Off when they already know."],
      ["CC", "Anyone else who needs to follow the thread."],
      ["Send Survey to Customer", "Leave alone unless the workflow calls for it."],
    ],
  },
  {
    name: "Attachments",
    required: false,
    purpose: "Files. Never pasted into the description.",
    fields: [
      ["Attach Files", "Screenshots and documents go here, separately from the description text."],
    ],
  },
];

export async function TicketAnatomyScreen({
  viewer,
  basePath = "",
}: {
  viewer: Viewer;
  basePath?: string;
}) {
  void viewer;
  const taxonomies = await listTaxonomies();
  const categories = taxonomies.find((t) => t.key === "footprints-categories");
  const assignees = taxonomies.find((t) => t.key === "footprints-assignee-groups");

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
        eyebrow="Reference"
        title="How a ticket works"
        description="The Footprints New Issue form, tab by tab, and what belongs in each field."
      />

      <div className="space-y-8 border-t border-subtle pt-8">
        {/* ------------------------------------------------------- titles */}
        <section>
          <h2 className="text-lg font-semibold tracking-tight text-primary">
            The title
          </h2>
          <p className="mt-2 text-[0.9375rem] leading-7 text-secondary">
            Short, specific, consistent. It is what everyone sees in a queue, a
            search result, and a notification.
          </p>

          <div className="mt-4 space-y-3">
            <figure className="overflow-hidden rounded-lg border border-subtle bg-surface-sunken">
              <figcaption className="border-b border-subtle px-4 py-2 font-mono text-xs uppercase tracking-wider text-tertiary">
                General ticket
              </figcaption>
              <pre className="overflow-x-auto px-4 py-3.5">
                <code className="font-mono text-[0.8125rem] leading-6 text-secondary">
{`Issue Title  USERNAME

Cannot Sign In To Email  JSMITH01
VPN Fails At Authentication  ADOE22`}
                </code>
              </pre>
            </figure>

            <figure className="overflow-hidden rounded-lg border border-subtle bg-surface-sunken">
              <figcaption className="border-b border-subtle px-4 py-2 font-mono text-xs uppercase tracking-wider text-tertiary">
                Classroom ticket — location leads
              </figcaption>
              <pre className="overflow-x-auto px-4 py-3.5">
                <code className="font-mono text-[0.8125rem] leading-6 text-secondary">
{`BUILDING ROOM Issue  USERNAME

NEX 135 Projector Not Working  JOHNSMITH`}
                </code>
              </pre>
            </figure>
          </div>

          <div className="mt-4 rounded-lg border border-signal/25 bg-signal-soft px-4 py-3.5">
            <p className="text-sm leading-6 text-secondary">
              <span className="font-medium text-signal">Two spaces</span> before the
              username, every time. It is a consistent separator, which is what makes
              the username reliably findable when searching Footprints.
            </p>
          </div>
        </section>

        {/* ---------------------------------------------------------- tabs */}
        <section>
          <SectionHeading
            className="mb-4"
            title="The form"
            description="Fields marked with a red asterisk in Footprints are required."
          />

          <div className="space-y-4">
            {TABS.map((tab) => (
              <Surface key={tab.name} className="overflow-hidden">
                <div className="flex flex-wrap items-center gap-2 border-b border-subtle px-4 py-3">
                  <h3 className="text-sm font-medium text-primary">{tab.name}</h3>
                  {tab.required ? <Badge tone="danger">Required</Badge> : null}
                  <span className="ml-auto text-xs text-tertiary">{tab.purpose}</span>
                </div>
                <dl className="divide-y divide-subtle">
                  {tab.fields.map(([label, value]) => (
                    <div
                      key={label}
                      className="grid gap-1 px-4 py-3 sm:grid-cols-[minmax(0,14rem)_1fr] sm:gap-4"
                    >
                      <dt className="text-sm font-medium text-primary">{label}</dt>
                      <dd className="text-sm leading-6 text-secondary">
                        <RichText>{value!}</RichText>
                      </dd>
                    </div>
                  ))}
                </dl>
              </Surface>
            ))}
          </div>
        </section>

        {/* ------------------------------------------------- option lists */}
        {categories && !categories.complete ? (
          <div className="flex gap-3 rounded-lg border border-warning/30 bg-warning-soft px-4 py-3.5">
            <TriangleAlert className="mt-0.5 size-4 shrink-0 text-warning" aria-hidden />
            <div>
              <p className="text-sm font-semibold text-warning">
                The category list is incomplete
              </p>
              <p className="mt-1 text-sm leading-6 text-secondary">
                {categories.missing} Until it is filled in, check with a supervisor
                rather than picking the closest-looking option.
              </p>
            </div>
          </div>
        ) : null}

        {/* ---------------------------------------------------- assignees */}
        <section>
          <SectionHeading
            className="mb-3"
            title="Routing"
            description="Correct assignment is part of correct troubleshooting, not filing."
          />
          <Surface className="p-5">
            <p className="text-sm leading-6 text-secondary">
              <span className="font-medium text-primary">+Customer Experience</span>{" "}
              is the default for general Help Desk issues. Technical issues may belong
              to another IT team, another department, or a specialist group.
            </p>
            {assignees && !assignees.complete ? (
              <p className="mt-3 border-l-2 border-warning/40 pl-3 text-sm leading-6 text-tertiary">
                The full group list has not been captured yet — {assignees.missing}
              </p>
            ) : null}
            <p className="mt-3 text-sm leading-6 text-secondary">
              Some templates arrive with an assignee already selected. Check the
              Assignees box before saving — the classroom workflow in particular
              requires removing a default so the notification reaches TSS.
            </p>
          </Surface>
        </section>

        <section className="border-t border-subtle pt-6">
          <SectionHeading className="mb-3" title="Next" />
          <ul className="grid gap-2.5 sm:grid-cols-2">
            {[
              ["/checklists/call-intake", "What to collect on a call"],
              ["/checklists/ticket-quality-check", "The check before you save"],
              ["/tickets", "Worked examples"],
              ["/reference", "All systems"],
            ].map(([href, label]) => (
              <li key={href}>
                <Link
                  href={`${basePath}${href}`}
                  className="block rounded-lg border border-subtle bg-surface-raised px-4 py-3 text-sm text-primary transition-colors hover:border-default hover:bg-surface-overlay"
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </PageContainer>
  );
}
