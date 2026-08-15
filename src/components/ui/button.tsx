import Link from "next/link";
import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { cn } from "@/lib/cn";

/**
 * The one button in the system.
 *
 * Renders as `<button>`, or as a Next `<Link>` when `href` is supplied, so a
 * navigational action is still a real anchor — right-click, middle-click, and
 * assistive technology all keep working.
 */

type Variant = "primary" | "secondary" | "ghost" | "danger";
type Size = "sm" | "md" | "lg";

const VARIANTS: Record<Variant, string> = {
  primary:
    "bg-accent text-accent-contrast hover:bg-accent-hover shadow-elev-sm font-medium",
  secondary:
    "bg-surface-inset text-primary border border-default hover:border-strong hover:bg-surface-overlay",
  ghost: "text-secondary hover:text-primary hover:bg-surface-inset",
  danger: "bg-danger-soft text-danger border border-danger/30 hover:bg-danger/20",
};

const SIZES: Record<Size, string> = {
  sm: "h-8 px-3 text-sm gap-1.5 rounded-md",
  md: "h-10 px-4 text-sm gap-2 rounded-lg",
  lg: "h-12 px-6 text-base gap-2.5 rounded-lg",
};

const BASE =
  "inline-flex items-center justify-center whitespace-nowrap transition-colors duration-150 " +
  "disabled:opacity-50 disabled:pointer-events-none select-none " +
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent";

interface CommonProps {
  variant?: Variant;
  size?: Size;
  className?: string;
  children: ReactNode;
}

type ButtonProps = CommonProps &
  Omit<ComponentPropsWithoutRef<"button">, "className" | "children"> & {
    href?: undefined;
  };

type AnchorProps = CommonProps &
  Omit<ComponentPropsWithoutRef<"a">, "className" | "children" | "href"> & {
    href: string;
  };

export function Button(props: ButtonProps | AnchorProps) {
  const { variant = "primary", size = "md", className, children, ...rest } = props;
  const classes = cn(BASE, VARIANTS[variant], SIZES[size], className);

  if ("href" in rest && typeof rest.href === "string") {
    const { href, ...anchorRest } = rest as AnchorProps;
    const external = href.startsWith("http") || href.startsWith("mailto:");
    if (external) {
      return (
        <a
          {...anchorRest}
          href={href}
          className={classes}
          target="_blank"
          rel="noopener noreferrer"
        >
          {children}
        </a>
      );
    }
    return (
      <Link {...anchorRest} href={href} className={classes}>
        {children}
      </Link>
    );
  }

  const { type = "button", ...buttonRest } = rest as ButtonProps;
  return (
    <button {...buttonRest} type={type} className={classes}>
      {children}
    </button>
  );
}
