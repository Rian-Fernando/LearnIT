"use client";

import { useState } from "react";
import { CheckCircle2, Flag, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/cn";

/**
 * "Report outdated information".
 *
 * Placed at the end of every procedure, because that is where a technician
 * realises the instructions no longer match what they are looking at. Anything
 * that makes this take more than a few seconds means it does not get used, and
 * the documentation quietly rots.
 */

const REASONS = [
  { value: "outdated", label: "Out of date", hint: "The procedure has changed" },
  { value: "incorrect", label: "Incorrect", hint: "Something here is wrong" },
  { value: "unclear", label: "Unclear", hint: "Hard to follow in practice" },
  { value: "broken-link", label: "Broken link", hint: "A link goes nowhere" },
  { value: "other", label: "Something else", hint: "" },
] as const;

type Reason = (typeof REASONS)[number]["value"];
type Status = "idle" | "open" | "sending" | "sent" | "error";

export function ReportOutdated({
  resourceType,
  resourceSlug,
  resourceTitle,
  className,
}: {
  resourceType: "article" | "module" | "flow" | "response" | "scenario";
  resourceSlug: string;
  resourceTitle: string;
  className?: string;
}) {
  const [status, setStatus] = useState<Status>("idle");
  const [reason, setReason] = useState<Reason>("outdated");
  const [detail, setDetail] = useState("");
  const [error, setError] = useState<string | null>(null);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setStatus("sending");
    setError(null);

    try {
      const response = await fetch("/api/reports", {
        method: "POST",
        headers: { "content-type": "application/json" },
        credentials: "same-origin",
        body: JSON.stringify({
          resourceType,
          resourceSlug,
          reason,
          detail: detail.trim() || undefined,
        }),
      });

      if (!response.ok) {
        const data = (await response.json().catch(() => ({}))) as { error?: string };
        setError(data.error ?? "That could not be submitted. Please try again.");
        setStatus("error");
        return;
      }

      setStatus("sent");
    } catch {
      setError("Network error. Please try again.");
      setStatus("error");
    }
  };

  if (status === "sent") {
    return (
      <div
        className={cn(
          "flex items-start gap-3 rounded-lg border border-success/25 bg-success-soft px-4 py-3.5",
          className,
        )}
      >
        <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-success" aria-hidden />
        <div>
          <p className="text-sm font-medium text-success">Thanks — that is logged</p>
          <p className="mt-1 text-sm leading-6 text-secondary">
            It goes into the review queue for Help Desk leadership. Flagging things
            you notice is genuinely how this documentation stays accurate.
          </p>
        </div>
      </div>
    );
  }

  if (status === "idle") {
    return (
      <div className={cn("border-t border-subtle pt-6", className)}>
        <button
          type="button"
          onClick={() => setStatus("open")}
          className="inline-flex items-center gap-2 text-sm text-tertiary transition-colors hover:text-primary"
        >
          <Flag className="size-3.5" aria-hidden />
          Report outdated information
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={submit}
      className={cn(
        "rounded-xl border border-subtle bg-surface-raised p-5",
        className,
      )}
    >
      <h2 className="text-sm font-medium text-primary">
        Report an issue with this page
      </h2>
      <p className="mt-1 text-sm leading-6 text-tertiary">
        Reporting &ldquo;{resourceTitle}&rdquo;. This creates a review item for
        Help Desk leadership.
      </p>

      <fieldset className="mt-4">
        <legend className="sr-only">What is wrong?</legend>
        <div className="flex flex-wrap gap-1.5">
          {REASONS.map((option) => (
            <label
              key={option.value}
              className={cn(
                "cursor-pointer rounded-lg border px-2.5 py-1.5 text-sm transition-colors",
                reason === option.value
                  ? "border-accent/30 bg-accent-soft text-accent-text"
                  : "border-default bg-surface-inset text-secondary hover:border-strong hover:text-primary",
              )}
            >
              <input
                type="radio"
                name="reason"
                value={option.value}
                checked={reason === option.value}
                onChange={() => setReason(option.value)}
                className="sr-only"
              />
              {option.label}
            </label>
          ))}
        </div>
      </fieldset>

      <div className="mt-4">
        <label
          htmlFor={`report-detail-${resourceSlug}`}
          className="block text-sm text-secondary"
        >
          What did you notice?{" "}
          <span className="text-tertiary">(optional, but very helpful)</span>
        </label>
        <textarea
          id={`report-detail-${resourceSlug}`}
          value={detail}
          onChange={(event) => setDetail(event.target.value)}
          rows={3}
          maxLength={1000}
          placeholder="Step 4 refers to a menu that has moved…"
          className="mt-2 w-full resize-y rounded-lg border border-default bg-surface-inset px-3 py-2.5 text-sm text-primary outline-none transition-colors placeholder:text-tertiary focus:border-strong"
        />
        <p className="mt-1.5 text-xs text-tertiary">
          Do not include credentials, ticket contents, or anything identifying a
          requester.
        </p>
      </div>

      {error ? (
        <p role="alert" className="mt-3 text-sm text-danger">
          {error}
        </p>
      ) : null}

      <div className="mt-4 flex gap-2">
        <Button type="submit" size="sm" disabled={status === "sending"}>
          {status === "sending" ? (
            <>
              <Loader2 className="size-4 animate-spin" aria-hidden />
              Sending
            </>
          ) : (
            "Submit report"
          )}
        </Button>
        <Button
          type="button"
          size="sm"
          variant="ghost"
          onClick={() => {
            setStatus("idle");
            setError(null);
          }}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}
