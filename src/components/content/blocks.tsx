import Link from "next/link";
import {
  AlertTriangle,
  ArrowUpRight,
  CheckCircle2,
  ExternalLink,
  FileText,
  Info,
  Lightbulb,
  MessageSquareQuote,
  OctagonAlert,
} from "lucide-react";
import type { Block, CalloutTone } from "@/lib/content/schema";
import { cn } from "@/lib/cn";
import { RichText } from "./rich-text";

/**
 * Block renderer.
 *
 * A closed switch over the block union — adding a block type to the schema
 * produces a type error here until it is handled, which is exactly the
 * behaviour we want from a content pipeline.
 *
 * `link` blocks reference an `ImportantLink` by key. Resolution happens on the
 * server (pages call `buildLinkMap`) and the resolved map is passed in, so this
 * component stays serialisable and usable inside client components too.
 */

export type LinkMap = Record<
  string,
  { label: string; description: string; href: string }
>;

const CALLOUT: Record<
  CalloutTone,
  { icon: typeof Info; wrap: string; accent: string; label: string }
> = {
  info: {
    icon: Info,
    wrap: "border-signal/25 bg-signal-soft",
    accent: "text-signal",
    label: "Note",
  },
  tip: {
    icon: Lightbulb,
    wrap: "border-accent/25 bg-accent-soft",
    accent: "text-accent-text",
    label: "Tip",
  },
  warning: {
    icon: AlertTriangle,
    wrap: "border-warning/30 bg-warning-soft",
    accent: "text-warning",
    label: "Important",
  },
  danger: {
    icon: OctagonAlert,
    wrap: "border-danger/30 bg-danger-soft",
    accent: "text-danger",
    label: "Critical",
  },
  success: {
    icon: CheckCircle2,
    wrap: "border-success/25 bg-success-soft",
    accent: "text-success",
    label: "Confirmed",
  },
};

function BlockView({ block, links }: { block: Block; links: LinkMap }) {
  switch (block.type) {
    case "paragraph":
      return (
        <p className="text-[0.9375rem] leading-7 text-secondary">
          <RichText>{block.text}</RichText>
        </p>
      );

    case "heading": {
      if (block.level === 2) {
        return (
          <h2 className="mt-2 text-lg font-semibold tracking-tight text-primary">
            {block.text}
          </h2>
        );
      }
      return (
        <h3 className="mt-1 text-base font-semibold tracking-tight text-primary">
          {block.text}
        </h3>
      );
    }

    case "list": {
      const Tag = block.ordered ? "ol" : "ul";
      return (
        <Tag
          className={cn(
            "space-y-2 pl-1 text-[0.9375rem] leading-7 text-secondary",
            block.ordered ? "list-decimal marker:text-tertiary" : "",
          )}
        >
          {block.items.map((item, i) => (
            <li key={i} className={cn(block.ordered ? "ml-5 pl-1" : "flex gap-3")}>
              {block.ordered ? null : (
                <span
                  aria-hidden
                  className="mt-[0.6875rem] size-1 shrink-0 rounded-full bg-tertiary"
                />
              )}
              <span className={block.ordered ? undefined : "flex-1"}>
                <RichText>{item}</RichText>
              </span>
            </li>
          ))}
        </Tag>
      );
    }

    case "steps":
      return (
        <ol className="space-y-0">
          {block.items.map((item, i) => (
            <li key={i} className="group relative flex gap-4 pb-5 last:pb-0">
              {/* Connector line between step markers. */}
              <div className="flex flex-col items-center">
                <span className="tabular flex size-7 shrink-0 items-center justify-center rounded-full border border-default bg-surface-inset text-xs font-medium text-secondary">
                  {i + 1}
                </span>
                <span
                  aria-hidden
                  className="mt-1 w-px flex-1 bg-subtle group-last:hidden"
                />
              </div>
              <div className="flex-1 pt-0.5 pb-1">
                <p className="text-[0.9375rem] font-medium leading-6 text-primary">
                  <RichText>{item.title}</RichText>
                </p>
                {item.detail ? (
                  <p className="mt-1 text-sm leading-6 text-tertiary">
                    <RichText>{item.detail}</RichText>
                  </p>
                ) : null}
              </div>
            </li>
          ))}
        </ol>
      );

    case "callout": {
      const config = CALLOUT[block.tone];
      const Icon = config.icon;
      return (
        <aside className={cn("rounded-lg border px-4 py-3.5", config.wrap)}>
          <div className="flex gap-3">
            <Icon className={cn("mt-0.5 size-4 shrink-0", config.accent)} aria-hidden />
            <div className="min-w-0 flex-1">
              <p className={cn("text-sm font-semibold", config.accent)}>
                {block.title ?? config.label}
              </p>
              <p className="mt-1 text-sm leading-6 text-secondary">
                <RichText>{block.text}</RichText>
              </p>
            </div>
          </div>
        </aside>
      );
    }

    case "code":
      return (
        <figure className="overflow-hidden rounded-lg border border-subtle bg-surface-sunken">
          {block.caption ? (
            <figcaption className="border-b border-subtle px-4 py-2 font-mono text-xs uppercase tracking-wider text-tertiary">
              {block.caption}
            </figcaption>
          ) : null}
          <pre className="overflow-x-auto px-4 py-3.5">
            <code className="font-mono text-[0.8125rem] leading-6 text-secondary">
              {block.code}
            </code>
          </pre>
        </figure>
      );

    case "fields":
      return (
        <dl className="divide-y divide-subtle overflow-hidden rounded-lg border border-subtle">
          {block.items.map((item, i) => (
            <div key={i} className="grid gap-1 px-4 py-3 sm:grid-cols-[minmax(0,13rem)_1fr] sm:gap-4">
              <dt className="text-sm font-medium text-primary">{item.label}</dt>
              <dd className="text-sm leading-6 text-secondary">
                <RichText>{item.value}</RichText>
              </dd>
            </div>
          ))}
        </dl>
      );

    case "image":
      return (
        <figure className="overflow-hidden rounded-lg border border-subtle bg-surface-sunken">
          {/* eslint-disable-next-line @next/next/no-img-element -- content images
              are author-supplied paths of unknown intrinsic size; next/image
              would require dimensions the content model does not always carry. */}
          <img
            src={block.src}
            alt={block.alt}
            width={block.width}
            height={block.height}
            loading="lazy"
            decoding="async"
            className="w-full"
          />
          {block.caption ? (
            <figcaption className="border-t border-subtle px-4 py-2 text-xs text-tertiary">
              {block.caption}
            </figcaption>
          ) : null}
        </figure>
      );

    case "link": {
      const target = links[block.linkKey];
      if (!target) {
        // The link exists but this viewer may not see it (staff-only link in a
        // public context). Render nothing rather than a dead reference.
        return null;
      }
      const unset = target.href === "#";
      const body = (
        <>
          <span className="flex min-w-0 flex-1 flex-col">
            <span className="flex items-center gap-1.5 text-sm font-medium text-primary">
              {target.label}
              {unset ? null : (
                <ExternalLink className="size-3.5 text-tertiary" aria-hidden />
              )}
            </span>
            <span className="mt-0.5 text-sm leading-6 text-tertiary">
              {block.note ?? target.description}
            </span>
            {unset ? (
              <span className="mt-1.5 font-mono text-[0.6875rem] uppercase tracking-wider text-warning">
                Awaiting configuration by an administrator
              </span>
            ) : null}
          </span>
        </>
      );

      if (unset) {
        return (
          <div className="flex gap-3 rounded-lg border border-dashed border-default bg-surface-inset/50 px-4 py-3.5">
            {body}
          </div>
        );
      }

      return (
        <a
          href={target.href}
          target="_blank"
          rel="noopener noreferrer"
          className="flex gap-3 rounded-lg border border-subtle bg-surface-inset px-4 py-3.5 transition-colors hover:border-default hover:bg-surface-overlay"
        >
          {body}
        </a>
      );
    }

    case "articleRef":
      return (
        <Link
          href={`/knowledge/${block.slug}`}
          className="group flex items-start gap-3 rounded-lg border border-subtle bg-surface-inset px-4 py-3.5 transition-colors hover:border-default hover:bg-surface-overlay"
        >
          <FileText className="mt-0.5 size-4 shrink-0 text-tertiary" aria-hidden />
          <span className="min-w-0 flex-1">
            <span className="flex items-center gap-1.5 text-sm font-medium text-primary">
              Related article
              <ArrowUpRight className="size-3.5 text-tertiary transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden />
            </span>
            <span className="mt-0.5 block text-sm text-tertiary">
              {block.note ?? "Open the full procedure"}
            </span>
          </span>
        </Link>
      );

    case "responseRef":
      return (
        <Link
          href={`/responses?open=${block.slug}`}
          className="group flex items-start gap-3 rounded-lg border border-subtle bg-surface-inset px-4 py-3.5 transition-colors hover:border-default hover:bg-surface-overlay"
        >
          <MessageSquareQuote className="mt-0.5 size-4 shrink-0 text-tertiary" aria-hidden />
          <span className="min-w-0 flex-1">
            <span className="flex items-center gap-1.5 text-sm font-medium text-primary">
              Quick response available
              <ArrowUpRight className="size-3.5 text-tertiary transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden />
            </span>
            <span className="mt-0.5 block text-sm text-tertiary">
              Open the copy-ready template
            </span>
          </span>
        </Link>
      );

    case "divider":
      return <hr className="border-subtle" />;
  }
}

export function Blocks({
  blocks,
  links = {},
  className,
}: {
  blocks: Block[];
  links?: LinkMap;
  className?: string;
}) {
  return (
    <div className={cn("space-y-5", className)}>
      {blocks.map((block, index) => (
        <BlockView key={index} block={block} links={links} />
      ))}
    </div>
  );
}
