import type { AdelphiSystem } from "@/lib/content/schema";

/**
 * ---------------------------------------------------------------------------
 * The systems directory
 * ---------------------------------------------------------------------------
 * A new technician's first problem is not procedure — it is knowing which of a
 * dozen tools to open. This answers that in seconds, mid-call.
 *
 * Each entry is deliberately shallow: what it is, when it sends you here, the
 * facts worth having in front of you, and what people get wrong. Depth lives in
 * the knowledge base and the modules; duplicating it here would create two
 * versions to keep in step.
 *
 * Entries with heavy placeholders are the ones nobody has documented yet. They
 * are listed anyway, because knowing a system exists is itself useful — and a
 * visible gap is safer than an omission that reads as completeness.
 */
export const systems: AdelphiSystem[] = [
  {
    slug: "system-footprints",
    shortName: "Footprints",
    title: "Footprints",
    summary:
      "The ticketing system. Every contact ends up here, including the ones you redirect elsewhere.",
    purpose:
      "Footprints is where Help Desk work is recorded. It holds the ticket, its contact, its classification, its assignee, and the description that lets somebody else pick the work up.",
    category: "ticketing",
    order: 1,
    visibility: "staff",
    status: "published",
    updatedAt: "2026-08-21",
    updatedBy: "Rian Fernando",
    revision: 1,
    verification: "needs-review",
    linkKey: "help-desk-portal",
    whenYouUseIt: [
      "Every single contact — phone, email, walk-in, in scope or not",
      "Checking whether a user has called about this before",
      "Handing work to another team with the context attached",
    ],
    keyFacts: [
      { label: "Form", value: "New Issue for IT" },
      {
        label: "Tabs",
        value:
          "Contact Information · Issue Information · Description · Assignees and Notifications · Attachments · Time Tracking",
      },
      { label: "Required", value: "Title, Priority, Status, Category, Division" },
      { label: "Defaults", value: "Priority Medium · Status Open · Division OITR" },
      {
        label: "Title format",
        value: "`Issue Title  USERNAME` — two spaces before the username",
      },
      {
        label: "Classroom titles",
        value: "`BUILDING ROOM Issue  USERNAME` — location leads",
      },
      { label: "Default assignee", value: "+Customer Experience for general issues" },
    ],
    watchOut: [
      "Location of Work To Be Done is **required** for classroom and physical hardware issues — Footprints says so on the form.",
      "Selecting the first matching contact name. There is more than one Mark — check the User ID.",
      "Leaving a template's default assignee in place when the workflow needs it removed.",
      "Leaving notifications on when you are only closing a ticket.",
      "Pasting an email into the description with formatting, which drags inline images in with it.",
    ],
    articleSlugs: ["ticket-lifecycle", "writing-useful-ticket-notes"],
    moduleSlug: "creating-a-footprints-ticket",
  },

  {
    slug: "system-user-lookup",
    shortName: "User Lookup",
    title: "User Lookup",
    summary:
      "Confirms what a caller tells you — whether the account exists, what state it is in, and what the person has access to.",
    purpose:
      "User Lookup returns an account's status across Adelphi's systems, the directory record behind it, group membership, and the services the person holds. It is the fastest way to stop troubleshooting the wrong thing.",
    category: "accounts",
    order: 2,
    visibility: "staff",
    status: "published",
    updatedAt: "2026-08-21",
    updatedBy: "Rian Fernando",
    revision: 1,
    verification: "needs-review",
    whenYouUseIt: [
      "Before acting on any account problem",
      "Confirming whether someone is a student, an employee, or both",
      "Checking whether an account is disabled or has moved to alumni",
      "Checking PMT enrolment and which MFA methods are registered",
      "Checking whether a user has VPN access",
    ],
    keyFacts: [
      { label: "Search by", value: "Username or AUID" },
      {
        label: "Sections",
        value: "Summary · SAAS · directory attributes · Groups · Library groups · Services",
      },
      {
        label: "PMT enrolment",
        value: "The Azure/PMT/SSPR row shows **Enrolled** when the user has enrolled",
      },
      {
        label: "MFA methods",
        value: "`MFA_AuthMethod_…` group membership shows which method types are registered",
      },
    ],
    watchOut: [
      "**Enrolled is not the same as working.** A user can be enrolled with a phone number they no longer have — check live via the eCampus forgot-password step.",
      "An empty result does not mean the person does not exist. Alumni in particular may not appear the way a current user does.",
    ],
    articleSlugs: ["account-types-overview"],
    moduleSlug: "user-lookup",
  },

  {
    slug: "system-saas",
    shortName: "SAAS",
    title: "SAAS",
    summary:
      "Student records. Used to verify identity and confirm graduation when a caller does not appear as a current user.",
    purpose:
      "SAAS holds the student record. The Help Desk uses it to verify a person against information only they should know, and to confirm whether someone actually graduated before treating them as an alumnus.",
    category: "accounts",
    order: 3,
    visibility: "staff",
    status: "published",
    updatedAt: "2026-08-21",
    updatedBy: "Rian Fernando",
    revision: 1,
    verification: "needs-review",
    whenYouUseIt: [
      "Verifying a caller who does not populate through normal lookup",
      "Confirming graduation before starting the alumni workflow",
      "Searching by ID number or a fragment of a name",
    ],
    keyFacts: [
      { label: "Current workflow", value: "Option 6" },
      { label: "Search by", value: "ID number, or a fragment of first or last name" },
      { label: "Verify with", value: "Information such as date of birth or ZIP code" },
    ],
    watchOut: [
      "A matching name is **not** identification. Two people share a name — verify with the additional information before selecting.",
      "Confirm identifiers verbally. Do not copy date of birth, ZIP, or similar into the ticket description.",
      "No graduation record has two meanings — they may not have graduated, or it may not be updated yet. Direct them to One Stop rather than guessing.",
      "When SAAS reports no user, copy the exact wording into the ticket rather than paraphrasing.",
    ],
    articleSlugs: ["alumni-account-transition"],
    moduleSlug: "alumni-account-workflow",
  },

  {
    slug: "system-ecampus",
    shortName: "eCampus",
    title: "eCampus",
    summary:
      "The Adelphi portal, at portal.adelphi.edu. Also the fastest way to see what MFA methods a user is actually offered.",
    purpose:
      "eCampus is the portal users sign into. For the Help Desk it doubles as a diagnostic: the forgot-password flow shows exactly which recovery methods a user will be offered.",
    category: "accounts",
    order: 4,
    visibility: "staff",
    status: "published",
    updatedAt: "2026-08-21",
    updatedBy: "Rian Fernando",
    revision: 1,
    verification: "needs-review",
    whenYouUseIt: [
      "Confirming which MFA methods a user actually has",
      "Checking whether a sign-in problem is the account or the service",
    ],
    keyFacts: [
      { label: "Address", value: "portal.adelphi.edu" },
      {
        label: "MFA check",
        value:
          "Private window → eCampus → enter the user's Adelphi email → forgot-password step → count the methods offered",
      },
    ],
    watchOut: [
      "This is a **read-only check**. Do not complete a reset on a user's behalf.",
      "Never ask a user to read you a code that arrives.",
    ],
    articleSlugs: [],
    moduleSlug: "user-lookup",
  },

  {
    slug: "system-ems",
    shortName: "EMS",
    title: "EMS",
    summary:
      "Room and event scheduling. Checked before dispatching anyone to a classroom.",
    purpose:
      "EMS holds room bookings. On a classroom call it confirms the room exists, a class is genuinely scheduled, and the caller is associated with the booking.",
    category: "software",
    order: 5,
    visibility: "staff",
    status: "published",
    updatedAt: "2026-08-21",
    updatedBy: "Rian Fernando",
    revision: 1,
    verification: "needs-review",
    linkKey: "event-scheduling-system",
    whenYouUseIt: [
      "Any classroom technology call, before troubleshooting",
      "Confirming a class is scheduled in the room at that time",
    ],
    keyFacts: [
      { label: "Confirm", value: "The classroom exists, the class exists, the caller is associated with it" },
    ],
    watchOut: [
      "Record in the ticket that you checked EMS. If you do not, the next person checks it again.",
    ],
    articleSlugs: [],
    moduleSlug: "classroom-technology-support",
  },

  {
    slug: "system-andromeda",
    shortName: "Andromeda",
    title: "Andromeda (OpenSense VPN)",
    summary:
      "The second VPN. A caller saying 'the VPN' has not yet told you which one they mean.",
    purpose:
      "Andromeda is Adelphi's OpenSense VPN, running alongside the primary client. Users need a setup process before first use, and access is visible in User Lookup.",
    category: "vpn",
    order: 6,
    visibility: "staff",
    status: "published",
    updatedAt: "2026-08-21",
    updatedBy: "Rian Fernando",
    revision: 1,
    verification: "needs-review",
    whenYouUseIt: [
      "Any VPN call — first establish which of the two the caller means",
      "Confirming VPN entitlement before walking someone through setup",
    ],
    keyFacts: [
      { label: "Address", value: "andromeda.adelphi.edu" },
      { label: "Platform", value: "OpenSense" },
      { label: "Access check", value: "Visible in User Lookup" },
    ],
    watchOut: [
      "There are **two** VPNs. Establish which one before troubleshooting anything.",
      "Most VPN calls come from people who do not need a VPN at all — ask what they are trying to reach first.",
    ],
    articleSlugs: ["andromeda-vpn", "vpn-what-it-is", "vpn-connection-troubleshooting"],
    moduleSlug: "vpn-and-connectivity",
  },

  {
    slug: "system-eplanner",
    shortName: "ePlanner",
    title: "ePlanner (Stellic)",
    summary:
      "Academic planning. ePlanner and Stellic are the same platform — users say either.",
    purpose:
      "ePlanner is the academic planning platform. The Help Desk handles access requests and routes support questions to training material.",
    category: "software",
    order: 7,
    visibility: "staff",
    status: "published",
    updatedAt: "2026-08-21",
    updatedBy: "Rian Fernando",
    revision: 1,
    verification: "needs-review",
    whenYouUseIt: [
      "A user requesting access — use the ePlanner Access template",
      "A user who has access but does not know how to use it — ePlanner Support and Training",
    ],
    keyFacts: [
      { label: "Also called", value: "Stellic — same platform" },
      { label: "Access requests", value: "ePlanner Access template; add the role requested" },
      { label: "How-to questions", value: "ePlanner Support and Training template" },
    ],
    watchOut: [
      "The question that picks the template is \"can you get in at all?\" — no means Access, yes-but-stuck means Support and Training.",
      "Leave the template's pre-set description in place. The only thing you add is the role.",
    ],
    articleSlugs: ["eplanner-stellic-access"],
  },

  {
    slug: "system-remote-support",
    shortName: "Remote support",
    title: "Remote support console",
    summary:
      "Taking control of a user's machine, with consent. The most trust-sensitive thing a technician does.",
    purpose:
      "The remote support console is used when a fix genuinely needs hands on the user's machine. Zoom covers the cases where you only need to see their screen.",
    category: "remote-support",
    order: 8,
    visibility: "staff",
    status: "published",
    updatedAt: "2026-08-21",
    updatedBy: "Rian Fernando",
    revision: 1,
    verification: "needs-review",
    linkKey: "remote-support-console",
    whenYouUseIt: [
      "When the fix needs hands on their machine, not instructions",
      "Never as a default — phone guidance and screen sharing come first",
    ],
    keyFacts: [
      { label: "Screen sharing alternative", value: "Zoom, when you need to see but not touch" },
      { label: "Consent", value: "Explicit, before connecting, recorded in the ticket" },
      { label: "Presence", value: "The user stays at the machine for the whole session" },
    ],
    watchOut: [
      "\"I'm going to connect now\" is an announcement, not consent.",
      "Access granted for one problem is not access to the machine.",
      "Ending a session means terminating it in the console — closing a window is not the same thing.",
    ],
    articleSlugs: ["remote-support-session-conduct"],
    moduleSlug: "remote-support",
  },

  {
    slug: "system-pmt",
    shortName: "PMT",
    title: "PMT",
    summary:
      "Password and MFA management. Central to account troubleshooting — and not yet documented.",
    purpose:
      "PMT is used for password and multi-factor troubleshooting. User Lookup shows whether a user is enrolled and which methods they hold; what happens inside PMT has not been documented yet.",
    category: "accounts",
    order: 9,
    visibility: "staff",
    status: "draft",
    updatedAt: "2026-08-21",
    updatedBy: "Rian Fernando",
    revision: 1,
    verification: "unverified",
    whenYouUseIt: [
      "MFA problems",
      "Account access problems where self-service is unavailable",
    ],
    keyFacts: [
      { label: "Enrolment", value: "Visible in User Lookup on the Azure/PMT/SSPR row" },
    ],
    watchOut: [
      "**The PMT procedure itself is not written yet.** Ask a supervisor rather than working from memory or guesswork.",
    ],
    articleSlugs: [],
    moduleSlug: "pmt-overview",
  },

  {
    slug: "system-helpdesk-email",
    shortName: "Help Desk email",
    title: "Help Desk email",
    summary:
      "The shared inbox. Emails become Footprints tickets — cleanly, if you use the right paste.",
    purpose:
      "The shared Help Desk inbox is one of the main intake channels. Working an email means claiming it, moving its content into a ticket without the formatting, and attaching files separately.",
    category: "ticketing",
    order: 10,
    visibility: "staff",
    status: "published",
    updatedAt: "2026-08-21",
    updatedBy: "Rian Fernando",
    revision: 1,
    verification: "needs-review",
    whenYouUseIt: ["Any request that arrives by email"],
    keyFacts: [
      { label: "Claim it", value: "Mark the message Work in Progress so nobody duplicates it" },
      { label: "Open the content", value: "Forward — you are not sending it, only exposing the text" },
      { label: "Copy", value: "Ctrl + A, Ctrl + X, then Ctrl + Shift + V into the ticket" },
      { label: "Attachments", value: "Separately, via the Attachments tab" },
    ],
    watchOut: [
      "A plain paste drags the email's formatting and inline images into the description.",
      "Pasting does not carry attachments. Attach them deliberately.",
      "Put your response **above** the forwarded message so the two are clearly separate.",
    ],
    articleSlugs: [],
    moduleSlug: "handling-help-desk-email",
  },
];
