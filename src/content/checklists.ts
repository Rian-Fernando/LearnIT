import type { Checklist } from "@/lib/content/schema";

/**
 * Reusable checklists.
 *
 * Call Intake and the Ticket Quality Check appear across nearly every workflow.
 * Defining them once and referencing them with a `checklistRef` block is what
 * stops eight slightly-different copies drifting apart — and means a correction
 * lands everywhere at once.
 */
export const checklists: Checklist[] = [
  {
    slug: "call-intake",
    title: "Call intake",
    summary:
      "What to establish before you begin troubleshooting. Built around where, when, why, how, and what.",
    purpose:
      "Run this at the start of any contact, before you start fixing anything.",
    category: "general",
    visibility: "public",
    status: "published",
    updatedAt: "2026-08-15",
    updatedBy: "Rian Fernando",
    revision: 1,
    verification: "needs-review",
    groups: [
      {
        label: "The five questions",
        items: [
          {
            id: "what",
            text: "What exactly is happening?",
            detail:
              "Not 'it's broken'. What did they do, what did they expect, and what happened instead — including the error message word for word.",
          },
          {
            id: "where",
            text: "Where is the user?",
            detail:
              "On campus or off. Which building and room, if it is a physical or classroom issue.",
          },
          {
            id: "when",
            text: "When did it start?",
            detail:
              "And whether anything changed around that time — a password change, a new device, a software update.",
          },
          {
            id: "why",
            text: "What were they trying to accomplish?",
            detail:
              "The underlying goal often has a faster route than the one they are stuck on.",
          },
          {
            id: "how",
            text: "How is the problem occurring?",
            detail:
              "Every time, or intermittently? On one device or all of them? For them alone or for colleagues too?",
          },
        ],
      },
      {
        label: "Identity and account",
        items: [
          {
            id: "who",
            text: "Who is the user, verified through the approved process?",
          },
          {
            id: "username",
            text: "Which username are they using?",
            detail: "Ask them to spell it. Do not infer it from their name.",
          },
          {
            id: "roles",
            text: "What role or roles do they hold?",
            detail:
              "Student, faculty, staff, alumni, guest — and remember a person can hold more than one.",
          },
          {
            id: "which-account",
            text: "Which account is the problem on?",
            appliesWhen: "the user has more than one Adelphi account",
            detail:
              "Never assume. A student-plus-employee user having trouble with their work account is a completely different path.",
          },
          {
            id: "system",
            text: "Which system are they trying to reach?",
          },
        ],
      },
      {
        label: "Contact and context",
        items: [
          { id: "callback", text: "Callback number captured?" },
          {
            id: "personal-callback",
            text: "Asked for a second number?",
            appliesWhen: "only an office number is on file",
            detail:
              "Gives the Help Desk another way to reach them if the issue outlives the call.",
          },
          { id: "department", text: "Department noted?" },
          { id: "device", text: "Device type, and university-issued or personal?" },
          {
            id: "property-tag",
            text: "Property tag recorded?",
            appliesWhen: "the device is Adelphi-owned",
            detail: "The five-digit number on the 'Property of Adelphi University' tag.",
          },
        ],
      },
      {
        label: "History",
        items: [
          {
            id: "previous-tickets",
            text: "Checked the user's history in Footprints?",
            detail:
              "Someone may have already solved this, or already tried what you are about to try.",
          },
          { id: "recurring", text: "Has this happened before?" },
          { id: "others-affected", text: "Is anyone else experiencing it?" },
          {
            id: "urgency",
            text: "Is there a class, meeting, or deadline in play?",
            detail:
              "This changes how you communicate and whether it needs escalating now rather than later.",
          },
        ],
      },
    ],
  },

  {
    slug: "ticket-quality-check",
    title: "Ticket quality check",
    summary:
      "The final pass before saving a Footprints ticket. Ten seconds of re-reading catches almost every ticket problem.",
    purpose: "Run this immediately before you press Save, every time.",
    category: "ticketing",
    visibility: "public",
    status: "published",
    updatedAt: "2026-08-15",
    updatedBy: "Rian Fernando",
    revision: 1,
    verification: "needs-review",
    groups: [
      {
        label: "Contact information",
        items: [
          {
            id: "correct-user",
            text: "Correct user selected?",
            detail:
              "Seeing the right first name is not confirmation. Check the surname, username, and callback number too — there is more than one Mark.",
          },
          { id: "username-verified", text: "Username verified against the system?" },
          { id: "account-type", text: "Account type confirmed?" },
          { id: "callback-verified", text: "Callback number correct?" },
        ],
      },
      {
        label: "Issue information",
        items: [
          { id: "category", text: "Correct category selected?" },
          { id: "subcategory", text: "Correct subcategory, where one applies?" },
          {
            id: "location",
            text: "Location of Work To Be Done set?",
            appliesWhen: "this is a classroom or physical hardware issue",
            detail: "Footprints marks this required for those issue types.",
          },
          {
            id: "property-tag",
            text: "Property tag recorded?",
            appliesWhen: "Adelphi-owned equipment is involved",
          },
        ],
      },
      {
        label: "Title and description",
        items: [
          {
            id: "title-concise",
            text: "Title short, specific, and searchable?",
          },
          {
            id: "title-username",
            text: "Username at the end of the title, after two spaces?",
          },
          {
            id: "description-issue",
            text: "Description explains what the user actually reported?",
          },
          {
            id: "description-troubleshooting",
            text: "Troubleshooting performed and its results documented?",
          },
          {
            id: "description-escalation",
            text: "Escalation reason and next steps written out?",
            appliesWhen: "the ticket is being escalated",
            detail:
              "Why it is being escalated, what has already been tried, and what the receiving team needs to do.",
          },
          {
            id: "no-credentials",
            text: "No passwords, codes, or sensitive personal details in the description?",
          },
        ],
      },
      {
        label: "Routing and notification",
        items: [
          {
            id: "assignee",
            text: "Correct assignee — and any default assignee that should not be there removed?",
          },
          {
            id: "notifications",
            text: "Notification checkboxes reviewed deliberately?",
            detail:
              "Assignees, Contact, and CC. Uncheck them when you are only closing a ticket and nobody needs an email about it.",
          },
          {
            id: "cc",
            text: "CC recipients added where others need to follow the thread?",
          },
          {
            id: "attachments",
            text: "Attachments added through the Attachments tab rather than pasted into the description?",
          },
        ],
      },
    ],
  },

  {
    slug: "before-you-troubleshoot",
    title: "Before you troubleshoot",
    summary:
      "A two-question reflection that slows a new technician down at the point where rushing costs the most.",
    purpose:
      "Run this the moment you feel the urge to start fixing something.",
    category: "general",
    visibility: "public",
    status: "published",
    updatedAt: "2026-08-15",
    updatedBy: "Rian Fernando",
    revision: 1,
    verification: "needs-review",
    groups: [
      {
        label: "Stop and ask yourself",
        items: [
          {
            id: "what-do-i-have",
            text: "What information do I actually have?",
            detail: "Facts you have verified — not what you have assumed from context.",
          },
          {
            id: "what-am-i-missing",
            text: "What information am I missing?",
            detail:
              "If the answer includes the username, the account, or what they were trying to do, you are not ready to troubleshoot yet.",
          },
        ],
      },
      {
        label: "The questions that most often turn out to matter",
        items: [
          { id: "q-who", text: "Who am I speaking to, and have I verified it?" },
          { id: "q-username", text: "What username are they using?" },
          { id: "q-account", text: "Which account are they trying to reach?" },
          { id: "q-device", text: "What device, and is it Adelphi-owned?" },
          { id: "q-error", text: "What does the error say, word for word?" },
          { id: "q-tried", text: "What have they already tried?" },
          { id: "q-started", text: "When did it start, and has it happened before?" },
          { id: "q-others", text: "Is anyone else affected?" },
          { id: "q-urgent", text: "Is a class or meeting about to start?" },
          { id: "q-previous", text: "Is there a previous ticket?" },
        ],
      },
    ],
  },
];
