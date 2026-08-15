"use client";

import { useActionState } from "react";
import { Loader2, Megaphone, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge, EmptyState, Surface } from "@/components/ui/primitives";
import type { Announcement } from "@/lib/content/schema";
import { formatDate } from "@/lib/format";
import { publishAnnouncement, removeAnnouncement, type ActionResult } from "./actions";

/**
 * Dashboard notices.
 *
 * Expiry is a required part of the workflow rather than an afterthought: the
 * fastest way to make a dashboard ignored is to leave last semester's outage
 * notice on it. The form nudges toward setting one every time.
 */
export function NoticesEditor({
  authored,
  published,
}: {
  authored: Announcement[];
  published: Announcement[];
}) {
  const [result, action, pending] = useActionState<ActionResult | null, FormData>(
    publishAnnouncement,
    null,
  );

  const today = new Date().toISOString().slice(0, 10);
  const defaultExpiry = new Date(Date.now() + 30 * 86_400_000)
    .toISOString()
    .slice(0, 10);

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_24rem]">
      {/* ------------------------------------------------------------ list */}
      <div className="space-y-8">
        <section>
          <h2 className="mb-3 text-sm font-medium text-primary">
            Published from this console
          </h2>
          {published.length === 0 ? (
            <EmptyState
              icon={<Megaphone className="size-6" aria-hidden />}
              title="No notices published"
              description="Notices posted here appear at the top of every technician's dashboard until they expire."
            />
          ) : (
            <ul className="space-y-2.5">
              {published.map((notice) => (
                <NoticeRow key={notice.id} notice={notice} removable />
              ))}
            </ul>
          )}
        </section>

        {authored.length > 0 ? (
          <section>
            <h2 className="mb-3 text-sm font-medium text-primary">
              Authored in the repository
            </h2>
            <p className="mb-3 text-sm leading-6 text-tertiary">
              These live in{" "}
              <span className="font-mono text-xs text-secondary">
                src/content/announcements.ts
              </span>{" "}
              and are changed with a commit.
            </p>
            <ul className="space-y-2.5">
              {authored.map((notice) => (
                <NoticeRow key={notice.id} notice={notice} />
              ))}
            </ul>
          </section>
        ) : null}
      </div>

      {/* ----------------------------------------------------------- form */}
      <aside className="lg:sticky lg:top-24 lg:self-start">
        <Surface className="p-5">
          <h2 className="text-sm font-medium text-primary">Publish a notice</h2>
          <p className="mt-1 text-xs leading-5 text-tertiary">
            Appears on the dashboard immediately.
          </p>

          <form action={action} className="mt-4 space-y-3">
            <div>
              <label htmlFor="notice-title" className="block text-xs text-secondary">
                Title
              </label>
              <input
                id="notice-title"
                name="title"
                type="text"
                required
                maxLength={160}
                placeholder="Printing outage in the library"
                className="mt-1.5 h-9 w-full rounded-lg border border-default bg-surface-inset px-3 text-sm text-primary outline-none transition-colors placeholder:text-tertiary focus:border-strong"
              />
            </div>

            <div>
              <label htmlFor="notice-body" className="block text-xs text-secondary">
                Message
              </label>
              <textarea
                id="notice-body"
                name="body"
                required
                rows={4}
                maxLength={2000}
                placeholder="What is happening, what technicians should do, and who to escalate to."
                className="mt-1.5 w-full resize-y rounded-lg border border-default bg-surface-inset px-3 py-2.5 text-sm text-primary outline-none transition-colors placeholder:text-tertiary focus:border-strong"
              />
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <label htmlFor="notice-tone" className="block text-xs text-secondary">
                  Tone
                </label>
                <select
                  id="notice-tone"
                  name="tone"
                  defaultValue="info"
                  className="mt-1.5 h-9 w-full rounded-lg border border-default bg-surface-inset px-3 text-sm text-primary outline-none focus:border-strong"
                >
                  <option value="info">Information</option>
                  <option value="warning">Important</option>
                  <option value="critical">Critical</option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="notice-visibility"
                  className="block text-xs text-secondary"
                >
                  Audience
                </label>
                <select
                  id="notice-visibility"
                  name="visibility"
                  defaultValue="staff"
                  className="mt-1.5 h-9 w-full rounded-lg border border-default bg-surface-inset px-3 text-sm text-primary outline-none focus:border-strong"
                >
                  <option value="staff">Help Desk staff</option>
                  <option value="public">Public (demo too)</option>
                </select>
              </div>
            </div>

            <div>
              <label htmlFor="notice-expires" className="block text-xs text-secondary">
                Expires
              </label>
              <input
                id="notice-expires"
                name="expiresAt"
                type="date"
                min={today}
                defaultValue={defaultExpiry}
                className="mt-1.5 h-9 w-full rounded-lg border border-default bg-surface-inset px-3 text-sm text-primary outline-none focus:border-strong"
              />
              <p className="mt-1 text-xs text-tertiary">
                Stops showing after this date. Leave a short window — stale notices
                are why people stop reading them.
              </p>
            </div>

            <Button type="submit" size="sm" disabled={pending} className="w-full">
              {pending ? <Loader2 className="size-3.5 animate-spin" aria-hidden /> : null}
              Publish notice
            </Button>

            {result ? (
              <p
                role="status"
                className={`text-sm ${result.ok ? "text-success" : "text-danger"}`}
              >
                {result.message}
              </p>
            ) : null}
          </form>
        </Surface>
      </aside>
    </div>
  );
}

/* -------------------------------------------------------------------------- */

const TONE_BADGE = {
  info: "signal",
  warning: "warning",
  critical: "danger",
} as const;

function NoticeRow({
  notice,
  removable = false,
}: {
  notice: Announcement;
  removable?: boolean;
}) {
  const [result, action, pending] = useActionState<ActionResult | null, FormData>(
    removeAnnouncement,
    null,
  );

  return (
    <li>
      <Surface className="p-4">
        <div className="flex flex-wrap items-center gap-2">
          <Badge tone={TONE_BADGE[notice.tone]}>{notice.tone}</Badge>
          <Badge tone={notice.visibility === "staff" ? "signal" : "neutral"}>
            {notice.visibility === "staff" ? "Staff" : "Public"}
          </Badge>
          <span className="ml-auto text-xs text-tertiary">
            {formatDate(notice.publishedAt)}
            {notice.expiresAt ? ` → ${formatDate(notice.expiresAt)}` : " · no expiry"}
          </span>
        </div>

        <p className="mt-2.5 text-sm font-medium text-primary">{notice.title}</p>
        <p className="mt-1 text-sm leading-6 text-secondary">{notice.body}</p>

        {removable ? (
          <form action={action} className="mt-3">
            <input type="hidden" name="id" value={notice.id} />
            <Button type="submit" size="sm" variant="ghost" disabled={pending}>
              <Trash2 className="size-3.5" aria-hidden />
              Remove
            </Button>
            {result && !result.ok ? (
              <span role="status" className="ml-2 text-sm text-danger">
                {result.message}
              </span>
            ) : null}
          </form>
        ) : null}
      </Surface>
    </li>
  );
}
