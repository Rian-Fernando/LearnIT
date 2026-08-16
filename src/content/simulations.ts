import type { TicketSimulation } from "@/lib/content/schema";

/**
 * ---------------------------------------------------------------------------
 * Call simulations
 * ---------------------------------------------------------------------------
 * The trainee reads a call transcript, then writes the ticket. It is graded
 * against a rubric with per-item feedback, and the model answer is shown
 * afterwards for comparison.
 *
 * Every caller, username, phone number, and room below is invented.
 *
 * Rubric items accept multiple phrasings on purpose. The grader is a keyword
 * and pattern matcher — it can tell whether a fact was captured, and cannot
 * tell whether a description reads well. Being generous about wording keeps it
 * honest about what it is actually measuring.
 */
export const simulations: TicketSimulation[] = [
  /* ======================================================================== *
   * A — work account blocked by student session
   * ======================================================================== */
  {
    slug: "sim-work-account-browser-conflict",
    title: "Cannot sign in to work email",
    summary:
      "A caller with two Adelphi accounts cannot reach their employee email. Practises establishing which account is affected before troubleshooting.",
    brief:
      "You answer the phone. Take the call, then write the ticket you would have written.",
    category: "accounts",
    difficulty: "intro",
    visibility: "staff",
    status: "published",
    updatedAt: "2026-08-15",
    updatedBy: "Rian Fernando",
    revision: 1,
    verification: "needs-review",
    transcript: [
      { speaker: "caller", text: "Hi — I can't get into my work email. It keeps giving me an error." },
      { speaker: "technician", text: "Sorry about that. Can I take your name and username?" },
      { speaker: "caller", text: "Alex Doe. My username is ADOE22 — A-D-O-E-2-2." },
      { speaker: "technician", text: "Thanks. And a good callback number?" },
      { speaker: "caller", text: "555-010-4477." },
      { speaker: "technician", text: "What department are you in?" },
      { speaker: "caller", text: "Student Financial Services. I work there, but I'm also finishing my degree part-time." },
      { speaker: "note", text: "The caller has just told you they hold two roles." },
      { speaker: "technician", text: "Good to know. Can you read me exactly what the error says?" },
      { speaker: "caller", text: "It says \"You are already signed in with a different account.\"" },
      { speaker: "technician", text: "Are you signed into anything else in that browser?" },
      { speaker: "caller", text: "My student email, I think. That one works fine — it's just the work one." },
      { speaker: "technician", text: "When did this start?" },
      { speaker: "caller", text: "This morning. I've never really used the work email in this browser before." },
      { speaker: "note", text: "You walk them through opening an incognito window and signing in. It works." },
      { speaker: "caller", text: "Oh — that worked. So my password is fine?" },
      { speaker: "note", text: "You walk them through creating a second Chrome profile named Work. They sign in successfully and confirm access." },
      { speaker: "caller", text: "That's great, thank you. Much easier than logging out every time." },
    ],
    categoryOptions: [
      "(select a category)",
      "Accounts",
      "Multimedia",
      "Printing",
      "Network",
      "Software",
    ],
    assigneeOptions: [
      "(select an assignee)",
      "+Customer Experience",
      "+Communications",
      "+Administrative Systems",
      "+CCAP",
    ],
    rubric: [
      {
        id: "title-username",
        label: "Username at the end of the title, after two spaces",
        target: "title",
        weight: 2,
        pattern: "\\s{2}ADOE22\\s*$",
        anyOf: [],
        feedbackPass: "Correct — two spaces then the username, so the ticket is findable by searching for the user.",
        feedbackFail:
          "The title should end with two spaces followed by the username in caps: `…  ADOE22`. Without it the ticket cannot be found by searching for this user.",
      },
      {
        id: "title-specific",
        label: "Title describes the actual problem",
        target: "title",
        weight: 1,
        anyOf: ["sign in", "sign-in", "signin", "log in", "login", "cannot access", "can't access", "email"],
        feedbackPass: "The title says what was wrong, so it is useful in a queue.",
        feedbackFail:
          "The title is too vague to be useful in a search result. Say what was actually failing — signing in to work email.",
      },
      {
        id: "two-accounts",
        label: "Recorded that the user holds two Adelphi accounts",
        target: "description",
        weight: 3,
        anyOf: ["two account", "both account", "student and employee", "employee and student", "two adelphi", "student account", "multiple account", "also a student", "part-time"],
        feedbackPass:
          "This is the fact the whole diagnosis turns on. Recording it means the next technician understands immediately.",
        feedbackFail:
          "The single most important detail is missing: this user holds both a student and an employee account. Without it the ticket reads as an ordinary sign-in failure.",
      },
      {
        id: "error-verbatim",
        label: "Captured the error message",
        target: "description",
        weight: 2,
        anyOf: ["already signed in", "different account"],
        feedbackPass: "The error is recorded, so it can be searched for when it recurs.",
        feedbackFail:
          "The exact error was never recorded. \"You are already signed in with a different account\" is what makes this diagnosable — and searchable next time.",
      },
      {
        id: "incognito-test",
        label: "Recorded the incognito test and what it proved",
        target: "description",
        weight: 2,
        anyOf: ["incognito", "private window", "private browsing"],
        feedbackPass:
          "Good — the test is recorded along with its result, so nobody repeats it.",
        feedbackFail:
          "The incognito test is what proved the account was fine. Recording only the outcome loses the evidence.",
      },
      {
        id: "resolution",
        label: "Recorded the fix that was applied",
        target: "description",
        weight: 2,
        anyOf: ["chrome profile", "profile", "second profile", "separate profile"],
        feedbackPass: "The fix is documented, so a repeat call does not repeat the advice.",
        feedbackFail:
          "The resolution — creating a second Chrome profile — is not recorded. A colleague taking a follow-up call would start from nothing.",
      },
      {
        id: "category",
        label: "Correct category",
        target: "category",
        weight: 1,
        anyOf: ["Accounts"],
        feedbackPass: "Accounts is right for a sign-in issue.",
        feedbackFail: "This is an account sign-in problem, so Accounts is the fitting category.",
      },
      {
        id: "assignee",
        label: "Correct assignee",
        target: "assignee",
        weight: 1,
        anyOf: ["+Customer Experience"],
        feedbackPass: "Customer Experience is the default for general Help Desk issues.",
        feedbackFail:
          "This was resolved at first contact by the Help Desk, so it belongs with +Customer Experience.",
      },
      {
        id: "notifications",
        label: "Notification settings deliberate",
        target: "notifications",
        weight: 1,
        anyOf: [],
        expectNotification: { assignees: true, contact: false },
        feedbackPass:
          "Contact notification off is the right call — the user was on the phone and already knows it is fixed.",
        feedbackFail:
          "The user was on the phone and knows it is resolved. Emailing them again adds nothing; leave Assignees on and Contact off.",
      },
    ],
    modelAnswer: {
      title: "Cannot Sign In To Work Email  ADOE22",
      category: "Accounts",
      assignee: "+Customer Experience",
      notifyAssignees: true,
      notifyContact: false,
      description: `User reported they cannot sign in to their work email. Error
shown was "You are already signed in with a different account."

Verified user through the approved process.

User holds two Adelphi accounts — a student account and an
employee account (works in Student Financial Services, also
finishing a degree part-time). The failing account is the
employee account; the student account signs in normally and is
already active in Chrome.

Troubleshooting:
- Had user open an incognito window and sign in to the employee
  account. Sign-in succeeded, confirming the account itself is
  fine and the conflict is the existing browser session.
- Walked user through creating a second Chrome profile named
  "Work" for the employee account.
- User signed in successfully and confirmed access.

Advised keeping the two profiles separate going forward.

Resolved at first contact. No escalation required.`,
    },
    debrief: [
      {
        type: "paragraph",
        text: "This call is a test of one habit: noticing when a caller mentions a second role. \"I work there, but I'm also finishing my degree\" is the whole diagnosis, and it arrives in passing while you are asking about something else.",
      },
      { type: "principle", id: "verify-the-account" },
      {
        type: "callout",
        tone: "tip",
        title: "Incognito is a diagnostic, not a fix",
        text: "It proves the account is fine. Leaving the user there — signing into a private window every day — would be abandoning them halfway. The Chrome profile is the actual resolution.",
      },
      { type: "ticketRef", slug: "ticket-work-account-browser-conflict" },
      { type: "articleRef", slug: "student-work-account-browser-conflict" },
    ],
  },

  /* ======================================================================== *
   * B — classroom, class in session
   * ======================================================================== */
  {
    slug: "sim-classroom-projector",
    title: "Projector dead, class starting",
    summary:
      "A faculty member calls from a classroom with students waiting. Practises the classroom title format and capturing urgency for TSS.",
    brief:
      "You answer the phone. There is time pressure on this one — take the call, then write the ticket.",
    category: "hardware",
    difficulty: "core",
    visibility: "staff",
    status: "published",
    updatedAt: "2026-08-15",
    updatedBy: "Rian Fernando",
    revision: 1,
    verification: "needs-review",
    transcript: [
      { speaker: "caller", text: "Hi, the projector in here isn't working and I've got a class about to start." },
      { speaker: "technician", text: "Let's get on it. Which building and room are you in?" },
      { speaker: "caller", text: "Nexus, room 135." },
      { speaker: "technician", text: "And your name and username?" },
      { speaker: "caller", text: "Jordan Smith, JSMITH. I'm in Biology." },
      { speaker: "technician", text: "Best number to reach you on?" },
      { speaker: "caller", text: "555-010-2291." },
      { speaker: "technician", text: "When does your class start?" },
      { speaker: "caller", text: "Eleven — so about five minutes. There are already forty students in here." },
      { speaker: "note", text: "You check EMS. The class is scheduled in NEX 135 at 11:00 and Jordan Smith is associated with the booking." },
      { speaker: "technician", text: "What does the projector show?" },
      { speaker: "caller", text: "It says No Signal. The screen's on, it's just not picking anything up." },
      { speaker: "note", text: "You check the classroom technology page for the room configuration." },
      { speaker: "technician", text: "Can you check the cable at the podium is seated properly?" },
      { speaker: "caller", text: "Yes, it's plugged in. I've tried unplugging and back in. Still No Signal." },
      { speaker: "technician", text: "And the input source on the projector?" },
      { speaker: "caller", text: "It's on the right one — same as always." },
      { speaker: "note", text: "You have exhausted what can be done by phone. This needs someone in the room." },
    ],
    categoryOptions: [
      "(select a category)",
      "Multimedia",
      "Accounts",
      "Printing",
      "Network",
      "Software",
    ],
    assigneeOptions: [
      "(select an assignee)",
      "TSS / Lab Consultant",
      "+Communications",
      "+Customer Experience",
      "+CCAP",
    ],
    rubric: [
      {
        id: "title-location-first",
        label: "Title starts with building and room",
        target: "title",
        weight: 3,
        pattern: "^\\s*NEX\\s*135",
        anyOf: [],
        feedbackPass:
          "Correct — location first. A TSS technician reading the notification knows where to go before reading anything else.",
        feedbackFail:
          "Classroom titles lead with the building and room: `NEX 135 …`. Whoever is dispatched reads the notification on their phone and needs the location first.",
      },
      {
        id: "title-username",
        label: "Username at the end, after two spaces",
        target: "title",
        weight: 2,
        pattern: "\\s{2}JSMITH\\s*$",
        anyOf: [],
        feedbackPass: "Two spaces then the username, as the format requires.",
        feedbackFail: "The title should end with two spaces followed by `JSMITH`.",
      },
      {
        id: "urgency",
        label: "Recorded that a class is in session or imminent",
        target: "description",
        weight: 3,
        anyOf: ["class in session", "class starting", "class starts", "in session", "11:00", "11am", "5 minutes", "five minutes", "students waiting", "40 students", "forty students", "imminent"],
        feedbackPass:
          "Urgency is captured. This is what tells TSS to move now rather than working the queue in order.",
        feedbackFail:
          "The most important field on a classroom ticket is missing — there is a class starting in five minutes with forty students in the room. Nothing else in this ticket matters as much.",
      },
      {
        id: "ems-verified",
        label: "Recorded that the booking was verified in EMS",
        target: "description",
        weight: 2,
        anyOf: ["ems", "booking", "verified the class", "class is scheduled", "scheduled in"],
        feedbackPass: "Good — nobody needs to repeat the EMS check.",
        feedbackFail:
          "You checked EMS but did not record it. The next person will check it again unless the ticket says you did.",
      },
      {
        id: "error-state",
        label: "Recorded the actual symptom",
        target: "description",
        weight: 2,
        anyOf: ["no signal", "no-signal"],
        feedbackPass: "The symptom is recorded specifically rather than as 'not working'.",
        feedbackFail:
          "\"No Signal\" is a specific state that points at the source rather than the projector. Record it — 'not working' does not carry that.",
      },
      {
        id: "troubleshooting",
        label: "Recorded the phone troubleshooting already attempted",
        target: "description",
        weight: 2,
        anyOf: ["cable", "input", "unplug", "reseat", "source"],
        feedbackPass:
          "Recorded, so TSS does not arrive and repeat the checks you already did.",
        feedbackFail:
          "You checked the cable and the input source. If that is not in the ticket, TSS will walk in and start with exactly those.",
      },
      {
        id: "category",
        label: "Correct category",
        target: "category",
        weight: 2,
        anyOf: ["Multimedia"],
        feedbackPass: "Multimedia is correct for classroom technology.",
        feedbackFail:
          "Classroom technology issues use the Multimedia category, which can also affect routing.",
      },
      {
        id: "assignee",
        label: "Routed to TSS rather than left with a default",
        target: "assignee",
        weight: 3,
        anyOf: ["TSS", "Lab Consultant"],
        feedbackPass:
          "Correct. Leaving +Communications on a classroom ticket sends the notification to the wrong team while the class waits.",
        feedbackFail:
          "This needs a TSS or Lab Consultant assignee. If +Communications is left selected, the people who can actually walk to the room never get notified.",
      },
    ],
    modelAnswer: {
      title: "NEX 135 Projector Not Working  JSMITH",
      category: "Multimedia",
      assignee: "TSS / Lab Consultant",
      notifyAssignees: true,
      notifyContact: true,
      description: `CLASS IN SESSION — starts 11:00 AM, approx. 40 students waiting.

Professor reports the projector in NEX 135 shows "No Signal".
Display is powered on, no output.

Verified booking in EMS — class is scheduled in NEX 135 at 11:00
and the professor is associated with it.

Checked the classroom technology page for this room's
configuration.

Troubleshooting performed by phone:
- Confirmed cable at the podium is seated; user unplugged and
  reconnected. No change.
- Confirmed correct input source selected on the projector.
- Issue persists.

TSS assistance required on site — remaining steps need physical
access to the equipment.

Contact: Jordan Smith, Biology, 555-010-2291.`,
    },
    debrief: [
      {
        type: "paragraph",
        text: "Two things decide whether this ticket works: the title leading with the location, and the urgency being impossible to miss. Everything else is supporting detail.",
      },
      {
        type: "callout",
        tone: "danger",
        title: "The assignee is the trap",
        text: "Several classroom workflows arrive with +Communications already selected. Leave it and the notification goes to a team that cannot help, while forty students sit in a room with a dead projector.",
      },
      { type: "principle", id: "assign-correctly" },
      {
        type: "callout",
        tone: "tip",
        title: "Then tag @TSS on Discord",
        text: "The ticket is the record; the Discord tag is what gets someone moving. Do the ticket first so they have something to reference when they arrive.",
      },
      { type: "ticketRef", slug: "ticket-classroom-projector" },
    ],
  },
];
