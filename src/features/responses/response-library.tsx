"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Check,
  ChevronDown,
  Copy,
  Info,
  Mail,
  MessageCircle,
  Phone,
  Search,
  TriangleAlert,
  X,
} from "lucide-react";
import { Badge, EmptyState } from "@/components/ui/primitives";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/cn";
import type { QuickResponse } from "@/lib/content/schema";
import { CATEGORY_LABELS } from "@/lib/content/schema";
import {
  fillTemplate,
  resolvePlaceholders,
  unfilledTokens,
} from "@/lib/responses/template";

/**
 * Quick response library.
 *
 * The whole feature is judged on one interaction: how fast a technician gets a
 * correct, personalised message onto the clipboard. So the list filters
 * instantly, the placeholder fields are inline rather than behind a dialog, and
 * the copy button warns — but never blocks — when a token is still unfilled.
 *
 * The open response is reflected in the URL (`?open=slug`) so troubleshooting
 * outcomes and articles can link straight to the message they recommend.
 */

const CHANNEL_ICONS = {
  email: Mail,
  phone: Phone,
  chat: MessageCircle,
  any: MessageCircle,
} as const;

export function ResponseLibrary({
  responses,
  technicianName,
}: {
  responses: QuickResponse[];
  technicianName?: string;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<string>("all");

  const openSlug = searchParams.get("open");

  const setOpen = useCallback(
    (slug: string | null) => {
      const params = new URLSearchParams(searchParams.toString());
      if (slug) params.set("open", slug);
      else params.delete("open");
      const queryString = params.toString();
      router.replace(queryString ? `?${queryString}` : "?", { scroll: false });
    },
    [router, searchParams],
  );

  const categories = useMemo(() => {
    const set = new Set(responses.map((response) => response.category));
    return [...set].sort((a, b) => CATEGORY_LABELS[a].localeCompare(CATEGORY_LABELS[b]));
  }, [responses]);

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return responses.filter((response) => {
      if (category !== "all" && response.category !== category) return false;
      if (!needle) return true;
      return (
        response.title.toLowerCase().includes(needle) ||
        response.summary.toLowerCase().includes(needle) ||
        response.template.toLowerCase().includes(needle) ||
        response.tags.some((tag) => tag.toLowerCase().includes(needle))
      );
    });
  }, [responses, query, category]);

  return (
    <div>
      <div className="mb-6 space-y-4">
        <div className="relative">
          <Search
            className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-tertiary"
            aria-hidden
          />
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Filter by title, tag, or a phrase from the message…"
            aria-label="Filter responses"
            className="h-11 w-full rounded-lg border border-default bg-surface-raised pl-10 pr-4 text-sm text-primary outline-none transition-colors placeholder:text-tertiary focus:border-strong"
          />
        </div>

        <div className="flex flex-wrap gap-1.5">
          <CategoryChip active={category === "all"} onClick={() => setCategory("all")}>
            All
          </CategoryChip>
          {categories.map((value) => (
            <CategoryChip
              key={value}
              active={category === value}
              onClick={() => setCategory(value)}
            >
              {CATEGORY_LABELS[value]}
            </CategoryChip>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon={<Search className="size-6" aria-hidden />}
          title="No responses match"
          description="Try a broader term. Searching also looks inside the message text, so a phrase you remember from the message itself usually works."
        />
      ) : (
        <ul className="space-y-2.5">
          {filtered.map((response) => (
            <ResponseCard
              key={response.slug}
              response={response}
              open={openSlug === response.slug}
              onToggle={() => setOpen(openSlug === response.slug ? null : response.slug)}
              technicianName={technicianName}
            />
          ))}
        </ul>
      )}
    </div>
  );
}

/* -------------------------------------------------------------------------- */

function ResponseCard({
  response,
  open,
  onToggle,
  technicianName,
}: {
  response: QuickResponse;
  open: boolean;
  onToggle: () => void;
  technicianName?: string;
}) {
  const placeholders = useMemo(
    () => resolvePlaceholders(response.template, response.placeholders),
    [response],
  );

  // The signed-in technician's name pre-fills the signature placeholder — it is
  // in every template and nobody should have to type it each time.
  const initialValues = (): Record<string, string> =>
    technicianName ? { tech_name: technicianName } : {};

  const [values, setValues] = useState<Record<string, string>>(initialValues);
  const [copied, setCopied] = useState(false);
  const [copyError, setCopyError] = useState(false);
  const cardRef = useRef<HTMLLIElement>(null);
  const resetTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const filled = fillTemplate(response.template, values);
  const missing = unfilledTokens(response.template, values);

  // Deep links (`?open=slug`) should land on the response, not the top of the page.
  useEffect(() => {
    if (open) {
      cardRef.current?.scrollIntoView({ block: "center", behavior: "smooth" });
    }
  }, [open]);

  useEffect(
    () => () => {
      if (resetTimer.current) clearTimeout(resetTimer.current);
    },
    [],
  );

  const copy = async () => {
    setCopyError(false);
    try {
      await navigator.clipboard.writeText(filled);
      setCopied(true);
      resetTimer.current = setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard access can be denied (insecure context, permissions policy).
      // Say so rather than silently doing nothing — the technician needs to
      // know to select the text manually.
      setCopyError(true);
    }
  };

  const ChannelIcon = CHANNEL_ICONS[response.channel];

  return (
    <li
      ref={cardRef}
      className="scroll-mt-24 overflow-hidden rounded-xl border border-subtle bg-surface-raised"
    >
      <h3>
        <button
          type="button"
          onClick={onToggle}
          aria-expanded={open}
          className="flex w-full items-start gap-3 p-4 text-left transition-colors hover:bg-surface-overlay"
        >
          <ChannelIcon className="mt-0.5 size-4 shrink-0 text-tertiary" aria-hidden />
          <span className="min-w-0 flex-1">
            <span className="flex flex-wrap items-center gap-2">
              <span className="text-[0.9375rem] font-medium text-primary">
                {response.title}
              </span>
              <Badge tone="neutral">{CATEGORY_LABELS[response.category]}</Badge>
              {response.visibility === "staff" ? (
                <Badge tone="signal">Internal</Badge>
              ) : null}
            </span>
            <span className="mt-1 block text-sm leading-6 text-secondary">
              {response.summary}
            </span>
          </span>
          <ChevronDown
            className={cn(
              "mt-1 size-4 shrink-0 text-tertiary transition-transform",
              open && "rotate-180",
            )}
            aria-hidden
          />
        </button>
      </h3>

      {open ? (
        <div className="border-t border-subtle p-4">
          {response.usage ? (
            <div className="mb-4 flex gap-2.5 rounded-lg border border-signal/25 bg-signal-soft px-3.5 py-3">
              <Info className="mt-0.5 size-3.5 shrink-0 text-signal" aria-hidden />
              <p className="text-sm leading-6 text-secondary">{response.usage}</p>
            </div>
          ) : null}

          {placeholders.length > 0 ? (
            <fieldset className="mb-4">
              <legend className="text-sm font-medium text-primary">Fill in</legend>
              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                {placeholders.map((placeholder) => (
                  <div key={placeholder.key}>
                    <label
                      htmlFor={`${response.slug}-${placeholder.key}`}
                      className="block text-xs text-secondary"
                    >
                      {placeholder.label}
                    </label>
                    <input
                      id={`${response.slug}-${placeholder.key}`}
                      type="text"
                      value={values[placeholder.key] ?? ""}
                      onChange={(event) =>
                        setValues((current) => ({
                          ...current,
                          [placeholder.key]: event.target.value,
                        }))
                      }
                      placeholder={placeholder.example}
                      className="mt-1.5 h-9 w-full rounded-lg border border-default bg-surface-inset px-3 text-sm text-primary outline-none transition-colors placeholder:text-tertiary focus:border-strong"
                    />
                  </div>
                ))}
              </div>
            </fieldset>
          ) : null}

          <div className="overflow-hidden rounded-lg border border-subtle bg-surface-sunken">
            <pre className="max-h-80 overflow-auto px-4 py-3.5 text-[0.8125rem] leading-6 text-secondary">
              <code className="whitespace-pre-wrap break-words font-sans">{filled}</code>
            </pre>
          </div>

          {missing.length > 0 ? (
            <p className="mt-3 flex items-start gap-2 text-sm text-warning">
              <TriangleAlert className="mt-0.5 size-3.5 shrink-0" aria-hidden />
              <span>
                {missing.length} placeholder{missing.length === 1 ? "" : "s"} still
                unfilled. They will be copied as-is — fill them in before sending.
              </span>
            </p>
          ) : null}

          {copyError ? (
            <p role="alert" className="mt-3 text-sm text-danger">
              Your browser blocked clipboard access. Select the text above and copy
              it manually.
            </p>
          ) : null}

          <div className="mt-4 flex flex-wrap items-center gap-2">
            <Button size="sm" onClick={copy}>
              {copied ? (
                <>
                  <Check className="size-4" aria-hidden />
                  Copied
                </>
              ) : (
                <>
                  <Copy className="size-4" aria-hidden />
                  Copy message
                </>
              )}
            </Button>
            {Object.keys(values).length > 0 ? (
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setValues(initialValues())}
              >
                <X className="size-3.5" aria-hidden />
                Clear fields
              </Button>
            ) : null}
          </div>

          <p role="status" aria-live="polite" className="sr-only">
            {copied ? "Message copied to clipboard" : ""}
          </p>
        </div>
      ) : null}
    </li>
  );
}

function CategoryChip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "rounded-lg border px-2.5 py-1.5 text-sm transition-colors",
        active
          ? "border-accent/30 bg-accent-soft text-accent-text"
          : "border-default bg-surface-raised text-secondary hover:border-strong hover:text-primary",
      )}
    >
      {children}
    </button>
  );
}
