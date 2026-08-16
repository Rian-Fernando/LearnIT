import type { ReferenceTicket } from "@/lib/content/schema";

/**
 * ---------------------------------------------------------------------------
 * Reference tickets — worked examples
 * ---------------------------------------------------------------------------
 * "What does a good one actually look like?" is the question new technicians
 * ask most, and prose describing a well-written ticket answers it far less well
 * than seeing the fields filled in.
 *
 * Every value here is invented. Reproducing a real ticket — even with the name
 * stripped — carries a real person's problem and phrasing into material read by
 * every new hire, so these are written from scratch rather than sanitised from
 * anything.
 *
 * Only two exist so far: the two workflows described in enough detail to model
 * honestly. The rest are tracked in `backlog.ts` — VPN/Andromeda, MFA token
 * reset, password reset without PMT, ePlanner/Stellic, and VoiceThread.
 */
export const tickets: ReferenceTicket[] = [
  {
    slug: "ticket-work-account-browser-conflict",
    title: "Work account sign-in blocked by student session",
    summary:
      "A staff member who is also a student could not sign into their employee account. Nothing was wrong with the account — the browser was holding the student session. Resolved at first contact.",
    situation:
      "Caller reported being unable to sign into their work email. Holds both a student and an employee account.",
    category: "accounts",
    visibility: "staff",
    status: "published",
    updatedAt: "2026-08-15",
    updatedBy: "Rian Fernando",
    revision: 1,
    verification: "needs-review",
    fields: {
      title: "Cannot Sign In To Work Email  ADOE22",
      priority: "Medium",
      status: "Open",
      inquiry: "Phone",
      category: "(category to be confirmed)",
      division: "OITR",
    },
    contact: {
      firstName: "Alex",
      lastName: "Doe",
      userId: "ADOE22",
      phone: "(555) 010-4477",
      department: "Student Financial Services",
    },
    description: `User reported they cannot sign in to their work email. Error
shown was "You are already signed in with a different account."

Verified user through the approved process.

Confirmed user holds two Adelphi accounts — a student account
and an employee account. The account failing is the employee
account; the student account signs in normally and is the one
already active in Chrome.

Troubleshooting:
- Had user open an incognito window and sign in to the employee
  account. Sign-in succeeded. This confirms the account itself
  is fine and the conflict is the existing browser session.
- Walked user through creating a second Chrome profile for the
  employee account, named "Work".
- User signed in successfully in the new profile and confirmed
  access to work email.

Advised user to keep the two profiles separate going forward.
Sent the Chrome profile guide for reference.

Resolved at first contact. No escalation required.`,
    assignees: ["+Customer Experience"],
    notifications: { assignees: true, contact: false },
    whatMakesItGood: [
      "The error message is quoted verbatim rather than paraphrased, so the next person can search for it.",
      "It states plainly that the user holds two accounts and which one failed — the fact the whole diagnosis turns on.",
      "The incognito test is recorded along with what it proved, not just that it was tried.",
      "It says what the user was advised, so a repeat call does not repeat the advice.",
      "Contact notification is off because the user was on the phone and already knows it is fixed.",
    ],
    commonMistakes: [
      "Recording only \"user could not log in, resolved\" — which teaches the next technician nothing.",
      "Troubleshooting the account rather than the browser, which can lead to an unnecessary password reset.",
      "Leaving the username off the title, so the ticket cannot be found by searching for the user.",
      "Assuming which account was affected instead of asking.",
    ],
    articleSlugs: ["student-work-account-browser-conflict", "chrome-profiles-guide"],
  },

  {
    slug: "ticket-classroom-projector",
    title: "Classroom projector not displaying, class in session",
    summary:
      "A faculty member called from a classroom with a class already running. Shows the classroom title format, the urgency detail TSS needs, and the assignee correction that has to happen before saving.",
    situation:
      "Faculty member called from NEX 135. Projector showing no signal with a class in progress.",
    category: "hardware",
    visibility: "staff",
    status: "published",
    updatedAt: "2026-08-15",
    updatedBy: "Rian Fernando",
    revision: 1,
    verification: "needs-review",
    fields: {
      title: "NEX 135 Projector Not Working  JSMITH",
      priority: "Medium",
      status: "Open",
      inquiry: "Phone",
      category: "Multimedia",
      subcategory: "(subcategory to be confirmed)",
      division: "OITR",
      locationOfWork: "Nexus Building",
      room: "135",
    },
    contact: {
      firstName: "Jordan",
      lastName: "Smith",
      userId: "JSMITH",
      phone: "(555) 010-2291",
      department: "Biology",
    },
    description: `CLASS IN SESSION — started 11:00 AM, runs until 12:15 PM.

Professor reports the projector in NEX 135 is showing "No Signal".
Room display is powered on. Class of approximately 40 students
waiting.

Verified booking in EMS — class is scheduled in NEX 135 at this
time and the professor is associated with it.

Checked the classroom technology page for this room's
configuration.

Troubleshooting performed over the phone:
- Confirmed the projector is powered on and the correct input
  is selected.
- Had professor confirm the cable connection at the podium.
- Issue persists. No display output.

TSS assistance required on site — remaining steps need physical
access to the equipment.

TSS notified via Discord at 11:06 AM with building, room, issue,
and troubleshooting performed.`,
    assignees: ["(TSS / Lab Consultant assignee to be confirmed)"],
    notifications: { assignees: true, contact: true },
    whatMakesItGood: [
      "The title leads with building and room, so a TSS technician reading the notification knows where to go before reading anything else.",
      "Urgency is the first line of the description, in capitals — a class is running right now.",
      "It records that EMS was checked and the booking verified, so nobody repeats that step.",
      "Phone troubleshooting is listed with its outcome, so TSS does not arrive and repeat it.",
      "It states explicitly that the Discord tag was sent, and when.",
    ],
    commonMistakes: [
      "Leaving +Communications in the Assignees box, so the notification never reaches TSS.",
      "Omitting whether a class is in session — the single most important field on a classroom ticket.",
      "Writing a vague title like \"Classroom issue\", which tells a responder nothing.",
      "Skipping the EMS check and dispatching to a room with no class in it.",
      "Tagging Discord before the ticket exists, so TSS arrives with nothing to reference.",
    ],
    articleSlugs: [],
  },
];
