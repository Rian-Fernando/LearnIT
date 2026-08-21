import Link from "next/link";
import { ArrowRight, BookOpen, GraduationCap, Route, Search } from "lucide-react";
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
          className="rounded-md focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#c7f04a]"
        >
          <Wordmark size="md" tone="onDark" />
          <span className="sr-only">learnIT home</span>
        </Link>

        <nav className="flex items-center gap-1 sm:gap-2">
          <Link
            href="/demo"
            className="rounded-lg px-3 py-2 text-sm text-white/60 transition-colors hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#c7f04a]"
          >
            Explore demo
          </Link>
          <Button href="/signin" size="sm" className="bg-white text-[#0a0b09] hover:bg-white/90">
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
      className="relative flex min-h-screen items-center overflow-hidden bg-[#0a0b09]"
    >
      {/* Backdrop. Raised from the near-invisible original: the grid now reads
          as structure rather than noise, and a second warm wash on the right
          stops that half of the screen falling away to flat black. */}
      <div aria-hidden className="bg-grid absolute inset-0 opacity-90" />
      <div
        aria-hidden
        className="absolute inset-0 bg-[radial-gradient(ellipse_65%_55%_at_22%_42%,rgba(199,240,74,0.16),transparent_68%)]"
      />
      <div
        aria-hidden
        className="absolute inset-0 bg-[radial-gradient(ellipse_50%_45%_at_82%_58%,rgba(86,199,232,0.09),transparent_70%)]"
      />
      <div
        aria-hidden
        className="bg-grain-layer pointer-events-none absolute inset-0 opacity-[0.14] mix-blend-overlay"
      />
      <div
        aria-hidden
        className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-[#0a0b09] to-transparent"
      />

      <div className="relative mx-auto w-full max-w-[88rem] px-6 py-28 sm:px-10">
        <div className="grid items-center gap-16 lg:grid-cols-[minmax(0,1fr)_26rem] xl:gap-20">
          {/* ------------------------------------------------------- copy */}
          <div>
            <p className="animate-fade-up inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 font-mono text-[0.6875rem] uppercase tracking-[0.18em] text-white/55">
              <span aria-hidden className="size-1.5 rounded-full bg-[#c7f04a]" />
              Adelphi University · Help Desk
            </p>

            <h1 className="animate-fade-up mt-7" style={{ animationDelay: "80ms" }}>
              <Wordmark size="xl" tone="onDark" className="block" />
              <span className="mt-5 block max-w-2xl text-2xl font-medium leading-[1.2] tracking-[-0.025em] text-white/85 sm:text-[2rem]">
                Learn the tools. Understand the workflow. Support the community.
              </span>
            </h1>

            <p
              className="animate-fade-up mt-7 max-w-xl text-base leading-relaxed text-white/60"
              style={{ animationDelay: "160ms" }}
            >
              learnIT is the onboarding and knowledge platform for the Help Desk.
              Structured training for a technician&rsquo;s first week, and a
              reference fast enough to search while someone is on the line.
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
                className="border-white/15 bg-white/[0.05] text-white hover:border-white/25 hover:bg-white/[0.1]"
              >
                Explore the demo
              </Button>
            </div>

            {/* A concrete sense of scale, which the hero previously lacked. */}
            <dl
              className="animate-fade-up mt-12 grid max-w-lg grid-cols-3 gap-6 border-t border-white/[0.08] pt-6"
              style={{ animationDelay: "300ms" }}
            >
              {[
                ["Procedures", "20"],
                ["Guided workflows", "4"],
                ["Training modules", "15"],
              ].map(([label, value]) => (
                <div key={label}>
                  <dt className="text-xs text-white/40">{label}</dt>
                  <dd className="tabular mt-1 text-2xl font-semibold tracking-tight text-white">
                    {value}
                  </dd>
                </div>
              ))}
            </dl>

            <p
              className="animate-fade-up mt-6 text-xs text-white/35"
              style={{ animationDelay: "340ms" }}
            >
              The demo uses fictional content and requires no account.
            </p>
          </div>

          {/* ------------------------------------------------------ preview */}
          <HeroPreview />
        </div>
      </div>
    </section>
  );
}

/**
 * A stylised search result, standing in for the product itself.
 *
 * The hero previously left the right two thirds of a desktop screen empty,
 * which read as unfinished rather than restrained. This shows the single
 * interaction learnIT is judged on — type a word, get the procedure — so a
 * visitor understands what it is before reading a line of copy.
 *
 * Static markup rather than a live component: it is illustrative, and wiring
 * the real palette in here would mean shipping the search index to the
 * marketing page.
 */
function HeroPreview() {
  const results = [
    { title: "Printer troubleshooting path", meta: "Printing · reviewed 30 Jul", hot: true },
    { title: "Konica devices: the redirect procedure", meta: "Printing · reviewed 5 Aug" },
    { title: "What printing the Help Desk supports", meta: "Printing · reviewed 5 Aug" },
  ];

  return (
    <div
      aria-hidden
      className="animate-fade-up relative hidden lg:block"
      style={{ animationDelay: "200ms" }}
    >
      <div
        aria-hidden
        className="absolute -inset-6 rounded-3xl bg-[radial-gradient(ellipse_at_center,rgba(199,240,74,0.10),transparent_70%)]"
      />

      <div className="relative overflow-hidden rounded-2xl border border-white/[0.1] bg-[#121410]/90 shadow-[0_24px_80px_-24px_rgba(0,0,0,0.9)] backdrop-blur-sm">
        <div className="flex items-center gap-2 border-b border-white/[0.08] px-4 py-3">
          <span aria-hidden className="size-2.5 rounded-full bg-white/15" />
          <span aria-hidden className="size-2.5 rounded-full bg-white/15" />
          <span aria-hidden className="size-2.5 rounded-full bg-white/15" />
          <span className="ml-2 font-mono text-[0.625rem] uppercase tracking-[0.16em] text-white/35">
            learnIT
          </span>
          <kbd className="ml-auto rounded border border-white/12 bg-white/[0.04] px-1.5 py-0.5 font-mono text-[0.625rem] text-white/45">
            ⌘K
          </kbd>
        </div>

        <div className="flex items-center gap-2.5 border-b border-white/[0.08] px-4 py-3.5">
          <Search className="size-4 shrink-0 text-white/35" />
          <span className="font-mono text-sm text-white/85">printer</span>
          <span
            aria-hidden
            className="ml-0.5 inline-block h-4 w-px animate-pulse bg-[#c7f04a]"
          />
        </div>

        <ul className="p-2">
          {results.map((result) => (
            <li
              key={result.title}
              className={`flex items-start gap-3 rounded-lg px-3 py-2.5 ${
                result.hot ? "bg-white/[0.06]" : ""
              }`}
            >
              <BookOpen
                className={`mt-0.5 size-3.5 shrink-0 ${
                  result.hot ? "text-[#c7f04a]" : "text-white/30"
                }`}
              />
              <span className="min-w-0 flex-1">
                <span className="block truncate text-[0.8125rem] font-medium text-white/90">
                  {result.title}
                </span>
                <span className="mt-0.5 block truncate text-[0.6875rem] text-white/40">
                  {result.meta}
                </span>
              </span>
            </li>
          ))}
        </ul>

        <div className="border-t border-white/[0.08] px-4 py-2.5">
          <p className="font-mono text-[0.625rem] text-white/30">
            20 items indexed · results in under a millisecond
          </p>
        </div>
      </div>
    </div>
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
      className="relative overflow-hidden border-t border-white/[0.07] bg-[#0a0b09]"
    >
      <div
        aria-hidden
        className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_0%,rgba(199,240,74,0.08),transparent_70%)]"
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
                  className="group flex h-full flex-col rounded-xl border border-white/[0.08] bg-white/[0.02] p-5 transition-colors hover:border-white/15 hover:bg-white/[0.04] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#c7f04a]"
                >
                  <Icon className="size-4 text-[#c7f04a]" aria-hidden />
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
      className="border-t border-white/[0.07] bg-[#0a0b09]"
    >
      <div className="mx-auto w-full max-w-[88rem] px-6 py-12 sm:px-10">
        <div className="flex flex-col gap-8 sm:flex-row sm:items-start sm:justify-between">
          <div className="max-w-md">
            <Wordmark size="sm" tone="onDark" />
            <p className="mt-3 text-sm leading-6 text-white/40">
              An onboarding and knowledge platform for a university IT Help Desk.
              Built for the Adelphi University Help Desk.
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
            <a
              href="https://github.com/Rian-Fernando/LearnIT"
              className="text-white/50 transition-colors hover:text-white"
              target="_blank"
              rel="noopener noreferrer"
            >
              Source
            </a>
          </nav>
        </div>

        <div className="mt-10 flex flex-col gap-4 border-t border-white/[0.07] pt-6 sm:flex-row sm:items-start sm:justify-between">
          <p className="max-w-2xl text-xs leading-6 text-white/30">
            Demonstration content is fictional and does not represent official
            Adelphi University Help Desk procedure. Not an official University
            service.
          </p>

          {/* Attribution back to the portfolio. Kept as a real, crawlable link
              so this project is discoverable as part of rianfernando.com. */}
          <p className="shrink-0 text-xs leading-6 text-white/40">
            Built by{" "}
            <a
              href="https://rianfernando.com"
              className="text-[#c7f04a] underline decoration-[#c7f04a]/30 underline-offset-2 transition-colors hover:decoration-[#c7f04a]"
            >
              Rian Fernando
            </a>{" "}
            ·{" "}
            <a
              href="https://rianfernando.com/projects"
              className="text-white/50 underline decoration-white/20 underline-offset-2 transition-colors hover:text-white"
            >
              More projects
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
