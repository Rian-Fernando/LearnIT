import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Wordmark } from "@/components/brand/wordmark";
import { Button } from "@/components/ui/button";
import { LandingFooter } from "@/components/landing/landing-chrome";

export const metadata: Metadata = {
  title: "About this project",
  description:
    "How learnIT is built: content architecture, access model, and the engineering decisions behind an internal Help Desk knowledge platform.",
};

/**
 * Project context page.
 *
 * The homepage sells the product; this explains the engineering. It exists
 * because someone reviewing this as a portfolio piece deserves the reasoning,
 * not just the surface.
 */
export default function AboutPage() {
  return (
    <>
      <main
        id="main"
        data-surface="cinematic"
        className="relative min-h-screen bg-[#0a0b09]"
      >
        <div aria-hidden className="bg-grid absolute inset-0 opacity-30" />
        <div
          aria-hidden
          className="absolute inset-0 bg-[radial-gradient(ellipse_60%_45%_at_50%_0%,rgba(199,240,74,0.07),transparent_70%)]"
        />

        <div className="relative mx-auto w-full max-w-3xl px-6 py-16 sm:px-8 sm:py-24">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-white/50 transition-colors hover:text-white"
          >
            <ArrowLeft className="size-4" aria-hidden />
            Back
          </Link>

          <div className="mt-12">
            <Wordmark size="lg" tone="onDark" />
            <h1 className="mt-6 text-3xl font-semibold leading-[1.1] tracking-[-0.03em] text-white sm:text-4xl">
              An operational system, not a documentation site
            </h1>
            <p className="mt-6 text-base leading-relaxed text-white/60">
              learnIT is an onboarding and knowledge platform built around a real
              problem: a new Help Desk technician arrives on day one facing a
              university&rsquo;s entire technology ecosystem, and the procedures
              they need are scattered across shared documents, a
              supervisor&rsquo;s memory, and a message from six months ago.
            </p>
          </div>

          <div className="mt-16 space-y-12">
            <Section
              eyebrow="Problem"
              title="The failure mode is drift, not absence"
            >
              <p>
                Help desks rarely lack documentation. What they lack is a way to
                tell which version is current. A procedure that was right last
                semester and is quietly wrong now is worse than no procedure,
                because someone will follow it confidently.
              </p>
              <p>
                So the design centres on freshness: every record shows when it was
                last reviewed and by whom, every page carries a one-click
                &ldquo;report outdated information&rdquo; control that creates a
                real review item, and the admin console leads with what needs
                attention rather than with counts.
              </p>
            </Section>

            <Section eyebrow="Architecture" title="Content is data, not components">
              <p>
                Every article, training module, decision tree, quick response, and
                practice scenario is a typed record validated by a schema. Body
                content is a closed union of block types — steps, callouts, field
                tables, references — rendered through a switch, so adding a block
                type fails to compile until it is handled, and no HTML string ever
                enters the pipeline.
              </p>
              <p>
                A build-time validator proves what types cannot: that every
                cross-reference resolves, that every troubleshooting graph is
                reachable and terminates, and that no public record links to
                internal content. A malformed decision tree fails the build rather
                than dead-ending a technician mid-call.
              </p>
            </Section>

            <Section eyebrow="Access" title="The boundary is the repository">
              <p>
                Pages never read content directly. They ask a repository and pass
                a viewer, and visibility filtering happens there — so a page that
                forgets to check still cannot leak internal documentation.
                Navigation hiding and edge middleware exist for polish; neither is
                load-bearing.
              </p>
              <p>
                The public demo you can explore here runs the same screens and the
                same code as the internal application. The only difference is the
                viewer, and a build flag that strips internal content before role
                checks even run — so a demo sign-in cannot reach it either.
              </p>
            </Section>

            <Section eyebrow="Identity" title="No invented login">
              <p>
                learnIT has no password field and no user table. It defines an
                identity provider interface with a complete OpenID Connect
                implementation for institutional single sign-on, and a mock
                provider for development. Roles come from directory group
                membership, never from the client.
              </p>
              <p>
                The environment configuration refuses to start a production
                deployment using mock authentication unless it is explicitly the
                sanitised public demo — and that opt-in additionally forces demo
                mode on.
              </p>
            </Section>

            <Section eyebrow="Restraint" title="What was left out">
              <p>
                No component library, because the visual identity is the point. No
                state manager, because server components and one context cover it.
                No ORM, because no database is required yet — and the file-backed
                content adapter gives procedures review and history through git,
                which is genuinely the right tool for documentation that must be
                checked before it changes.
              </p>
              <p>
                And no AI. A confidently wrong answer about a security procedure
                is worse than no answer, and the premise of the whole system is
                that procedures are reviewed by people accountable for them. There
                are two places it would earn its keep later — semantic search, and
                authoring assistance — both noted in the roadmap.
              </p>
            </Section>
          </div>

          <div className="mt-16 rounded-xl border border-white/[0.08] bg-white/[0.02] p-6">
            <h2 className="text-base font-medium text-white">
              About the content you will see
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-white/55">
              Everything in the demo is fictional. It was written from general IT
              support practice to demonstrate the content model, and it is not
              Adelphi University Help Desk procedure. No part of it derives from
              real tickets or internal documentation, and every external link is a
              placeholder.
            </p>
          </div>

          <div className="mt-10 flex flex-wrap gap-3">
            <Button href="/demo" size="lg">
              Explore the demo
              <ArrowRight className="size-4" aria-hidden />
            </Button>
            <Button
              href="/"
              size="lg"
              variant="secondary"
              className="border-white/15 bg-white/[0.04] text-white hover:border-white/25 hover:bg-white/[0.08]"
            >
              Back to the homepage
            </Button>
          </div>
        </div>
      </main>
      <LandingFooter />
    </>
  );
}

function Section({
  eyebrow,
  title,
  children,
}: {
  eyebrow: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section>
      <p className="font-mono text-[0.6875rem] uppercase tracking-[0.16em] text-[#c7f04a]">
        {eyebrow}
      </p>
      <h2 className="mt-3 text-xl font-semibold tracking-[-0.02em] text-white">
        {title}
      </h2>
      <div className="mt-4 space-y-4 text-[0.9375rem] leading-relaxed text-white/55">
        {children}
      </div>
    </section>
  );
}
