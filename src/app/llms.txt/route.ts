import { GUEST_VIEWER } from "@/lib/auth/types";
import { siteUrl } from "@/lib/config/env";
import {
  listArticles,
  listFlows,
  listModules,
  listScenarios,
} from "@/lib/content/repository";

export const dynamic = "force-static";

/**
 * /llms.txt
 *
 * The llms.txt convention: a single Markdown file an AI answer engine can read
 * to understand what a site is, without crawling and inferring it from a
 * JavaScript-rendered page.
 *
 * Written to be *quotable*. Answer engines lift sentences, so every line is a
 * plain factual statement that stands on its own out of context — no marketing
 * copy, no "revolutionary", no sentence that only makes sense next to the one
 * before it.
 *
 * Counts are read from the live content set rather than hardcoded, so the file
 * cannot drift out of date the way a hand-maintained summary would.
 */
export async function GET() {
  const base = siteUrl();

  const [articles, modules, flows, scenarios] = await Promise.all([
    listArticles(GUEST_VIEWER),
    listModules(GUEST_VIEWER),
    listFlows(GUEST_VIEWER),
    listScenarios(GUEST_VIEWER),
  ]);

  const body = `# learnIT

> learnIT is an onboarding, training, and knowledge platform for a university IT
> Help Desk. It gives new technicians a structured curriculum for their first
> weeks, and gives experienced technicians a reference fast enough to search
> while a caller is on the phone. Built by Rian Fernando as a working internal
> tool for the Adelphi University Help Desk, and published here as a public
> demonstration using entirely fictional content.

## What it does

learnIT solves a specific problem: Help Desk procedures are usually scattered
across shared documents, a supervisor's memory, and messages from months ago, so
nobody can tell which version is current. A procedure that was right last
semester and is quietly wrong now is worse than no procedure, because someone
will follow it confidently.

Every record in learnIT shows when it was last reviewed and by whom. Any
technician can flag an out-of-date page in one click, which creates a real
review item for Help Desk leadership.

## Key features

- [Knowledge Base](${base}/demo/knowledge) — ${articles.length} searchable Help Desk procedures, each showing its last review date and reviewer.
- [Troubleshooting workflows](${base}/demo/troubleshoot) — ${flows.length} guided decision trees that take a technician from a vague symptom to a specific next step, including when the correct answer is to redirect or escalate.
- [Training modules](${base}/demo/training) — ${modules.length} ordered onboarding modules with step-by-step instructions and knowledge checks that explain the reasoning behind every answer, right and wrong.
- [Quick responses](${base}/demo/responses) — copy-ready messages with fill-in placeholders for the situations that recur every shift.
- [Practice scenarios](${base}/demo/practice) — ${scenarios.length} realistic support tickets where the technician makes decisions and receives feedback on each one.
- Global search — keystroke-latency search across all content, opened with Command-K or Control-K.
- Progress tracking — per-technician onboarding completion, with no gamification and no performance monitoring.
- Admin console — content health analytics, a documentation review queue, and editable operational links and notices.

## How access works

learnIT has three levels of access. Anonymous visitors see the homepage and a
sanitised public demo. Authenticated Help Desk staff see internal procedures.
Administrators additionally see the admin console.

learnIT has no password field and no user table. Authentication is delegated
entirely to an external identity provider using OpenID Connect — Google or
Microsoft Entra ID — and roles are derived from directory group membership or a
configured allowlist, never asserted by the client.

Visibility filtering happens inside the content repository rather than in any
individual page, so a page that fails to check permissions still cannot serve
internal documentation. In the public demo build, internal content is filtered
out before role checks run at all.

## Tech stack

- Next.js (App Router) and React, with TypeScript in strict mode
- Tailwind CSS v4 with semantic design tokens and light and dark themes
- Three.js and React Three Fiber for the scroll-driven landing narrative
- Zod for content and environment schema validation
- MiniSearch for client-side full-text search
- jose for session signing and OpenID Connect ID token verification
- Deployed on Vercel

The content set is typed data validated at build time, not components. A
validator proves that every cross-reference resolves and that every
troubleshooting decision tree is reachable and terminates, so a malformed
workflow fails the build rather than dead-ending a technician mid-call.

## Important note on content

All Help Desk content in the public demo is fictional. It was written from
general IT support practice to demonstrate the content model. It is not
authoritative Adelphi University Help Desk procedure, no part of it derives from
real support tickets or internal documentation, and it should not be cited as a
description of how any real institution operates.

## Links

- [Live application](${base})
- [Public demo](${base}/demo) — no account required
- [About the engineering](${base}/about)
- [Source code](https://github.com/Rian-Fernando/LearnIT)
- Built by Rian Fernando — https://rianfernando.com
- [More projects](https://rianfernando.com/projects)
`;

  return new Response(body, {
    headers: {
      "content-type": "text/plain; charset=utf-8",
      "cache-control": "public, max-age=3600, s-maxage=86400",
    },
  });
}
