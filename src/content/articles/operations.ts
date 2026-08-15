import type { Article } from "@/lib/content/schema";

export const operationsArticles: Article[] = [
  {
    slug: "remote-support-session-conduct",
    title: "Conducting a remote support session",
    summary:
      "Remote access is the most trust-sensitive thing a technician does. This covers consent, conduct during the session, and ending it properly.",
    category: "remote-support",
    tags: ["remote-support", "consent", "privacy", "conduct"],
    visibility: "public",
    status: "published",
    updatedAt: "2026-08-09",
    updatedBy: "Help Desk Leadership",
    revision: 5,
    featured: true,
    related: ["ticket-lifecycle", "handling-frustrated-users"],
    body: [
      {
        type: "paragraph",
        text: "When you take remote control of someone's computer, you are inside their working life — their documents, their mail, their browser tabs. The technical part of a remote session is easy. The conduct is what makes it professional.",
      },
      {
        type: "callout",
        tone: "danger",
        title: "Never connect without explicit permission",
        text: "Ask, wait for a clear yes, and note it in the ticket. “I'm going to connect now” is not permission — it is an announcement. If the user hesitates, stop and explain what you will be able to see.",
      },
      { type: "heading", level: 2, text: "Before connecting" },
      {
        type: "steps",
        items: [
          {
            title: "Verify the user through the approved process",
            detail: "Remote access is never the step where verification gets skipped.",
          },
          {
            title: "Explain what you are about to do",
            detail:
              "One plain sentence: what you will see, what you will change, and how long it should take.",
          },
          {
            title: "Ask for explicit permission and wait for it",
          },
          {
            title: "Ask them to close anything private first",
            detail:
              "Personal mail, medical portals, financial pages. Offering this unprompted is the single easiest way to earn trust.",
          },
          {
            title: "Confirm they will stay present",
            detail:
              "The user should remain at the machine for the whole session. Do not continue on an unattended computer.",
          },
        ],
      },
      { type: "link", linkKey: "remote-support-console" },
      { type: "heading", level: 2, text: "During the session" },
      {
        type: "list",
        ordered: false,
        items: [
          "Narrate what you are doing. Silence while their cursor moves on its own is unsettling.",
          "Stay inside the problem. Do not open applications, files, or folders unrelated to the ticket.",
          "If you see something private, say nothing, look away from it, and move on.",
          "Ask before installing, uninstalling, or restarting anything.",
          "If the user asks you to stop, stop immediately — no negotiation.",
        ],
      },
      {
        type: "callout",
        tone: "warning",
        title: "You are a guest",
        text: "Access granted for one problem is not access for anything else. Browsing “while you're in there” is the fastest way to lose a user's trust permanently, and it is not acceptable regardless of intent.",
      },
      { type: "heading", level: 2, text: "Ending the session" },
      {
        type: "steps",
        items: [
          { title: "Tell the user you are finished and disconnecting" },
          {
            title: "End the session properly in the console",
            detail:
              "Closing a window is not the same as terminating the session. Confirm it has actually ended.",
          },
          {
            title: "Confirm the user can see their own cursor is back",
            detail: "A short, reassuring close beats a silent disconnect.",
          },
          {
            title: "Summarise what you changed",
            detail:
              "In the call and in the ticket. Someone else may inherit this machine's next problem.",
          },
          {
            title: "Note that permission was obtained",
            detail: "A one-line record. It protects the user and it protects you.",
          },
        ],
      },
      { type: "responseRef", slug: "remote-session-invite" },
    ],
  },
  {
    slug: "ticket-lifecycle",
    title: "The ticket lifecycle",
    summary:
      "How a contact becomes a ticket, moves through its states, and closes — plus what makes a ticket genuinely useful to whoever reads it next.",
    category: "ticketing",
    tags: ["ticketing", "documentation", "fundamentals", "escalation"],
    visibility: "public",
    status: "published",
    updatedAt: "2026-08-02",
    updatedBy: "Help Desk Leadership",
    revision: 4,
    featured: true,
    related: ["writing-useful-ticket-notes", "remote-support-session-conduct"],
    body: [
      {
        type: "paragraph",
        text: "A ticket is not paperwork attached to the real work. It **is** part of the work — it is how the Help Desk remembers, hands off, and improves.",
      },
      { type: "heading", level: 2, text: "The states" },
      {
        type: "fields",
        items: [
          { label: "New", value: "Logged, not yet worked. Every contact gets one — including out-of-scope ones." },
          { label: "In progress", value: "Actively being worked by a named person." },
          { label: "Waiting on user", value: "Blocked pending information or action from the requester." },
          { label: "Escalated", value: "Handed to another team with full context attached." },
          { label: "Resolved", value: "Fixed and confirmed. Not “probably fixed”." },
          { label: "Closed", value: "Finalised. Reopens if the issue returns." },
        ],
      },
      {
        type: "callout",
        tone: "warning",
        title: "“Waiting on user” is not a parking space",
        text: "Set it only when you genuinely need something from them, and say precisely what you need. A ticket that sits in this state for a week with a vague note is a ticket nobody can rescue.",
      },
      { type: "heading", level: 2, text: "Log everything" },
      {
        type: "paragraph",
        text: "Including the two-minute calls, and including the ones you redirect elsewhere. Unlogged contacts are invisible, and invisible volume is why staffing and signage never get fixed.",
      },
      { type: "link", linkKey: "help-desk-portal" },
      { type: "articleRef", slug: "writing-useful-ticket-notes" },
    ],
  },
  {
    slug: "writing-useful-ticket-notes",
    title: "Writing ticket notes someone else can use",
    summary:
      "The difference between a note that saves the next technician ten minutes and one that wastes them. Includes a repeatable structure.",
    category: "ticketing",
    tags: ["ticketing", "documentation", "communication", "handoff"],
    visibility: "public",
    status: "published",
    updatedAt: "2026-08-02",
    updatedBy: "Help Desk Leadership",
    revision: 3,
    featured: false,
    related: ["ticket-lifecycle"],
    body: [
      {
        type: "paragraph",
        text: "Write for the person who picks this up at 8am tomorrow knowing nothing. That person may well be you, and you will not remember.",
      },
      { type: "heading", level: 2, text: "A structure that always works" },
      {
        type: "steps",
        items: [
          {
            title: "What the user reported",
            detail: "In their words, including the exact error text.",
          },
          {
            title: "What you verified",
            detail:
              "Facts you established — account type, device, network, whether other devices work.",
          },
          {
            title: "What you tried",
            detail: "And what each attempt did. A failed attempt is useful information.",
          },
          {
            title: "Where it stands",
            detail: "Resolved, blocked on something specific, or escalated to a named team.",
          },
          {
            title: "What should happen next",
            detail: "The single most valuable line in the whole ticket.",
          },
        ],
      },
      { type: "heading", level: 2, text: "Compare" },
      {
        type: "code",
        caption: "Not useful",
        code: "User called about VPN. Troubleshot. Still not working. Escalated.",
      },
      {
        type: "code",
        caption: "Useful",
        code: `Reported: VPN fails at sign-in on personal MacBook from home.
Error verbatim: "Unable to establish secure connection."

Verified: web sign-in to email works (account is fine). MFA prompt
arrives and is approved. Fails on home network; connects fine on
phone hotspot.

Tried: quit + relaunch client, device restart, hotspot test.

Status: escalated to Network. Cause appears specific to the user's
home network, not the account or the client.

Next: confirm whether the user's router blocks the VPN protocol.
User is reachable after 3pm weekdays.`,
      },
      {
        type: "callout",
        tone: "tip",
        title: "Verbatim beats paraphrase",
        text: "“Some kind of certificate error” and the actual error string are worth very different amounts. Ask people to read it out, and type it exactly.",
      },
      {
        type: "callout",
        tone: "danger",
        title: "Never put credentials in a ticket",
        text: "No passwords, no one-time codes, no security answers — not even temporarily. Ticket text is retained, searchable, and read by many people.",
      },
    ],
  },
  {
    slug: "handling-frustrated-users",
    title: "Handling frustrated users",
    summary:
      "Practical technique for calls where the person is already angry, plus where the real limits are.",
    category: "communication",
    tags: ["communication", "soft-skills", "phone", "escalation"],
    visibility: "public",
    status: "published",
    updatedAt: "2026-07-25",
    updatedBy: "Help Desk Leadership",
    revision: 4,
    featured: true,
    related: ["professional-communication", "ticket-lifecycle"],
    body: [
      {
        type: "paragraph",
        text: "By the time someone reaches you, they have often already lost an hour, missed a deadline, or been transferred twice. The frustration is rarely about you — but you are the person who can end it.",
      },
      { type: "heading", level: 2, text: "What actually works" },
      {
        type: "steps",
        items: [
          {
            title: "Let them finish",
            detail:
              "Interrupting to start troubleshooting resets the conversation. Thirty uninterrupted seconds usually costs less than the argument it prevents.",
          },
          {
            title: "Acknowledge the impact, not the fault",
            detail:
              "“Missing that deadline because of this is genuinely frustrating” is honest and costs nothing. You are not admitting anyone did anything wrong.",
          },
          {
            title: "Say what you are going to do, right now",
            detail:
              "Concrete next action. Vagueness reads as being brushed off, and it is the thing that escalates calls.",
          },
          {
            title: "Give realistic timelines",
            detail:
              "An honest “this will take until tomorrow” lands far better than an optimistic promise that fails.",
          },
          {
            title: "Follow through visibly",
            detail: "Update the ticket, and tell them you have.",
          },
        ],
      },
      {
        type: "callout",
        tone: "tip",
        title: "Do not over-apologise",
        text: "Repeated apologising reads as uncertainty and invites more pressure. One sincere acknowledgement, then move to action.",
      },
      { type: "heading", level: 2, text: "Where the line is" },
      {
        type: "paragraph",
        text: "Frustration is expected and you should absorb it professionally. Abuse is different. You are not required to stay on a call where you are being personally attacked, threatened, or harassed.",
      },
      {
        type: "list",
        ordered: false,
        items: [
          "State clearly, once, that you want to help and need the conversation to stay respectful.",
          "If it continues, tell them you are ending the call and that a supervisor will follow up.",
          "End the call. Document what happened factually, without editorialising.",
          "Tell your supervisor the same shift — never sit on it.",
        ],
      },
      {
        type: "callout",
        tone: "warning",
        title: "Pressure never changes a policy answer",
        text: "If the answer is no — verification cannot be completed, the device is out of scope, the access is not yours to grant — persistence does not change it. Escalate rather than bending. Nobody will fault you for routing a hard call upward.",
      },
      { type: "responseRef", slug: "escalation-acknowledgement" },
    ],
  },
  {
    slug: "professional-communication",
    title: "Professional communication on phone and email",
    summary:
      "Tone, structure, and the specific habits that make Help Desk communication clear — including the jargon problem.",
    category: "communication",
    tags: ["communication", "email", "phone", "writing"],
    visibility: "public",
    status: "published",
    updatedAt: "2026-07-25",
    updatedBy: "Help Desk Leadership",
    revision: 3,
    featured: false,
    related: ["handling-frustrated-users", "writing-useful-ticket-notes"],
    body: [
      {
        type: "paragraph",
        text: "You are often the only part of IT a person ever speaks to. How you communicate becomes, for them, what the whole department is like.",
      },
      { type: "heading", level: 2, text: "On the phone" },
      {
        type: "list",
        ordered: false,
        items: [
          "Open with the Help Desk and your first name — people relax when they know who they are talking to.",
          "Slow down when giving instructions. What is muscle memory to you is unfamiliar to them.",
          "Say what you are doing during silences. Dead air on a call feels like being abandoned.",
          "Confirm the fix before closing: “Can you try it now while I'm here?”",
          "Say what happens next, even when the answer is “nothing, you're all set.”",
        ],
      },
      { type: "heading", level: 2, text: "In writing" },
      {
        type: "steps",
        items: [
          { title: "Lead with the answer", detail: "Not the history of the investigation." },
          { title: "One idea per paragraph", detail: "Dense blocks do not get read." },
          { title: "Number anything with steps", detail: "People follow numbered lists and skim prose." },
          { title: "Bold the single action you need from them", detail: "If you need something, make it impossible to miss." },
          { title: "Close with what happens next", detail: "Every message should answer “so what now?”" },
        ],
      },
      { type: "heading", level: 2, text: "The jargon problem" },
      {
        type: "fields",
        items: [
          { label: "Instead of “clear your cache”", value: "“Clear your browsing history — I'll walk you through where that is.”" },
          { label: "Instead of “it's a DNS issue”", value: "“Your computer is having trouble finding that site. I'm looking into it.”" },
          { label: "Instead of “escalating to tier 2”", value: "“I'm passing this to the team that handles this system, with everything we've found.”" },
          { label: "Instead of “authenticate”", value: "“Sign in.”" },
        ],
      },
      {
        type: "callout",
        tone: "tip",
        title: "Never make someone feel stupid",
        text: "Not with words, not with tone, not with a pause. “That's a really common one” costs you nothing and changes how the entire interaction goes.",
      },
    ],
  },
  {
    slug: "recognising-phishing-reports",
    title: "When a user reports a suspicious message",
    summary:
      "How to handle a phishing report at first contact, what to collect, and the cases that must be escalated immediately.",
    category: "general",
    tags: ["security", "phishing", "escalation", "accounts"],
    visibility: "public",
    status: "published",
    updatedAt: "2026-08-07",
    updatedBy: "Help Desk Leadership",
    revision: 2,
    featured: false,
    related: ["account-lockout-escalation", "password-reset-walkthrough"],
    body: [
      {
        type: "paragraph",
        text: "A user reporting a suspicious message has done exactly the right thing. Say so — it is the behaviour you want more of, and people who feel foolish stop reporting.",
      },
      { type: "heading", level: 2, text: "The first question" },
      {
        type: "callout",
        tone: "danger",
        title: "“Did you click anything or enter any information?”",
        text: "This single question determines everything that follows. A report about a message that was merely received is routine. A report from someone who entered their credentials is an active incident and must be escalated immediately, without troubleshooting.",
      },
      { type: "heading", level: 2, text: "If they did not interact with it" },
      {
        type: "steps",
        items: [
          { title: "Thank them for reporting it" },
          {
            title: "Have them report it through the approved reporting path",
            detail: "Forwarding to colleagues is not reporting — it spreads it.",
          },
          { title: "Tell them to delete it afterwards" },
          { title: "Log the ticket so campaign volume is visible" },
        ],
      },
      { type: "heading", level: 2, text: "If they did interact with it" },
      {
        type: "steps",
        items: [
          {
            title: "Stay calm and do not lecture",
            detail:
              "They are already embarrassed. Blame slows down the only thing that matters now, which is speed.",
          },
          {
            title: "Escalate immediately",
            detail: "Do not attempt to remediate this yourself at first contact.",
          },
          {
            title: "Capture what was entered and when",
            detail:
              "Credentials, a multi-factor approval, or personal details — and the approximate time.",
          },
          {
            title: "Record the message details",
            detail: "Sender, subject, and time received.",
          },
          {
            title: "Follow the escalation path exactly",
            detail: "This is a security incident, not a password ticket.",
          },
        ],
      },
      {
        type: "callout",
        tone: "warning",
        title: "Never ask what the password was",
        text: "You do not need it, and asking creates a second problem. You need to know *that* credentials were entered, not what they were.",
      },
    ],
  },
];
