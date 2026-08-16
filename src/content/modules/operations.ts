import type { TrainingModule } from "@/lib/content/schema";

/**
 * Core operational modules: identity verification, Footprints ticket creation,
 * and email handling.
 *
 * Structure below is drawn from the Footprints "New Issue for IT" form itself,
 * so field names and tab names match what a technician sees. Anything that
 * could not be read from the form — the category list, the full assignee list —
 * is a `placeholder` block rather than a plausible guess.
 */
export const operationsModules: TrainingModule[] = [
  /* ======================================================================== *
   * Identity and accounts
   * ======================================================================== */
  {
    slug: "identity-and-accounts",
    title: "Identity and accounts",
    summary:
      "Establishing who you are speaking to, which of their accounts is affected, and what to collect before you touch anything.",
    order: 1,
    category: "accounts",
    visibility: "staff",
    status: "published",
    updatedAt: "2026-08-15",
    updatedBy: "Rian Fernando",
    revision: 1,
    verification: "needs-review",
    prerequisites: ["help-desk-fundamentals"],
    outcomes: [
      "Establish identity and account before troubleshooting anything",
      "Recognise when a user holds more than one Adelphi account",
      "Run a complete call intake without it feeling like an interrogation",
      "Capture a property tag correctly",
    ],
    steps: [
      {
        id: "one-person-many-accounts",
        title: "A person is not an account",
        minutes: 5,
        body: [
          {
            type: "paragraph",
            text: "The most expensive assumption at the Help Desk is that you already know which account someone is talking about. A person can hold a student account, an employee account, or both — and the two behave completely differently.",
          },
          {
            type: "callout",
            tone: "danger",
            title: "Do not assume the account",
            text: "Someone can be a student **and** faculty, or a student **and** staff, with separate accounts for each role. Confirm which account is experiencing the problem before you do anything else. Fixing the account they did not ask about looks, to them, like the problem is unfixable.",
          },
          { type: "heading", level: 2, text: "Six things to establish" },
          {
            type: "steps",
            items: [
              { title: "Who is the user?", detail: "Verified through the approved process — not just the name on the caller ID." },
              { title: "What role or roles do they hold?", detail: "Student, faculty, staff, alumni, sponsored guest — and possibly more than one." },
              { title: "Which account is having the problem?" },
              { title: "What username are they actually typing?", detail: "Ask them to spell it. Do not infer it from their name." },
              { title: "Which system are they trying to reach?" },
              { title: "Is this their student account or their employee account?" },
            ],
          },
          {
            type: "callout",
            tone: "warning",
            title: "Familiar is not the same as verified",
            text: "A username that looks right, a name you recognise, an account type you assumed from the phone number — none of those are verification. Check it against the system.",
          },
          { type: "principle", id: "verify-the-account" },
          {
            type: "placeholder",
            label: "The approved identity verification process",
            needs: [
              "What a technician must ask to verify a caller",
              "What to do when verification cannot be completed",
              "Whether the process differs for students, employees, alumni, and guests",
            ],
            owner: "Help Desk leadership",
          },
        ],
        check: {
          id: "identity-multi-account",
          prompt:
            "A caller says they cannot sign in. You recognise the name — they teach in your department and you have helped them before. What do you do first?",
          kind: "single",
          options: [
            {
              id: "verify-and-ask-which",
              text: "Verify them through the approved process, then ask which account and which system",
              correct: true,
              explanation:
                "Correct on both counts. Recognising someone is not verification, and a faculty member may well hold a student account too — so 'cannot sign in' is not yet a specific problem.",
            },
            {
              id: "assume-faculty",
              text: "Start troubleshooting their faculty account, since that is the one you know they have",
              correct: false,
              explanation:
                "This is exactly the assumption the module is about. They may be trying to reach something on a student account, and you would be troubleshooting the wrong one.",
            },
            {
              id: "skip-verification",
              text: "Skip verification because you already know who they are",
              correct: false,
              explanation:
                "Familiarity is not verification. The process protects the account holder, and it protects you.",
            },
            {
              id: "reset-password",
              text: "Reset their password to rule it out",
              correct: false,
              explanation:
                "Acting before diagnosing. You do not yet know which account, which system, or what the error actually says.",
            },
          ],
        },
      },
      {
        id: "call-intake",
        title: "Running the intake",
        minutes: 6,
        body: [
          {
            type: "paragraph",
            text: "Think in five questions — **where, when, why, how, what**. They are quick to ask, they sound like interest rather than interrogation, and between them they capture nearly everything a ticket needs.",
          },
          { type: "checklistRef", slug: "call-intake" },
          {
            type: "callout",
            tone: "tip",
            title: "Ask for the error word for word",
            text: "“Some kind of certificate error” and the actual error string are worth very different amounts. Ask them to read it out, and type it exactly as they say it.",
          },
          {
            type: "callout",
            tone: "info",
            title: "Check history before troubleshooting",
            text: "Look at the user's previous tickets in Footprints. Someone may have already solved this — or already tried the thing you are about to try.",
          },
          { type: "principle", id: "ask-before-assuming" },
        ],
      },
      {
        id: "property-tags",
        title: "Property tags",
        minutes: 3,
        body: [
          {
            type: "paragraph",
            text: "When the issue involves Adelphi-owned equipment, ask for the property tag. It identifies exactly which physical device you are dealing with, which matters when the ticket reaches someone who has to go and find it.",
          },
          {
            type: "fields",
            items: [
              { label: "What it says", value: "Property of Adelphi University" },
              { label: "What to record", value: "The five-digit tag number" },
            ],
          },
          {
            type: "code",
            caption: "Example — fictional tag",
            code: `PROPERTY OF
ADELPHI UNIVERSITY
    04217`,
          },
          {
            type: "callout",
            tone: "warning",
            title: "Konica devices are the exception",
            text: "Konica multifunction printers are not handled through the standard Adelphi-tagged equipment workflow. Do not apply the property tag process to them.",
          },
          { type: "articleRef", slug: "konica-device-redirect" },
        ],
        check: {
          id: "identity-property-tag",
          prompt: "When should you ask for a property tag?",
          kind: "single",
          options: [
            {
              id: "adelphi-owned",
              text: "When the issue involves Adelphi-owned equipment",
              correct: true,
              explanation:
                "Correct. It identifies the specific physical device for whoever has to work on it.",
            },
            {
              id: "always",
              text: "On every ticket, without exception",
              correct: false,
              explanation:
                "A personal laptop has no Adelphi tag, and asking for one just confuses the caller.",
            },
            {
              id: "konica",
              text: "Especially on Konica printers, since they are large shared devices",
              correct: false,
              explanation:
                "Konica devices are specifically the exception — they are not part of the standard tagged-equipment workflow.",
            },
            {
              id: "hardware-only",
              text: "Only when the device needs to be physically replaced",
              correct: false,
              explanation:
                "Record it whenever Adelphi equipment is involved. Whoever picks the ticket up may need to locate the device for reasons you cannot predict.",
            },
          ],
        },
      },
    ],
  },

  /* ======================================================================== *
   * Creating a Footprints ticket
   * ======================================================================== */
  {
    slug: "creating-a-footprints-ticket",
    title: "Creating a Footprints ticket",
    summary:
      "The New Issue form tab by tab — contact, issue information, description, assignees, and attachments — and the checks that go with each.",
    order: 3,
    category: "ticketing",
    visibility: "staff",
    status: "published",
    updatedAt: "2026-08-15",
    updatedBy: "Rian Fernando",
    revision: 1,
    verification: "needs-review",
    prerequisites: ["identity-and-accounts", "tickets-and-documentation"],
    outcomes: [
      "Navigate the New Issue form and know what each tab is for",
      "Write a title that is findable six months later",
      "Select the correct contact rather than the first matching name",
      "Route a ticket to the right assignee with the right notifications",
    ],
    steps: [
      {
        id: "form-layout",
        title: "The form, tab by tab",
        minutes: 5,
        body: [
          {
            type: "paragraph",
            text: "A new ticket opens as **New Issue for IT**. Title, Priority, and Status sit at the top and stay visible; everything else is behind the tabs down the left. Fields marked with a red asterisk are required.",
          },
          {
            type: "fields",
            items: [
              { label: "Contact Information", value: "Who the ticket is for. Last name, first name, User ID, phone, department, location, secondary email." },
              { label: "Issue Information", value: "What kind of issue it is. Inquiry, Category, Division, Location of Work To Be Done, Room, Primary Assignee." },
              { label: "Description", value: "The account of what happened. Rich text, with Insert Quick Description and Search Knowledge Base above it." },
              { label: "Assignees and Notifications", value: "Who works it, and who gets emailed." },
              { label: "Attachments", value: "Files. Screenshots and documents belong here, not pasted into the description." },
              { label: "Time Tracking", value: "Time recorded against the ticket." },
            ],
          },
          {
            type: "callout",
            tone: "tip",
            title: "Start from a template when one fits",
            text: "The dropdown at the top right pre-fills a new issue from a template — Alumni Account and Guest AUig Account among them. Selecting the right template first saves re-typing the description and usually sets the assignees for you.",
          },
          {
            type: "placeholder",
            label: "Which templates the Help Desk actually uses",
            needs: [
              "The remainder of the template dropdown below 'Account Disabled for Security'",
              "Which templates are Help Desk workflows versus other teams'",
            ],
          },
        ],
      },
      {
        id: "title",
        title: "Writing the title",
        minutes: 4,
        body: [
          {
            type: "paragraph",
            text: "The title is what everyone sees in a queue, a search result, and a notification. It should be short, specific, and consistent — so that someone searching Footprints in six months actually finds it.",
          },
          { type: "heading", level: 2, text: "General tickets" },
          {
            type: "code",
            caption: "Issue, then two spaces, then the username",
            code: `Issue Title  USERNAME`,
          },
          {
            type: "code",
            caption: "Examples — fictional usernames",
            code: `Cannot Sign In To Email  JSMITH01
VPN Fails At Authentication  ADOE22
Printer Not Releasing Jobs  MCHEN`,
          },
          {
            type: "callout",
            tone: "info",
            title: "Why two spaces",
            text: "The double space is a consistent separator, which makes the username reliably findable when searching — and keeps titles looking uniform in a long queue.",
          },
          { type: "heading", level: 2, text: "Classroom tickets" },
          {
            type: "paragraph",
            text: "Classroom technology tickets lead with the location, because the person receiving the notification needs to know **where** before anything else.",
          },
          {
            type: "code",
            caption: "Building, room, issue, two spaces, username",
            code: `NEX 135 Projector Not Working  JOHNSMITH`,
          },
          {
            type: "paragraph",
            text: "Reading left to right that gives **location → room → problem → user**, which is exactly the order a TSS technician needs it in.",
          },
          { type: "principle", id: "document-what-you-did" },
        ],
        check: {
          id: "footprints-title",
          prompt: "Which classroom ticket title follows the format?",
          kind: "single",
          options: [
            {
              id: "correct",
              text: "NEX 135 Projector Not Working  JOHNSMITH",
              correct: true,
              explanation:
                "Building, room, issue, two spaces, username. A TSS technician sees the location first, which is what they need.",
            },
            {
              id: "user-first",
              text: "JOHNSMITH — Projector issue in NEX 135",
              correct: false,
              explanation:
                "The username leads, so the location is buried. The person being dispatched has to read the whole title to find where to go.",
            },
            {
              id: "vague",
              text: "Classroom issue  JOHNSMITH",
              correct: false,
              explanation:
                "No building, no room, no description of the problem. This tells a responder nothing actionable.",
            },
            {
              id: "no-username",
              text: "NEX 135 Projector Not Working",
              correct: false,
              explanation:
                "Correct up to the username, which is missing — so the ticket cannot be found by searching for the user.",
            },
          ],
        },
      },
      {
        id: "contact",
        title: "Selecting the right contact",
        minutes: 4,
        body: [
          {
            type: "paragraph",
            text: "Footprints will happily offer you several people with the same name. Selecting the first match is one of the most common mistakes on a new technician's tickets.",
          },
          {
            type: "callout",
            tone: "danger",
            title: "Seeing “Mark” does not mean it is the right Mark",
            text: "Check the surname, the User ID, and the callback number before you commit. A ticket raised against the wrong person is difficult to unpick and exposes one user's issue in another user's history.",
          },
          {
            type: "list",
            ordered: false,
            items: [
              "First name **and** last name",
              "User ID — the definitive field",
              "Callback number",
              "Department, where it helps distinguish",
            ],
          },
          {
            type: "callout",
            tone: "tip",
            title: "Ask for a second number",
            text: "If only an office number is on file, ask whether there is a better number to reach them on. It costs one question and saves the ticket stalling when they are away from their desk.",
          },
          { type: "principle", id: "verify-the-user" },
        ],
      },
      {
        id: "issue-information",
        title: "Issue information",
        minutes: 4,
        body: [
          {
            type: "paragraph",
            text: "This tab is how the ticket gets classified and routed. Category and Division are required; Location of Work To Be Done becomes required depending on the issue.",
          },
          {
            type: "callout",
            tone: "warning",
            title: "Location of Work To Be Done",
            text: "Footprints states on the form: **required for all classroom and physical hardware issues.** If someone has to physically go somewhere, this field is not optional.",
          },
          {
            type: "fields",
            items: [
              { label: "Inquiry", value: "How the request reached you. Defaults to Phone." },
              { label: "Category", value: "Required. Can change which team the ticket routes to." },
              { label: "Division", value: "Required. Defaults to OITR." },
              { label: "Location Of Work To Be Done", value: "Required for classroom and physical hardware issues." },
              { label: "Room", value: "Free text, alongside the location." },
              { label: "Primary Assignee", value: "Can be set here as well as on the Assignees tab." },
            ],
          },
          {
            type: "placeholder",
            label: "The Footprints category and subcategory lists",
            needs: [
              "The full Category dropdown",
              "Subcategory values for each category",
              "Which categories change the assignee automatically",
            ],
            owner: "Help Desk leadership",
          },
          {
            type: "callout",
            tone: "info",
            title: "Category is part of troubleshooting",
            text: "It is not filing. The category can determine which team sees the ticket, so choosing the convenient option rather than the correct one sends the user's problem to the wrong queue.",
          },
        ],
      },
      {
        id: "description",
        title: "Writing the description",
        minutes: 5,
        body: [
          {
            type: "paragraph",
            text: "The description is the ticket. Everything else is metadata. It should let someone who was not on the call pick this up and continue without guessing.",
          },
          {
            type: "steps",
            items: [
              { title: "What the user reported", detail: "In their words, with the error text verbatim." },
              { title: "Relevant user information", detail: "Account type, device, location, and what they were trying to do." },
              { title: "Troubleshooting performed", detail: "And the result of each thing you tried — including what did not work." },
              { title: "Next steps", detail: "What should happen now." },
              { title: "Escalation detail", detail: "When escalating: why, what has been tried, and what the receiving team needs to do.", },
            ],
          },
          {
            type: "callout",
            tone: "info",
            title: "Say “user” or “customer”, and stay consistent",
            text: "Pick one and use it throughout. Mixed terminology across a ticket thread reads as careless and makes tickets harder to skim.",
          },
          {
            type: "callout",
            tone: "tip",
            title: "Two shortcuts worth knowing",
            text: "**Insert Quick Description** drops in a saved block of text. **Search Knowledge Base** searches documented solutions without leaving the ticket.",
          },
          {
            type: "callout",
            tone: "danger",
            title: "Never record credentials",
            text: "No passwords, no one-time codes, no security answers — not even temporarily. Ticket text is retained, searchable, and read by many people.",
          },
          { type: "principle", id: "protect-user-information" },
        ],
      },
      {
        id: "assignees-notifications",
        title: "Assignees and notifications",
        minutes: 5,
        body: [
          {
            type: "paragraph",
            text: "The Assignees tab has two halves. On the left, **Workspace Members** — every group, prefixed with `+`. Move the ones that should own this ticket into **Assignees** on the right. On the far right, **Send Email To** controls who is actually notified.",
          },
          {
            type: "fields",
            items: [
              { label: "Customer Experience", value: "The default assignee for general Help Desk issues." },
              { label: "Another IT team", value: "When the issue belongs to a specialist group." },
              { label: "Another department", value: "When it is not an IT issue at all." },
            ],
          },
          { type: "heading", level: 2, text: "Send Email To" },
          {
            type: "list",
            ordered: false,
            items: [
              "**Assignees** — the group or person picking it up.",
              "**Contact** — the user. Leave on when they need to know something; turn off when they do not.",
              "**CC** — anyone else who needs to follow the thread. Useful on email threads involving several people.",
              "**Send Survey to Customer** — leave alone unless the workflow calls for it.",
            ],
          },
          {
            type: "callout",
            tone: "warning",
            title: "Uncheck notifications when you are only closing a ticket",
            text: "If nothing about the closure needs communicating, do not send an email about it. Unnecessary notifications train people to ignore ticket email — including the one that mattered.",
          },
          {
            type: "callout",
            tone: "danger",
            title: "Some templates arrive with an assignee already set",
            text: "Check what is in the Assignees box before saving. Certain workflows require removing a default group so the notification reaches the right team instead — the classroom workflow is the clearest example.",
          },
          { type: "principle", id: "notify-deliberately" },
          {
            type: "placeholder",
            label: "The full assignee group list, and what each one handles",
            needs: [
              "The complete Workspace Members list",
              "Which group handles which issue type",
              "The TSS / Lab Consultant entries used by the classroom workflow",
            ],
          },
        ],
        check: {
          id: "footprints-notifications",
          prompt:
            "You are closing a ticket that was resolved on the phone. The user already knows it is fixed. What should you do with the notification checkboxes?",
          kind: "single",
          options: [
            {
              id: "uncheck",
              text: "Uncheck them, so closing the ticket does not send another email nobody needs",
              correct: true,
              explanation:
                "Correct. The user already knows. An extra email adds nothing and erodes attention for the notifications that do matter.",
            },
            {
              id: "leave-default",
              text: "Leave them as they are — the defaults are usually right",
              correct: false,
              explanation:
                "The defaults are right for a new ticket, not for a silent closure. Review them deliberately every time.",
            },
            {
              id: "check-all",
              text: "Check everything, so there is a complete record",
              correct: false,
              explanation:
                "The record lives in the ticket regardless of who was emailed. Notifications are for people who need to act or know.",
            },
            {
              id: "cc-supervisor",
              text: "CC a supervisor so the closure is visible",
              correct: false,
              explanation:
                "Routine closures do not need supervisor visibility. Reserve CCs for people who genuinely need to follow the thread.",
            },
          ],
        },
      },
      {
        id: "attachments-and-final-check",
        title: "Attachments, and the check before saving",
        minutes: 4,
        body: [
          {
            type: "paragraph",
            text: "Screenshots, documents, and files go on the **Attachments** tab via **Attach Files** — not pasted into the description. Pasting is unreliable and clutters the ticket with inline images.",
          },
          { type: "checklistRef", slug: "ticket-quality-check", note: "Run this before every save." },
          { type: "principle", id: "double-check-before-saving" },
        ],
      },
    ],
  },

  /* ======================================================================== *
   * Handling Help Desk email
   * ======================================================================== */
  {
    slug: "handling-help-desk-email",
    title: "Handling Help Desk email",
    summary:
      "Turning an email in the shared inbox into a clean Footprints ticket, without dragging the formatting and inline images along with it.",
    order: 4,
    category: "ticketing",
    visibility: "staff",
    status: "published",
    updatedAt: "2026-08-15",
    updatedBy: "Rian Fernando",
    revision: 1,
    verification: "needs-review",
    prerequisites: ["creating-a-footprints-ticket"],
    outcomes: [
      "Mark an email as being worked so nobody duplicates it",
      "Move email content into a ticket without its formatting",
      "Handle attachments correctly",
      "Separate your response from the original message",
    ],
    steps: [
      {
        id: "claim-it",
        title: "Mark it Work in Progress",
        minutes: 2,
        body: [
          {
            type: "paragraph",
            text: "Before anything else, use the filter at the top of the Help Desk email interface to mark the message **Work in Progress**. It is a shared inbox — this is what stops two people working the same email.",
          },
          {
            type: "placeholder",
            label: "The Help Desk inbox interface",
            needs: ["A sanitised screenshot showing the filter and label controls"],
          },
        ],
      },
      {
        id: "forward-trick",
        title: "Open the content with Forward",
        minutes: 4,
        body: [
          {
            type: "paragraph",
            text: "On the email you are working, select **Forward**.",
          },
          {
            type: "callout",
            tone: "warning",
            title: "You are not forwarding this to anyone",
            text: "This trips up every new technician. Forward is being used only to expose the full message content in an editable form so it can be copied into the ticket. You will never send it.",
          },
        ],
      },
      {
        id: "copy-without-formatting",
        title: "Copy without formatting",
        minutes: 4,
        body: [
          {
            type: "steps",
            items: [
              { title: "Select all", detail: "Ctrl + A" },
              { title: "Cut", detail: "Ctrl + X" },
              { title: "Paste into the Footprints description without formatting", detail: "Ctrl + Shift + V" },
            ],
          },
          {
            type: "callout",
            tone: "info",
            title: "Why paste without formatting",
            text: "The Footprints description is a rich text editor. A normal paste carries the email's styling and pulls inline images and attachments into the description, which makes the ticket bloated and hard to read. Paste-without-formatting brings the text only.",
          },
          {
            type: "callout",
            tone: "tip",
            title: "On a Mac",
            text: "Use ⌘ in place of Ctrl. The paste-without-formatting shortcut is ⌘ + Shift + V.",
          },
        ],
        check: {
          id: "email-paste",
          prompt: "Why paste the email into the ticket with Ctrl + Shift + V rather than Ctrl + V?",
          kind: "single",
          options: [
            {
              id: "no-formatting",
              text: "It pastes text only, which stops the email's formatting and inline images being pulled into the description",
              correct: true,
              explanation:
                "Correct. The description is a rich text editor, so a plain paste brings styling and embedded images with it.",
            },
            {
              id: "faster",
              text: "It is faster",
              correct: false,
              explanation: "Both are instant. The difference is what arrives in the ticket.",
            },
            {
              id: "attachments",
              text: "It copies the attachments across automatically",
              correct: false,
              explanation:
                "The opposite — attachments are handled separately through the Attachments tab. Do not rely on pasting for them.",
            },
            {
              id: "required",
              text: "Footprints rejects formatted text",
              correct: false,
              explanation:
                "It accepts it. That is the problem — it accepts it and the ticket becomes cluttered.",
            },
          ],
        },
      },
      {
        id: "attachments",
        title: "Attachments go separately",
        minutes: 3,
        body: [
          {
            type: "paragraph",
            text: "Screenshots, documents, and any other files the user sent are attached through the ticket's **Attachments** tab.",
          },
          {
            type: "callout",
            tone: "warning",
            title: "Pasting does not carry attachments",
            text: "Do not assume that copying the email content brought the files with it. Attach them deliberately, and check they are there before saving.",
          },
        ],
      },
      {
        id: "response-above",
        title: "Put your response above the forwarded message",
        minutes: 4,
        body: [
          {
            type: "paragraph",
            text: "Once the email is pasted in, find the **Forwarded message** marker. Add a line break above it and write the Help Desk response there.",
          },
          {
            type: "code",
            caption: "The shape you are aiming for",
            code: `Called user and confirmed the issue is on their employee
account, not their student account. Walked through signing
in via an incognito window, which worked. Recommended Chrome
profiles as the longer-term fix and sent the guide.

Resolved on first contact.

---------- Forwarded message ----------
From: [user]
Subject: Can't log in to my work email

I keep getting an error when I try to sign in...`,
          },
          {
            type: "callout",
            tone: "info",
            title: "Why the separation matters",
            text: "Anyone opening the ticket sees the Help Desk's account first and the user's original message underneath. Without the break, the two run together and it becomes genuinely unclear who said what.",
          },
          { type: "checklistRef", slug: "ticket-quality-check" },
        ],
      },
    ],
  },
];
