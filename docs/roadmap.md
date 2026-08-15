# Roadmap

## Built

**Foundation** — Next.js App Router, TypeScript with `strict` and
`noUncheckedIndexedAccess`, Tailwind v4 with semantic design tokens, light and
dark themes, ESLint, validated environment configuration.

**Visual identity** — original design language for learnIT: warm-neutral ink,
Adelphi-derived gold accent, a cool signal hue for technical states, Geist and
Geist Mono self-hosted at build time.

**Cinematic landing** — scroll-driven WebGL narrative in five acts, built on one
persistent point cloud morphing between precomputed formations. Purpose-built
static alternative for reduced motion, small screens, and missing WebGL, with
the 3D bundle code-split away from those visitors entirely.

**Authentication and authorization** — `IdentityProvider` abstraction with a
mock provider for development and a complete OIDC + PKCE provider for Adelphi
SSO. Role from IdP group membership. Signed httpOnly session cookies. Guards
enforced in server components, Server Actions, and route handlers — never in the
UI alone.

**Content architecture** — Zod-validated schemas for every content type, block
based bodies with no `dangerouslySetInnerHTML`, a repository that applies
visibility and demo sanitisation on every read, and a validator that checks
cross-references and decision-tree reachability at build time.

**Application** — dashboard, knowledge base, ⌘K global search, training modules
with steps and knowledge checks, data-driven troubleshooting workflows, quick
responses with placeholder filling, practice scenarios with per-decision
feedback, and progress tracking.

**Public demo** — the same screens and the same code, rendered for a guest
viewer, fully static, and structurally incapable of serving internal content.

**Admin console** — content-health analytics, full content inventory, working
documentation review queue, and editable Important Links and dashboard notices.

**Documentation** — architecture, authentication, content authoring, security,
analytics, and this roadmap.

---

## Next — before internal rollout

Ordered by what blocks a real deployment.

**1. Content review with Help Desk leadership.** The seeded content is
illustrative and must be reviewed or replaced. This is the largest remaining
task and it is not an engineering one. See [content.md](content.md).

**2. Register with Adelphi's identity provider.** The OIDC implementation is
complete and needs configuration only. Checklist in
[authentication.md](authentication.md).

**3. Postgres adapter.** Makes three things durable: content authoring in the
admin console, the review queue, and link and notice edits. Three interfaces,
one file each — `ContentSource`, `ReportStore`, `OverrideStore`.

**4. Server-side progress.** Replace the browser adapter so completion survives
a device change, and so leadership can see aggregate onboarding progress without
seeing individuals.

**5. Operational hardening.** CSP at the proxy, rate limiting on report
submission and sign-in, an audit log for admin mutations, and CI running
`npm run check` on every change.

---

## Later

**In-app content editing.** A block-based editor for articles and modules, and a
visual editor for decision trees, once Postgres is in place. The content model
was designed for this — each block type maps to a specific control.

**Content versioning UI.** Revision history and diffs. The `revision` field and
the `content_revisions` table design already exist.

**Search analytics.** Specifically the two reports in
[analytics.md](analytics.md) — searches that returned nothing, and the knowledge
checks failed most often. Both need an event store, which is a decision for
leadership rather than a default.

**Richer training media.** The `image` block exists; video would need a hosting
decision consistent with university policy.

**Shift handover notes.** Frequently requested in help desks and adjacent to
what is already here, but a genuinely different product surface — worth doing
properly or not at all.

---

## Where AI would fit, and where it would not

learnIT is not an AI product, and making it one would be the wrong move. The
foundation that matters is accurate structured knowledge, good onboarding, and
fast retrieval — and none of those are improved by adding a model on top of
content that has not been reviewed yet.

Two places where it would genuinely help, once the content is real:

**Natural-language search over the knowledge base.** A technician thinking "the
copier in the mail room is jammed" should reach the Konica redirect procedure
without knowing the word "Konica". Semantic retrieval over the existing
`SearchDocument` shape would do that. It requires no generation and no new
failure modes — worst case it ranks results slightly worse than keyword search.

**Suggesting related procedures during authoring.** When leadership writes a new
article, proposing `related` slugs and relevant `articleRef` blocks reduces the
manual cross-referencing that otherwise gets skipped.

What should not happen: generating Help Desk procedure, drafting responses to
requesters, or answering technicians' questions directly. In a support context,
a confidently wrong answer about a security procedure is worse than no answer —
and the entire premise of learnIT is that procedures are reviewed by people who
are accountable for them.
