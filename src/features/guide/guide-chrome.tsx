import Link from "next/link";
import { Wordmark } from "@/components/brand/wordmark";

/**
 * Guide header and footer.
 *
 * Server components with no interactivity, so the guide ships effectively no
 * JavaScript of its own — which is the point when it is competing with twenty
 * other Chrome tabs for memory.
 */

const LINKS = [
  { href: "/guide", label: "Overview" },
  { href: "/guide/ticket-basics", label: "Ticket basics" },
  { href: "/guide/systems", label: "Systems" },
  { href: "/guide/bookmarks", label: "Bookmarks" },
];

export function GuideChrome() {
  return (
    <header className="sticky top-0 z-40 border-b border-subtle bg-surface-base/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 w-full max-w-5xl items-center gap-4 px-4 sm:px-6">
        <Link href="/" className="shrink-0">
          <Wordmark size="sm" />
          <span className="sr-only">learnIT home</span>
        </Link>

        <nav aria-label="Guide" className="flex min-w-0 flex-1 gap-1 overflow-x-auto">
          {LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="whitespace-nowrap rounded-lg px-2.5 py-1.5 text-sm text-secondary transition-colors hover:bg-surface-inset hover:text-primary"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <Link
          href="/signin"
          className="hidden shrink-0 text-sm text-tertiary transition-colors hover:text-primary sm:block"
        >
          Staff sign in
        </Link>
      </div>
    </header>
  );
}

export function GuideFooter() {
  return (
    <footer className="mt-16 border-t border-subtle">
      <div className="mx-auto w-full max-w-5xl px-4 py-10 sm:px-6">
        <p className="text-xs leading-6 text-tertiary">
          Open to anyone — no account needed. This covers how the Help Desk works
          in general terms. Internal procedures, escalation paths, and anything
          containing user information stay behind staff sign-in.
        </p>
        <p className="mt-4 text-xs leading-6 text-tertiary">
          Built by{" "}
          <a
            href="https://rianfernando.com"
            className="text-accent-text underline decoration-accent/30 underline-offset-2 hover:decoration-accent"
          >
            Rian Fernando
          </a>
        </p>
      </div>
    </footer>
  );
}
