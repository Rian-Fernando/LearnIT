import Link from "next/link";
import {
  AlertTriangle,
  ArrowRight,
  BookOpen,
  ExternalLink,
  Info,
  MessageSquareQuote,
  OctagonAlert,
  Route,
  Terminal,
} from "lucide-react";
import { PageContainer, PageHeader } from "@/components/ui/page";
import { SectionHeading, Surface } from "@/components/ui/primitives";
import type { Viewer } from "@/lib/auth/types";
import { CATEGORY_LABELS } from "@/lib/content/schema";
import {
  activeAnnouncements,
  listLinks,
  listModules,
  recentlyUpdatedArticles,
} from "@/lib/content/repository";
import { formatDate, relativeDate } from "@/lib/format";
import { ContinueLearning, OnboardingProgress, type ModuleRef } from "./continue-learning";

/**
 * Dashboard.
 *
 * Answers three questions in order of how often they are asked:
 *   1. What do I do next?           → Continue learning
 *   2. What do I need right now?    → Quick actions and pinned systems
 *   3. What changed?                → Notices and recently updated procedures
 */
export async function DashboardScreen({
  viewer,
  basePath = "",
}: {
  viewer: Viewer;
  basePath?: string;
}) {
  const [modules, recent, notices, links] = await Promise.all([
    listModules(viewer),
    recentlyUpdatedArticles(viewer, 5),
    activeAnnouncements(viewer),
    listLinks(viewer),
  ]);

  const moduleRefs: ModuleRef[] = modules.map((module) => ({
    slug: module.slug,
    title: module.title,
    summary: module.summary,
    stepIds: module.steps.map((step) => step.id),
    minutes: module.steps.reduce((sum, step) => sum + step.minutes, 0),
  }));

  const pinned = links.filter((link) => link.pinned);
  const firstName = viewer.user?.name.split(" ")[0] ?? "there";

  return (
    <PageContainer width="wide">
      <PageHeader
        // The greeting is time-of-day sensitive, so it is only used where the
        // page is rendered per request. The demo dashboard is static.
        eyebrow={viewer.isAuthenticated ? greeting() : "Demo walkthrough"}
        title={
          viewer.isAuthenticated ? `Welcome back, ${firstName}` : "learnIT demo"
        }
        description={
          viewer.isAuthenticated
            ? "Pick up your onboarding, or jump straight to what you need."
            : "A sanitised walkthrough of the Help Desk platform. Everything here is fictional demonstration content."
        }
      />

      {notices.length > 0 ? (
        <section aria-label="Notices" className="mb-8 space-y-2.5">
          {notices.map((notice) => (
            <Notice key={notice.id} notice={notice} />
          ))}
        </section>
      ) : null}

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_20rem]">
        {/* ------------------------------------------------------- primary */}
        <div className="space-y-8">
          <section aria-labelledby="continue-heading">
            <SectionHeading
              className="mb-4"
              title="Continue learning"
              description="Your onboarding track, in order."
              action={
                <Link
                  href={`${basePath}/training`}
                  className="flex items-center gap-1 text-sm text-secondary transition-colors hover:text-primary"
                >
                  All modules
                  <ArrowRight className="size-3.5" aria-hidden />
                </Link>
              }
            />
            <h2 id="continue-heading" className="sr-only">
              Continue learning
            </h2>
            <ContinueLearning modules={moduleRefs} basePath={basePath} />
          </section>

          <section aria-labelledby="actions-heading">
            <SectionHeading
              className="mb-4"
              title="Quick actions"
              description="The four things you will reach for most."
            />
            <h2 id="actions-heading" className="sr-only">
              Quick actions
            </h2>
            <ul className="grid gap-3 sm:grid-cols-2">
              {QUICK_ACTIONS.map((action) => {
                const Icon = action.icon;
                return (
                  <li key={action.href}>
                    <Link
                      href={`${basePath}${action.href}`}
                      className="group flex h-full items-start gap-3 rounded-xl border border-subtle bg-surface-raised p-4 transition-colors hover:border-default hover:bg-surface-overlay"
                    >
                      <Icon className="mt-0.5 size-4 shrink-0 text-accent-text" aria-hidden />
                      <span className="min-w-0 flex-1">
                        <span className="flex items-center gap-1.5 text-sm font-medium text-primary">
                          {action.label}
                          <ArrowRight
                            className="size-3.5 text-tertiary transition-transform group-hover:translate-x-0.5"
                            aria-hidden
                          />
                        </span>
                        <span className="mt-0.5 block text-sm leading-6 text-tertiary">
                          {action.description}
                        </span>
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </section>

          <section aria-labelledby="recent-heading">
            <SectionHeading
              className="mb-4"
              title="Recently updated"
              description="Procedures change. These changed most recently."
              action={
                <Link
                  href={`${basePath}/knowledge`}
                  className="flex items-center gap-1 text-sm text-secondary transition-colors hover:text-primary"
                >
                  Knowledge Base
                  <ArrowRight className="size-3.5" aria-hidden />
                </Link>
              }
            />
            <h2 id="recent-heading" className="sr-only">
              Recently updated
            </h2>
            <Surface>
              <ul className="divide-y divide-subtle">
                {recent.map((article) => (
                  <li key={article.slug}>
                    <Link
                      href={`${basePath}/knowledge/${article.slug}`}
                      className="flex items-start gap-4 px-4 py-3.5 transition-colors hover:bg-surface-overlay"
                    >
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-sm font-medium text-primary">
                          {article.title}
                        </span>
                        <span className="mt-0.5 block truncate text-xs text-tertiary">
                          {CATEGORY_LABELS[article.category]} · updated{" "}
                          {relativeDate(article.updatedAt)}
                        </span>
                      </span>
                      <ArrowRight
                        className="mt-0.5 size-3.5 shrink-0 text-tertiary"
                        aria-hidden
                      />
                    </Link>
                  </li>
                ))}
              </ul>
            </Surface>
          </section>
        </div>

        {/* ------------------------------------------------------- sidebar */}
        <aside className="space-y-6">
          <OnboardingProgress modules={moduleRefs} basePath={basePath} />

          {pinned.length > 0 ? (
            <Surface className="p-5">
              <h3 className="text-sm font-medium text-primary">Systems</h3>
              <p className="mt-1 text-xs leading-5 text-tertiary">
                Maintained by administrators, so these never go stale in an article.
              </p>
              <ul className="mt-4 space-y-1">
                {pinned.map((link) => {
                  const unset = link.href === "#";
                  return (
                    <li key={link.key}>
                      {unset ? (
                        <span className="flex items-start gap-2 rounded-lg px-2 py-2 text-sm text-tertiary">
                          <span className="min-w-0 flex-1 truncate">{link.label}</span>
                          <span className="shrink-0 font-mono text-[0.625rem] uppercase tracking-wider text-warning">
                            unset
                          </span>
                        </span>
                      ) : (
                        <a
                          href={link.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-start gap-2 rounded-lg px-2 py-2 text-sm text-secondary transition-colors hover:bg-surface-inset hover:text-primary"
                        >
                          <span className="min-w-0 flex-1 truncate">{link.label}</span>
                          <ExternalLink
                            className="mt-0.5 size-3.5 shrink-0 text-tertiary"
                            aria-hidden
                          />
                        </a>
                      )}
                    </li>
                  );
                })}
              </ul>
            </Surface>
          ) : null}
        </aside>
      </div>
    </PageContainer>
  );
}

/* -------------------------------------------------------------------------- */

const QUICK_ACTIONS = [
  {
    href: "/knowledge",
    icon: BookOpen,
    label: "Search the Knowledge Base",
    description: "Or press ⌘K from anywhere.",
  },
  {
    href: "/troubleshoot",
    icon: Route,
    label: "Troubleshoot an issue",
    description: "Answer questions, get a next step.",
  },
  {
    href: "/responses",
    icon: MessageSquareQuote,
    label: "Quick responses",
    description: "Copy-ready messages, filled in.",
  },
  {
    href: "/practice",
    icon: Terminal,
    label: "Practice a ticket",
    description: "Realistic scenarios with feedback.",
  },
];

const NOTICE_TONES = {
  info: { icon: Info, wrap: "border-signal/25 bg-signal-soft", accent: "text-signal" },
  warning: {
    icon: AlertTriangle,
    wrap: "border-warning/30 bg-warning-soft",
    accent: "text-warning",
  },
  critical: {
    icon: OctagonAlert,
    wrap: "border-danger/30 bg-danger-soft",
    accent: "text-danger",
  },
} as const;

function Notice({
  notice,
}: {
  notice: { id: string; title: string; body: string; tone: keyof typeof NOTICE_TONES; publishedAt: string; author: string };
}) {
  const config = NOTICE_TONES[notice.tone];
  const Icon = config.icon;
  return (
    <div className={`flex gap-3 rounded-lg border px-4 py-3.5 ${config.wrap}`}>
      <Icon className={`mt-0.5 size-4 shrink-0 ${config.accent}`} aria-hidden />
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-baseline gap-x-2.5">
          <p className={`text-sm font-semibold ${config.accent}`}>{notice.title}</p>
          <p className="text-xs text-tertiary">
            {notice.author} · {formatDate(notice.publishedAt)}
          </p>
        </div>
        <p className="mt-1 text-sm leading-6 text-secondary">{notice.body}</p>
      </div>
    </div>
  );
}

function greeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}
