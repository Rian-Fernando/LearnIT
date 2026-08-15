import Link from "next/link";
import { Fragment, type ReactNode } from "react";

/**
 * Inline rich text.
 *
 * Content authors get a deliberately tiny markup subset:
 *
 *   **bold**            → <strong>
 *   `code`              → <code>
 *   [label](/path)      → link
 *
 * It is parsed into React elements — there is no HTML string anywhere in this
 * pipeline, so a content author cannot inject markup and `dangerouslySetInnerHTML`
 * never appears in the codebase. Anything richer than this belongs in a block
 * type, not in inline markup.
 */

const PATTERN = /(\*\*[^*]+\*\*|`[^`]+`|\[[^\]]+\]\([^)\s]+\))/g;

function renderLink(label: string, href: string, key: number): ReactNode {
  const isExternal = /^https?:\/\//.test(href);
  const className =
    "text-accent-text underline decoration-accent/30 underline-offset-2 transition-colors hover:decoration-accent";

  if (isExternal) {
    return (
      <a
        key={key}
        href={href}
        className={className}
        target="_blank"
        rel="noopener noreferrer"
      >
        {label}
      </a>
    );
  }

  // Reject anything that is not a same-origin path — content should never be
  // able to produce a `javascript:` or `data:` URL.
  if (!href.startsWith("/")) return <Fragment key={key}>{label}</Fragment>;

  return (
    <Link key={key} href={href} className={className}>
      {label}
    </Link>
  );
}

export function RichText({ children }: { children: string }) {
  const parts = children.split(PATTERN);

  return (
    <>
      {parts.map((part, index) => {
        if (!part) return null;

        if (part.startsWith("**") && part.endsWith("**")) {
          return (
            <strong key={index} className="font-semibold text-primary">
              {part.slice(2, -2)}
            </strong>
          );
        }

        if (part.startsWith("`") && part.endsWith("`")) {
          return (
            <code
              key={index}
              className="rounded border border-subtle bg-surface-inset px-1.5 py-0.5 font-mono text-[0.85em] text-primary"
            >
              {part.slice(1, -1)}
            </code>
          );
        }

        const linkMatch = /^\[([^\]]+)\]\(([^)\s]+)\)$/.exec(part);
        if (linkMatch) {
          return renderLink(linkMatch[1]!, linkMatch[2]!, index);
        }

        return <Fragment key={index}>{part}</Fragment>;
      })}
    </>
  );
}
