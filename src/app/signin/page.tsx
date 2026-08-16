import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowLeft, ArrowRight, ShieldCheck, TriangleAlert } from "lucide-react";
import { Wordmark } from "@/components/brand/wordmark";
import { GoogleMark, MicrosoftMark } from "@/components/brand/provider-marks";
import { enabledProviders, getViewer, sanitizeReturnTo } from "@/lib/auth";
import { PERSONAS } from "@/lib/auth/providers/mock";

export const metadata: Metadata = {
  title: "Sign in",
  description:
    "Sign in to learnIT, the Help Desk onboarding and knowledge platform, with your Google or Microsoft work account.",
  robots: { index: false, follow: false },
};

const ERRORS: Record<string, string> = {
  not_authorized:
    "That account is not authorised for learnIT. Access is granted to Help Desk staff — contact Help Desk leadership if you believe this is wrong.",
  sign_in_failed: "Sign-in could not be completed. Please try again.",
  provider_unavailable:
    "The identity provider could not be reached. Please try again shortly.",
  unknown_provider: "That sign-in method is not available here.",
};

const MARKS = {
  google: GoogleMark,
  microsoft: MicrosoftMark,
} as const;

export default async function SignInPage({
  searchParams,
}: {
  searchParams: Promise<{ returnTo?: string; error?: string }>;
}) {
  const params = await searchParams;
  const returnTo = sanitizeReturnTo(params.returnTo);
  const error = params.error ? ERRORS[params.error] : undefined;

  // Already signed in — no reason to show this screen.
  const viewer = await getViewer();
  if (viewer.isAuthenticated) redirect(returnTo);

  const providers = enabledProviders();
  const mock = providers.find((provider) => provider.id === "mock");
  const federated = providers.filter((provider) => provider.id !== "mock");

  return (
    <main
      id="main"
      data-surface="cinematic"
      className="relative flex min-h-screen flex-col bg-[#0a0b09]"
    >
      <div aria-hidden className="bg-grid absolute inset-0 opacity-40" />
      <div
        aria-hidden
        className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_0%,rgba(199,240,74,0.08),transparent_70%)]"
      />

      <div className="relative flex flex-1 flex-col px-6 py-8 sm:px-10">
        <Link
          href="/"
          className="inline-flex w-fit items-center gap-2 rounded-md text-sm text-white/50 transition-colors hover:text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#c7f04a]"
        >
          <ArrowLeft className="size-4" aria-hidden />
          Back
        </Link>

        <div className="mx-auto flex w-full max-w-lg flex-1 flex-col justify-center py-12">
          <Wordmark size="lg" tone="onDark" />
          <h1 className="mt-6 text-2xl font-semibold tracking-[-0.025em] text-white">
            Sign in to learnIT
          </h1>
          <p className="mt-2 text-sm leading-6 text-white/50">
            {federated.length > 0
              ? "Use your work account. learnIT never sees your password."
              : "This build uses a demo identity provider. Choose a persona to explore the platform from that point of view."}
          </p>

          {error ? (
            <div
              role="alert"
              className="mt-6 flex gap-3 rounded-lg border border-danger/30 bg-danger-soft px-4 py-3.5"
            >
              <TriangleAlert className="mt-0.5 size-4 shrink-0 text-danger" aria-hidden />
              <p className="text-sm leading-6 text-white/80">{error}</p>
            </div>
          ) : null}

          {federated.length > 0 ? (
            <ul className="mt-8 space-y-2.5">
              {federated.map((provider) => {
                const Mark = MARKS[provider.id as keyof typeof MARKS];
                return (
                  <li key={provider.id}>
                    <a
                      href={`/api/auth/signin?provider=${provider.id}&returnTo=${encodeURIComponent(returnTo)}`}
                      className="flex h-12 w-full items-center justify-center gap-3 rounded-lg bg-white px-4 text-sm font-medium text-[#0a0b09] transition-colors hover:bg-white/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#c7f04a]"
                    >
                      {Mark ? <Mark className="size-5 shrink-0" /> : null}
                      Continue with {provider.displayName}
                    </a>
                  </li>
                );
              })}
            </ul>
          ) : null}

          {mock && federated.length > 0 ? (
            <div className="mt-8 flex items-center gap-3">
              <span aria-hidden className="h-px flex-1 bg-white/10" />
              <span className="font-mono text-[0.625rem] uppercase tracking-[0.16em] text-white/30">
                or explore as a demo persona
              </span>
              <span aria-hidden className="h-px flex-1 bg-white/10" />
            </div>
          ) : null}

          {mock ? <PersonaPicker returnTo={returnTo} /> : null}

          <div className="mt-10 flex gap-3 rounded-lg border border-white/[0.08] bg-white/[0.02] px-4 py-3.5">
            <ShieldCheck className="mt-0.5 size-4 shrink-0 text-white/40" aria-hidden />
            <div className="text-sm leading-6 text-white/45">
              {federated.length > 0 ? (
                <>
                  <span className="font-medium text-white/70">
                    learnIT never sees your password.
                  </span>{" "}
                  Authentication happens entirely with your identity provider.
                  Access is granted based on your organisation and Help Desk role.
                </>
              ) : (
                <>
                  <span className="font-medium text-white/70">
                    No real credentials are involved.
                  </span>{" "}
                  Demo personas exist so the platform can be reviewed before it is
                  registered with an institutional identity provider. This build
                  serves only sanitised, fictional content.
                </>
              )}
            </div>
          </div>

          <p className="mt-8 text-center text-sm text-white/40">
            Just looking around?{" "}
            <Link
              href="/demo"
              className="text-[#c7f04a] underline decoration-[#c7f04a]/30 underline-offset-2 transition-colors hover:decoration-[#c7f04a]"
            >
              Explore the demo
            </Link>{" "}
            — no account needed.
          </p>
        </div>
      </div>
    </main>
  );
}

/* -------------------------------------------------------------------------- */

function PersonaPicker({ returnTo }: { returnTo: string }) {
  return (
    <ul className="mt-6 space-y-2.5">
      {PERSONAS.map((persona) => (
        <li key={persona.id}>
          <Link
            href={`/api/auth/callback?persona=${persona.id}&returnTo=${encodeURIComponent(returnTo)}`}
            className="group flex items-start gap-4 rounded-xl border border-white/[0.08] bg-white/[0.02] p-4 transition-colors hover:border-white/20 hover:bg-white/[0.05] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#c7f04a]"
          >
            <span
              aria-hidden
              className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/[0.04] font-mono text-xs font-medium text-white/60"
            >
              {initials(persona.name)}
            </span>
            <span className="min-w-0 flex-1">
              <span className="flex flex-wrap items-center gap-2">
                <span className="text-sm font-medium text-white">{persona.name}</span>
                {persona.role === "admin" ? (
                  <span className="rounded border border-[#c7f04a]/30 bg-[#c7f04a]/12 px-1.5 py-0.5 font-mono text-[0.625rem] uppercase tracking-wider text-[#c7f04a]">
                    Admin
                  </span>
                ) : null}
              </span>
              <span className="mt-0.5 block text-xs text-white/45">{persona.title}</span>
              <span className="mt-2 block text-sm leading-6 text-white/50">
                {persona.blurb}
              </span>
            </span>
            <ArrowRight
              className="mt-1 size-4 shrink-0 text-white/25 transition-transform group-hover:translate-x-0.5 group-hover:text-white/50"
              aria-hidden
            />
          </Link>
        </li>
      ))}
    </ul>
  );
}

function initials(name: string): string {
  return name
    .split(" ")
    .slice(0, 2)
    .map((part) => part[0] ?? "")
    .join("")
    .toUpperCase();
}
