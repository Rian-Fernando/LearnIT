import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, Headphones } from "lucide-react";
import { PageContainer, PageHeader } from "@/components/ui/page";
import {
  Badge,
  EmptyState,
  MetaLine,
  SectionHeading,
  Surface,
} from "@/components/ui/primitives";
import { VerificationBadge } from "@/components/content/verification-badge";
import { ScenarioStatus } from "@/features/practice/scenario-status";
import { SimulatorRunner } from "./simulator-runner";
import type { Viewer } from "@/lib/auth/types";
import { CATEGORY_LABELS } from "@/lib/content/schema";
import { buildLinkMap, getSimulation, listSimulations } from "@/lib/content/repository";
import { formatDate } from "@/lib/format";

const DIFFICULTY = {
  intro: { label: "Introductory", tone: "success" },
  core: { label: "Core", tone: "accent" },
  advanced: { label: "Advanced", tone: "warning" },
} as const;

/**
 * The simulator list without page chrome, so it can be embedded under the
 * Practice heading. Keeping the page wrapper out of here is what stops the
 * embedded copy introducing a second `<h1>`.
 */
export async function SimulatorList({
  viewer,
  basePath = "",
}: {
  viewer: Viewer;
  basePath?: string;
}) {
  const simulations = await listSimulations(viewer);

  return (
    <>
      <SectionHeading
        className="mb-4"
        title="Call simulator"
        description="Read a call transcript, then write the ticket you would have written. Graded on what you captured, the title format, and where you routed it — with the model answer shown afterwards."
      />

      {simulations.length === 0 ? (
        <EmptyState
          icon={<Headphones className="size-6" aria-hidden />}
          title="No simulations published"
          description="Call simulations are authored by Help Desk leadership."
        />
      ) : (
        <ul className="grid gap-3 sm:grid-cols-2">
          {simulations.map((simulation) => {
            const difficulty = DIFFICULTY[simulation.difficulty];
            return (
              <li key={simulation.slug}>
                <Link
                  href={`${basePath}/practice/simulator/${simulation.slug}`}
                  className="group flex h-full flex-col rounded-xl border border-subtle bg-surface-raised p-5 transition-colors hover:border-default hover:bg-surface-overlay"
                >
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge tone={difficulty.tone}>{difficulty.label}</Badge>
                    <Badge tone="neutral">{CATEGORY_LABELS[simulation.category]}</Badge>
                    <ScenarioStatus slug={simulation.slug} />
                  </div>
                  <h2 className="mt-3 flex items-start gap-1.5 text-base font-medium leading-6 text-primary">
                    <span className="min-w-0 flex-1">{simulation.title}</span>
                    <ArrowRight
                      className="mt-1 size-4 shrink-0 text-tertiary transition-transform group-hover:translate-x-0.5"
                      aria-hidden
                    />
                  </h2>
                  <p className="mt-1.5 flex-1 text-sm leading-6 text-secondary">
                    {simulation.summary}
                  </p>
                  <p className="tabular mt-4 text-xs text-tertiary">
                    {simulation.transcript.length} lines · {simulation.rubric.length} graded checks
                  </p>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </>
  );
}

export async function SimulatorScreen({
  viewer,
  slug,
  basePath = "",
}: {
  viewer: Viewer;
  slug: string;
  basePath?: string;
}) {
  const simulation = await getSimulation(viewer, slug);
  if (!simulation) notFound();

  const links = await buildLinkMap(viewer);
  const difficulty = DIFFICULTY[simulation.difficulty];

  return (
    <PageContainer width="reading">
      <Link
        href={`${basePath}/practice`}
        className="mb-6 inline-flex items-center gap-2 text-sm text-tertiary transition-colors hover:text-primary"
      >
        <ArrowLeft className="size-4" aria-hidden />
        Practice
      </Link>

      <PageHeader
        eyebrow="Call simulator"
        title={simulation.title}
        description={simulation.summary}
        meta={
          <div className="flex flex-wrap items-center gap-2">
            <Badge tone={difficulty.tone}>{difficulty.label}</Badge>
            <Badge tone="neutral">{CATEGORY_LABELS[simulation.category]}</Badge>
            <VerificationBadge verification={simulation.verification} />
            <MetaLine className="ml-1" items={[`Updated ${formatDate(simulation.updatedAt)}`]} />
          </div>
        }
      />

      <div className="border-t border-subtle pt-8">
        <SimulatorRunner simulation={simulation} links={links} basePath={basePath} />
      </div>

      <Surface className="mt-12 p-4">
        <p className="text-xs leading-6 text-tertiary">
          This call is fictional. The caller, username, phone number, and room are
          invented for training and do not correspond to any real request.
        </p>
      </Surface>
    </PageContainer>
  );
}
