import type { Article } from "@/lib/content/schema";

export const accountArticles: Article[] = [
  {
    slug: "account-types-overview",
    title: "Account types and what each one can access",
    summary:
      "Students, faculty, staff, alumni, and sponsored guests hold different account types with different lifecycles. Identifying the type correctly is the first step in almost every account ticket.",
    category: "accounts",
    tags: ["accounts", "student", "faculty", "alumni", "identity"],
    visibility: "public",
    status: "published",
    updatedAt: "2026-08-04",
    updatedBy: "Help Desk Leadership",
    revision: 4,
    verification: "unverified",
    featured: true,
    related: ["password-reset-walkthrough", "alumni-account-transition"],
    body: [
      {
        type: "paragraph",
        text: "Nearly every account ticket becomes straightforward once you know **which kind of account** you are looking at. The type determines what the person can sign in to, how long the account lives, and who owns the decision when something needs to change.",
      },
      { type: "heading", level: 2, text: "The five types you will see" },
      {
        type: "fields",
        items: [
          {
            label: "Student",
            value:
              "Created at admission, active while enrolled. Access to email, learning systems, campus wireless, labs, and printing.",
          },
          {
            label: "Faculty",
            value:
              "Created at hire. Adds course tools, department resources, and in many cases VPN eligibility.",
          },
          {
            label: "Staff",
            value:
              "Created at hire. Access follows the department and role, and is the type most often affected by a job change.",
          },
          {
            label: "Alumni",
            value:
              "A reduced-access account a graduate transitions into. Many services are intentionally removed.",
          },
          {
            label: "Sponsored guest",
            value:
              "Time-limited, requested by a department for contractors, visiting researchers, and event staff. Always has an expiry date.",
          },
        ],
      },
      {
        type: "callout",
        tone: "tip",
        title: "Ask early, not late",
        text: "“Are you a current student, or did you graduate?” takes three seconds and prevents ten minutes of troubleshooting an account that is behaving exactly as designed.",
      },
      { type: "heading", level: 2, text: "Why the type matters on a call" },
      {
        type: "list",
        ordered: false,
        items: [
          "An expired sponsored guest account looks identical to a password problem until you check the expiry date.",
          "A recent graduate reporting “email stopped working” is usually an alumni transition, not a fault.",
          "A staff member who changed departments may have lost access that followed their old role — that is a request, not an incident.",
          "A student who never activated their account cannot reset a password they never set.",
        ],
      },
      { type: "heading", level: 2, text: "What to capture in the ticket" },
      {
        type: "steps",
        items: [
          {
            title: "Confirm identity using the approved verification process",
            detail:
              "Never proceed on an account request without it, no matter how routine the request sounds.",
          },
          {
            title: "Record the account type",
            detail: "Student, faculty, staff, alumni, or sponsored guest.",
          },
          {
            title: "Record what they were trying to reach",
            detail:
              "“Cannot sign in” is not actionable. “Cannot sign in to the wireless network on a personal laptop” is.",
          },
          {
            title: "Record the exact error text",
            detail:
              "Ask them to read it verbatim. The wording distinguishes a wrong password from a disabled account.",
          },
        ],
      },
      {
        type: "callout",
        tone: "warning",
        title: "Verification is not optional",
        text: "Account access is the single highest-risk thing the Help Desk touches. If you cannot verify the person, you do not proceed — you explain the verification requirement and offer the approved path. This is never rudeness; it is the protection the account holder is entitled to.",
      },
      { type: "articleRef", slug: "password-reset-walkthrough", note: "The most common account ticket, start to finish." },
    ],
  },
  {
    slug: "password-reset-walkthrough",
    title: "Walking a user through a password reset",
    summary:
      "The self-service path resolves most password tickets. This is how to guide someone through it, and how to recognise the cases that are not really password problems.",
    category: "accounts",
    tags: ["accounts", "password", "self-service", "mfa"],
    visibility: "public",
    status: "published",
    updatedAt: "2026-08-04",
    updatedBy: "Help Desk Leadership",
    revision: 6,
    verification: "unverified",
    featured: true,
    related: ["account-types-overview", "recognising-phishing-reports"],
    body: [
      {
        type: "paragraph",
        text: "Password resets are the most common ticket the Help Desk receives. Almost all of them are resolved by the user themselves, in the self-service portal, in under two minutes — provided you guide them clearly.",
      },
      {
        type: "link",
        linkKey: "account-self-service",
        note: "Send every eligible user here first.",
      },
      { type: "heading", level: 2, text: "The walkthrough" },
      {
        type: "steps",
        items: [
          {
            title: "Verify the caller",
            detail: "Follow the approved identity verification process before anything else.",
          },
          {
            title: "Confirm they can receive their recovery method",
            detail:
              "A reset link sent to an inbox they cannot open is the most common dead end. Check this before starting.",
          },
          {
            title: "Direct them to the self-service portal",
            detail:
              "Read the address slowly, or send it in the ticket. Do not assume they will find it from a search engine — lookalike sites exist.",
          },
          {
            title: "Stay on the line while they complete it",
            detail:
              "Most failures happen at the confirmation step. Being present turns a callback into a resolved ticket.",
          },
          {
            title: "Have them sign in to one real service to confirm",
            detail:
              "Email is a good test. A reset that was never verified tends to come back tomorrow.",
          },
          {
            title: "Note the outcome in the ticket and close it",
            detail: "Record which method worked; it speeds up the next contact.",
          },
        ],
      },
      { type: "heading", level: 2, text: "When it is not a password problem" },
      {
        type: "list",
        ordered: false,
        items: [
          "**Repeated lockouts within minutes** — usually a saved password on a phone or tablet still trying the old one. Ask what other devices are signed in.",
          "**Correct password, still refused** — check whether the account is expired, disabled, or a graduate who has transitioned to alumni access.",
          "**Multi-factor prompts never arrive** — this is an MFA enrollment issue, not a password issue. Different path, different escalation.",
          "**Password works on one service only** — that points at the individual service, not the account.",
        ],
      },
      {
        type: "callout",
        tone: "danger",
        title: "Never take a password",
        text: "Do not ask a user to tell you their password, do not type it for them, and do not accept one they volunteer. If a user says it out loud, tell them plainly that they should change it, and note that you did so.",
      },
      {
        type: "callout",
        tone: "tip",
        title: "The saved-password trap",
        text: "If someone is locked out again within an hour of a successful reset, the cause is almost always a device with the old password cached. Walk through phones, tablets, and mail clients before escalating.",
      },
      { type: "responseRef", slug: "password-reset-guidance" },
    ],
  },
  {
    slug: "alumni-account-transition",
    title: "Alumni account transitions",
    summary:
      "Graduates move to a reduced-access alumni account on a published schedule. Recognising this pattern prevents long troubleshooting of behaviour that is working as intended.",
    category: "accounts",
    tags: ["accounts", "alumni", "graduation", "access"],
    visibility: "public",
    status: "published",
    updatedAt: "2026-07-28",
    updatedBy: "Help Desk Leadership",
    revision: 3,
    verification: "unverified",
    featured: false,
    related: ["account-types-overview"],
    body: [
      {
        type: "paragraph",
        text: "After graduation, accounts transition from student access to alumni access. Some services continue, some are reduced, and some end. To the graduate this arrives as “my account stopped working” — which is why this ticket is so often misdiagnosed as a fault.",
      },
      {
        type: "callout",
        tone: "info",
        title: "This is a scheduled change, not an outage",
        text: "Troubleshooting a transitioned account as though it were broken wastes the caller's time and yours. Identify the pattern first.",
      },
      { type: "heading", level: 2, text: "How to recognise it" },
      {
        type: "list",
        ordered: false,
        items: [
          "The user graduated recently, and the problem began without any change on their end.",
          "Some services still work while others refuse access.",
          "Their password is accepted, but a specific system rejects them.",
        ],
      },
      { type: "heading", level: 2, text: "How to handle it" },
      {
        type: "steps",
        items: [
          {
            title: "Verify the caller",
            detail: "The approved verification process applies to graduates exactly as it does to current students.",
          },
          {
            title: "Confirm graduation timing",
            detail: "“When did you graduate?” establishes where they are in the transition schedule.",
          },
          {
            title: "Explain what changed, in plain language",
            detail:
              "Say what continues and what does not. Vagueness here produces a second call and a frustrated person.",
          },
          {
            title: "Point them to the right owner for anything you cannot change",
            detail:
              "Access decisions for alumni are policy, not a Help Desk setting. Do not promise a restoration you cannot deliver.",
          },
          {
            title: "Log the ticket with the account type recorded",
            detail: "Volume here is useful evidence when communications need improving.",
          },
        ],
      },
      {
        type: "callout",
        tone: "warning",
        title: "Do not improvise the policy",
        text: "If you are unsure what a graduate retains, say you will confirm and follow up rather than guessing. An incorrect promise about email retention is a hard thing to walk back.",
      },
      { type: "responseRef", slug: "alumni-account-transition" },
    ],
  },
  {
    slug: "account-lockout-escalation",
    title: "Account lockouts that require escalation",
    summary:
      "Internal reference: the lockout patterns that must not be resolved at first contact, and what the receiving team needs from your ticket.",
    category: "accounts",
    tags: ["accounts", "escalation", "security", "internal"],
    visibility: "staff",
    status: "published",
    updatedAt: "2026-08-08",
    updatedBy: "Help Desk Leadership",
    revision: 2,
    verification: "unverified",
    featured: false,
    related: ["password-reset-walkthrough", "recognising-phishing-reports"],
    body: [
      {
        type: "callout",
        tone: "warning",
        title: "Internal procedure",
        text: "This article is for authenticated Help Desk staff. Do not read its contents to a caller verbatim — describing the exact criteria that trigger a security review is not appropriate over the phone.",
      },
      {
        type: "paragraph",
        text: "Most lockouts are self-inflicted and self-resolved. A small number are signals of something else, and those must reach the right team without being “fixed” first.",
      },
      { type: "heading", level: 2, text: "Escalate rather than reset" },
      {
        type: "list",
        ordered: false,
        items: [
          "The user reports sign-in attempts or multi-factor prompts they did not initiate.",
          "The account was locked immediately after the user reports responding to a suspicious message.",
          "Mail rules, forwarding, or recovery details changed without the user's knowledge.",
          "Multiple unrelated accounts in the same department lock out within a short window.",
          "The caller cannot complete verification but insists the situation is urgent.",
        ],
      },
      {
        type: "callout",
        tone: "danger",
        title: "Pressure is a signal, not a reason",
        text: "Urgency, seniority, and frustration are all things a social engineering attempt will present with. They never lower the verification bar. Escalate instead — that is the correct answer, and it protects you as well as the account holder.",
      },
      { type: "heading", level: 2, text: "What the receiving team needs" },
      {
        type: "steps",
        items: [
          { title: "Exact time the user first noticed the problem" },
          { title: "Verbatim error text or prompt wording" },
          { title: "Devices and locations the user has signed in from recently" },
          {
            title: "Whether the user interacted with a suspicious message",
            detail: "Clicked, entered credentials, or approved a prompt — record which.",
          },
          { title: "What you did and did not change" },
        ],
      },
      { type: "link", linkKey: "escalation-directory" },
    ],
  },
];
