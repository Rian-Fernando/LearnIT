import {
  Camera,
  FileQuestion,
  ListTree,
  ScrollText,
  ShieldQuestion,
} from "lucide-react";
import { PageContainer, PageHeader } from "@/components/ui/page";
import { Badge, EmptyState, Surface } from "@/components/ui/primitives";
import type { Viewer } from "@/lib/auth/types";
import type { BacklogItem } from "@/lib/content/schema";
import { listBacklog } from "@/lib/content/repository";

/**
 * The content backlog.
 *
 * This screen exists because the alternative to tracking gaps is filling them
 * with something plausible, and in a Help Desk context an invented procedure
 * gets followed. Making the gaps countable, owned, and prioritised is what
 * turns "we should document that sometime" into a list somebody can work.
 *
 * Admin-only. A technician mid-call does not benefit from a candid inventory
 * of what the documentation does not cover.
 */

const KIND_META: Record<
  BacklogItem["kind"],
  { icon: typeof Camera; label: string; tone: string }
> = {
  screenshot: { icon: Camera, label: "Screenshot", tone: "text-signal" },
  procedure: { icon: ScrollText, label: "Procedure", tone: "text-accent-text" },
  taxonomy: { icon: ListTree, label: "Option list", tone: "text-warning" },
  reference: { icon: FileQuestion, label: "Reference", tone: "text-tertiary" },
  policy: { icon: ShieldQuestion, label: "Policy", tone: "text-danger" },
};

const PRIORITY_TONE = {
  high: "danger",
  medium: "warning",
  low: "neutral",
} as const;

export async function BacklogScreen({ viewer }: { viewer: Viewer }) {
  const items = await listBacklog(viewer);

  const byPriority = {
    high: items.filter((item) => item.priority === "high"),
    medium: items.filter((item) => item.priority === "medium"),
    low: items.filter((item) => item.priority === "low"),
  };

  const byKind = items.reduce<Record<string, number>>((acc, item) => {
    acc[item.kind] = (acc[item.kind] ?? 0) + 1;
    return acc;
  }, {});

  return (
    <PageContainer width="wide">
      <PageHeader
        eyebrow="Admin console"
        title="Content backlog"
        description="Everything learnIT knows it does not yet know. Each item names what stays incomplete until it arrives."
      />

      {items.length === 0 ? (
        <EmptyState
          title="Nothing outstanding"
          description="Every documented gap has been filled. That is unusual — worth double-checking that new placeholders are being recorded here."
        />
      ) : (
        <>
          {/* ------------------------------------------------------ summary */}
          <div className="mb-10 grid gap-3 sm:grid-cols-4">
            <Surface className="p-5">
              <p className="text-sm text-secondary">Outstanding</p>
              <p className="tabular mt-2 text-3xl font-semibold tracking-tight text-primary">
                {items.length}
              </p>
            </Surface>
            <Surface className="p-5">
              <p className="text-sm text-secondary">High priority</p>
              <p className="tabular mt-2 text-3xl font-semibold tracking-tight text-danger">
                {byPriority.high.length}
              </p>
            </Surface>
            <Surface className="p-5">
              <p className="text-sm text-secondary">Screenshots needed</p>
              <p className="tabular mt-2 text-3xl font-semibold tracking-tight text-primary">
                {byKind.screenshot ?? 0}
              </p>
            </Surface>
            <Surface className="p-5">
              <p className="text-sm text-secondary">Procedures needed</p>
              <p className="tabular mt-2 text-3xl font-semibold tracking-tight text-primary">
                {(byKind.procedure ?? 0) + (byKind.policy ?? 0)}
              </p>
            </Surface>
          </div>

          <div className="space-y-10">
            <Group title="High priority" items={byPriority.high} />
            <Group title="Medium priority" items={byPriority.medium} />
            <Group title="Low priority" items={byPriority.low} />
          </div>
        </>
      )}
    </PageContainer>
  );
}

function Group({ title, items }: { title: string; items: BacklogItem[] }) {
  if (items.length === 0) return null;

  return (
    <section>
      <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-tertiary">
        {title}{" "}
        <span className="tabular font-normal normal-case tracking-normal">
          ({items.length})
        </span>
      </h2>

      <ul className="space-y-2.5">
        {items.map((item) => {
          const meta = KIND_META[item.kind];
          const Icon = meta.icon;
          return (
            <li key={item.id}>
              <Surface className="p-5">
                <div className="flex items-start gap-3">
                  <Icon className={`mt-0.5 size-4 shrink-0 ${meta.tone}`} aria-hidden />
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-[0.9375rem] font-medium text-primary">
                        {item.title}
                      </h3>
                      <Badge tone={PRIORITY_TONE[item.priority]}>{item.priority}</Badge>
                      <Badge tone="neutral">{meta.label}</Badge>
                    </div>

                    <p className="mt-2 text-sm leading-6 text-secondary">{item.blocks}</p>

                    {item.notes ? (
                      <p className="mt-2 border-l-2 border-default pl-3 text-sm leading-6 text-tertiary">
                        {item.notes}
                      </p>
                    ) : null}

                    <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-tertiary">
                      <span>Owner: {item.owner}</span>
                      {item.affects.length > 0 ? (
                        <span>
                          Affects:{" "}
                          <span className="font-mono">{item.affects.join(", ")}</span>
                        </span>
                      ) : null}
                    </div>
                  </div>
                </div>
              </Surface>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
