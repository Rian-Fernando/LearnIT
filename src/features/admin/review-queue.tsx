"use client";

import { useActionState } from "react";
import { CheckCircle2, Flag, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge, EmptyState, Surface } from "@/components/ui/primitives";
import type { ContentReport } from "@/lib/content/schema";
import { setReportStatus, type ActionResult } from "./actions";

/**
 * Documentation review queue.
 *
 * Reports come from the "report outdated information" control at the bottom of
 * every procedure. Triage is two clicks, because a queue that is tedious to work
 * is a queue that grows.
 */

const REASON_LABELS: Record<ContentReport["reason"], string> = {
  outdated: "Out of date",
  incorrect: "Incorrect",
  unclear: "Unclear",
  "broken-link": "Broken link",
  other: "Other",
};

const STATUS_TONE = {
  open: "warning",
  reviewing: "signal",
  resolved: "success",
  dismissed: "neutral",
} as const;

export function ReviewQueue({
  reports,
  durable,
}: {
  reports: ContentReport[];
  durable: boolean;
}) {
  const [result, action, pending] = useActionState<ActionResult | null, FormData>(
    setReportStatus,
    null,
  );

  const open = reports.filter((report) => report.status === "open");
  const active = reports.filter((report) => report.status === "reviewing");
  const closed = reports.filter(
    (report) => report.status === "resolved" || report.status === "dismissed",
  );

  if (reports.length === 0) {
    return (
      <EmptyState
        icon={<Flag className="size-6" aria-hidden />}
        title="Nothing reported"
        description={
          durable
            ? "Technicians can flag a procedure from the bottom of any article, module, workflow, response, or scenario. Reports land here."
            : "Reports are held in memory in this deployment and reset on restart. Configure the database adapter to retain them."
        }
      />
    );
  }

  return (
    <div className="space-y-8">
      {result ? (
        <p
          role="status"
          className={`text-sm ${result.ok ? "text-success" : "text-danger"}`}
        >
          {result.message}
        </p>
      ) : null}

      <Group title="Open" reports={open} action={action} pending={pending} />
      <Group title="In review" reports={active} action={action} pending={pending} />
      <Group title="Closed" reports={closed} action={action} pending={pending} closed />
    </div>
  );
}

function Group({
  title,
  reports,
  action,
  pending,
  closed = false,
}: {
  title: string;
  reports: ContentReport[];
  action: (formData: FormData) => void;
  pending: boolean;
  closed?: boolean;
}) {
  if (reports.length === 0) return null;

  return (
    <section>
      <h2 className="mb-3 text-sm font-medium text-primary">
        {title}{" "}
        <span className="tabular font-normal text-tertiary">({reports.length})</span>
      </h2>

      <Surface>
        <ul className="divide-y divide-subtle">
          {reports.map((report) => (
            <li key={report.id} className="p-4">
              <div className="flex flex-wrap items-start gap-x-3 gap-y-2">
                <Badge tone={STATUS_TONE[report.status]}>{report.status}</Badge>
                <Badge tone="neutral">{REASON_LABELS[report.reason]}</Badge>
                <span className="font-mono text-xs text-tertiary">
                  {report.resourceType} · {report.resourceSlug}
                </span>
                <span className="ml-auto text-xs text-tertiary">
                  {report.reportedBy} ·{" "}
                  {new Date(report.reportedAt).toLocaleDateString("en-GB", {
                    day: "numeric",
                    month: "short",
                  })}
                </span>
              </div>

              {report.detail ? (
                <p className="mt-3 border-l-2 border-default pl-3 text-sm leading-6 text-secondary">
                  {report.detail}
                </p>
              ) : (
                <p className="mt-3 text-sm italic text-tertiary">
                  No further detail given.
                </p>
              )}

              {!closed ? (
                <div className="mt-4 flex flex-wrap gap-2">
                  {report.status === "open" ? (
                    <StatusButton
                      action={action}
                      pending={pending}
                      id={report.id}
                      status="reviewing"
                      label="Start review"
                      variant="secondary"
                    />
                  ) : null}
                  <StatusButton
                    action={action}
                    pending={pending}
                    id={report.id}
                    status="resolved"
                    label="Mark resolved"
                    variant="primary"
                  />
                  <StatusButton
                    action={action}
                    pending={pending}
                    id={report.id}
                    status="dismissed"
                    label="Dismiss"
                    variant="ghost"
                  />
                </div>
              ) : (
                <p className="mt-3 flex items-center gap-1.5 text-xs text-tertiary">
                  <CheckCircle2 className="size-3.5" aria-hidden />
                  Closed as {report.status}
                </p>
              )}
            </li>
          ))}
        </ul>
      </Surface>
    </section>
  );
}

function StatusButton({
  action,
  pending,
  id,
  status,
  label,
  variant,
}: {
  action: (formData: FormData) => void;
  pending: boolean;
  id: string;
  status: ContentReport["status"];
  label: string;
  variant: "primary" | "secondary" | "ghost";
}) {
  return (
    <form action={action}>
      <input type="hidden" name="id" value={id} />
      <input type="hidden" name="status" value={status} />
      <Button type="submit" size="sm" variant={variant} disabled={pending}>
        {pending ? <Loader2 className="size-3.5 animate-spin" aria-hidden /> : null}
        {label}
      </Button>
    </form>
  );
}
