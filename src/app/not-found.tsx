import Link from "next/link";
import { ArrowLeft, Search } from "lucide-react";
import { Wordmark } from "@/components/brand/wordmark";
import { Button } from "@/components/ui/button";

/**
 * 404.
 *
 * Deliberately does not distinguish "does not exist" from "you may not see
 * this" — a 404 for content a viewer lacks permission for is the correct
 * behaviour, because a 403 would confirm the record exists.
 */
export default function NotFound() {
  return (
    <main
      id="main"
      className="flex min-h-screen flex-col items-center justify-center px-6 py-20"
    >
      <div className="w-full max-w-md text-center">
        <Wordmark size="md" />

        <p className="eyebrow mt-10">404</p>
        <h1 className="mt-3 text-2xl font-semibold tracking-[-0.025em] text-primary">
          That page isn&rsquo;t here
        </h1>
        <p className="mt-3 text-[0.9375rem] leading-relaxed text-secondary">
          It may have been archived, renamed, or it may be internal documentation
          that requires a Help Desk account.
        </p>

        <div className="mt-8 flex flex-wrap justify-center gap-2">
          <Button href="/dashboard" size="md">
            <ArrowLeft className="size-4" aria-hidden />
            Dashboard
          </Button>
          <Button href="/knowledge" size="md" variant="secondary">
            <Search className="size-4" aria-hidden />
            Knowledge Base
          </Button>
        </div>

        <p className="mt-8 text-sm text-tertiary">
          Looking around without an account?{" "}
          <Link
            href="/demo"
            className="text-accent-text underline decoration-accent/30 underline-offset-2 hover:decoration-accent"
          >
            Explore the demo
          </Link>
        </p>
      </div>
    </main>
  );
}
