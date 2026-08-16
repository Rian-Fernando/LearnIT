# Architecture

## The shape of the problem

learnIT has to be three things at once, and they pull in different directions:

1. **An internal Help Desk tool** — accurate, current, fast, access-controlled.
2. **An onboarding curriculum** — structured, ordered, with progress.
3. **A public portfolio artefact** — deployable with no infrastructure, and
   containing nothing that should not be public.

Most of the architecture is a consequence of holding all three at once.

---

## Decisions

### Next.js App Router, TypeScript, React

Server components let authorization run *before* a page renders, rather than
rendering and then hiding things. `requireStaff()` at the top of a server
component is a genuine boundary in a way a `useEffect` redirect never is.

It also lets one codebase serve the public demo as fully static HTML and the
authenticated application as per-request renders, which is what makes the
portfolio deployment free and the internal deployment correct.

### Content as typed data

Every article, training module, decision tree, quick response, and practice
scenario is a record validated by a Zod schema in
`src/lib/content/schema.ts`. Body content is a **block array** — a closed union
of `paragraph`, `steps`, `callout`, `fields`, `code`, `link`, `articleRef`, and
so on — not Markdown and not HTML.

The consequences are worth the constraint:

- There is no `dangerouslySetInnerHTML` anywhere in the codebase.
- Rendering is a `switch` that fails to compile when a block type is added and
  not handled.
- Search indexing walks blocks and extracts meaningful text.
- An admin editor can offer real controls per block type rather than a textarea.
- Cross-references (`articleRef`, `linkKey`) are validated at build time.

Inline emphasis uses a deliberately tiny subset — `**bold**`, `` `code` ``,
`[label](/path)` — parsed to React elements in `components/content/rich-text.tsx`.
Anything richer belongs in a block type.

### The repository is the choke point

```
page  →  repository(viewer)  →  demo sanitisation  →  visibility filter  →  content
```

Pages never import from `src/content/` directly. They call
`src/lib/content/repository.ts` and pass a `Viewer` (`guest`, `staff`, or
`admin`). Every read applies, in order:

1. **Demo sanitisation** — when `NEXT_PUBLIC_DEMO_MODE=true`, only records with
   `visibility: "public"` are loaded at all. This runs before role checks, so an
   authenticated demo persona cannot reach internal content either.
2. **Access rules** (`src/lib/content/access.ts`) — published/draft/archived and
   public/staff, evaluated against the viewer.

A page that forgets to filter still gets filtered content. That is the point.

### Two viewers, one set of screens

The authenticated application (`app/(app)/`) and the public demo (`app/demo/`)
render the *same* feature components from `src/features/`. The only differences
are the `Viewer` passed in and a `basePath` prefix.

This avoids the usual failure mode where a "public version" is a second,
divergent copy of the UI that slowly stops matching — and it means the demo is
an honest representation of the product, because it *is* the product.

---

## Adapters and swap points

Three subsystems are defined as interfaces with an in-process implementation
shipped and a durable implementation documented. Each is a single file.

### 1. Content — `ContentSource`

`src/lib/content/repository.ts`

| Adapter | Behaviour |
| --- | --- |
| `file` (shipped) | Content compiled from `src/content/**`. Read-only. Type-checked, git-versioned, reviewable in pull requests. |
| `postgres` | Read/write with revision history, for in-app authoring. |

The file adapter is not a placeholder — for documentation that must be reviewed
before it changes, git *is* the right CMS. Procedures get diffs, blame, and
review. The database adapter matters when Help Desk leadership needs to publish
without a developer in the loop.

**To add the Postgres adapter:**

1. Provision **Neon** from the Vercel dashboard (Storage → Neon). `DATABASE_URL`
   is injected into the project automatically.
2. Implement `ContentSource` (seven methods returning arrays) in
   `src/lib/content/adapters/postgres.ts`, using a plain Postgres driver — no
   vendor SDK, so the database stays swappable.
3. Return it from `getContentSource()` when `CONTENT_ADAPTER=postgres`.
4. Set `writable: true`, which switches the admin console out of preview mode.

Neon over Supabase here for one reason: learnIT needs Postgres and nothing else.
Authentication is already handled by the identity provider, there is no file
storage, and there is no realtime requirement — so Supabase's additional
services would go unused while adding a second dashboard and a second bill.
Neon also scales to zero, which matters while this is a portfolio deployment.

The schema follows directly from `src/lib/content/schema.ts` — one table per
content type with a `jsonb` body column, plus a `content_revisions` table
holding `(resource_type, slug, revision, body, updated_by, updated_at)` for
version history.

### 2. Progress — browser storage

`src/lib/progress/store.tsx`

Learning progress (completed steps, knowledge-check answers, scenario results)
is held in `localStorage`. It is a technician's own record: not sensitive, not
authoritative, not shared.

That choice makes the demo fully functional with zero infrastructure. For the
internal deployment, replace `readState` / `writeState` with a server action
backed by a `training_progress` table — the stored shape is already the table
shape.

Deliberately not recorded: anything identifying, anything about the people a
technician has helped, and timing precise enough to be used for performance
monitoring. This is a learning aid, not surveillance.

### 3. Reports and overrides — in-memory

`src/lib/feedback/store.ts`, `src/lib/admin/overrides.ts`

Content reports ("this looks out of date") and administrator edits to links and
notices live in a module-scoped map. They work immediately and reset on restart.
The admin console states this plainly rather than implying durability.

Both are one interface implementation away from Postgres.

---

## Why links and notices are editable but articles are not

A deliberate split, not an oversight.

**Articles, modules, workflows, responses, and scenarios** are procedure. They
should change through review, and git gives that for free.

**Links and notices** are operational. A system moving, or a printer outage this
afternoon, cannot wait for a pull request — and getting them wrong is
immediately visible to every technician. So those two are layered over the file
content by `OverrideStore` and editable from `/admin/links` and `/admin/notices`.

Because articles reference links by *key* rather than embedding a URL, changing
one address updates every article, dashboard tile, and troubleshooting outcome
that points at it.

---

## The landing experience

`src/components/landing/`

The scroll narrative is one persistent point cloud (2,600 points on capable
devices, 1,400 otherwise) that morphs between five precomputed formations:
scattered → converging on a hub → fragmented into system clusters → an ordered
lattice → a plane of interface panels. The same points carry through the whole
story, which is what makes it read as *reorganisation* rather than a sequence of
unrelated effects.

Performance and accessibility notes:

- Scroll position is written to a ref, never React state — scrolling costs one
  number assignment per event, not a render.
- All per-frame work writes into preallocated typed arrays. Nothing is allocated
  after mount.
- The render loop stops entirely when the canvas leaves the viewport.
- Device pixel ratio is capped at 1.75.
- Glow comes from additive-blended points with a soft radial falloff in the
  fragment shader, not a postprocessing pass — one less full-screen render and
  two fewer dependencies.
- **Every word of the narrative is real DOM**, above the canvas. The story is
  fully available to screen readers and to search engines.
- `prefers-reduced-motion`, small screens, and missing WebGL get
  `StaticStory` — a different, purpose-built vertical layout with static
  diagrams of the same five formations, not the desktop layout with the canvas
  removed. The 3D bundle is code-split and never requested for those visitors.

---

## Search

`src/lib/search/documents.ts`, `src/app/api/search/route.ts`

The index is built per-viewer from the repository, so it inherits visibility
filtering — a guest's index physically cannot contain internal content. It is
fetched once, lazily, the first time the command palette opens, and queried
locally with MiniSearch.

Client-side search is the right call at this corpus size for one reason: a
technician typing "printer" while someone is on the phone needs results before
they finish the word. Title matches are boosted 6× over body text so an article
named for a term always outranks one that merely mentions it.

If the corpus outgrows this — thousands of articles — the replacement is a
server query behind the same `SearchDocument` shape. No UI changes.

---

## Testing

`npm run check` runs three gates:

- **ESLint** and **TypeScript** — the usual.
- **`scripts/validate-content.ts`** — the interesting one. It proves what types
  cannot: every cross-reference resolves, slugs are unique, every decision-tree
  graph has a valid start node with no dangling edges and no unreachable nodes,
  every knowledge check has a correct answer consistent with its kind, and no
  public record references staff-only content (which would break in the demo
  build).

A malformed troubleshooting tree fails validation instead of dead-ending a
technician mid-call.
