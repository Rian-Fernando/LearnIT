# Analytics

## Position

The useful question is *"what are new technicians struggling with, and which
documentation needs attention?"* — not *"how many page views did we get?"*

So learnIT measures a deliberately small number of things, and most of what it
currently reports is **derived from content rather than collected from people**.
That makes it accurate on the first deploy, with no tracking infrastructure and
nothing recorded about individuals.

---

## What is built

`src/lib/analytics/content-health.ts`, surfaced at `/admin`.

| Metric | Derived from | Why it earns its place |
| --- | --- | --- |
| Open reports | Report queue | Direct signal from technicians that a procedure is wrong |
| Repeatedly flagged records | Report queue | Two people independently flagging one page is rarely coincidence — the strongest signal available |
| Procedures due for review | `updatedAt` (>120 days) | Age is not inaccuracy, but it is where inaccuracy hides |
| Unconfigured links | Links with `href: "#"` | Every one is a visible "awaiting configuration" notice to technicians |
| Coverage gaps | Content cross-analysis | Modules with no matching practice scenario; article categories with no troubleshooting workflow |
| Publication and visibility counts | All content | Sanity check before a semester — how much is draft, how much is internal |
| Onboarding shape | Modules and steps | Total steps, estimated minutes, knowledge-check count for a new hire |

None of this requires an event pipeline, a cookie banner, or a single record
about a named person.

---

## What is deliberately not built

Behavioural metrics — most-viewed articles, most-searched terms, most-used quick
responses, average completion time — genuinely would improve onboarding. They
are not built yet because they need an event store, and adding one is a decision
with consequences (retention, access, and the question of whether it becomes
performance monitoring) that belongs to Help Desk leadership rather than to a
default.

The design is settled so it can be added deliberately.

### Proposed event shape

```ts
interface AnalyticsEvent {
  id: string;
  type:
    | "search"            // query text, result count, whether anything was opened
    | "article_view"
    | "flow_started" | "flow_outcome"
    | "response_copied"
    | "module_step_completed"
    | "check_answered"    // correct or not
    | "scenario_completed"
    | "report_submitted";
  resourceSlug?: string;
  metadata?: Record<string, string | number | boolean>;
  /** Bucketed, never a name or an ID. */
  cohort: "week-1" | "month-1" | "established";
  /** Truncated to the hour. */
  occurredAt: string;
}
```

Three constraints that should survive implementation:

**No individual identifiers.** Events carry a coarse tenure cohort, not a user.
The question "which module is confusing?" needs aggregates; the question "how
fast is Jordan going?" is performance monitoring, and this is a learning tool.

**Timestamps truncated to the hour.** Minute-level timing plus a small team is
individually identifying in practice.

**A published retention window.** Ninety days is a reasonable default, and it
should be stated to technicians rather than buried.

### The two reports worth building first

**Searches that returned nothing.** A ranked list of queries with no results is
the closest thing to a direct request for documentation that does not exist yet.
It is by far the highest-value behavioural metric here.

**Knowledge checks failed most often.** Aggregated per check, this points
straight at either a genuinely difficult concept or a badly written step — and
either is worth knowing. Cross-referencing with the checks technicians retry
distinguishes the two.

Everything else can wait until those two have been acted on.

---

## Privacy commitments

These hold today and should hold if event capture is added:

- No third-party analytics, tag manager, or tracking pixel. The application
  makes **no external requests at runtime** — fonts are self-hosted at build
  time.
- Learning progress stays in the technician's own browser under the current
  adapter, and is never shared.
- Content reports record a display name only — never an email or directory
  identifier.
- No metric is designed to evaluate an individual's performance, and the
  progress screen says so plainly.
