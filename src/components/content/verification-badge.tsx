import { BadgeCheck, CircleHelp, TriangleAlert } from "lucide-react";
import { Badge } from "@/components/ui/primitives";
import type { Verification } from "@/lib/content/schema";
import { formatDate } from "@/lib/format";

/**
 * How far a reader should trust this page.
 *
 * Shown on every content record. The unverified state is deliberately visible
 * rather than quiet: this platform is being built alongside the procedures it
 * documents, and a technician needs to know at a glance whether they are
 * reading confirmed Adelphi procedure or a first draft awaiting review.
 *
 * `verified` is the only state that stays understated — it is the expected
 * condition, and a badge shouting about it on every page becomes invisible.
 */
export function VerificationBadge({
  verification,
  verifiedBy,
  verifiedAt,
}: {
  verification: Verification;
  verifiedBy?: string;
  verifiedAt?: string;
}) {
  if (verification === "verified") {
    return (
      <Badge tone="success">
        <BadgeCheck className="size-3" aria-hidden />
        Verified
        {verifiedAt ? (
          <span className="font-normal opacity-70">
            {" "}
            {formatDate(verifiedAt)}
            {verifiedBy ? ` · ${verifiedBy}` : ""}
          </span>
        ) : null}
      </Badge>
    );
  }

  if (verification === "needs-review") {
    return (
      <Badge tone="warning">
        <TriangleAlert className="size-3" aria-hidden />
        Needs review
      </Badge>
    );
  }

  return (
    <Badge tone="neutral">
      <CircleHelp className="size-3" aria-hidden />
      Not yet verified
    </Badge>
  );
}

/**
 * The fuller banner, for the top of a procedure a technician might act on.
 *
 * A badge is enough for a listing. A page someone is about to follow during a
 * live call warrants a sentence explaining what "not verified" actually means
 * for them.
 */
export function VerificationNotice({
  verification,
}: {
  verification: Verification;
}) {
  if (verification === "verified") return null;

  const isDraft = verification === "unverified";

  return (
    <div
      className={
        isDraft
          ? "flex gap-3 rounded-lg border border-subtle bg-surface-inset px-4 py-3.5"
          : "flex gap-3 rounded-lg border border-warning/30 bg-warning-soft px-4 py-3.5"
      }
    >
      {isDraft ? (
        <CircleHelp className="mt-0.5 size-4 shrink-0 text-tertiary" aria-hidden />
      ) : (
        <TriangleAlert className="mt-0.5 size-4 shrink-0 text-warning" aria-hidden />
      )}
      <div className="min-w-0">
        <p
          className={
            isDraft
              ? "text-sm font-medium text-primary"
              : "text-sm font-medium text-warning"
          }
        >
          {isDraft ? "Not yet confirmed as Adelphi procedure" : "Due for review"}
        </p>
        <p className="mt-1 text-sm leading-6 text-secondary">
          {isDraft
            ? "This was written from general IT support practice to demonstrate the format, and has not been confirmed by Help Desk leadership. Check with a supervisor before relying on it."
            : "This follows a procedure as described, but has not been confirmed against the current system. If what you see does not match, report it."}
        </p>
      </div>
    </div>
  );
}
