import { cn } from "@/lib/cn";

/**
 * learnIT wordmark.
 *
 * "learn" in the reading weight, "IT" set in the mono face and accent colour —
 * the pun does the work, and the type change makes it read as a product name
 * rather than a sentence. Set as text rather than an image so it stays crisp,
 * selectable, translatable, and themeable.
 */
export function Wordmark({
  className,
  size = "md",
  tone = "default",
}: {
  className?: string;
  size?: "sm" | "md" | "lg" | "xl";
  tone?: "default" | "onDark";
}) {
  const sizes = {
    sm: "text-base",
    md: "text-lg",
    lg: "text-2xl",
    xl: "text-4xl sm:text-5xl",
  } as const;

  return (
    <span
      className={cn(
        "inline-flex select-none items-baseline font-semibold tracking-[-0.03em]",
        sizes[size],
        tone === "onDark" ? "text-white" : "text-primary",
        className,
      )}
    >
      learn
      <span
        className={cn(
          "font-mono font-semibold tracking-[-0.02em]",
          tone === "onDark" ? "text-[#c7f04a]" : "text-accent-text",
        )}
      >
        IT
      </span>
    </span>
  );
}

/** Compact mark for tight spaces (favicons, collapsed navigation). */
export function Monogram({ className }: { className?: string }) {
  return (
    <span
      aria-hidden
      className={cn(
        "inline-flex size-8 items-center justify-center rounded-lg border border-accent/30 bg-accent-soft font-mono text-sm font-semibold text-accent-text",
        className,
      )}
    >
      IT
    </span>
  );
}
