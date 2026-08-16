import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { cn } from "@/lib/cn";

/* ========================================================================== *
 * Surface — the single card primitive.
 * Deliberately restrained: a hairline border and a flat raised fill. No
 * gradients, no heavy radii, no drop shadows stacked on drop shadows.
 * ========================================================================== */

/**
 * Rendered as a plain `<div>`.
 *
 * This was briefly polymorphic via an `as` prop, but every call site passed a
 * div, and React 19's stricter `ElementType` makes an unconstrained polymorphic
 * component genuinely awkward to type. Semantic grouping is expressed by the
 * surrounding element instead, which is where it belongs.
 */
export function Surface({
  className,
  interactive = false,
  children,
  ...rest
}: {
  className?: string;
  interactive?: boolean;
  children: ReactNode;
} & Omit<ComponentPropsWithoutRef<"div">, "className" | "children">) {
  return (
    <div
      {...rest}
      className={cn(
        "rounded-xl border border-subtle bg-surface-raised",
        interactive &&
          "transition-colors duration-150 hover:border-default hover:bg-surface-overlay",
        className,
      )}
    >
      {children}
    </div>
  );
}

/* ========================================================================== *
 * Eyebrow — the small mono label used above section headings.
 * ========================================================================== */

export function Eyebrow({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return <p className={cn("eyebrow", className)}>{children}</p>;
}

/* ========================================================================== *
 * Badge
 * ========================================================================== */

type BadgeTone = "neutral" | "accent" | "signal" | "success" | "warning" | "danger";

const BADGE_TONES: Record<BadgeTone, string> = {
  neutral: "bg-surface-inset text-tertiary border-default",
  accent: "bg-accent-soft text-accent-text border-accent/25",
  signal: "bg-signal-soft text-signal border-signal/25",
  success: "bg-success-soft text-success border-success/25",
  warning: "bg-warning-soft text-warning border-warning/25",
  danger: "bg-danger-soft text-danger border-danger/25",
};

export function Badge({
  tone = "neutral",
  children,
  className,
}: {
  tone?: BadgeTone;
  children: ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-md border px-2 py-0.5 text-xs font-medium",
        BADGE_TONES[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}

/* ========================================================================== *
 * Progress — accessible by default. Always announces its value.
 * ========================================================================== */

export function ProgressBar({
  value,
  total,
  label,
  className,
  tone = "accent",
}: {
  value: number;
  total: number;
  label: string;
  className?: string;
  tone?: "accent" | "success";
}) {
  const safeTotal = Math.max(total, 1);
  const percent = Math.round((Math.min(value, safeTotal) / safeTotal) * 100);
  return (
    <div
      role="progressbar"
      aria-valuenow={percent}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={label}
      className={cn("h-1.5 w-full overflow-hidden rounded-full bg-surface-inset", className)}
    >
      <div
        className={cn(
          "h-full rounded-full transition-[width] duration-500 ease-[var(--ease-out-expo)]",
          tone === "success" ? "bg-success" : "bg-accent",
        )}
        style={{ width: `${percent}%` }}
      />
    </div>
  );
}

/* ========================================================================== *
 * Section heading
 * ========================================================================== */

export function SectionHeading({
  eyebrow,
  title,
  description,
  action,
  className,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-wrap items-end justify-between gap-4", className)}>
      <div className="max-w-2xl">
        {eyebrow ? <Eyebrow className="mb-2.5">{eyebrow}</Eyebrow> : null}
        <h2 className="text-xl font-semibold tracking-tight text-primary">{title}</h2>
        {description ? (
          <p className="mt-1.5 text-sm leading-relaxed text-secondary">{description}</p>
        ) : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}

/* ========================================================================== *
 * Empty state — every list in the app has one. An empty screen with no
 * explanation is a bug, not a design.
 * ========================================================================== */

export function EmptyState({
  icon,
  title,
  description,
  action,
  className,
}: {
  icon?: ReactNode;
  title: string;
  description: string;
  action?: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center rounded-xl border border-dashed border-default bg-surface-raised/40 px-6 py-14 text-center",
        className,
      )}
    >
      {icon ? <div className="mb-4 text-tertiary">{icon}</div> : null}
      <h3 className="text-base font-medium text-primary">{title}</h3>
      <p className="mt-1.5 max-w-sm text-sm leading-relaxed text-tertiary">{description}</p>
      {action ? <div className="mt-5">{action}</div> : null}
    </div>
  );
}

/* ========================================================================== *
 * Skeleton — loading placeholder with a restrained shimmer.
 * ========================================================================== */

export function Skeleton({ className }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={cn(
        "relative overflow-hidden rounded-md bg-surface-inset",
        "after:absolute after:inset-0 after:-translate-x-full after:bg-gradient-to-r",
        "after:from-transparent after:via-white/[0.04] after:to-transparent",
        "after:animate-[lt-shimmer_1.6s_infinite]",
        className,
      )}
    />
  );
}

/* ========================================================================== *
 * Meta row — the "Updated 4 Aug 2026 · Help Desk Leadership" line.
 * ========================================================================== */

export function MetaLine({
  items,
  className,
}: {
  items: (string | null | undefined)[];
  className?: string;
}) {
  const visible = items.filter(Boolean) as string[];
  return (
    <p className={cn("text-xs text-tertiary", className)}>
      {visible.map((item, i) => (
        <span key={item}>
          {i > 0 ? <span className="mx-1.5 opacity-50">·</span> : null}
          {item}
        </span>
      ))}
    </p>
  );
}

/* ========================================================================== *
 * Visually hidden — for live regions and screen-reader-only labels.
 * ========================================================================== */

export function VisuallyHidden({ children }: { children: ReactNode }) {
  return (
    <span className="absolute h-px w-px overflow-hidden whitespace-nowrap [clip:rect(0,0,0,0)]">
      {children}
    </span>
  );
}
