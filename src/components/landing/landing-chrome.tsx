import Link from "next/link";
import { ArrowRight, BookOpen, GraduationCap, Route } from "lucide-react";
import { Wordmark } from "@/components/brand/wordmark";
import { Button } from "@/components/ui/button";

/**
 * Landing page chrome: header, hero title card, closing call to action, footer.
 *
 * All server components — nothing here needs interactivity, so nothing here
 * ships JavaScript.
 */

export function LandingHeader() {
  return (
    <header className="absolute inset-x-0 top-0 z-50">
      <div className="mx-auto flex h-20 w-full max-w-[88rem] items-center justify-between px-6 sm:px-10">
        <Link
          href="/"
          className="rounded-md focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#e89f2c]"
        >
          <Wordmark size="md" tone="onDark" />
          <span className="sr-only">learnIT home</span>
        </Link>

        <nav className="flex items-center gap-1 sm:gap-2">
          <Link
            href="/demo"
            className="rounded-lg px-3 py-2 text-sm text-white/60 transition-colors hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#e89f2c]"
          >
            Explore demo
          </Link>
          <Button href="/signin" size="sm" className="bg-white text-[#08090b] hover:bg-white/90">
            Sign in
          </Button>
        </nav>
      </div>
    </header>
  );
}

/**
 * Title card.
 *
 * A deliberately quiet opening: the wordmark, one sentence about what this is,
 * and the two things a visitor can do. The story does the persuading; this
 * establishes what they are looking at before it starts.
 */
export function LandingHero() {
  return (
    <section
      data-surface="cinematic"
      className="relative flex min-h-screen items-center overflow-hidden bg-[#08090b]"
    >
      {/* Static backdrop — no WebGL here, so first paint is immediate. */}
      <div aria-hidden className="bg-grid absolute inset-0 opacity-[0.55]" />
      <div
        aria-hidden
        className="absolute inset-0 bg-[radial-gradient(ellipse_70%_55%_at_30%_45%,rgba(232,159,44,0.10),transparent_70%)]"
      />
      <div
        aria-hidden
        className="bg-grain-layer pointer-events-none absolute inset-0 opacity-[0.15] mix-blend-overlay"
      />
      <div
        aria-hidden
        className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-[#08090b] to-transparent"
      />

      <div className="relative mx-auto w-full max-w-[88rem] px-6 py-28 sm:px-10">
        <div className="max-w-3xl">
          <p className="animate-fade-up font-mono text-[0.6875rem] uppercase tracking-[0.18em] text-white/40">
            Adelphi University · Help Desk
          </p>

          <h1 className="animate-fade-up mt-7" style={{ animationDelay: "80ms" }}>
            <Wordmark size="xl" tone="onDark" className="block" />
            <span className="mt-5 block max-w-2xl text-2xl font-medium leading-[1.2] tracking-[-0.025em] text-white/85 sm:text-[2rem]">
              Learn the tools. Understand the workflow. Support the community.
            </span>
          </h1>

          <p
            className="animate-fade-up mt-7 max-w-xl text-base leading-relaxed text-white/55"
            style={{ animationDelay: "160ms" }}
          >
            The onboarding and knowledge platform for the Help Desk — structured
            training for your first week, and a reference fast enough to use with
            someone on the line.
          </p>

          <div
            className="animate-fade-up mt-10 flex flex-wrap items-center gap-3"
            style={{ animationDelay: "240ms" }}
          >
            <Button href="/signin" size="lg">
              Start learning
              <ArrowRight className="size-4" aria-hidden />
            </Button>
            <Button
              href="/demo"
              size="lg"
              variant="secondary"
              className="border-white/15 bg-white/[0.04] text-white hover:border-white/25 hover:bg-white/[0.08]"
            >
              Explore the demo
            </Button>
          </div>

          <p
            className="animate-fade-up mt-6 text-xs text-white/35"
            style={{ animationDelay: "300ms" }}
          >
            The demo uses fictional content and requires no account.
          </p>
        </div>
      </div>
    </section>
  );
}

const CLOSING_LINKS = [
  {
    href: "/demo/knowledge",
    icon: BookOpen,
    title: "Knowledge Base",
    description: "Procedures, searchable in milliseconds.",
  },
  {
    href: "/demo/troubleshoot",
    icon: Route,
    title: "Troubleshooting",
    description: "Guided decision trees from symptom to next step.",
  },
  {
    href: "/demo/training",
    icon: GraduationCap,
    title: "Training",
    description: "Structured onboarding with knowledge checks.",
  },
];

export function LandingClosing() {
  return (
    <section
      data-surface="cinematic"
      className="relative overflow-hidden border-t border-white/[0.07] bg-[#08090b]"
    >
      <div
        aria-hidden
        className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_0%,rgba(232,159,44,0.09),transparent_70%)]"
      />

      <div className="relative mx-auto w-full max-w-[88rem] px-6 py-28 sm:px-10 sm:py-36">
        <div className="mx-auto max-w-2xl text-center">
          <p className="font-mono text-[0.6875rem] uppercase tracking-[0.18em] text-white/40">
            Ready to learn?
          </p>
          <h2 className="mt-6 text-3xl font-semibold leading-[1.1] tracking-[-0.03em] text-white sm:text-5xl">
            Know exactly where to start.
          </h2>
          <p className="mx-auto mt-6 max-w-lg text-base leading-relaxed text-white/55">
            Sign in with your Help Desk account to pick up your onboarding, or
            explore the public demo to see how learnIT works.
          </p>

          <div className="mt-10 flex flex-wrap justify-center gap-3">
            <Button href="/signin" size="lg">
              Start learning
              <ArrowRight className="size-4" aria-hidden />
            </Button>
            <Button
              href="/demo"
              size="lg"
              variant="secondary"
              className="border-white/15 bg-white/[0.04] text-white hover:border-white/25 hover:bg-white/[0.08]"
            >
              Explore the demo
            </Button>
          </div>
        </div>

        <ul className="mx-auto mt-20 grid max-w-4xl gap-3 sm:grid-cols-3">
          {CLOSING_LINKS.map((link) => {
            const Icon = link.icon;
            return (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="group flex h-full flex-col rounded-xl border border-white/[0.08] bg-white/[0.02] p-5 transition-colors hover:border-white/15 hover:bg-white/[0.04] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#e89f2c]"
                >
                  <Icon className="size-4 text-[#e89f2c]" aria-hidden />
                  <span className="mt-4 flex items-center gap-1.5 text-sm font-medium text-white">
                    {link.title}
                    <ArrowRight
                      className="size-3.5 text-white/30 transition-transform group-hover:translate-x-0.5"
                      aria-hidden
                    />
                  </span>
                  <span className="mt-1.5 text-sm leading-6 text-white/45">
                    {link.description}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}

export function LandingFooter() {
  return (
    <footer
      data-surface="cinematic"
      className="border-t border-white/[0.07] bg-[#08090b]"
    >
      <div className="mx-auto w-full max-w-[88rem] px-6 py-12 sm:px-10">
        <div className="flex flex-col gap-8 sm:flex-row sm:items-start sm:justify-between">
          <div className="max-w-md">
            <Wordmark size="sm" tone="onDark" />
            <p className="mt-3 text-sm leading-6 text-white/40">
              An internal onboarding and knowledge platform for the Adelphi
              University Help Desk.
            </p>
          </div>

          <nav aria-label="Footer" className="flex flex-wrap gap-x-8 gap-y-3 text-sm">
            <Link href="/demo" className="text-white/50 transition-colors hover:text-white">
              Demo
            </Link>
            <Link href="/signin" className="text-white/50 transition-colors hover:text-white">
              Sign in
            </Link>
            <Link href="/about" className="text-white/50 transition-colors hover:text-white">
              About this project
            </Link>
          </nav>
        </div>

        <div className="mt-10 border-t border-white/[0.07] pt-6">
          <p className="text-xs leading-6 text-white/30">
            Demonstration content is fictional and does not represent official
            Adelphi University Help Desk procedure. Not an official University
            service.
          </p>
        </div>
      </div>
    </footer>
  );
}
