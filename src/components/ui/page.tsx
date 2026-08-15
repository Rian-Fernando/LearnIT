import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

/**
 * Page scaffolding.
 *
 * Every screen in the application uses these, which is what keeps rhythm and
 * measure consistent without each page re-inventing its own spacing.
 */

export function PageContainer({
  children,
  className,
  width = "default",
}: {
  children: ReactNode;
  className?: string;
  width?: "default" | "wide" | "reading";
}) {
  const widths = {
    default: "max-w-6xl",
    wide: "max-w-[88rem]",
    // ~72ch — the measure long-form procedures actually read well at.
    reading: "max-w-3xl",
  } as const;

  return (
    <div className={cn("mx-auto w-full px-4 py-8 sm:px-6 sm:py-10", widths[width], className)}>
      {children}
    </div>
  );
}

export function PageHeader({
  eyebrow,
  title,
  description,
  actions,
  meta,
  className,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  actions?: ReactNode;
  meta?: ReactNode;
  className?: string;
}) {
  return (
    <header className={cn("mb-8", className)}>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0 max-w-2xl">
          {eyebrow ? <p className="eyebrow mb-2.5">{eyebrow}</p> : null}
          <h1 className="text-2xl font-semibold tracking-[-0.025em] text-primary sm:text-[1.75rem]">
            {title}
          </h1>
          {description ? (
            <p className="mt-2 text-[0.9375rem] leading-relaxed text-secondary">
              {description}
            </p>
          ) : null}
          {meta ? <div className="mt-3">{meta}</div> : null}
        </div>
        {actions ? <div className="flex shrink-0 gap-2">{actions}</div> : null}
      </div>
    </header>
  );
}
