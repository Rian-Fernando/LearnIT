# learnIT

An onboarding, training, and operational knowledge platform for the Adelphi
University Help Desk.

New technicians use it to learn how the Help Desk works. Experienced technicians
use it as a reference fast enough to search while someone is on the phone.
Leadership uses it to keep procedures current without a developer.

---

## Quick start

```bash
npm install
cp .env.example .env.local     # then set SESSION_SECRET
npm run dev                    # http://localhost:3000
```

Generate a signing key:

```bash
openssl rand -base64 48
```

Out of the box the app runs with the **mock identity provider** and the
**file content adapter** — no database, no SSO registration, no external
services. Sign in at `/signin` by choosing one of three demo personas
(new technician, experienced technician, administrator).

### Commands

| Command | What it does |
| --- | --- |
| `npm run dev` | Development server |
| `npm run build` | Production build |
| `npm run start` | Serve a production build |
| `npm run check` | Lint, typecheck, and validate content |
| `npm run content:validate` | Validate content schemas, references, and decision-tree graphs |
| `npm run lint` | ESLint |
| `npm run typecheck` | TypeScript, no emit |

`npm run check` is what should gate a deploy. Content validation catches broken
cross-references and unreachable troubleshooting nodes that types cannot.

---

## What is in here

| Area | Route | Notes |
| --- | --- | --- |
| Cinematic landing | `/` | Scroll-driven WebGL narrative, with a purpose-built static alternative |
| Public demo | `/demo` | Sanitised content, no account needed, fully static |
| Dashboard | `/dashboard` | Continue learning, quick actions, notices, recent changes |
| Knowledge Base | `/knowledge` | Browsable and searchable procedures |
| Troubleshooting | `/troubleshoot` | Data-driven decision trees |
| Quick Responses | `/responses` | Copy-ready messages with fill-in placeholders |
| Training | `/training` | Ordered modules, steps, knowledge checks |
| Practice | `/practice` | Realistic tickets with per-decision feedback |
| Progress | `/progress` | Personal completion tracking |
| Admin console | `/admin` | Content health, review queue, links, notices |

Global search is available anywhere with <kbd>⌘K</kbd> / <kbd>Ctrl</kbd>+<kbd>K</kbd>
(or `/`).

---

## Architecture at a glance

```
src/
  app/                     Routes
    (app)/                 Authenticated application — guarded by requireStaff()
      admin/               Admin console — guarded by requireAdmin()
    demo/                  Public demo — guest viewer, statically rendered
    api/                   Auth, search index, content reports
  components/              Design system, block renderer, app shell, landing scene
  content/                 The Help Desk content set (typed modules)
  features/                Screens, composed from components + repository
  lib/
    auth/                  Identity abstraction: mock + OIDC providers
    content/               Schema, access rules, repository, adapters
    progress/              Learning progress store
    search/                Search document construction
    analytics/             Derived content-health metrics
docs/                      Architecture, auth, content, security, analytics, roadmap
scripts/                   Content validation
```

Three ideas carry most of the design:

**1. Content is data, not components.** Every article, module, decision tree,
response, and scenario is a typed record validated by Zod. Adding a procedure
never means editing a component. See [docs/content.md](docs/content.md).

**2. The repository is the security boundary.** Pages ask
`src/lib/content/repository.ts` for content and pass a `Viewer`. Visibility,
publication status, and demo-mode sanitisation are applied there — so a page
that forgets to filter still cannot leak internal documentation. See
[docs/security.md](docs/security.md).

**3. Identity is abstracted, not invented.** learnIT does not define its own
credentials. It defines an `IdentityProvider` interface with a mock
implementation for development and OpenID Connect implementations for Google and
Microsoft Entra ID. More than one can run at once, so migrating between them is
a configuration change rather than a cutover. See
[docs/authentication.md](docs/authentication.md).

---

## Technology, and why

| Choice | Reason |
| --- | --- |
| **Next.js (App Router) + TypeScript** | Server components let authorization run before render rather than after, which is what makes the security model simple. Static rendering for the public demo, dynamic for authenticated routes, in one codebase. |
| **Tailwind CSS v4** | Semantic design tokens in CSS with utilities on top. Light and dark themes are a token swap, not a second stylesheet. Every text/surface pairing is verified against WCAG AA. |
| **Three.js + React Three Fiber** | The landing scene is a single persistent point cloud morphing between formations. Declarative scene graph, and the whole bundle is code-split away from anyone who will not see it. |
| **Zod** | The content schema and the environment schema are the same idea: validate at the boundary, then trust the types. |
| **MiniSearch** | ~10 kB client-side index. Searching happens with no round trip, which is the difference between usable and unusable during a call. |
| **jose** | Standards-compliant JWT and JWKS handling for sessions and OIDC ID-token verification. |
| **lucide-react, clsx, tailwind-merge** | Icons, and override-safe class composition for the design system. |

Deliberately **not** used: a component library (the visual identity is the
point), a state manager (server components plus one context), an ORM (no
database is required yet), and AI features (see
[docs/roadmap.md](docs/roadmap.md) for when that changes).

---

## Deployment

Deployed on **Vercel** at **https://learnit.rianfernando.com**, with DNS through
Cloudflare.

**Public portfolio deployment** — sanitised content, demo personas:

```env
NEXT_PUBLIC_SITE_URL="https://learnit.rianfernando.com"
NEXT_PUBLIC_DEMO_MODE="true"
AUTH_PROVIDERS="mock"
AUTH_ALLOW_MOCK_IN_PRODUCTION="true"
SESSION_SECRET="<openssl rand -base64 48>"
```

**Internal deployment** — real content, real sign-in:

```env
NEXT_PUBLIC_SITE_URL="https://learnit.rianfernando.com"
NEXT_PUBLIC_DEMO_MODE="false"
AUTH_PROVIDERS="google"              # or "google,microsoft", or "microsoft"
GOOGLE_CLIENT_ID="…"
GOOGLE_CLIENT_SECRET="…"
AUTH_ALLOWED_DOMAINS="adelphi.edu"
AUTH_ADMIN_EMAILS="…"
SESSION_SECRET="<openssl rand -base64 48>"
```

The environment schema refuses to start a production deployment that enables
mock authentication without explicitly opting in, refuses to combine mock
authentication with the internal content set at all, and refuses to start a real
provider with no authorisation rule configured. See
[docs/security.md](docs/security.md).

**Database.** Nothing needs one today — the file content adapter runs the whole
application. When durable admin editing and cross-device progress are wanted,
provision **Neon Postgres from the Vercel Marketplace** (Storage → Neon).
`DATABASE_URL` is injected automatically, it scales to zero, and the code uses a
plain Postgres driver with no vendor SDK, so it stays portable. See
[docs/architecture.md](docs/architecture.md).

---

## Status of the content

**The Help Desk content in this repository is illustrative.** It was written
from general IT support practice to demonstrate the content model, and it is not
authoritative Adelphi University Help Desk procedure. No part of it derives from
real tickets or internal documentation, and every link is a placeholder until an
administrator sets it.

Before the internal deployment goes live, Help Desk leadership must review and
replace it. [docs/content.md](docs/content.md) explains how.

---

## Documentation

- [Architecture](docs/architecture.md) — decisions, adapters, and how to move to a database
- [Authentication](docs/authentication.md) — the identity abstraction and the SSO registration checklist
- [Content](docs/content.md) — authoring articles, modules, workflows, responses, and scenarios
- [Security](docs/security.md) — the authorization model, threat notes, and headers
- [Analytics](docs/analytics.md) — what is measured, and what deliberately is not
- [Discoverability](docs/discoverability.md) — SEO, and being cited by AI answer engines
- [Roadmap](docs/roadmap.md) — what is built, what is next

---

Built by [Rian Fernando](https://rianfernando.com) ·
[More projects](https://rianfernando.com/projects)
