import type { TrainingModule } from "@/lib/content/schema";

/**
 * Workflow modules — the specific, named procedures.
 *
 * These follow Adelphi workflows as described so far. Where a step depends on a
 * screen nobody has documented yet, there is a `placeholder` rather than an
 * invented description of what the screen probably looks like. That distinction
 * is the whole point: a technician can act on "this is not written yet", and
 * cannot safely act on a confident fabrication.
 */
export const workflowModules: TrainingModule[] = [
  /* ======================================================================== *
   * User Lookup
   * ======================================================================== */
  {
    slug: "user-lookup",
    title: "User Lookup",
    summary:
      "The tool for answering 'does this account exist, what state is it in, and what does this person have access to' before you troubleshoot anything.",
    order: 7,
    category: "accounts",
    visibility: "staff",
    status: "published",
    updatedAt: "2026-08-15",
    updatedBy: "Rian Fernando",
    revision: 1,
    verification: "needs-review",
    prerequisites: ["identity-and-accounts"],
    outcomes: [
      "Look up an account and read its overall state",
      "Tell the difference between account states that look similar",
      "Find the information PMT troubleshooting depends on",
    ],
    steps: [
      {
        id: "what-it-is",
        title: "What User Lookup answers",
        minutes: 4,
        body: [
          {
            type: "paragraph",
            text: "User Lookup is where you confirm what a caller tells you. Search by username or AUID and it returns a summary of that account's state across Adelphi's systems, the directory attributes behind it, group membership, and which services the person has.",
          },
          {
            type: "callout",
            tone: "tip",
            title: "It answers the question you were about to assume",
            text: "Does this username exist? Is the account active? Is this a student or an employee — or both? Are they alumni? Thirty seconds here prevents most misdiagnosed account tickets.",
          },
          { type: "heading", level: 2, text: "Roughly what it shows" },
          {
            type: "fields",
            items: [
              { label: "Summary", value: "Per-service status — directory, email, and enrolment state across Adelphi's systems." },
              { label: "SAAS", value: "AUID and the account provisioning dates." },
              { label: "Directory attributes", value: "The underlying account record, including display name, department, and whether the account is in a normal or restricted state." },
              { label: "Groups", value: "Group membership. This is where access — and MFA enrolment — is visible." },
              { label: "Library groups", value: "Library patron status, including alumni." },
              { label: "Services", value: "The list of services the person has, and whether each is active." },
            ],
          },
          {
            type: "callout",
            tone: "warning",
            title: "This section is not yet verified",
            text: "The structure above was derived from a single sanitised export, not from documentation. Field names, section names, and what each status actually means all need confirming before this is taught as procedure.",
          },
          {
            type: "placeholder",
            label: "User Lookup — annotated screenshots of each account state",
            needs: [
              "Current student",
              "Faculty",
              "Staff",
              "Student who is also an employee",
              "Disabled account",
              "Alumni",
              "Recently graduated, account still active",
              "Username not found",
            ],
            owner: "Rian Fernando",
          },
        ],
      },
      {
        id: "account-states",
        title: "Reading account state",
        minutes: 4,
        body: [
          {
            type: "paragraph",
            text: "The states matter because several of them look similar from the caller's side — 'I can't log in' is what all of them sound like — but they need completely different responses.",
          },
          {
            type: "callout",
            tone: "danger",
            title: "No result does not mean no person",
            text: "Alumni in particular may not appear the way a current student does. Treating an empty result as 'this user does not exist' is the single most common mistake in the alumni workflow.",
          },
          { type: "articleRef", slug: "alumni-account-transition" },
          {
            type: "placeholder",
            label: "What each account state looks like, and what it means",
            needs: [
              "The exact wording shown for a disabled account",
              "How an alumni account presents",
              "How a student-plus-employee user presents",
              "What is shown when a username genuinely does not exist",
            ],
          },
        ],
      },
      {
        id: "mfa-methods",
        title: "Checking MFA enrolment",
        minutes: 6,
        body: [
          {
            type: "paragraph",
            text: "Two questions come up constantly in sign-in problems: **is this user enrolled in PMT**, and **what methods do they actually have?** User Lookup answers the first two, but only a live check answers the third — whether the methods work on their end.",
          },
          { type: "heading", level: 2, text: "1. What User Lookup tells you" },
          {
            type: "fields",
            items: [
              {
                label: "Azure/PMT/SSPR",
                value: "Shows **Enrolled** when the user has enrolled in PMT. This is the first thing to check.",
              },
              {
                label: "MFA_AuthMethod_… groups",
                value: "Group membership confirms which method types the user has — for example an authenticator app, a phone number, or a passwordless method.",
              },
            ],
          },
          {
            type: "callout",
            tone: "warning",
            title: "This tells you what is on file, not what works",
            text: "A user can be enrolled with a phone number they no longer have. Enrolment on the record and access in their hand are different things, and the gap between them is where most MFA calls actually live.",
          },
          { type: "heading", level: 2, text: "2. Verifying on the user's end" },
          {
            type: "paragraph",
            text: "To see what the user sees, check it the way they would:",
          },
          {
            type: "steps",
            items: [
              {
                title: "Open a private window on your machine",
                detail: "Keeps your own session out of the way.",
              },
              {
                title: "Go to eCampus",
                detail: "portal.adelphi.edu",
              },
              {
                title: "Enter the user's Adelphi email address",
              },
              {
                title: "Go through the forgot-my-password step",
                detail: "Do not complete a reset — you are only looking at the method list it offers.",
              },
              {
                title: "Count the methods shown",
                detail: "This is what the user will be offered when they try to recover their own account.",
              },
            ],
          },
          {
            type: "callout",
            tone: "danger",
            title: "You are looking, not resetting",
            text: "This is a read-only check. Do not proceed through a password reset on a user's behalf, and never ask them to read you a code that arrives.",
          },
          { type: "heading", level: 2, text: "3. Confirming with the user" },
          {
            type: "paragraph",
            text: "Now check what is on file against what they actually have:",
          },
          {
            type: "list",
            ordered: false,
            items: [
              "Do they have the methods that are showing?",
              "If a **phone number** is listed — is it still the right number? Does it match the one showing?",
              "Do they have access to **Microsoft Authenticator**?",
              "Do they actually **receive the notification** in the app when a sign-in is attempted?",
            ],
          },
          {
            type: "callout",
            tone: "tip",
            title: "The last question is the one that finds the problem",
            text: "Enrolled, correct number, app installed — and still no notification arriving. That is a real and common situation, and you only find it by asking specifically rather than assuming the app works because it is installed.",
          },
          { type: "principle", id: "verify-the-account" },
          {
            type: "placeholder",
            label: "User Lookup — annotated MFA and PMT examples",
            needs: [
              "A sanitised screenshot showing the Azure/PMT/SSPR row",
              "A sanitised screenshot showing the MFA_AuthMethod groups",
              "A screenshot of the eCampus forgot-password method list",
              "A user who has VPN access, for comparison",
            ],
            owner: "Rian Fernando",
          },
        ],
        check: {
          id: "user-lookup-mfa-check",
          prompt:
            "User Lookup shows the user as Enrolled with a phone method on file, but they say MFA is not working. What is the most useful next step?",
          kind: "single",
          options: [
            {
              id: "verify-live",
              text: "Check the method list via the eCampus forgot-password step, then confirm with the user whether that number is still theirs and whether notifications arrive",
              correct: true,
              explanation:
                "Correct. Enrolment on the record only proves what is on file. The number may be out of date, or the notification may not be arriving — and neither shows up in User Lookup.",
            },
            {
              id: "trust-lookup",
              text: "Tell them MFA is working, since User Lookup shows they are enrolled",
              correct: false,
              explanation:
                "Enrolled means a method is registered, not that the user can still use it. This is exactly the assumption the live check exists to catch.",
            },
            {
              id: "reset-password",
              text: "Reset their password to clear the problem",
              correct: false,
              explanation:
                "This is an MFA problem, not a password problem. A reset does not change which methods are enrolled.",
            },
            {
              id: "ask-code",
              text: "Ask them to read you the code when it arrives so you can confirm it is valid",
              correct: false,
              explanation:
                "Never. A technician has no legitimate reason to hold a one-time code, in any circumstance.",
            },
          ],
        },
      },
    ],
  },

  /* ======================================================================== *
   * PMT
   * ======================================================================== */
  {
    slug: "pmt-overview",
    title: "PMT",
    summary:
      "Placeholder module. PMT is central to account and MFA troubleshooting, and its procedure has not been documented yet.",
    order: 8,
    category: "accounts",
    visibility: "staff",
    status: "draft",
    updatedAt: "2026-08-15",
    updatedBy: "Rian Fernando",
    revision: 1,
    verification: "unverified",
    prerequisites: ["user-lookup"],
    outcomes: [
      "Understand what PMT is and when the Help Desk uses it",
      "Know how User Lookup information feeds PMT troubleshooting",
    ],
    steps: [
      {
        id: "pending",
        title: "This module is not written yet",
        minutes: 1,
        body: [
          {
            type: "callout",
            tone: "warning",
            title: "Deliberately empty",
            text: "PMT comes up constantly in account and MFA work, so a half-remembered version of the procedure would get used — and would be wrong. It is left as a stub until the real workflow is provided.",
          },
          {
            type: "paragraph",
            text: "What is confirmed so far: User Lookup shows PMT enrolment on the **Azure/PMT/SSPR** row, and the `MFA_AuthMethod_…` groups show which method types are registered. Checking what the user can actually use is covered in the User Lookup module.",
          },
          { type: "articleRef", slug: "vpn-what-it-is", note: "Placeholder link — replace once PMT articles exist." },
          {
            type: "placeholder",
            label: "The PMT workflow itself",
            needs: [
              "What PMT stands for and what it does, in one paragraph",
              "When Help Desk staff use it rather than another tool",
              "How a user is verified within PMT",
              "The MFA reset procedure",
              "The account troubleshooting procedure",
              "What a technician can and cannot do without a supervisor",
            ],
            owner: "Rian Fernando",
          },
        ],
      },
    ],
  },

  /* ======================================================================== *
   * Classroom technology
   * ======================================================================== */
  {
    slug: "classroom-technology-support",
    title: "Classroom technology support",
    summary:
      "Handling a call from a room with a class in it — what to check, how to title the ticket, and how to get TSS moving.",
    order: 12,
    category: "hardware",
    visibility: "staff",
    status: "published",
    updatedAt: "2026-08-15",
    updatedBy: "Rian Fernando",
    revision: 1,
    verification: "needs-review",
    prerequisites: ["creating-a-footprints-ticket"],
    outcomes: [
      "Verify a classroom and class before troubleshooting",
      "Identify the room's technology configuration",
      "Write a classroom ticket TSS can act on immediately",
      "Escalate to TSS through the right channels",
    ],
    steps: [
      {
        id: "urgency",
        title: "Classroom calls are different",
        minutes: 3,
        body: [
          {
            type: "paragraph",
            text: "A faculty member calling from a classroom usually has students sitting in front of them. The clock is the defining feature of this call — establish immediately whether a class is running now or about to start, because it determines everything that follows.",
          },
          {
            type: "list",
            ordered: false,
            items: [
              "Is a class in session right now?",
              "Is one about to begin, and when?",
              "Which building and room?",
              "What is not working?",
            ],
          },
          { type: "principle", id: "ask-before-assuming" },
        ],
      },
      {
        id: "verify-ems",
        title: "Check EMS",
        minutes: 4,
        body: [
          {
            type: "paragraph",
            text: "Before troubleshooting, verify the booking in EMS. You are confirming three things:",
          },
          {
            type: "steps",
            items: [
              { title: "The classroom exists", detail: "And that you have the right room — building abbreviations and room numbers are easy to mishear." },
              { title: "The class exists", detail: "That something is genuinely scheduled in that room at that time." },
              { title: "The caller is associated with it", detail: "That the person on the phone is connected to the booking." },
            ],
          },
          { type: "link", linkKey: "event-scheduling-system" },
          {
            type: "placeholder",
            label: "EMS lookup procedure",
            needs: [
              "How to search EMS for a room and time",
              "What to do when the booking does not appear",
              "Whether Help Desk staff can see all bookings",
            ],
          },
        ],
      },
      {
        id: "identify-configuration",
        title: "Identify the room configuration",
        minutes: 4,
        body: [
          {
            type: "paragraph",
            text: "Rooms are not all built the same way, and the troubleshooting differs by configuration. Check the Adelphi classroom technology page to see how this specific room is set up before giving any instructions.",
          },
          {
            type: "link",
            linkKey: "classroom-technology-page",
            note: "Maintained by administrators — check here rather than relying on memory.",
          },
          { type: "heading", level: 2, text: "Configurations known to differ" },
          {
            type: "list",
            ordered: false,
            items: [
              "Desktop configuration",
              "PC located on a rack",
              "PC located in a closet",
            ],
          },
          {
            type: "callout",
            tone: "danger",
            title: "Do not guess the configuration",
            text: "Telling a faculty member to look for a machine that is not in that room, in front of a full class, is worse than saying you are checking. Confirm the layout first.",
          },
          {
            type: "placeholder",
            label: "Troubleshooting per classroom configuration",
            needs: [
              "Steps for the desktop configuration",
              "Steps for a PC on a rack",
              "Steps for a PC in a closet",
              "Any other configurations in use",
              "Which problems the Help Desk can resolve by phone versus which need TSS on site",
            ],
            owner: "Rian Fernando",
          },
        ],
      },
      {
        id: "classroom-ticket",
        title: "Writing the ticket",
        minutes: 5,
        body: [
          {
            type: "code",
            caption: "Title format — building, room, issue, two spaces, username",
            code: `NEX 135 Projector Not Working  JOHNSMITH`,
          },
          {
            type: "paragraph",
            text: "Location first, because TSS staff work from the notification and need to know **where** before anything else. It also makes these tickets far easier to find in Footprints later.",
          },
          { type: "heading", level: 2, text: "Fields" },
          {
            type: "fields",
            items: [
              { label: "Category", value: "Multimedia. This may set the assignee automatically." },
              { label: "Subcategory", value: "Whatever matches the actual issue." },
              { label: "Location Of Work To Be Done", value: "Required — this is a classroom issue." },
              { label: "Room", value: "The room number." },
            ],
          },
          { type: "heading", level: 2, text: "What the description must contain" },
          {
            type: "list",
            ordered: false,
            items: [
              "Room and building",
              "The issue, specifically",
              "The user or professor",
              "Troubleshooting already performed, and what it did",
              "Whether TSS has been notified",
              "Urgency — **is a class in session, or about to start?**",
              "Anything else the responding technician needs to avoid starting from zero",
            ],
          },
          {
            type: "callout",
            tone: "info",
            title: "Write it for someone walking to the room",
            text: "The person reading this is about to pick up their keys. Everything they need should be in the ticket, because they may not be able to reach you on the way.",
          },
          {
            type: "placeholder",
            label: "Multimedia subcategory values",
            needs: ["The subcategory list under the Multimedia category"],
          },
        ],
      },
      {
        id: "tss-handoff",
        title: "Getting TSS moving",
        minutes: 4,
        body: [
          {
            type: "callout",
            tone: "warning",
            title: "Check the assignees before saving",
            text: "Some classroom workflows arrive with **+Communications** already in the Assignees box. Where the workflow requires it, remove Communications and make sure the appropriate TSS or Lab Consultant assignee is the one left selected — otherwise the notification goes to the wrong team while the class waits.",
          },
          { type: "heading", level: 2, text: "Then tag TSS on Discord" },
          {
            type: "paragraph",
            text: "Ticket alone is not enough for something time-critical. Tag **@TSS** on Discord with:",
          },
          {
            type: "list",
            ordered: false,
            items: [
              "Building",
              "Room number",
              "A brief description of the issue",
              "Troubleshooting already performed",
              "Why TSS assistance is needed",
              "The Footprints ticket number, if you have it",
            ],
          },
          {
            type: "callout",
            tone: "danger",
            title: "Have the ticket ready first",
            text: "The Footprints ticket should already exist, or be complete enough to be useful, before TSS arrives. They need something to reference and update — arriving to find no ticket means they start by asking you the questions you already asked the caller.",
          },
          { type: "principle", id: "assign-correctly" },
          {
            type: "placeholder",
            label: "The TSS workflow",
            needs: [
              "Which assignee group is correct for TSS / Lab Consultants",
              "When Communications should and should not be removed",
              "Dispatch and response expectations",
              "Escalation path when TSS is unavailable",
            ],
            owner: "Rian Fernando",
          },
        ],
        check: {
          id: "classroom-tss",
          prompt:
            "A projector is dead in a room with a class starting in five minutes. You have troubleshot what you can by phone. What is the right sequence?",
          kind: "single",
          options: [
            {
              id: "ticket-then-discord",
              text: "Create the Footprints ticket with the room, issue, troubleshooting and urgency, check the assignees are correct, then tag @TSS on Discord with the ticket number",
              correct: true,
              explanation:
                "Correct. TSS arrives with somewhere to reference and update, and the Discord tag gets them moving immediately rather than waiting on a notification.",
            },
            {
              id: "discord-only",
              text: "Tag @TSS on Discord straight away and create the ticket afterwards when there is time",
              correct: false,
              explanation:
                "Speed is right, but TSS turns up with nothing to reference and no record of what you already tried — so they repeat it.",
            },
            {
              id: "ticket-only",
              text: "Create the ticket and let the notification reach TSS",
              correct: false,
              explanation:
                "Too slow for a class starting in five minutes, and it assumes the assignees are already correct.",
            },
            {
              id: "escalate-supervisor",
              text: "Escalate to a supervisor to decide who should go",
              correct: false,
              explanation:
                "Adds a hop for a situation with a documented path. Follow the workflow.",
            },
          ],
        },
      },
    ],
  },

  /* ======================================================================== *
   * Guest accounts
   * ======================================================================== */
  {
    slug: "guest-account-workflow",
    title: "Guest account requests",
    summary:
      "Creating a guest account ticket, verifying identity with photo ID, and handling credentials without ever writing them down in the wrong place.",
    order: 13,
    category: "accounts",
    visibility: "staff",
    status: "published",
    updatedAt: "2026-08-15",
    updatedBy: "Rian Fernando",
    revision: 1,
    verification: "needs-review",
    prerequisites: ["creating-a-footprints-ticket"],
    outcomes: [
      "Run the guest account workflow from the correct template",
      "Verify identity with an acceptable form of ID",
      "Handle guest credentials without exposing them",
    ],
    steps: [
      {
        id: "template-and-details",
        title: "Start from the template",
        minutes: 4,
        body: [
          {
            type: "paragraph",
            text: "Use the **Guest AUig Account** template in Footprints. It sets up the issue information and description structure the workflow expects — do not build a guest ticket from a blank issue.",
          },
          { type: "heading", level: 2, text: "Collect" },
          {
            type: "list",
            ordered: false,
            items: ["First name", "Last name", "Phone number"],
          },
          {
            type: "callout",
            tone: "info",
            title: "Keep the description to what the template asks for",
            text: "The description should contain the information the workflow needs and nothing beyond it.",
          },
        ],
      },
      {
        id: "verify-id",
        title: "Verify identity with photo ID",
        minutes: 3,
        body: [
          {
            type: "paragraph",
            text: "Verify the person using an acceptable valid photo ID:",
          },
          {
            type: "list",
            ordered: false,
            items: ["Student ID", "Driver's licence", "Passport"],
          },
          {
            type: "callout",
            tone: "danger",
            title: "Look, confirm, record nothing",
            text: "Do not write down ID numbers, do not photograph the document, and do not attach an image of it to the ticket. You are confirming the person in front of you matches the request — that is all.",
          },
          { type: "principle", id: "protect-user-information" },
        ],
      },
      {
        id: "credentials",
        title: "Handling the credentials",
        minutes: 5,
        body: [
          {
            type: "paragraph",
            text: "Guest account credentials come from the authorised internal AUig sheet, which is supervisor-controlled.",
          },
          {
            type: "steps",
            items: [
              { title: "Obtain the appropriate guest account information from the authorised sheet" },
              { title: "Add the required username and password information to the authorised Footprints workflow" },
              { title: "Once the ticket is closed and the password has been provided, remove the password from the internal sheet", detail: "This follows the supervisor-controlled process." },
            ],
          },
          {
            type: "callout",
            tone: "danger",
            title: "Credentials never enter learnIT",
            text: "No real usernames, no passwords, no copies of the AUig sheet — not in learnIT, not in a note, not in a message. learnIT teaches the workflow; the credentials live only in the authorised systems.",
          },
          {
            type: "callout",
            tone: "warning",
            title: "Put the username in the title and description",
            text: "The supervisor needs to know which account requires action after closure. If the username is not clearly recorded in both places, the follow-up step cannot happen.",
          },
          {
            type: "placeholder",
            label: "Guest account — the supervisor removal step",
            needs: [
              "Who removes the password from the sheet",
              "How the Help Desk confirms it has been done",
              "The expected timeframe",
            ],
          },
          {
            type: "placeholder",
            label: "The Guest AUig Account template",
            needs: [
              "A sanitised screenshot of the template",
              "Which fields it pre-fills",
              "The exact description structure it expects",
            ],
            owner: "Rian Fernando",
          },
        ],
        check: {
          id: "guest-credentials",
          prompt: "Where may guest account credentials be recorded?",
          kind: "single",
          options: [
            {
              id: "authorised-only",
              text: "Only in the authorised Footprints workflow and the supervisor-controlled internal sheet",
              correct: true,
              explanation:
                "Correct. Those are the authorised systems. Nothing gets copied out of them — not into learnIT, not into notes, not into chat.",
            },
            {
              id: "learnit",
              text: "In learnIT, so the next technician can find them quickly",
              correct: false,
              explanation:
                "Never. learnIT documents the workflow and holds no credentials of any kind.",
            },
            {
              id: "ticket-only",
              text: "Anywhere, as long as the ticket is closed afterwards",
              correct: false,
              explanation:
                "Closing a ticket does not remove what was written in it. Ticket text is retained and searchable.",
            },
            {
              id: "email",
              text: "In an email to the guest so they have a record",
              correct: false,
              explanation:
                "Follow the authorised workflow for providing credentials rather than inventing a delivery method.",
            },
          ],
        },
      },
    ],
  },

  /* ======================================================================== *
   * Alumni accounts
   * ======================================================================== */
  {
    slug: "alumni-account-workflow",
    title: "Alumni account re-enablement",
    summary:
      "The full alumni workflow — why lookup behaves differently, verifying graduation in SAAS, building the ticket, and handling the three subtickets it generates.",
    order: 14,
    category: "accounts",
    visibility: "staff",
    status: "published",
    updatedAt: "2026-08-15",
    updatedBy: "Rian Fernando",
    revision: 1,
    verification: "needs-review",
    prerequisites: ["user-lookup", "creating-a-footprints-ticket"],
    outcomes: [
      "Recognise why alumni do not behave like current users in lookup",
      "Verify graduation before telling anyone they are an alumnus",
      "Handle the case where there is no graduation record",
      "Complete the alumni ticket and its three subtickets",
    ],
    steps: [
      {
        id: "why-different",
        title: "Why alumni are different",
        minutes: 4,
        body: [
          {
            type: "paragraph",
            text: "Alumni are no longer current students or employees, so they may not populate through normal Footprints autofill the way a current user does.",
          },
          {
            type: "callout",
            tone: "danger",
            title: "No Footprints result does not mean the user does not exist",
            text: "This is the mistake that derails the whole workflow. An empty autofill is expected for alumni — it tells you nothing about whether the person is real. Use the approved user lookup process instead.",
          },
          { type: "principle", id: "investigate-dont-guess" },
        ],
      },
      {
        id: "lookup",
        title: "Check the username",
        minutes: 3,
        body: [
          {
            type: "paragraph",
            text: "Look the username up. For a disabled alumni account it will show a status indicating the account is not active.",
          },
          {
            type: "callout",
            tone: "warning",
            title: "Exact wording not confirmed",
            text: "The precise message shown for a disabled account has not been documented. Do not paraphrase it in a ticket — copy what the system actually says.",
          },
          {
            type: "placeholder",
            label: "User Lookup — disabled alumni account",
            needs: [
              "A sanitised screenshot",
              "The exact status wording shown",
            ],
            owner: "Rian Fernando",
          },
        ],
      },
      {
        id: "saas-verification",
        title: "Verify in SAAS",
        minutes: 6,
        body: [
          {
            type: "paragraph",
            text: "Use the approved SAAS process. The current workflow uses **Option 6**.",
          },
          { type: "heading", level: 2, text: "Searching" },
          {
            type: "list",
            ordered: false,
            items: [
              "ID number",
              "A fragment of the first name",
              "A fragment of the last name",
            ],
          },
          {
            type: "paragraph",
            text: "The system may return a selection to choose from. Select the correct user, then verify identity using appropriate information such as date of birth or ZIP code.",
          },
          {
            type: "callout",
            tone: "danger",
            title: "A matching name is not the right person",
            text: "This is the highest-risk moment in the workflow. Two people can share a name. Verify with the additional identifying information before proceeding — you are about to act on someone's account.",
          },
          {
            type: "callout",
            tone: "warning",
            title: "Confirm verbally, do not transcribe",
            text: "Date of birth, ZIP, and similar identifiers are confirmed verbally against the system. Do not copy them into the ticket description — the ticket does not need them and they should not be sitting in retained, searchable text.",
          },
          { type: "principle", id: "protect-user-information" },
          {
            type: "placeholder",
            label: "SAAS Option 6 screens",
            needs: [
              "The search screen",
              "The result selection screen",
              "Where identity verification information appears",
            ],
            owner: "Rian Fernando",
          },
        ],
        check: {
          id: "alumni-saas-verify",
          prompt:
            "In SAAS you search a surname and get three people with the same name. What do you do?",
          kind: "single",
          options: [
            {
              id: "verify-additional",
              text: "Verify with additional identifying information such as date of birth or ZIP before selecting",
              correct: true,
              explanation:
                "Correct. A name match is not identification, and you are about to change someone's account access.",
            },
            {
              id: "pick-closest",
              text: "Select the one whose details look closest to what the caller said",
              correct: false,
              explanation:
                "'Looks closest' is a guess. Verify it properly — the cost of being wrong here is acting on a stranger's account.",
            },
            {
              id: "ask-username",
              text: "Ask the caller which one they are",
              correct: false,
              explanation:
                "The caller cannot see the list, and asking them to confirm which record is theirs inverts the verification.",
            },
            {
              id: "escalate",
              text: "Escalate, since duplicate names cannot be resolved at first contact",
              correct: false,
              explanation:
                "They can — that is exactly what the additional verification information is for.",
            },
          ],
        },
      },
      {
        id: "graduation-status",
        title: "Check the graduation record",
        minutes: 5,
        body: [
          {
            type: "paragraph",
            text: "Within SAAS Option 6, review the graduation information. It may show a graduation year, a degree, or a graduation record — for example a bachelor's or master's degree with the associated year.",
          },
          { type: "heading", level: 2, text: "No graduation record" },
          {
            type: "paragraph",
            text: "An absent record has more than one explanation, and they lead to different outcomes:",
          },
          {
            type: "fields",
            items: [
              { label: "They did not graduate", value: "The person may simply have left Adelphi without completing." },
              { label: "The record has not caught up", value: "They graduated recently and the information has not been updated yet." },
            ],
          },
          {
            type: "callout",
            tone: "danger",
            title: "Do not tell someone they are an alumnus until it is confirmed",
            text: "With no graduation record you cannot tell which of those two situations you are in. Direct the user to One Stop rather than guessing — getting this wrong sets an expectation that someone else has to take away.",
          },
          {
            type: "placeholder",
            label: "SAAS graduation status screen",
            needs: [
              "A sanitised screenshot of the graduation record",
              "How to tell a completed degree from an in-progress one",
              "What One Stop needs from the user when you redirect them",
            ],
            owner: "Rian Fernando",
          },
        ],
      },
      {
        id: "create-ticket",
        title: "Creating the alumni ticket",
        minutes: 6,
        body: [
          {
            type: "paragraph",
            text: "With graduation confirmed, create the ticket from the **Alumni Account** template.",
          },
          { type: "heading", level: 2, text: "Collect and verify" },
          {
            type: "list",
            ordered: false,
            items: [
              "First name",
              "Last name",
              "Phone number",
              "**Secondary email** — verify this carefully",
            ],
          },
          {
            type: "callout",
            tone: "warning",
            title: "The secondary email carries the whole workflow",
            text: "It may be how the re-enablement communication reaches them, and it is the one address that still works once the Adelphi account is disabled. Read it back to the user before saving.",
          },
          { type: "heading", level: 2, text: "The description" },
          {
            type: "list",
            ordered: false,
            items: [
              "Name",
              "Address",
              "ID",
              "Username",
              "Secondary email",
              "Phone number",
              "Alumni card status",
            ],
          },
          {
            type: "callout",
            tone: "info",
            title: "Alumni card",
            text: "Ask the user. If they do not have one, record the appropriate 'No' response rather than leaving the field blank — a blank field looks like it was missed.",
          },
          {
            type: "callout",
            tone: "tip",
            title: "Addresses should be accurate",
            text: "Where necessary, confirm an address using an appropriate address verification service. A wrong address on an alumni record is a problem that surfaces months later.",
          },
          {
            type: "placeholder",
            label: "The Alumni Account template",
            needs: [
              "A sanitised screenshot",
              "The exact description structure",
              "Default assignees and CC recipients",
              "Which notification checkbox alerts the supervisor",
            ],
            owner: "Rian Fernando",
          },
        ],
      },
      {
        id: "no-user-message",
        title: "When SAAS shows no user",
        minutes: 3,
        body: [
          {
            type: "paragraph",
            text: "Sometimes the username does not exist and SAAS displays a message to that effect.",
          },
          {
            type: "callout",
            tone: "warning",
            title: "Copy the message exactly",
            text: "Put the exact wording SAAS shows into the Footprints description. The ticket should match what the system said as closely as possible — a paraphrase loses the detail that whoever picks this up needs.",
          },
          {
            type: "placeholder",
            label: "The exact SAAS 'NO USER' message",
            needs: ["A screenshot or the verbatim wording"],
            owner: "Rian Fernando",
          },
        ],
      },
      {
        id: "subtickets",
        title: "The three subtickets",
        minutes: 6,
        body: [
          {
            type: "paragraph",
            text: "Saving the alumni ticket generates three related subtickets. Each needs handling differently.",
          },
          { type: "heading", level: 2, text: "1. Graduation" },
          {
            type: "steps",
            items: [
              { title: "Update the username in the title" },
              { title: "Add a concise confirmation", detail: "Along the lines of: Graduation of user confirmed. Closing." },
              { title: "Uncheck the unnecessary notification options", detail: "Nobody needs an email because a subticket was closed." },
              { title: "Close the ticket" },
            ],
          },
          { type: "heading", level: 2, text: "2. Directory Services" },
          {
            type: "steps",
            items: [
              { title: "Update the title with the correct username" },
              { title: "Copy in the relevant User Lookup summary" },
              { title: "Add a clear instruction above it", detail: "Making it unambiguous that the account should be re-enabled." },
            ],
          },
          {
            type: "callout",
            tone: "warning",
            title: "Exact wording not finalised",
            text: "The instruction should read clearly — something to the effect of asking for the account to be re-enabled — but the official phrasing has not been confirmed.",
          },
          { type: "heading", level: 2, text: "3. Library Services" },
          {
            type: "paragraph",
            text: "Leave the existing content as the workflow provides it. The title may be updated with the correct username.",
          },
          { type: "principle", id: "notify-deliberately" },
          {
            type: "placeholder",
            label: "Subticket handling detail",
            needs: [
              "The official wording for the Directory Services request",
              "Which notification options to uncheck on each subticket",
              "Whether the Library Services subticket ever needs editing",
            ],
          },
        ],
      },
      {
        id: "setting-expectations",
        title: "What to tell the user",
        minutes: 3,
        body: [
          {
            type: "paragraph",
            text: "Where appropriate, users can be told that re-enablement may take **24–48 hours**.",
          },
          {
            type: "callout",
            tone: "info",
            title: "This timeframe is editable content, not a rule in the code",
            text: "If Adelphi changes it, an administrator updates it here. Nothing in the application depends on the number.",
          },
          {
            type: "callout",
            tone: "warning",
            title: "Not yet confirmed as current",
            text: "24–48 hours is recorded from the workflow as described. It should be verified before technicians commit to it with users.",
          },
        ],
      },
      {
        id: "still-active",
        title: "Recently graduated, account still working",
        minutes: 4,
        body: [
          {
            type: "paragraph",
            text: "Sometimes a user has graduated recently and their account still works, but they want it transitioned to alumni status. User Lookup will show them normally rather than as an obviously disabled account.",
          },
          {
            type: "callout",
            tone: "danger",
            title: "An active account does not mean a current student",
            text: "The account still working tells you nothing about their enrolment status. Verify graduation through the approved system exactly as you would for a disabled account.",
          },
          {
            type: "paragraph",
            text: "The general workflow is similar, but the starting signal is different — you are working from the user's request rather than from a failed sign-in.",
          },
          {
            type: "placeholder",
            label: "Recently-graduated-but-active workflow differences",
            needs: [
              "Whether the same Alumni Account template applies",
              "Whether the subtickets differ",
              "What to tell the user about when their current access ends",
            ],
          },
        ],
        check: {
          id: "alumni-active-account",
          prompt:
            "A user says they graduated in May and want their account moved to alumni status. Their account still signs in normally. What do you do?",
          kind: "single",
          options: [
            {
              id: "verify-graduation",
              text: "Verify graduation through the approved system, exactly as you would for a disabled account",
              correct: true,
              explanation:
                "Correct. A working account tells you nothing about enrolment status — it may simply not have been processed yet.",
            },
            {
              id: "assume-current",
              text: "Explain that since the account works, they are still a current student",
              correct: false,
              explanation:
                "The account working is not evidence of enrolment. This is precisely the assumption the branch exists to prevent.",
            },
            {
              id: "disable-first",
              text: "Have the account disabled first so the alumni workflow can run normally",
              correct: false,
              explanation:
                "Removing someone's working access to make a workflow tidier is not an acceptable trade.",
            },
            {
              id: "one-stop",
              text: "Send them to One Stop",
              correct: false,
              explanation:
                "One Stop is for when graduation cannot be confirmed. Check the record first — it may be right there.",
            },
          ],
        },
      },
    ],
  },
];
