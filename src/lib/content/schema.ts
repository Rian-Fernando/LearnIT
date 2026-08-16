import { z } from "zod";

/**
 * ---------------------------------------------------------------------------
 * learnIT content model
 * ---------------------------------------------------------------------------
 * Every piece of Help Desk knowledge in learnIT is structured data validated by
 * these schemas — never JSX, never a hardcoded string in a component. That is
 * what lets an administrator add a new procedure without a developer, and what
 * lets `visibility` be enforced as a real security boundary on the server.
 *
 * Two fields appear on every content record and carry the most weight:
 *
 *   visibility — "public" content may be served to anonymous visitors and is
 *                the ONLY content that exists in the sanitised demo build.
 *                "staff" content requires an authenticated Help Desk session.
 *
 *   status     — "draft" is invisible to everyone but admins, "published" is
 *                live, "archived" is retained for history but delisted.
 */

/* ========================================================================== *
 * Primitives
 * ========================================================================== */

export const RoleSchema = z.enum(["guest", "staff", "admin"]);
export type Role = z.infer<typeof RoleSchema>;

/** Ordered by privilege — used for `hasAtLeast` comparisons. */
export const ROLE_RANK: Record<Role, number> = { guest: 0, staff: 1, admin: 2 };

export const VisibilitySchema = z.enum(["public", "staff"]);
export type Visibility = z.infer<typeof VisibilitySchema>;

export const ContentStatusSchema = z.enum(["draft", "published", "archived"]);
export type ContentStatus = z.infer<typeof ContentStatusSchema>;

/**
 * How much a reader should trust this record — deliberately separate from
 * `status`.
 *
 * `status` answers "is this live?"; `verification` answers "has an authorised
 * Help Desk source confirmed it?". A procedure can be perfectly published and
 * still be awaiting confirmation, and conflating the two is how stale
 * documentation ends up looking authoritative.
 *
 *   verified      Confirmed by an authorised Adelphi Help Desk source.
 *   needs-review  May have changed, or a supervisor flagged it.
 *   unverified    Written down but not yet confirmed. Shown with a banner.
 */
export const VerificationSchema = z.enum(["verified", "needs-review", "unverified"]);
export type Verification = z.infer<typeof VerificationSchema>;

export const VERIFICATION_LABELS: Record<Verification, string> = {
  verified: "Verified",
  "needs-review": "Needs review",
  unverified: "Not yet verified",
};

const SlugSchema = z
  .string()
  .min(1)
  .max(80)
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "must be a lowercase kebab-case slug");

/** ISO-8601 date (`YYYY-MM-DD`). Stored as a plain string to stay serialisable
 *  across the server/client boundary without timezone drift. */
const IsoDateSchema = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, "must be an ISO date (YYYY-MM-DD)");

export const CategorySchema = z.enum([
  "accounts",
  "vpn",
  "printing",
  "network",
  "software",
  "hardware",
  "remote-support",
  "ticketing",
  "communication",
  "general",
]);
export type Category = z.infer<typeof CategorySchema>;

export const CATEGORY_LABELS: Record<Category, string> = {
  accounts: "Accounts",
  vpn: "VPN",
  printing: "Printing",
  network: "Network",
  software: "Software",
  hardware: "Hardware",
  "remote-support": "Remote Support",
  ticketing: "Ticketing",
  communication: "Communication",
  general: "General Help Desk",
};

/** Metadata shared by every editable content record. */
export const ContentMetaSchema = z.object({
  slug: SlugSchema,
  title: z.string().min(1).max(160),
  summary: z.string().min(1).max(400),
  visibility: VisibilitySchema,
  status: ContentStatusSchema,
  updatedAt: IsoDateSchema,
  /** Display name of the last editor. Never an email or Adelphi username —
   *  see docs/security.md on avoiding incidental PII in content records. */
  updatedBy: z.string().min(1).max(80),
  /** Monotonic revision counter, bumped by the persistence adapter on write. */
  revision: z.number().int().positive().default(1),
  /**
   * Defaults to `unverified` on purpose: content is untrusted until somebody
   * with authority says otherwise, and forgetting to set this should fail
   * safe rather than silently claiming confirmation.
   */
  verification: VerificationSchema.default("unverified"),
  /** Who confirmed it, and when. Required reading before trusting `verified`. */
  verifiedBy: z.string().min(1).max(80).optional(),
  verifiedAt: IsoDateSchema.optional(),
});
export type ContentMeta = z.infer<typeof ContentMetaSchema>;

/* ========================================================================== *
 * Rich content blocks
 * ========================================================================== */

/**
 * Body content is a block array rather than raw HTML/Markdown. Benefits:
 *   - Rendering is a pure switch over a closed union, so there is no
 *     `dangerouslySetInnerHTML` anywhere in the codebase.
 *   - The admin editor can offer real controls per block type.
 *   - Search indexing can walk blocks and extract meaningful text.
 *
 * Inline text supports a deliberately tiny markup subset (`**bold**`,
 * `` `code` ``, `[label](href)`) parsed to React elements in `rich-text.tsx`.
 */

const CalloutToneSchema = z.enum(["info", "tip", "warning", "danger", "success"]);
export type CalloutTone = z.infer<typeof CalloutToneSchema>;

const ParagraphBlock = z.object({
  type: z.literal("paragraph"),
  text: z.string().min(1),
});

const HeadingBlock = z.object({
  type: z.literal("heading"),
  level: z.union([z.literal(2), z.literal(3)]),
  text: z.string().min(1),
});

const ListBlock = z.object({
  type: z.literal("list"),
  ordered: z.boolean().default(false),
  items: z.array(z.string().min(1)).min(1),
});

const StepsBlock = z.object({
  type: z.literal("steps"),
  items: z
    .array(
      z.object({
        title: z.string().min(1),
        detail: z.string().optional(),
      }),
    )
    .min(1),
});

const CalloutBlock = z.object({
  type: z.literal("callout"),
  tone: CalloutToneSchema,
  title: z.string().optional(),
  text: z.string().min(1),
});

const CodeBlock = z.object({
  type: z.literal("code"),
  language: z.string().optional(),
  code: z.string().min(1),
  caption: z.string().optional(),
});

const FieldsBlock = z.object({
  type: z.literal("fields"),
  items: z
    .array(z.object({ label: z.string().min(1), value: z.string().min(1) }))
    .min(1),
});

const ImageBlock = z.object({
  type: z.literal("image"),
  src: z.string().min(1),
  /** Required — a screenshot with no alt text is unusable to a screen reader
   *  and useless to an employee on a slow connection. */
  alt: z.string().min(1),
  caption: z.string().optional(),
  width: z.number().int().positive().optional(),
  height: z.number().int().positive().optional(),
});

const LinkBlock = z.object({
  type: z.literal("link"),
  /** References an `ImportantLink` by key so URLs stay centrally managed
   *  instead of being duplicated across dozens of articles. */
  linkKey: SlugSchema,
  note: z.string().optional(),
});

const ArticleRefBlock = z.object({
  type: z.literal("articleRef"),
  slug: SlugSchema,
  note: z.string().optional(),
});

const ResponseRefBlock = z.object({
  type: z.literal("responseRef"),
  slug: SlugSchema,
});

const DividerBlock = z.object({ type: z.literal("divider") });

/**
 * A hole in the documentation, rendered as a visible card rather than silently
 * omitted.
 *
 * This exists because the alternative — inventing a plausible-sounding
 * procedure to fill the gap — is actively dangerous in a Help Desk context. A
 * technician following a confidently-worded but fabricated step is worse off
 * than one who can see that the step has not been written yet and knows to ask.
 *
 * Every placeholder feeds the admin content backlog automatically.
 */
const PlaceholderBlock = z.object({
  type: z.literal("placeholder"),
  /** What is missing, in one line. */
  label: z.string().min(1).max(160),
  /** Specific artefacts required to complete it — screenshots, a procedure. */
  needs: z.array(z.string().min(1)).default([]),
  /** Who is expected to supply it. */
  owner: z.string().max(80).optional(),
});

/** Renders a reusable checklist inline. */
const ChecklistRefBlock = z.object({
  type: z.literal("checklistRef"),
  slug: SlugSchema,
  note: z.string().optional(),
});

/** Surfaces one of the recurring Help Desk principles in context. */
const PrincipleBlock = z.object({
  type: z.literal("principle"),
  id: SlugSchema,
  /** Why this principle applies *here*, specifically. */
  context: z.string().optional(),
});

/** Points at a worked example ticket. */
const TicketRefBlock = z.object({
  type: z.literal("ticketRef"),
  slug: SlugSchema,
  note: z.string().optional(),
});

export const BlockSchema = z.discriminatedUnion("type", [
  ParagraphBlock,
  HeadingBlock,
  ListBlock,
  StepsBlock,
  CalloutBlock,
  CodeBlock,
  FieldsBlock,
  ImageBlock,
  LinkBlock,
  ArticleRefBlock,
  ResponseRefBlock,
  PlaceholderBlock,
  ChecklistRefBlock,
  PrincipleBlock,
  TicketRefBlock,
  DividerBlock,
]);
export type Block = z.infer<typeof BlockSchema>;
export type BlockType = Block["type"];

/* ========================================================================== *
 * Knowledge base
 * ========================================================================== */

export const ArticleSchema = ContentMetaSchema.extend({
  category: CategorySchema,
  tags: z.array(z.string().min(1).max(40)).default([]),
  body: z.array(BlockSchema).min(1),
  /** Slugs of related articles. Validated for existence by
   *  `scripts/validate-content.ts`, not by the schema itself. */
  related: z.array(SlugSchema).default([]),
  /** Surfaces the article on the dashboard and category landing pages. */
  featured: z.boolean().default(false),
});
export type Article = z.infer<typeof ArticleSchema>;

/* ========================================================================== *
 * Training / onboarding
 * ========================================================================== */

export const KnowledgeCheckSchema = z.object({
  id: SlugSchema,
  prompt: z.string().min(1),
  /** `single` renders radios, `multiple` renders checkboxes. */
  kind: z.enum(["single", "multiple"]).default("single"),
  options: z
    .array(
      z.object({
        id: SlugSchema,
        text: z.string().min(1),
        correct: z.boolean().default(false),
        /** Shown after answering — explains *why*, which is the actual
         *  learning moment. Required on correct options. */
        explanation: z.string().optional(),
      }),
    )
    .min(2),
});
export type KnowledgeCheck = z.infer<typeof KnowledgeCheckSchema>;

export const TrainingStepSchema = z.object({
  id: SlugSchema,
  title: z.string().min(1).max(160),
  /** Estimated reading/doing time, in minutes. Drives module duration. */
  minutes: z.number().int().min(1).max(60).default(3),
  body: z.array(BlockSchema).min(1),
  check: KnowledgeCheckSchema.optional(),
});
export type TrainingStep = z.infer<typeof TrainingStepSchema>;

export const TrainingModuleSchema = ContentMetaSchema.extend({
  /** Controls ordering of the onboarding track. */
  order: z.number().int().min(0),
  category: CategorySchema,
  /** Slugs of modules that should be completed first. Rendered as guidance,
   *  not a hard lock — a returning employee may need to jump straight in. */
  prerequisites: z.array(SlugSchema).default([]),
  outcomes: z.array(z.string().min(1)).min(1),
  steps: z.array(TrainingStepSchema).min(1),
});
export type TrainingModule = z.infer<typeof TrainingModuleSchema>;

/* ========================================================================== *
 * Troubleshooting decision trees
 * ========================================================================== */

/**
 * A flow is a directed graph of nodes. Two node kinds:
 *   question — presents options, each pointing at the next node id.
 *   outcome  — a terminal resolution with guidance, optional article/response
 *              references, and an escalation flag.
 *
 * Graphs are validated for reachability and dangling references by
 * `scripts/validate-content.ts`, so a malformed tree fails the build rather
 * than dead-ending an employee mid-call.
 */

const FlowOptionSchema = z.object({
  id: SlugSchema,
  label: z.string().min(1),
  hint: z.string().optional(),
  next: SlugSchema,
});

const QuestionNodeSchema = z.object({
  id: SlugSchema,
  kind: z.literal("question"),
  question: z.string().min(1),
  help: z.string().optional(),
  options: z.array(FlowOptionSchema).min(2),
});

const OutcomeNodeSchema = z.object({
  id: SlugSchema,
  kind: z.literal("outcome"),
  title: z.string().min(1),
  tone: z.enum(["resolved", "escalate", "out-of-scope"]).default("resolved"),
  body: z.array(BlockSchema).min(1),
  articleSlugs: z.array(SlugSchema).default([]),
  responseSlugs: z.array(SlugSchema).default([]),
});

export const FlowNodeSchema = z.discriminatedUnion("kind", [
  QuestionNodeSchema,
  OutcomeNodeSchema,
]);
export type FlowNode = z.infer<typeof FlowNodeSchema>;
export type QuestionNode = z.infer<typeof QuestionNodeSchema>;
export type OutcomeNode = z.infer<typeof OutcomeNodeSchema>;

export const TroubleshootingFlowSchema = ContentMetaSchema.extend({
  category: CategorySchema,
  /** Short label for the flow picker grid, e.g. "Printer". */
  entryLabel: z.string().min(1).max(40),
  icon: z.string().min(1).max(40).default("wrench"),
  startNodeId: SlugSchema,
  nodes: z.array(FlowNodeSchema).min(1),
});
export type TroubleshootingFlow = z.infer<typeof TroubleshootingFlowSchema>;

/* ========================================================================== *
 * Quick responses
 * ========================================================================== */

export const QuickResponseSchema = ContentMetaSchema.extend({
  category: CategorySchema,
  channel: z.enum(["email", "phone", "chat", "any"]).default("any"),
  tags: z.array(z.string().min(1).max(40)).default([]),
  /** The literal text an employee copies. Placeholders use `{{name}}` syntax
   *  and are surfaced as fill-in fields in the UI so nobody sends a message
   *  with an unreplaced token in it. */
  template: z.string().min(1),
  placeholders: z
    .array(
      z.object({
        key: z.string().regex(/^[a-z][a-z0-9_]*$/),
        label: z.string().min(1),
        example: z.string().optional(),
      }),
    )
    .default([]),
  /** Guidance on when this response is and is not appropriate. */
  usage: z.string().optional(),
});
export type QuickResponse = z.infer<typeof QuickResponseSchema>;

/* ========================================================================== *
 * Practice scenarios
 * ========================================================================== */

/**
 * A scenario walks an employee through a realistic ticket in ordered stages.
 * Each stage asks them to make a decision; feedback explains the reasoning
 * whether they were right or wrong. Scoring is intentionally lightweight — the
 * goal is reflection, not a leaderboard.
 */
export const ScenarioStageSchema = z.object({
  id: SlugSchema,
  prompt: z.string().min(1),
  kind: z.enum(["single", "multiple"]).default("single"),
  options: z
    .array(
      z.object({
        id: SlugSchema,
        text: z.string().min(1),
        correct: z.boolean().default(false),
        feedback: z.string().min(1),
      }),
    )
    .min(2),
});
export type ScenarioStage = z.infer<typeof ScenarioStageSchema>;

export const ScenarioSchema = ContentMetaSchema.extend({
  category: CategorySchema,
  difficulty: z.enum(["intro", "core", "advanced"]).default("core"),
  ticket: z.object({
    /** Fictional ticket reference. Never a real Adelphi ticket number. */
    reference: z.string().min(1).max(24),
    requesterType: z.enum(["student", "faculty", "staff", "alumni", "guest"]),
    device: z.string().min(1).max(60),
    channel: z.enum(["email", "phone", "chat", "walk-in"]),
    subject: z.string().min(1).max(160),
    message: z.string().min(1),
    /** Optional pressure cues — "third time contacting", "exam in an hour". */
    context: z.array(z.string().min(1)).default([]),
  }),
  stages: z.array(ScenarioStageSchema).min(1),
  /** Shown on the results screen — the "how a strong tech handles this" recap. */
  debrief: z.array(BlockSchema).min(1),
  articleSlugs: z.array(SlugSchema).default([]),
});
export type Scenario = z.infer<typeof ScenarioSchema>;

/* ========================================================================== *
 * Operational content
 * ========================================================================== */

export const ImportantLinkSchema = z.object({
  key: SlugSchema,
  label: z.string().min(1).max(80),
  description: z.string().min(1).max(200),
  href: z.string().min(1),
  category: CategorySchema,
  visibility: VisibilitySchema,
  /** Pins the link to the dashboard's quick-access rail. */
  pinned: z.boolean().default(false),
  updatedAt: IsoDateSchema,
});
export type ImportantLink = z.infer<typeof ImportantLinkSchema>;

export const AnnouncementSchema = z.object({
  id: SlugSchema,
  title: z.string().min(1).max(160),
  body: z.string().min(1),
  tone: z.enum(["info", "warning", "critical"]).default("info"),
  visibility: VisibilitySchema,
  publishedAt: IsoDateSchema,
  /** After this date the announcement stops rendering. Prevents the dashboard
   *  filling up with stale "printer outage" notices from last semester. */
  expiresAt: IsoDateSchema.optional(),
  author: z.string().min(1).max(80),
});
export type Announcement = z.infer<typeof AnnouncementSchema>;

/* ========================================================================== *
 * Feedback ("report outdated information")
 * ========================================================================== */

export const ContentReportSchema = z.object({
  id: z.string().min(1),
  resourceType: z.enum(["article", "module", "flow", "response", "scenario"]),
  resourceSlug: SlugSchema,
  reason: z.enum(["outdated", "incorrect", "unclear", "broken-link", "other"]),
  detail: z.string().max(1000).optional(),
  reportedBy: z.string().min(1).max(80),
  reportedAt: z.string(),
  status: z.enum(["open", "reviewing", "resolved", "dismissed"]).default("open"),
});
export type ContentReport = z.infer<typeof ContentReportSchema>;

/* ========================================================================== *
 * Taxonomy — configurable option lists
 * ========================================================================== */

/**
 * Dropdown values that belong to Adelphi's systems rather than to learnIT.
 *
 * Footprints categories, assignee groups, ticket templates, and inquiry types
 * all live in Footprints and change without warning. Hardcoding them into
 * components would mean a code change every time Adelphi adds a category, so
 * they are content — editable by an administrator.
 *
 * `complete: false` is the important field. Several of these lists were read
 * off a screenshot of a scrollable dropdown, so they are genuinely partial. The
 * UI says so rather than presenting a truncated list as authoritative.
 */
export const TaxonomyOptionSchema = z.object({
  value: z.string().min(1).max(120),
  label: z.string().min(1).max(160),
  note: z.string().max(300).optional(),
});
export type TaxonomyOption = z.infer<typeof TaxonomyOptionSchema>;

export const TaxonomySchema = z.object({
  key: SlugSchema,
  label: z.string().min(1).max(80),
  description: z.string().min(1).max(400),
  /** Where the Help Desk actually sets this — e.g. "Footprints → Issue Information". */
  source: z.string().min(1).max(160),
  verification: VerificationSchema.default("unverified"),
  /** False when the list is known to be partial. Surfaces a warning. */
  complete: z.boolean().default(false),
  options: z.array(TaxonomyOptionSchema).default([]),
  /** What is still needed to finish this list. */
  missing: z.string().max(400).optional(),
});
export type Taxonomy = z.infer<typeof TaxonomySchema>;

/* ========================================================================== *
 * Checklists
 * ========================================================================== */

/**
 * A reusable checklist, referenced from anywhere via a `checklistRef` block.
 *
 * Call Intake and Ticket Quality Check appear across many workflows, and
 * duplicating them per module guarantees they drift apart. One definition,
 * many references.
 */
export const ChecklistSchema = ContentMetaSchema.extend({
  category: CategorySchema,
  /** One line on when to run it. */
  purpose: z.string().min(1).max(300),
  groups: z
    .array(
      z.object({
        label: z.string().min(1).max(80),
        items: z
          .array(
            z.object({
              id: SlugSchema,
              text: z.string().min(1),
              detail: z.string().optional(),
              /** Rendered as "when…" so conditional items are obviously conditional. */
              appliesWhen: z.string().optional(),
            }),
          )
          .min(1),
      }),
    )
    .min(1),
});
export type Checklist = z.infer<typeof ChecklistSchema>;

/* ========================================================================== *
 * Reference tickets — worked examples
 * ========================================================================== */

/**
 * A complete, fictional worked example of a real ticket.
 *
 * New technicians consistently ask "what does a good one actually look like?".
 * Prose describing a well-written ticket is far less useful than seeing the
 * fields filled in, so this models the Footprints form directly.
 *
 * Every value is invented. Reproducing a real ticket — even with the name
 * removed — would carry a real person's problem and phrasing into training
 * material read by every new hire.
 */
export const ReferenceTicketSchema = ContentMetaSchema.extend({
  category: CategorySchema,
  /** What the user reported, in one line. */
  situation: z.string().min(1).max(300),
  /** The Footprints fields as they would be filled in. */
  fields: z.object({
    template: z.string().max(80).optional(),
    title: z.string().min(1).max(160),
    priority: z.string().max(40).default("Medium"),
    status: z.string().max(40).default("Open"),
    inquiry: z.string().max(40).optional(),
    category: z.string().max(80).optional(),
    subcategory: z.string().max(80).optional(),
    division: z.string().max(40).optional(),
    locationOfWork: z.string().max(80).optional(),
    room: z.string().max(40).optional(),
    propertyTag: z.string().max(40).optional(),
  }),
  contact: z.object({
    firstName: z.string().max(60),
    lastName: z.string().max(60),
    userId: z.string().max(60),
    phone: z.string().max(40).optional(),
    department: z.string().max(80).optional(),
    secondaryEmail: z.string().max(120).optional(),
  }),
  /** The description text, exactly as it would be typed. */
  description: z.string().min(1),
  assignees: z.array(z.string().min(1)).default([]),
  notifications: z
    .object({
      assignees: z.boolean().default(true),
      contact: z.boolean().default(true),
      cc: z.string().max(200).optional(),
    })
    .default({ assignees: true, contact: true }),
  /** Why this example is worth copying. */
  whatMakesItGood: z.array(z.string().min(1)).min(1),
  /** What a new technician typically gets wrong here. */
  commonMistakes: z.array(z.string().min(1)).default([]),
  articleSlugs: z.array(SlugSchema).default([]),
});
export type ReferenceTicket = z.infer<typeof ReferenceTicketSchema>;

/* ========================================================================== *
 * Ticket simulations
 * ========================================================================== */

/**
 * A graded call simulation.
 *
 * The trainee reads a call transcript, then writes the ticket they would have
 * written. It is scored against a rubric and given per-item feedback.
 *
 * **On the grading.** It is deterministic keyword and pattern matching, not
 * comprehension. That is a real limitation and the interface says so plainly:
 * it reliably catches "you never recorded the error message" and cannot judge
 * whether a description reads well. Presenting a keyword checker as though it
 * understood the writing would teach trainees to write for the checker, which
 * is the opposite of the point.
 *
 * Rubric items therefore accept several phrasings via `anyOf`, and the model
 * answer is always shown afterwards so a human comparison is possible.
 */
export const TranscriptLineSchema = z.object({
  speaker: z.enum(["caller", "technician", "note"]),
  text: z.string().min(1),
});
export type TranscriptLine = z.infer<typeof TranscriptLineSchema>;

const RubricItemSchema = z.object({
  id: SlugSchema,
  /** What the trainee was supposed to capture. */
  label: z.string().min(1).max(160),
  /** Which field is examined. */
  target: z.enum(["title", "description", "category", "assignee", "notifications"]),
  weight: z.number().int().min(1).max(10).default(1),
  /**
   * Any one of these substrings counts as a hit (case-insensitive). Multiple
   * phrasings are expected — a trainee writing "no signal" instead of
   * "No Signal" has still captured the fact.
   */
  anyOf: z.array(z.string().min(1)).default([]),
  /** Regular expression alternative, for format checks like the title. */
  pattern: z.string().optional(),
  /** Expected notification state, when target is "notifications". */
  expectNotification: z
    .object({ assignees: z.boolean(), contact: z.boolean() })
    .optional(),
  feedbackPass: z.string().min(1),
  feedbackFail: z.string().min(1),
});
export type RubricItem = z.infer<typeof RubricItemSchema>;

export const TicketSimulationSchema = ContentMetaSchema.extend({
  category: CategorySchema,
  difficulty: z.enum(["intro", "core", "advanced"]).default("core"),
  /** What the trainee is told before the call starts. */
  brief: z.string().min(1),
  transcript: z.array(TranscriptLineSchema).min(1),
  /** Options offered in the ticket form, so the exercise stays realistic. */
  categoryOptions: z.array(z.string().min(1)).min(2),
  assigneeOptions: z.array(z.string().min(1)).min(2),
  rubric: z.array(RubricItemSchema).min(1),
  /** Shown after grading, for human comparison. */
  modelAnswer: z.object({
    title: z.string().min(1),
    category: z.string().min(1),
    assignee: z.string().min(1),
    description: z.string().min(1),
    notifyAssignees: z.boolean().default(true),
    notifyContact: z.boolean().default(true),
  }),
  /** The reasoning a strong technician would apply. */
  debrief: z.array(BlockSchema).min(1),
});
export type TicketSimulation = z.infer<typeof TicketSimulationSchema>;

/* ========================================================================== *
 * Content backlog — what is knowingly missing
 * ========================================================================== */

/**
 * An explicit, tracked gap in the content set.
 *
 * The alternative to this list is inventing plausible-sounding procedure to
 * fill silence, which in a Help Desk context is genuinely harmful: a technician
 * following a fabricated escalation path does real damage to a real person's
 * day. Naming the gap is the honest option, and making it visible in the admin
 * console is what stops it being forgotten.
 */
export const BacklogItemSchema = z.object({
  id: SlugSchema,
  title: z.string().min(1).max(160),
  kind: z.enum(["screenshot", "procedure", "taxonomy", "reference", "policy"]),
  /** Why it matters — what stays incomplete until this arrives. */
  blocks: z.string().min(1).max(400),
  /** Content slugs that carry a placeholder waiting on this. */
  affects: z.array(z.string()).default([]),
  priority: z.enum(["high", "medium", "low"]).default("medium"),
  /** Who is expected to supply it. */
  owner: z.string().max(80).default("Help Desk leadership"),
  notes: z.string().max(600).optional(),
});
export type BacklogItem = z.infer<typeof BacklogItemSchema>;

/* ========================================================================== *
 * Help Desk principles
 * ========================================================================== */

/**
 * The recurring habits learnIT teaches, surfaced contextually via a `principle`
 * block rather than presented as a wall of ten rules nobody reads.
 */
export const PrincipleSchema = z.object({
  id: SlugSchema,
  order: z.number().int().min(0),
  title: z.string().min(1).max(80),
  summary: z.string().min(1).max(300),
  /** The failure this principle exists to prevent. */
  why: z.string().min(1).max(400),
});
export type Principle = z.infer<typeof PrincipleSchema>;

/* ========================================================================== *
 * Aggregate
 * ========================================================================== */

export const ContentBundleSchema = z.object({
  articles: z.array(ArticleSchema),
  checklists: z.array(ChecklistSchema),
  tickets: z.array(ReferenceTicketSchema),
  taxonomies: z.array(TaxonomySchema),
  modules: z.array(TrainingModuleSchema),
  flows: z.array(TroubleshootingFlowSchema),
  responses: z.array(QuickResponseSchema),
  scenarios: z.array(ScenarioSchema),
  links: z.array(ImportantLinkSchema),
  announcements: z.array(AnnouncementSchema),
});
export type ContentBundle = z.infer<typeof ContentBundleSchema>;

/** Every content record that carries `visibility` + `status`. */
export type ContentRecord =
  | Article
  | TrainingModule
  | TroubleshootingFlow
  | QuickResponse
  | Scenario;
