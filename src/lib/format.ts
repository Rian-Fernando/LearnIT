/**
 * Date formatting.
 *
 * Content dates are plain ISO date strings (`YYYY-MM-DD`) with no time or
 * timezone, so they are parsed as UTC and formatted in UTC. Doing otherwise
 * makes "4 Aug 2026" render as "3 Aug 2026" for anyone west of Greenwich —
 * a small bug that badly undermines trust in a page whose entire purpose is
 * telling you how current a procedure is.
 */

const FORMATTER = new Intl.DateTimeFormat("en-GB", {
  day: "numeric",
  month: "short",
  year: "numeric",
  timeZone: "UTC",
});

function parse(iso: string): Date | null {
  const date = new Date(`${iso}T00:00:00Z`);
  return Number.isNaN(date.getTime()) ? null : date;
}

export function formatDate(iso: string): string {
  const date = parse(iso);
  return date ? FORMATTER.format(date) : iso;
}

/**
 * "3 days ago" for the recent past, an absolute date beyond that.
 *
 * Relative dates are friendly up to about a month and actively unhelpful past
 * it — "11 months ago" tells a technician far less than "Sep 2025" about
 * whether a procedure is still current.
 */
export function relativeDate(iso: string, now: Date = new Date()): string {
  const date = parse(iso);
  if (!date) return iso;

  const days = Math.floor(
    (Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()) -
      date.getTime()) /
      86_400_000,
  );

  if (days < 0) return formatDate(iso);
  if (days === 0) return "today";
  if (days === 1) return "yesterday";
  if (days < 7) return `${days} days ago`;
  if (days < 14) return "last week";
  if (days < 31) return `${Math.floor(days / 7)} weeks ago`;
  return formatDate(iso);
}

/** Whole minutes as "12 min" / "1 hr 5 min". */
export function formatMinutes(minutes: number): string {
  if (minutes < 60) return `${minutes} min`;
  const hours = Math.floor(minutes / 60);
  const rest = minutes % 60;
  return rest === 0 ? `${hours} hr` : `${hours} hr ${rest} min`;
}
