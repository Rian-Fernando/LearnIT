# learnIT — status

Living checklist of what is built, what is blocked, and what is coming.
Updated as work lands. For the content-level gaps, `/admin/backlog` is the
authoritative list — this is the project view.

**Last updated:** 21 August 2026

---

## The two problems this is solving

1. **Onboarding.** A new Help Desk technician currently learns by shadowing and
   asking. There is no structured path, and no way to tell whether what they
   were told is current.
2. **Ticket search.** There are many tickets across many issue types with no
   consolidation, so finding "the one like this" is slow. The goal is to
   singularise recurring issues into quick references.

Everything below serves one of those two.

---

## Two experiences, one codebase

Selected by `NEXT_PUBLIC_EXPERIENCE`, so both deploy from the same repository.

| | `course` | `reference` |
| --- | --- | --- |
| Learning area | Ordered modules, steps, knowledge checks | Systems directory, ticket anatomy, checklists |
| Progress tracking | Yes | No — nothing to complete |
| Sequence | Deliberate | None |
| Built for | Learning the job from nothing | Someone with a caller on the line |
| Shared | Landing, knowledge base, troubleshooting, quick responses, reference tickets, simulator, search | ← |

Both are live in the codebase today. Set the variable per deployment.

---

## Built

### Platform
- [x] Next.js App Router, React 19, TypeScript strict, Tailwind v4
- [x] Highlighter visual identity, light + dark, WCAG AA verified (lowest 4.74:1)
- [x] Cinematic landing with reduced-motion, mobile, and no-WebGL alternatives
- [x] Google + Microsoft sign-in, both enabled simultaneously
- [x] Role from directory groups / email allowlist / verified domain
- [x] Public demo that cannot serve internal content, structurally
- [x] SEO + GEO: llms.txt, 19 AI crawlers, structured data, sitemap, OG image
- [x] Deployed to GitHub; Vercel pending

### Content architecture
- [x] Everything is typed, validated data — no procedure lives in a component
- [x] Verification status separate from publication status
- [x] `placeholder` blocks that render visible gaps instead of hiding them
- [x] Build-time validation: references resolve, decision trees terminate,
      simulation model answers score full marks against their own rubric
- [x] Admin: content health, review queue, backlog, option lists, links, notices

### Content
- [x] 20 knowledge base articles
- [x] 15 training modules (course experience)
- [x] 10 systems in the directory (reference experience)
- [x] 4 troubleshooting decision trees
- [x] 13 quick responses
- [x] 3 reusable checklists
- [x] 2 reference tickets (worked examples)
- [x] 2 graded call simulations
- [x] 10 Help Desk principles, surfaced contextually
- [x] 10 Footprints option lists, each marked complete or partial

### Verified against real Adelphi sources
- [x] Footprints form structure, tabs, required fields
- [x] 39 Footprints templates
- [x] "Location of Work To Be Done required for classroom & physical hardware"
- [x] Notification model (Assignees / Contact / CC / Survey)
- [x] MFA check: User Lookup enrolment + live eCampus forgot-password method count
- [x] Andromeda is OpenSense at andromeda.adelphi.edu
- [x] ePlanner and Stellic are the same platform
- [x] Two spaces before the username in ticket titles

---

## Blocked — waiting on information

Nothing below is guessed. Each is a visible placeholder in the product.

### Procedures
- [ ] **Identity verification for an ordinary call** — referenced ~15 times, unanswerable today
- [ ] **PMT** — module is a deliberate stub
- [ ] **Bomgar** — not written at all
- [ ] **OTP via SAAS**
- [ ] **TSS** — which assignee group, when +Communications comes off
- [ ] **Classroom troubleshooting** per configuration (desktop / rack / closet)
- [ ] **Konica** — ⚠️ current content contains invented detail, see Risks
- [ ] Official escalation rules
- [ ] Guest account supervisor removal step
- [ ] Andromeda setup and sign-in

### Screenshots
- [ ] User Lookup — **user with VPN access**
- [ ] User Lookup — disabled, alumni, student+employee, not-found
- [ ] SAAS Option 6 — search, results, graduation record, "NO USER" wording
- [ ] eCampus forgot-password method list
- [ ] Footprints — Alumni Account and Guest AUig templates
- [ ] Gmail inbox — Work in Progress filter
- [ ] Footprints categories and subcategories
- [ ] Sample ePlanner Access ticket
- [ ] Classroom layouts

### Reference data
- [ ] Transfer destinations and extensions
- [ ] Office hours — semester, summer, Zoom
- [ ] Zoom room link and its standing ticket number
- [ ] Building abbreviations and room list
- [ ] Loaner laptop process for faculty

### Reference tickets still to write
- [ ] VPN / Andromeda
- [ ] MFA token reset
- [ ] Password reset without PMT set up
- [ ] ePlanner / Stellic access
- [ ] VoiceThread

---

## Next up

Ordered by dependency, not ambition.

1. **Vercel deploy** — env vars, custom domain, Cloudflare DNS
2. **Ingest screenshots** as they arrive; convert placeholders to procedure
3. **Onboarding course build-out** — EMS, Bomgar, PMT, OTP via SAAS, ticket types
4. **More simulations** — one per scenario type as procedures land
5. **Knowledge checks** on the remaining modules
6. **Authenticated image route** — so internal screenshots can appear in-product
   without being publicly reachable by URL *(decision needed)*
7. **Postgres via Neon** — durable review queue, admin edits, cross-device progress
8. **Ticket consolidation** — see below
9. Feedex integration *(explicitly last)*

---

## Ticket consolidation — the second problem

Not started. Sketching it here so it is not forgotten.

The goal: many tickets across many issue types, collapsed into a small number of
quick references so a technician finds "the one like this" immediately.

Likely shape:
- A recurring-issue record that owns a cluster of past tickets
- Each carries the symptom in the caller's words, the actual cause, and the fix
- Search matches the caller's phrasing, not internal terminology
- Reference tickets already model the "worked example" half of this

**Open question:** does the Help Desk have exportable ticket data, or would these
be written by hand from experience? That decision changes the design completely —
export means clustering, by hand means authoring.

---

## Risks

| Risk | State |
| --- | --- |
| **Konica content contains invented detail** — "vendor-serviced under a support agreement", "service sticker on the unit" were written from general practice and read as procedure | Flagged high in `/admin/backlog`. Needs replacing. |
| Seeded content is illustrative, not Adelphi procedure | Marked `unverified` throughout; banner on every affected page |
| Screenshots contain real PII | `Screenshots/` gitignored; verified absent from remote |
| Reports and admin edits reset on restart | Stated in the admin UI; fixed by the Postgres adapter |
| No rate limiting on report submission or sign-in | Usually handled upstream; confirm before internal rollout |
| No audit log for admin actions | Single place to add it: `features/admin/actions.ts` |

---

## Conventions

- Nothing is invented. Missing procedure becomes a `placeholder`, never filler.
- Content is data. If a change needs a component edit, the model is wrong.
- Visibility is enforced in the repository, never in the UI.
- Every content record carries a review date and a verification state.
- Real credentials, PII, and ticket data never enter this repository.
