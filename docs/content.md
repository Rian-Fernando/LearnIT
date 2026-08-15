# Authoring content

All Help Desk content lives in `src/content/` as typed TypeScript modules,
validated against the schemas in `src/lib/content/schema.ts`.

After any change:

```bash
npm run content:validate
```

That checks schemas, unique slugs, every cross-reference, decision-tree
reachability, and knowledge-check correctness. It exits non-zero on a problem,
so wire it into CI.

---

## The two fields that matter most

Every content record carries these, and they are enforced server-side:

**`visibility`**
- `public` — may be served to anonymous visitors, and is the only content that
  exists in the demo build.
- `staff` — requires an authenticated Help Desk session.

**`status`**
- `draft` — visible only to admins.
- `published` — live.
- `archived` — retained but delisted from search, indexes, and related links.
  Still reachable by direct URL for admins.

When in doubt, author as `staff`. Moving a record to `public` later is a
one-word change; discovering that something internal was public is not.

---

## Blocks

Body content is an array of blocks, not Markdown.

| Block | Use for |
| --- | --- |
| `paragraph` | Prose |
| `heading` (level 2 or 3) | Section breaks |
| `list` (`ordered: true/false`) | Enumerations |
| `steps` | Numbered procedure with optional detail per step |
| `callout` (`info` `tip` `warning` `danger` `success`) | Something that must not be missed |
| `fields` | Label/value pairs — comparisons, reference tables |
| `code` | Literal text, with an optional caption |
| `image` | Screenshot. `alt` is **required** |
| `link` | Reference an Important Link **by key**, never a raw URL |
| `articleRef` | Link to another article |
| `responseRef` | Link to a quick response |
| `divider` | Horizontal rule |

Inline markup inside text is limited to `**bold**`, `` `code` ``, and
`[label](/path)`. Links must be `https://` or a same-origin path.

### Callout tone, in practice

- `danger` — someone could cause harm: credentials, privacy, security. Use
  sparingly enough that it still means something.
- `warning` — scope boundaries, escalation triggers, common serious mistakes.
- `tip` — the thing an experienced technician knows that saves ten minutes.
- `info` — context.
- `success` — confirmation of a correct outcome.

---

## Adding an article

`src/content/articles/` — grouped by area, re-exported from `index.ts`.

```ts
{
  slug: "vpn-connection-troubleshooting",   // lowercase-kebab, unique, permanent
  title: "VPN connection troubleshooting",
  summary: "One or two sentences. Shown in search results and cards.",
  category: "vpn",
  tags: ["vpn", "troubleshooting"],
  visibility: "public",
  status: "published",
  updatedAt: "2026-08-06",                  // YYYY-MM-DD, the review date
  updatedBy: "Help Desk Leadership",        // display name, never an email
  revision: 7,                              // bump on every substantive edit
  featured: false,                          // surfaces on the dashboard
  related: ["vpn-what-it-is"],
  body: [ /* blocks */ ],
}
```

Slugs are URLs. Once published, changing one breaks bookmarks and every
reference to it — treat them as permanent.

---

## Adding a training module

`src/content/modules/`

```ts
{
  slug: "remote-support",
  order: 4,                       // position in the onboarding track
  category: "remote-support",
  prerequisites: ["help-desk-fundamentals", "communication"],
  outcomes: ["Obtain and record informed consent", /* … */],
  steps: [
    {
      id: "consent",
      title: "Consent, properly",
      minutes: 5,                 // drives the module duration estimate
      body: [ /* blocks */ ],
      check: { /* optional knowledge check */ },
    },
  ],
}
```

Guidance that has held up well:

- **3–7 steps.** More than that is two modules.
- **3–6 minutes per step.** If a step needs fifteen, it is really three steps.
- **Outcomes are abilities, not topics.** "Obtain and record informed consent",
  not "Consent".
- **Prerequisites are guidance, not a lock.** A returning technician may need to
  jump straight in.

### Knowledge checks

```ts
check: {
  id: "remote-consent",
  prompt: "Which of these is acceptable? Select all that apply.",
  kind: "multiple",                    // or "single"
  options: [
    {
      id: "ask-close",
      text: "Asking the user to close personal applications first",
      correct: true,
      explanation: "Good practice, and it signals that you take their privacy seriously.",
    },
  ],
}
```

**Write an explanation for every option, including the wrong ones.** All
explanations are revealed after answering, and understanding why three options
are wrong is most of the learning. The validator warns about missing ones.

Distractors should be *plausible* — options a reasonable new technician might
actually pick. An obviously silly wrong answer teaches nothing.

---

## Adding a troubleshooting workflow

`src/content/flows.ts`

A flow is a directed graph of two node kinds:

```ts
// A question
{
  id: "device-type",
  kind: "question",
  question: "What kind of printer is it?",
  help: "Scope first. Everything else depends on this answer.",
  options: [
    { id: "konica", label: "Konica multifunction device",
      hint: "Large copy/scan/print unit", next: "konica-outcome" },
  ],
}

// A terminal outcome
{
  id: "konica-outcome",
  kind: "outcome",
  title: "Out of scope — redirect to the Konica vendor",
  tone: "resolved" | "escalate" | "out-of-scope",
  body: [ /* blocks */ ],
  articleSlugs: ["konica-device-redirect"],
  responseSlugs: ["konica-redirect"],
}
```

Rules the validator enforces: `startNodeId` must exist, every `next` must
resolve, every node must be reachable from the start, and the flow must contain
at least one outcome.

Design guidance:

- **Ask the scope question first.** Most out-of-scope work happens because
  troubleshooting started before anyone established what the device was.
- **Every option needs an outcome path.** Include "Not sure" — it is the honest
  answer during a real call, and it should lead somewhere useful.
- **Aim for 2–4 questions to an outcome.** Longer than that and people abandon
  it and guess.
- **Outcomes are instructions, not conclusions.** "Escalate to the network team"
  is not enough; say what to capture first.

---

## Adding a quick response

`src/content/responses.ts`

```ts
{
  slug: "konica-redirect",
  channel: "email" | "phone" | "chat" | "any",
  usage: "When to use this, and when not to.",
  placeholders: [
    { key: "device_location", label: "Device location", example: "the third-floor copy room" },
  ],
  template: `Hi {{name}},

…

Best regards,
{{tech_name}}`,
}
```

`{{name}}` (the requester) and `{{tech_name}}` (the signed-in technician) are
supplied automatically and need no declaration. Any other `{{token}}` should be
declared so it gets a proper label — undeclared tokens still work, but the UI
has to guess a label from the key.

Write the `usage` note. It is the difference between a template that gets used
correctly and one that gets pasted into the wrong situation.

---

## Adding a practice scenario

`src/content/scenarios.ts`

```ts
{
  difficulty: "intro" | "core" | "advanced",
  ticket: {
    reference: "HD-10482",          // fictional, always
    requesterType: "student",
    device: "MacBook Air (personal)",
    channel: "email",
    subject: "VPN keeps failing",
    message: "I've tried connecting three times and it keeps failing…",
    context: ["Working from home", "Meeting tomorrow at 9am"],
  },
  stages: [ /* decisions, each option carrying feedback */ ],
  debrief: [ /* blocks — the "how a strong tech handles this" recap */ ],
}
```

**Never build a scenario from a real ticket.** Requesters, references, and
messages are invented. See [security.md](security.md).

What makes a scenario worth doing:

- **The decisions are genuinely arguable.** If the right answer is obvious, it
  is a quiz, not practice.
- **Feedback explains reasoning, not just correctness.** "Jumping to an invasive
  fix before understanding the failure" beats "Incorrect".
- **At least one stage should pivot.** The strongest scenarios open looking
  routine and turn on one detail — that is the skill being practised.
- **The debrief names the transferable lesson**, not just what happened.

---

## Important links

`src/content/links.ts` seeds the list; administrators then set real addresses
from `/admin/links`.

Every URL in the repository is `#` on purpose — real Adelphi endpoints are not
committed. An unset link renders a visible "awaiting configuration" notice, and
the admin overview counts them.

**Never put a URL directly in an article.** Use a `link` block with a `linkKey`,
so a system that moves is one field change instead of forty article edits.

---

## Replacing the seed set

The content currently in this repository is illustrative — written from general
IT support practice to demonstrate the model. It is **not** authoritative
Adelphi procedure.

Before the internal deployment:

1. **Review every record with Help Desk leadership.** Anything that does not
   match actual practice is rewritten or removed.
2. **Set every Important Link** from `/admin/links`.
3. **Re-mark visibility.** Content written as `public` for demonstration may
   need to become `staff` once it reflects real procedure.
4. **Set `updatedBy` to the real reviewer** and `updatedAt` to the review date.
5. **Re-run `npm run content:validate`.**
6. **Decide what the public demo keeps.** The demo build serves only `public`
   records; the safest posture is a small, clearly fictional public subset.
