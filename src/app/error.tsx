"use client";

import { useEffect } from "react";
import { RefreshCw } from "lucide-react";
import { Wordmark } from "@/components/brand/wordmark";
import { Button } from "@/components/ui/button";

/**
 * Application error boundary.
 *
 * Shows the visitor a recovery path and nothing else. Stack traces, error
 * messages, and digests are not rendered — an internal IT tool's error text can
 * disclose infrastructure detail, and it is useless to the person reading it
 * anyway. The digest is logged for correlation with server logs.
 */
export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Replace with the deployment's error reporting service if one is adopted.
    console.error("[learnit] unhandled error", error.digest ?? error.message);
  }, [error]);

  return (
    <main
      id="main"
      className="flex min-h-screen flex-col items-center justify-center px-6 py-20"
    >
      <div className="w-full max-w-md text-center">
        <Wordmark size="md" />

        <p className="eyebrow mt-10">Error</p>
        <h1 className="mt-3 text-2xl font-semibold tracking-[-0.025em] text-primary">
          Something went wrong
        </h1>
        <p className="mt-3 text-[0.9375rem] leading-relaxed text-secondary">
          This page could not be loaded. Trying again usually resolves it. If it
          keeps happening, let Help Desk leadership know what you were doing.
        </p>

        <div className="mt-8 flex flex-wrap justify-center gap-2">
          <Button size="md" onClick={reset}>
            <RefreshCw className="size-4" aria-hidden />
            Try again
          </Button>
          <Button href="/dashboard" size="md" variant="secondary">
            Back to dashboard
          </Button>
        </div>

        {error.digest ? (
          <p className="mt-8 font-mono text-xs text-tertiary">
            Reference: {error.digest}
          </p>
        ) : null}
      </div>
    </main>
  );
}
