import type { BacklogItem } from "@/lib/content/schema";

/**
 * ---------------------------------------------------------------------------
 * Content backlog
 * ---------------------------------------------------------------------------
 * Everything learnIT knows it does not yet know.
 *
 * This list is the counterpart to a hard rule in this project: where a
 * procedure has not been confirmed, it is left as a visible gap rather than
 * filled with something plausible. A technician who can see "this step has not
 * been written yet" asks a supervisor. A technician following invented
 * procedure does not, and that is the failure mode worth engineering against.
 *
 * Surfaced at /admin/backlog, and every `placeholder` block in the content set
 * links back to an item here.
 */
export const backlog: BacklogItem[] = [
  /* ---------------------------------------------------------------- screenshots */
  {
    id: "user-lookup-states",
    title: "User Lookup — the different account states",
    kind: "screenshot",
    priority: "high",
    owner: "Help Desk leadership",
    blocks:
      "The User Lookup module can explain the layout but cannot show a technician what a disabled account, an alumni account, or a student-plus-employee account actually looks like on screen — which is the whole skill.",
    affects: ["user-lookup", "alumni-account-workflow", "identity-and-accounts"],
    notes:
      "Needed: current student, faculty, staff, student + employee, disabled user, alumni, recently graduated, and username-not-found. Must be sanitised — a real record carries AUID, directory attributes, and group membership.",
  },
  {
    id: "user-lookup-mfa",
    title: "User Lookup — where MFA methods appear",
    kind: "screenshot",
    priority: "high",
    owner: "Help Desk leadership",
    blocks:
      "PMT troubleshooting depends on knowing how many MFA methods a user has enrolled, and the navigation to that information is not documented.",
    affects: ["user-lookup", "pmt-overview"],
    notes:
      "A sanitised export suggests enrolment surfaces both in the Summary table (an Azure/PMT/SSPR row) and as directory groups whose names encode the method and a count. This needs confirming before it is written as procedure — see the question list.",
  },
  {
    id: "saas-option-6",
    title: "SAAS Option 6 — search and result screens",
    kind: "screenshot",
    priority: "high",
    owner: "Help Desk leadership",
    blocks:
      "The alumni workflow depends on SAAS Option 6 for graduation verification, and neither the search screen nor the result layout is documented.",
    affects: ["alumni-account-workflow"],
  },
  {
    id: "saas-graduation-screen",
    title: "SAAS — graduation status and degree record",
    kind: "screenshot",
    priority: "high",
    owner: "Help Desk leadership",
    blocks:
      "A technician cannot be taught to read a graduation record they have never seen, and getting this wrong means telling someone they are an alumnus when they are not.",
    affects: ["alumni-account-workflow"],
  },
  {
    id: "saas-no-user-message",
    title: "SAAS — exact wording of the 'NO USER' message",
    kind: "screenshot",
    priority: "medium",
    owner: "Help Desk leadership",
    blocks:
      "The procedure says to copy the system message verbatim into the ticket description, so the exact wording matters and must not be paraphrased.",
    affects: ["alumni-account-workflow"],
  },
  {
    id: "footprints-guest-template",
    title: "Footprints — Guest AUig Account template",
    kind: "screenshot",
    priority: "medium",
    owner: "Help Desk leadership",
    blocks:
      "The guest account workflow can describe the process but cannot show which fields the template pre-fills or what the description should contain.",
    affects: ["guest-account-workflow"],
  },
  {
    id: "footprints-alumni-template",
    title: "Footprints — Alumni Account template",
    kind: "screenshot",
    priority: "high",
    owner: "Help Desk leadership",
    blocks:
      "The alumni description format, default assignees, and CC recipients all come from this template.",
    affects: ["alumni-account-workflow"],
  },
  {
    id: "gmail-inbox-template",
    title: "Help Desk Gmail inbox — labels and the Work in Progress filter",
    kind: "screenshot",
    priority: "medium",
    owner: "Help Desk leadership",
    blocks:
      "The email handling module describes marking a message 'Work in Progress' without showing where that control is.",
    affects: ["handling-help-desk-email"],
    notes: "You mentioned this is coming.",
  },
  {
    id: "classroom-layouts",
    title: "Classroom technology layouts",
    kind: "screenshot",
    priority: "high",
    owner: "Help Desk leadership",
    blocks:
      "A technician needs to recognise which configuration a room uses before they can troubleshoot it over the phone.",
    affects: ["classroom-technology-support"],
    notes: "Desktop configuration, PC on rack, PC in closet, and any other variants.",
  },

  /* ---------------------------------------------------------------- procedures */
  {
    id: "classroom-troubleshooting",
    title: "Classroom troubleshooting, per configuration",
    kind: "procedure",
    priority: "high",
    owner: "Help Desk leadership",
    blocks:
      "The classroom module currently teaches only the intake path — check EMS, check the technology page, identify the configuration. What to actually do next is not written.",
    affects: ["classroom-technology-support"],
  },
  {
    id: "pmt-workflow",
    title: "PMT — the actual procedure",
    kind: "procedure",
    priority: "high",
    owner: "Help Desk leadership",
    blocks:
      "PMT exists in learnIT as a stub. What it is, when it is used, and how MFA and account troubleshooting run through it are all undocumented.",
    affects: ["pmt-overview"],
  },
  {
    id: "tss-workflow",
    title: "TSS assignment and dispatch",
    kind: "procedure",
    priority: "high",
    owner: "Help Desk leadership",
    blocks:
      "The classroom workflow knows a TSS or Lab Consultant must end up on the ticket, but not which assignee group, nor the dispatch expectations.",
    affects: ["classroom-technology-support"],
  },
  {
    id: "escalation-rules",
    title: "Official escalation rules",
    kind: "policy",
    priority: "high",
    owner: "Help Desk leadership",
    blocks:
      "Existing escalation guidance is written from general IT practice, not Adelphi policy, and is marked unverified throughout.",
    affects: ["help-desk-fundamentals", "account-lockout-escalation"],
  },
  {
    id: "identity-verification-policy",
    title: "The approved identity verification process",
    kind: "policy",
    priority: "high",
    owner: "Help Desk leadership",
    blocks:
      "learnIT repeatedly instructs technicians to 'verify the user through the approved process' without being able to say what that process is — the single most-referenced gap in the content set.",
    affects: ["identity-and-accounts", "accounts-and-access"],
  },
  {
    id: "guest-account-supervisor-process",
    title: "Guest account — supervisor password removal step",
    kind: "procedure",
    priority: "medium",
    owner: "Help Desk leadership",
    blocks:
      "The workflow states the password is removed from the internal sheet after the ticket closes, but not who does it or how it is confirmed.",
    affects: ["guest-account-workflow"],
  },
  {
    id: "alumni-reenable-timeframe",
    title: "Alumni re-enablement timeframe confirmation",
    kind: "policy",
    priority: "low",
    owner: "Help Desk leadership",
    blocks:
      "24–48 hours is recorded as the expectation to set with users, but has not been confirmed as current.",
    affects: ["alumni-account-workflow"],
  },
  {
    id: "konica-scope-confirmation",
    title: "Konica — confirm the scope boundary and redirect destination",
    kind: "policy",
    priority: "high",
    owner: "Help Desk leadership",
    blocks:
      "Existing Konica content states the devices are vendor-serviced under a support agreement and tells technicians to point users at a service sticker on the unit. Only the scope boundary itself was provided — the vendor agreement, the sticker, and the redirect destination were written from general practice and need confirming or replacing.",
    affects: ["konica-device-redirect", "printing-support-scope", "konica-redirect"],
    notes:
      "Flagged proactively: this is currently the largest block of unconfirmed detail presented as procedure, and technicians would act on it.",
  },
  {
    id: "printer-procedures",
    title: "Additional printer procedures",
    kind: "procedure",
    priority: "medium",
    owner: "Help Desk leadership",
    blocks:
      "Existing printing content is illustrative. Adelphi-specific queue, release, and quota procedures are not documented.",
    affects: ["printer-troubleshooting-path", "printing"],
  },

  /* ---------------------------------------------------------------- taxonomy */
  {
    id: "footprints-category-list",
    title: "Footprints category and subcategory lists",
    kind: "taxonomy",
    priority: "high",
    owner: "Help Desk leadership",
    blocks:
      "Category is a required field that can change ticket routing, and learnIT currently knows exactly one value. Until this is filled in, the ticket-creation module cannot teach category selection.",
    affects: ["creating-a-footprints-ticket"],
  },
  {
    id: "footprints-assignee-list",
    title: "Full assignee group list",
    kind: "taxonomy",
    priority: "medium",
    owner: "Help Desk leadership",
    blocks:
      "Only the first ten workspace members were visible in the screenshot. Correct routing cannot be taught from a partial list.",
    affects: ["creating-a-footprints-ticket"],
  },
  {
    id: "building-abbreviations",
    title: "Building abbreviations and room list",
    kind: "taxonomy",
    priority: "medium",
    owner: "Help Desk leadership",
    blocks:
      "Classroom ticket titles begin with a building abbreviation, and Location of Work To Be Done is a required field for classroom issues.",
    affects: ["classroom-technology-support"],
  },
  {
    id: "transfer-extensions",
    title: "Common transfer destinations and extensions",
    kind: "taxonomy",
    priority: "medium",
    owner: "Help Desk leadership",
    blocks:
      "Technicians transfer callers constantly and currently have nowhere in learnIT to look up where and to what extension.",
    affects: ["transfer-directory"],
    notes: "You flagged this. One Stop is referenced by the alumni workflow but has no extension recorded.",
  },
  {
    id: "office-hours",
    title: "Office hours — semester, summer, and Zoom coverage",
    kind: "reference",
    priority: "medium",
    owner: "Help Desk leadership",
    blocks:
      "The office-hours quick response has placeholder hours in it, so it cannot be sent as written.",
    affects: ["office-hours"],
    notes: "You flagged this: semester hours, summer hours, and the Zoom room hours.",
  },
  {
    id: "zoom-room-details",
    title: "IT Zoom room link and its reference ticket",
    kind: "reference",
    priority: "medium",
    owner: "Help Desk leadership",
    blocks:
      "The IT support meeting room link is an unset placeholder, so the quick response that shares it is unusable.",
    affects: ["it-support-meeting-room", "it-meeting-room"],
    notes: "You mentioned there is a standing ticket number associated with the Zoom room.",
  },

  /* ---------------------------------------------------------------- reference tickets */
  {
    id: "reference-ticket-vpn-andromeda",
    title: "Reference ticket — VPN / Andromeda",
    kind: "reference",
    priority: "high",
    owner: "Help Desk leadership",
    blocks:
      "No worked example exists for the most common connectivity ticket. 'Andromeda' does not appear anywhere in learnIT yet and needs explaining before a ticket can be modelled.",
    affects: [],
  },
  {
    id: "reference-ticket-mfa-token-reset",
    title: "Reference ticket — MFA token reset",
    kind: "reference",
    priority: "high",
    owner: "Help Desk leadership",
    blocks: "No worked example, and the underlying MFA reset procedure is undocumented.",
    affects: ["pmt-overview"],
  },
  {
    id: "reference-ticket-password-reset-no-pmt",
    title: "Reference ticket — password reset without PMT set up",
    kind: "reference",
    priority: "high",
    owner: "Help Desk leadership",
    blocks:
      "This is the awkward case where self-service is unavailable, and it is exactly where new technicians need a worked example.",
    affects: ["pmt-overview"],
  },
  {
    id: "reference-ticket-eplanner-stellic",
    title: "Reference ticket — ePlanner / Stellic access",
    kind: "reference",
    priority: "medium",
    owner: "Help Desk leadership",
    blocks:
      "Two Footprints templates exist for ePlanner, but the access request workflow itself is undocumented, and Stellic's relationship to ePlanner is unclear.",
    affects: [],
  },
  {
    id: "reference-ticket-voicethread",
    title: "Reference ticket — VoiceThread issues",
    kind: "reference",
    priority: "medium",
    owner: "Help Desk leadership",
    blocks: "VoiceThread is not covered anywhere in learnIT.",
    affects: [],
  },
];
