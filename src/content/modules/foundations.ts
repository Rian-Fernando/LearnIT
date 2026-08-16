import type { TrainingModule } from "@/lib/content/schema";

export const foundationModules: TrainingModule[] = [
  {
    slug: "help-desk-fundamentals",
    title: "Help Desk fundamentals",
    summary:
      "What the Help Desk is for, where your authority begins and ends, and the habits that make the difference in your first week.",
    order: 0,
    category: "general",
    visibility: "public",
    status: "published",
    updatedAt: "2026-08-01",
    updatedBy: "Help Desk Leadership",
    revision: 5,
    verification: "unverified",
    prerequisites: [],
    outcomes: [
      "Explain what the Help Desk owns and what it routes elsewhere",
      "Recognise the four things every contact needs from you",
      "Know when to stop troubleshooting and escalate",
      "Understand why logging every contact matters",
    ],
    steps: [
      {
        id: "what-we-do",
        title: "What the Help Desk actually does",
        minutes: 4,
        body: [
          {
            type: "paragraph",
            text: "The Help Desk is the front door to university technology. Students, faculty, and staff come to you when something between them and their work has stopped functioning — and for most of them, you are the only part of IT they will ever speak to.",
          },
          { type: "heading", level: 2, text: "Three jobs, in order" },
          {
            type: "fields",
            items: [
              { label: "Resolve", value: "Fix what you can fix, at first contact, correctly." },
              { label: "Route", value: "Get what you cannot fix to the team that can, with full context attached." },
              { label: "Record", value: "Leave a trail that makes the next person faster — including when that person is you." },
            ],
          },
          {
            type: "callout",
            tone: "tip",
            title: "You are not expected to know everything",
            text: "New technicians assume the job is memorising answers. It is not. The job is knowing how to find the answer, and being honest when you have not found it yet. That is precisely why learnIT exists.",
          },
          { type: "heading", level: 2, text: "What every contact needs from you" },
          {
            type: "list",
            ordered: true,
            items: [
              "To be taken seriously — no sighing, no “that's a weird one”.",
              "To understand what is happening, in words they use.",
              "To know what happens next, even if the answer is “I don't know yet, and I'll find out by Thursday”.",
              "To not have to explain it all again to the next person.",
            ],
          },
        ],
        check: {
          id: "fundamentals-role",
          prompt: "A caller describes a problem with a system you have never heard of. What is the best first move?",
          kind: "single",
          options: [
            {
              id: "guess",
              text: "Offer your best guess so the call keeps moving",
              correct: false,
              explanation:
                "A confident guess that turns out wrong costs far more than a pause. It also teaches the caller not to trust what you say.",
            },
            {
              id: "look-it-up",
              text: "Say you want to check the right procedure, then look it up while they hold",
              correct: true,
              explanation:
                "Exactly right. Looking something up in front of a caller is not a weakness — it demonstrates that answers here come from procedure, not memory.",
            },
            {
              id: "transfer",
              text: "Transfer them immediately to avoid getting it wrong",
              correct: false,
              explanation:
                "Transferring before you understand the problem sends the caller onward with nothing gained. Gather the facts first — many of these turn out to be in scope.",
            },
            {
              id: "close",
              text: "Log it as out of scope and close the ticket",
              correct: false,
              explanation:
                "Unfamiliar is not the same as out of scope. Establish what the system is before deciding who owns it.",
            },
          ],
        },
      },
      {
        id: "scope-and-limits",
        title: "Scope: what is ours, what is not",
        minutes: 5,
        body: [
          {
            type: "paragraph",
            text: "Knowing the boundary is one of the most valuable things a new technician can learn quickly. Working outside it wastes your time, delays the person, and occasionally causes real damage.",
          },
          { type: "heading", level: 2, text: "Typically in scope" },
          {
            type: "list",
            ordered: false,
            items: [
              "Account access, password resets, and sign-in problems",
              "Campus wireless and network connectivity",
              "University-managed printers and print queues",
              "Supported software installation and configuration",
              "VPN and remote access",
              "University-issued device support",
            ],
          },
          { type: "heading", level: 2, text: "Typically not in scope" },
          {
            type: "list",
            ordered: false,
            items: [
              "Konica multifunction devices — vendor-serviced",
              "Personally-owned printers and home networking equipment",
              "Course content, grades, and academic policy",
              "Building systems, telephony hardware, and facilities",
              "Departmental applications with their own support team",
            ],
          },
          {
            type: "callout",
            tone: "warning",
            title: "Out of scope still gets a ticket",
            text: "Log it anyway. Unlogged contacts are invisible, and invisible volume is why signage, staffing, and self-service never improve. It takes ninety seconds.",
          },
          {
            type: "callout",
            tone: "tip",
            title: "Redirect with a name, not a direction",
            text: "“That's handled by another department” is worse than no answer. “That's the Registrar's Office, and here's their address” is a real resolution.",
          },
        ],
        check: {
          id: "fundamentals-scope",
          prompt: "Which of these should the Help Desk decline to troubleshoot? Select all that apply.",
          kind: "multiple",
          options: [
            {
              id: "konica",
              text: "A Konica multifunction copier jamming in a department office",
              correct: true,
              explanation:
                "Konica devices are vendor-serviced. Redirect, log the contact, and do not attempt repair.",
            },
            {
              id: "home-printer",
              text: "A faculty member's personal inkjet printer at home",
              correct: true,
              explanation: "Personally-owned equipment is out of scope. Point them to the manufacturer.",
            },
            {
              id: "lab-printer",
              text: "A university-managed lab printer with a stuck queue",
              correct: false,
              explanation: "This is core Help Desk work — clear the queue and resend.",
            },
            {
              id: "vpn",
              text: "A staff member who cannot connect to the VPN from home",
              correct: false,
              explanation: "VPN support is in scope and is one of the most common tickets you will handle.",
            },
          ],
        },
      },
      {
        id: "escalation",
        title: "Knowing when to escalate",
        minutes: 4,
        body: [
          {
            type: "paragraph",
            text: "Escalating is not giving up, and it is not an admission that you are new. It is a routing decision — and making it early is usually the more skilled choice.",
          },
          { type: "heading", level: 2, text: "Escalate when" },
          {
            type: "list",
            ordered: false,
            items: [
              "You have exhausted the documented first-contact steps.",
              "The fix needs access or permissions you do not hold.",
              "There is any sign of a security incident — escalate **before** troubleshooting.",
              "Multiple users report the same failure, suggesting a service-level problem.",
              "The user cannot complete identity verification.",
              "Proceeding would risk data or a production system.",
            ],
          },
          {
            type: "callout",
            tone: "danger",
            title: "Security escalations come first",
            text: "If a user mentions suspicious messages, prompts they did not trigger, or unrecognised activity, stop. Do not reset the password. Escalate immediately — resetting first can destroy the signal the security team needs.",
          },
          { type: "heading", level: 2, text: "Escalating well" },
          {
            type: "steps",
            items: [
              { title: "Write down what you verified", detail: "Facts, not impressions." },
              { title: "Write down what you tried and what each attempt did" },
              { title: "State clearly where it stands and what should happen next" },
              { title: "Tell the user it has moved, and to whom" },
              { title: "Do not promise a resolution time on another team's behalf" },
            ],
          },
          { type: "articleRef", slug: "writing-useful-ticket-notes" },
        ],
        check: {
          id: "fundamentals-escalation",
          prompt:
            "A user says their account keeps locking and they are getting login prompts on their phone that they did not request. What do you do?",
          kind: "single",
          options: [
            {
              id: "reset",
              text: "Reset the password to stop the lockouts, then close the ticket",
              correct: false,
              explanation:
                "This is the single most common serious mistake. Unrequested prompts suggest someone else holds the credentials. Resetting first can destroy signal the security team needs.",
            },
            {
              id: "escalate",
              text: "Escalate immediately through the security path without resetting",
              correct: true,
              explanation:
                "Correct. Unrequested authentication prompts are a possible compromise indicator. Capture the details and escalate — do not remediate at first contact.",
            },
            {
              id: "cached",
              text: "Assume a saved password on another device and walk through clearing it",
              correct: false,
              explanation:
                "Saved credentials cause repeated lockouts, but they do not generate prompts the user never triggered. That detail changes the diagnosis entirely.",
            },
            {
              id: "wait",
              text: "Ask them to wait an hour and call back if it continues",
              correct: false,
              explanation: "Delay is the worst option for a possible compromise. Escalate now.",
            },
          ],
        },
      },
    ],
  },

  {
    slug: "tickets-and-documentation",
    title: "Tickets and documentation",
    summary:
      "How to log a contact so it is genuinely useful — the ticket lifecycle, note structure, and what never belongs in a ticket.",
    order: 2,
    category: "ticketing",
    visibility: "public",
    status: "published",
    updatedAt: "2026-08-02",
    updatedBy: "Help Desk Leadership",
    revision: 4,
    verification: "unverified",
    prerequisites: ["help-desk-fundamentals"],
    outcomes: [
      "Move a ticket through its states correctly",
      "Write notes another technician can act on",
      "Know what must never be recorded in a ticket",
    ],
    steps: [
      {
        id: "lifecycle",
        title: "The ticket lifecycle",
        minutes: 4,
        body: [
          {
            type: "paragraph",
            text: "A ticket is the Help Desk's memory. It is how work is handed off, how patterns become visible, and how a user avoids repeating their story to four people.",
          },
          {
            type: "fields",
            items: [
              { label: "New", value: "Logged, not yet worked." },
              { label: "In progress", value: "Actively being worked by a named person." },
              { label: "Waiting on user", value: "Blocked on something specific from the requester." },
              { label: "Escalated", value: "With another team, context attached." },
              { label: "Resolved", value: "Fixed and confirmed — not “probably fixed”." },
              { label: "Closed", value: "Finalised, reopens if it returns." },
            ],
          },
          {
            type: "callout",
            tone: "warning",
            title: "“Waiting on user” needs a named blocker",
            text: "Say exactly what you are waiting for. A ticket parked in this state with a vague note is one nobody can rescue later.",
          },
          { type: "link", linkKey: "help-desk-portal" },
        ],
      },
      {
        id: "good-notes",
        title: "Writing notes someone else can use",
        minutes: 6,
        body: [
          {
            type: "paragraph",
            text: "Write for the technician who picks this up tomorrow morning knowing nothing about it. That person is often you, and you will not remember.",
          },
          {
            type: "steps",
            items: [
              { title: "What the user reported", detail: "Their words, and the exact error text." },
              { title: "What you verified", detail: "Established facts — account type, device, network, what else works." },
              { title: "What you tried", detail: "And what each attempt produced. Failures are informative." },
              { title: "Where it stands", detail: "Resolved, blocked on something named, or escalated to a named team." },
              { title: "What should happen next", detail: "The most valuable line in the ticket." },
            ],
          },
          {
            type: "code",
            caption: "Not useful",
            code: "User called about printer. Tried some things. Still broken.",
          },
          {
            type: "code",
            caption: "Useful",
            code: `Reported: nothing prints from library lab printer LIB-2F.
Verified: queue had a stuck job at head; user's quota fine;
device panel shows no errors.
Tried: cleared stuck job, sent test page — printed successfully.
Status: resolved, confirmed with user at the device.`,
          },
          {
            type: "callout",
            tone: "tip",
            title: "Verbatim beats paraphrase",
            text: "“Some kind of certificate error” and the actual error string are worth very different amounts. Ask people to read it out, and type it exactly.",
          },
        ],
        check: {
          id: "ticket-notes-quality",
          prompt: "Which note is most useful to the next technician?",
          kind: "single",
          options: [
            {
              id: "brief",
              text: "“VPN issue, escalated to network team.”",
              correct: false,
              explanation:
                "The receiving team now has to repeat every check you already did. This is the note that makes escalations slow.",
            },
            {
              id: "detailed",
              text: "“VPN fails at sign-in, error verbatim: 'Unable to establish secure connection'. Web email sign-in works, MFA approved. Fails on home network, connects on hotspot. Tried client restart + reboot. Escalated to Network — appears specific to home network.”",
              correct: true,
              explanation:
                "Correct. It separates what was verified from what was attempted, includes the decisive hotspot test, and states a hypothesis. Nobody repeats your work.",
            },
            {
              id: "apologetic",
              text: "“Tried everything I could think of, sorry — passing this on.”",
              correct: false,
              explanation:
                "This records feelings rather than facts. The next person learns nothing about what has already been ruled out.",
            },
            {
              id: "technical",
              text: "“Layer 3 connectivity anomaly, suspect MTU mismatch.”",
              correct: false,
              explanation:
                "Speculative jargon without evidence sends the next technician down a path you never actually tested. Record what you observed.",
            },
          ],
        },
      },
      {
        id: "never-record",
        title: "What never belongs in a ticket",
        minutes: 3,
        body: [
          {
            type: "callout",
            tone: "danger",
            title: "Never record credentials",
            text: "No passwords, no one-time codes, no security answers — not even temporarily, not even “I'll delete it after”. Ticket text is retained, searchable, and read by many people.",
          },
          {
            type: "list",
            ordered: false,
            items: [
              "**Credentials of any kind** — including ones a user volunteers.",
              "**Personal information beyond what the ticket needs** — health details, financial details, anything about a third party.",
              "**Editorial commentary about the user.** Assume they will read it, because they may.",
              "**Speculation stated as fact.** Say “appears to be” when that is what you mean.",
            ],
          },
          {
            type: "callout",
            tone: "tip",
            title: "The re-read test",
            text: "Before saving, ask: would this note be fine if the user, your supervisor, and an auditor all read it? If yes, save it.",
          },
        ],
      },
    ],
  },

  {
    slug: "communication",
    title: "Communication",
    summary:
      "Phone and written technique, translating jargon, and handling calls where the person is already frustrated.",
    order: 5,
    category: "communication",
    visibility: "public",
    status: "published",
    updatedAt: "2026-07-25",
    updatedBy: "Help Desk Leadership",
    revision: 4,
    verification: "unverified",
    prerequisites: ["help-desk-fundamentals"],
    outcomes: [
      "Run a clear, calm support call from open to close",
      "Write messages people actually read and act on",
      "De-escalate frustration and know where the line is",
    ],
    steps: [
      {
        id: "on-the-phone",
        title: "On the phone",
        minutes: 4,
        body: [
          {
            type: "list",
            ordered: false,
            items: [
              "Open with the Help Desk and your first name — people relax when they know who they are talking to.",
              "Slow down when giving instructions. What is muscle memory to you is unfamiliar to them.",
              "Narrate the silences. Dead air feels like being abandoned.",
              "Confirm the fix while they are still on the line: “Can you try it now?”",
              "Close by saying what happens next, even when the answer is “nothing, you're all set”.",
            ],
          },
          {
            type: "callout",
            tone: "tip",
            title: "Never make someone feel stupid",
            text: "Not with words, not with tone, not with a pause. “That's a really common one” costs nothing and changes the entire interaction.",
          },
        ],
      },
      {
        id: "translating-jargon",
        title: "Translating jargon",
        minutes: 3,
        body: [
          {
            type: "paragraph",
            text: "Technical vocabulary is precise among technicians and alienating with everyone else. Translate by default.",
          },
          {
            type: "fields",
            items: [
              { label: "Clear your cache", value: "“Clear your browsing history — I'll show you where.”" },
              { label: "It's a DNS issue", value: "“Your computer is having trouble finding that site.”" },
              { label: "Escalating to tier 2", value: "“I'm passing this to the team that handles this system.”" },
              { label: "Authenticate", value: "“Sign in.”" },
            ],
          },
        ],
        check: {
          id: "communication-jargon",
          prompt:
            "A student says “it just says error and won't let me in”. What is the most useful next question?",
          kind: "single",
          options: [
            {
              id: "verbatim",
              text: "“Could you read me exactly what it says, word for word?”",
              correct: true,
              explanation:
                "Correct. The exact wording distinguishes a wrong password from a disabled account from an expired one. Everything downstream depends on it.",
            },
            {
              id: "cache",
              text: "“Have you tried clearing your cache and cookies?”",
              correct: false,
              explanation:
                "Jumping to a fix before understanding the failure — and phrased in language many callers will not follow.",
            },
            {
              id: "browser",
              text: "“What browser and version are you running?”",
              correct: false,
              explanation:
                "Possibly relevant later, but it is not what is blocking the diagnosis right now.",
            },
            {
              id: "reset",
              text: "“I'll just reset your password.”",
              correct: false,
              explanation:
                "Acting before diagnosing. If the account is disabled or expired, a reset changes nothing and the user calls back.",
            },
          ],
        },
      },
      {
        id: "frustrated-users",
        title: "Frustrated users",
        minutes: 5,
        body: [
          {
            type: "paragraph",
            text: "By the time someone reaches you they may have lost an hour, missed a deadline, or been transferred twice. The frustration is rarely about you — but you are the person who can end it.",
          },
          {
            type: "steps",
            items: [
              { title: "Let them finish", detail: "Thirty uninterrupted seconds costs less than the argument it prevents." },
              { title: "Acknowledge the impact, not the fault", detail: "You are not admitting anyone did anything wrong." },
              { title: "Say what you are doing right now", detail: "Vagueness is what escalates calls." },
              { title: "Give honest timelines", detail: "An accurate “tomorrow” beats an optimistic promise that fails." },
              { title: "Follow through visibly", detail: "Update the ticket, and say that you have." },
            ],
          },
          {
            type: "callout",
            tone: "warning",
            title: "Where the line is",
            text: "Frustration you absorb professionally. Abuse you do not. State once that you want to help and need the conversation to stay respectful; if it continues, end the call, document it factually, and tell your supervisor the same shift.",
          },
          { type: "articleRef", slug: "handling-frustrated-users" },
        ],
        check: {
          id: "communication-frustration",
          prompt:
            "A faculty member is angry about a two-day-old unresolved ticket and raises their voice. What is the strongest opening move?",
          kind: "single",
          options: [
            {
              id: "defend",
              text: "Explain that the delay was caused by another team",
              correct: false,
              explanation:
                "Defending the department before acknowledging the impact reads as deflection and reliably makes the call worse.",
            },
            {
              id: "listen",
              text: "Let them finish, acknowledge the impact, then state the specific next action you are taking",
              correct: true,
              explanation:
                "Correct. Uninterrupted venting, a genuine acknowledgement, then concrete action — that sequence resolves most of these calls.",
            },
            {
              id: "transfer",
              text: "Transfer them to a supervisor straight away",
              correct: false,
              explanation:
                "Immediate transfer confirms their sense of being passed around. Reserve escalation for abuse or a genuine policy decision.",
            },
            {
              id: "apologise",
              text: "Apologise repeatedly until they calm down",
              correct: false,
              explanation:
                "Repeated apologising reads as uncertainty and invites more pressure. One sincere acknowledgement, then action.",
            },
          ],
        },
      },
    ],
  },
];
