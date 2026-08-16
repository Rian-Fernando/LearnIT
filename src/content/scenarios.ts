import type { Scenario } from "@/lib/content/schema";

/**
 * Practice scenarios.
 *
 * Every ticket reference, requester, and message below is fictional. Scenarios
 * are written from general Help Desk practice, never from real ticket data —
 * see docs/security.md on why real tickets must never become training content.
 */
export const scenarios: Scenario[] = [
  {
    slug: "vpn-wont-connect",
    title: "VPN will not connect",
    summary:
      "A student cannot reach a department file share from home. Work out what to collect, what to test, and when to escalate.",
    category: "vpn",
    difficulty: "intro",
    visibility: "public",
    status: "published",
    updatedAt: "2026-08-06",
    updatedBy: "Help Desk Leadership",
    revision: 3,
    verification: "unverified",
    articleSlugs: ["vpn-connection-troubleshooting", "vpn-what-it-is"],
    ticket: {
      reference: "HD-10482",
      requesterType: "student",
      device: "MacBook Air (personal)",
      channel: "email",
      subject: "VPN keeps failing",
      message:
        "I've tried connecting three times and it keeps failing. I need to get to my research group's shared drive for a meeting tomorrow morning. It worked fine last week.",
      context: ["Working from home", "Meeting tomorrow at 9am"],
    },
    stages: [
      {
        id: "first-question",
        prompt: "What is the most useful first question to ask?",
        kind: "single",
        options: [
          {
            id: "exact-error",
            text: "What is the exact wording of the error, and at what point does it appear?",
            correct: true,
            feedback:
              "Right. “Keeps failing” covers at least four different failures. The exact wording and the failure point narrow it immediately.",
          },
          {
            id: "reinstall",
            text: "Have you tried reinstalling the VPN client?",
            correct: false,
            feedback:
              "Jumping to an invasive fix before understanding the failure. It worked last week, so a corrupted install is unlikely.",
          },
          {
            id: "restart",
            text: "Have you restarted your computer?",
            correct: false,
            feedback:
              "Sometimes effective, but asking it first — before you know anything — reads as a brush-off to someone who has already tried three times.",
          },
          {
            id: "os-version",
            text: "What version of macOS are you running?",
            correct: false,
            feedback:
              "May matter later. It is not what is blocking the diagnosis right now.",
          },
        ],
      },
      {
        id: "need-check",
        prompt:
          "They reply: the client accepts their sign-in, then reports “Unable to establish secure connection.” They confirm they need the shared drive. What next?",
        kind: "single",
        options: [
          {
            id: "verify-account",
            text: "Have them sign in to their email in a browser to confirm the account is healthy",
            correct: true,
            feedback:
              "Correct. Fifteen seconds, and it cleanly separates an account problem from a VPN problem before you go further.",
          },
          {
            id: "escalate-now",
            text: "Escalate to the network team — the error mentions a secure connection",
            correct: false,
            feedback:
              "Far too early. First-contact steps are not exhausted, and the receiving team would send it straight back.",
          },
          {
            id: "not-needed",
            text: "Tell them the VPN is not needed for this",
            correct: false,
            feedback:
              "A department file share genuinely does need the VPN. This is one of the cases where it is required.",
          },
          {
            id: "settings",
            text: "Walk them through changing their DNS settings",
            correct: false,
            feedback:
              "Never modify network settings on a personal machine over the phone. This creates problems that outlive the ticket.",
          },
        ],
      },
      {
        id: "isolate",
        prompt:
          "Web email works fine and the multi-factor prompt was approved. What is the single most valuable test now?",
        kind: "single",
        options: [
          {
            id: "hotspot",
            text: "Have them try connecting over a phone hotspot",
            correct: true,
            feedback:
              "The decisive test. It separates a device or client problem from a network problem in one step, and the result determines everything after.",
          },
          {
            id: "reinstall2",
            text: "Reinstall the VPN client",
            correct: false,
            feedback:
              "Possible eventually, but you have not yet established whether the client is even at fault.",
          },
          {
            id: "another-computer",
            text: "Ask them to try from a different computer",
            correct: false,
            feedback:
              "Useful in principle, but most people do not have a spare laptop. The hotspot test is available to almost everyone.",
          },
          {
            id: "wait",
            text: "Ask them to try again in a few hours",
            correct: false,
            feedback:
              "This is a deadline-bound request. Delay without a diagnosis is the worst option here.",
          },
        ],
      },
      {
        id: "resolution",
        prompt:
          "It connects immediately on the hotspot and never on their home network. What is the correct action?",
        kind: "multiple",
        options: [
          {
            id: "escalate-network",
            text: "Escalate to the network team with the hotspot result recorded",
            correct: true,
            feedback:
              "Correct. The client and account are proven; this is specific to their home network and needs a team that can look at the protocol path.",
          },
          {
            id: "set-expectations",
            text: "Tell the user what was established and that it has moved to another team",
            correct: true,
            feedback:
              "Essential — especially with a deadline in the morning. They need to know where it stands.",
          },
          {
            id: "router-config",
            text: "Walk them through changing their home router configuration",
            correct: false,
            feedback:
              "Out of scope, and you cannot see what else on their network depends on that configuration.",
          },
          {
            id: "close",
            text: "Close the ticket since the VPN works on another network",
            correct: false,
            feedback:
              "The user's actual problem is unresolved. Working on a hotspot is a diagnostic result, not a fix.",
          },
        ],
      },
    ],
    debrief: [
      {
        type: "paragraph",
        text: "This ticket rewards sequencing. Each step ruled out a whole class of cause: the exact error narrowed the failure, web email cleared the account, and the hotspot isolated the network.",
      },
      {
        type: "callout",
        tone: "tip",
        title: "The hotspot test earns its reputation",
        text: "One test, two minutes, and it splits the entire problem space in half. Reach for it early in almost any connectivity ticket.",
      },
      {
        type: "list",
        ordered: false,
        items: [
          "Never modify a user's home network configuration.",
          "Escalating with evidence is fast; escalating with “tried everything” is not.",
          "A deadline in the ticket changes your communication, not your standards.",
        ],
      },
    ],
  },

  {
    slug: "konica-copier-jam",
    title: "The copier that is not ours",
    summary:
      "A frustrated staff member wants the department copier fixed today. Practise holding a scope boundary while still being useful.",
    category: "printing",
    difficulty: "intro",
    visibility: "public",
    status: "published",
    updatedAt: "2026-08-05",
    updatedBy: "Help Desk Leadership",
    revision: 2,
    verification: "unverified",
    articleSlugs: ["konica-device-redirect", "printing-support-scope"],
    ticket: {
      reference: "HD-10517",
      requesterType: "staff",
      device: "Konica Minolta multifunction copier",
      channel: "phone",
      subject: "Copier jammed — need it today",
      message:
        "The big copier on our floor is jammed again and I have 200 packets to run before a 2pm board meeting. Someone needs to come fix this now.",
      context: ["Board meeting at 2pm", "Second time this month", "Caller is audibly stressed"],
    },
    stages: [
      {
        id: "identify",
        prompt: "What do you establish first?",
        kind: "single",
        options: [
          {
            id: "confirm-device",
            text: "Confirm the make of the device — ask what branding is on the front",
            correct: true,
            feedback:
              "Correct. Scope determines everything here. Twenty seconds of identification prevents twenty minutes of work you should not be doing.",
          },
          {
            id: "dispatch",
            text: "Arrange for a technician to be dispatched",
            correct: false,
            feedback: "Committing to a dispatch before knowing whether the device is even ours.",
          },
          {
            id: "walkthrough",
            text: "Walk them through clearing the jam",
            correct: false,
            feedback:
              "You do not yet know what device this is — and if it is a Konica, this is exactly what you must not do.",
          },
          {
            id: "ticket-only",
            text: "Log a ticket and tell them someone will follow up",
            correct: false,
            feedback:
              "Vague deferral to someone under time pressure. You can give them a real answer right now.",
          },
        ],
      },
      {
        id: "handle",
        prompt: "They confirm it says Konica Minolta. How do you handle it?",
        kind: "single",
        options: [
          {
            id: "clear-redirect",
            text: "Tell them plainly it is vendor-serviced, point them to the service number on the unit, and log the ticket",
            correct: true,
            feedback:
              "Correct. Clear, confident, and actionable. Certainty is what makes a redirect land well — hesitation invites negotiation.",
          },
          {
            id: "try-anyway",
            text: "Try to help anyway since they are under pressure and it is only a jam",
            correct: false,
            feedback:
              "Understandable instinct, wrong call. These devices are under a vendor agreement, and a well-meant attempt can complicate the vendor's repair.",
          },
          {
            id: "over-apologise",
            text: "Apologise repeatedly and explain the Help Desk's limitations in detail",
            correct: false,
            feedback:
              "Over-apologising reads as uncertainty and invites pressure. One clear sentence, then the next step.",
          },
          {
            id: "escalate-supervisor",
            text: "Escalate to a supervisor because the caller is upset",
            correct: false,
            feedback:
              "Frustration alone is not an escalation trigger. You have a clear, correct answer to give.",
          },
        ],
      },
      {
        id: "actual-need",
        prompt: "They are still stuck: 200 packets, four hours. What genuinely helps?",
        kind: "multiple",
        options: [
          {
            id: "alternative-printer",
            text: "Point them to the nearest supported printer that could handle the job",
            correct: true,
            feedback:
              "This is the answer. Their real problem is “200 packets by 2pm”, not “the copier is broken”. One question uncovers it.",
          },
          {
            id: "log-ticket",
            text: "Log the ticket as an out-of-scope Konica contact",
            correct: true,
            feedback:
              "Yes — repeated jams on the same unit are exactly the pattern leadership needs visibility of.",
          },
          {
            id: "fix-it",
            text: "Go and look at the copier yourself since it is urgent",
            correct: false,
            feedback: "Urgency does not change scope. It is still a vendor-serviced device.",
          },
          {
            id: "nothing",
            text: "Nothing further — the redirect completes your responsibility",
            correct: false,
            feedback:
              "Technically true, and a poor outcome. Solving the underlying need is what separates a good technician from a correct one.",
          },
        ],
      },
    ],
    debrief: [
      {
        type: "paragraph",
        text: "Out of scope does not mean out of ideas. The scope boundary held, and the person still got their packets printed.",
      },
      {
        type: "callout",
        tone: "tip",
        title: "Listen for the need under the request",
        text: "“Fix the copier” was the request. “Get 200 packets printed by 2pm” was the need. Only one of those is in your power, and it happened to be the one that mattered.",
      },
    ],
  },

  {
    slug: "suspicious-login-prompts",
    title: "Prompts they did not request",
    summary:
      "A routine-sounding lockout turns out to be something else. Practise recognising the pivot and responding correctly.",
    category: "accounts",
    difficulty: "advanced",
    visibility: "public",
    status: "published",
    updatedAt: "2026-08-08",
    updatedBy: "Help Desk Leadership",
    revision: 2,
    verification: "unverified",
    articleSlugs: ["recognising-phishing-reports", "account-lockout-escalation"],
    ticket: {
      reference: "HD-10603",
      requesterType: "faculty",
      device: "University-issued laptop",
      channel: "phone",
      subject: "Account keeps locking",
      message:
        "My account has locked three times today. I keep resetting it and it locks again. Also my phone has been buzzing with login approval requests all morning — I've been declining them but it's driving me mad.",
      context: ["Third lockout today", "Teaching in 30 minutes"],
    },
    stages: [
      {
        id: "recognise",
        prompt: "What is the most important detail in this report?",
        kind: "single",
        options: [
          {
            id: "prompts",
            text: "Approval requests arriving that the user did not initiate",
            correct: true,
            feedback:
              "Correct, and it changes everything. Unrequested prompts mean someone else is attempting to sign in with their credentials right now.",
          },
          {
            id: "three-times",
            text: "The account locked three times today",
            correct: false,
            feedback:
              "Repeated lockouts alone usually mean cached credentials. Paired with unrequested prompts, they mean something else entirely.",
          },
          {
            id: "teaching",
            text: "They are teaching in thirty minutes",
            correct: false,
            feedback:
              "Real pressure, and it shapes how you communicate — but it does not change the diagnosis or the required action.",
          },
          {
            id: "resets",
            text: "They have already reset the password themselves",
            correct: false,
            feedback:
              "Relevant context, but not the decisive signal. The prompts are.",
          },
        ],
      },
      {
        id: "immediate-action",
        prompt: "What do you do right now?",
        kind: "single",
        options: [
          {
            id: "escalate",
            text: "Escalate immediately through the security path, without resetting the password again",
            correct: true,
            feedback:
              "Correct. This is a possible active compromise. Escalate before remediating — a reset can destroy signal the security team needs.",
          },
          {
            id: "reset-again",
            text: "Reset the password once more, then have them update saved passwords on all devices",
            correct: false,
            feedback:
              "The standard cached-credentials playbook, applied to the wrong situation. The prompts are the reason this is not that.",
          },
          {
            id: "ask-password",
            text: "Ask what password they have been using so you can check whether it is compromised",
            correct: false,
            feedback:
              "Never ask for a password. There is no version of this that is appropriate, and it creates a second problem.",
          },
          {
            id: "wait",
            text: "Ask them to keep declining the prompts and call back after their class",
            correct: false,
            feedback:
              "Delay during a possible active compromise is the worst available option.",
          },
        ],
      },
      {
        id: "information",
        prompt: "What do you capture for the escalation?",
        kind: "multiple",
        options: [
          {
            id: "clicked",
            text: "Whether they clicked anything or entered credentials anywhere recently",
            correct: true,
            feedback:
              "The single most important question. It determines the severity of everything that follows.",
          },
          {
            id: "timing",
            text: "When the prompts started and how frequently they arrive",
            correct: true,
            feedback: "Timing bounds the incident window for whoever investigates.",
          },
          {
            id: "approved",
            text: "Whether they approved any of the prompts, even accidentally",
            correct: true,
            feedback:
              "Critical. An approved prompt means the second factor was satisfied, which is a materially worse situation.",
          },
          {
            id: "password-value",
            text: "The password they were using",
            correct: false,
            feedback:
              "Never. You need to know *that* credentials may be exposed, never what they were.",
          },
        ],
      },
      {
        id: "communication",
        prompt: "How do you handle the human side, given they teach in thirty minutes?",
        kind: "single",
        options: [
          {
            id: "honest",
            text: "Explain plainly that this needs the security team, that you are escalating now, and what to expect — without blame",
            correct: true,
            feedback:
              "Correct. Honest, calm, and no lecture. They did the right thing by mentioning the prompts, and they should feel that.",
          },
          {
            id: "alarm",
            text: "Tell them their account is compromised and they should assume everything is exposed",
            correct: false,
            feedback:
              "Alarming and premature. Report the facts and let the security team make the determination.",
          },
          {
            id: "downplay",
            text: "Reassure them it is probably nothing and the security team will confirm",
            correct: false,
            feedback:
              "Understating it discourages the exact vigilance you want. Do not editorialise in either direction.",
          },
          {
            id: "lecture",
            text: "Explain how to recognise phishing so it does not happen again",
            correct: false,
            feedback:
              "Wrong moment entirely. That conversation belongs after resolution, not while they are heading into a class.",
          },
        ],
      },
    ],
    debrief: [
      {
        type: "paragraph",
        text: "This scenario opens as a textbook cached-credentials lockout and pivots on one clause. The skill being practised is noticing the pivot.",
      },
      {
        type: "callout",
        tone: "danger",
        title: "Unrequested prompts are never routine",
        text: "If a user reports authentication prompts they did not trigger, stop. Do not reset. Escalate. That sequence is not negotiable.",
      },
      {
        type: "list",
        ordered: false,
        items: [
          "Ask whether anything was clicked, entered, or approved — always.",
          "Never ask for a password, in any circumstance.",
          "Do not lecture someone mid-incident. Blame slows down the only thing that matters, which is speed.",
        ],
      },
    ],
  },

  {
    slug: "alumni-email-access",
    title: "The graduate whose email stopped working",
    summary:
      "Recognise a scheduled account transition rather than troubleshooting behaviour that is working as designed.",
    category: "accounts",
    difficulty: "core",
    visibility: "public",
    status: "published",
    updatedAt: "2026-07-28",
    updatedBy: "Help Desk Leadership",
    revision: 2,
    verification: "unverified",
    articleSlugs: ["alumni-account-transition", "account-types-overview"],
    ticket: {
      reference: "HD-10388",
      requesterType: "alumni",
      device: "Personal Windows laptop",
      channel: "email",
      subject: "Locked out of everything",
      message:
        "I graduated in May and suddenly I can't get into the library databases or my file storage. My email still works. I didn't change anything. Did my account get hacked?",
      context: ["Graduated in May", "Applying to graduate programmes"],
    },
    stages: [
      {
        id: "diagnose",
        prompt: "What is the most likely explanation?",
        kind: "single",
        options: [
          {
            id: "transition",
            text: "The account transitioned to alumni access, and those services are not part of it",
            correct: true,
            feedback:
              "Correct. Partial access loss after graduation, with no change on the user's end, is the signature of a scheduled transition.",
          },
          {
            id: "compromise",
            text: "The account was compromised",
            correct: false,
            feedback:
              "The user raised it, but the pattern does not fit. A compromise does not selectively remove exactly the services a graduation removes.",
          },
          {
            id: "password",
            text: "Their password needs resetting",
            correct: false,
            feedback: "Their email still works, so the credential is fine.",
          },
          {
            id: "outage",
            text: "Those systems are having an outage",
            correct: false,
            feedback:
              "Worth a glance at service status, but two unrelated systems failing for one recent graduate points elsewhere.",
          },
        ],
      },
      {
        id: "verify",
        prompt: "Before explaining, what do you do?",
        kind: "single",
        options: [
          {
            id: "verify-first",
            text: "Verify their identity through the approved process, then confirm the account status",
            correct: true,
            feedback:
              "Correct. Verification applies to graduates exactly as it does to current students — and you should confirm the transition rather than assume it.",
          },
          {
            id: "explain-now",
            text: "Reply with the explanation straight away since it is not a security matter",
            correct: false,
            feedback:
              "Even a benign-sounding account discussion requires verification first.",
          },
          {
            id: "restore",
            text: "Restore their access as a courtesy while they apply to graduate programmes",
            correct: false,
            feedback:
              "Not yours to grant, and promising it creates a problem someone else has to walk back.",
          },
          {
            id: "escalate",
            text: "Escalate to account services",
            correct: false,
            feedback: "This is well within first-contact handling once verified.",
          },
        ],
      },
      {
        id: "explain",
        prompt: "How do you explain it?",
        kind: "multiple",
        options: [
          {
            id: "specific",
            text: "Say specifically what continues and what has ended",
            correct: true,
            feedback:
              "Specificity is the whole job here. A vague answer produces a reply asking the same question again.",
          },
          {
            id: "reassure",
            text: "Confirm this is a scheduled change, not a compromise",
            correct: true,
            feedback: "They asked directly whether they were hacked. Answer it plainly.",
          },
          {
            id: "route",
            text: "Point them to the right office for anything driven by policy",
            correct: true,
            feedback:
              "Correct. Alumni access is policy, and they have a real need worth routing properly.",
          },
          {
            id: "promise",
            text: "Tell them you will see whether library access can be extended",
            correct: false,
            feedback:
              "Do not offer what you cannot deliver. Route the request instead of promising an outcome.",
          },
        ],
      },
    ],
    debrief: [
      {
        type: "paragraph",
        text: "Recognising “working as designed” is a real diagnostic skill. Troubleshooting this as a fault would have wasted the graduate's time and produced no fix, because nothing was broken.",
      },
      {
        type: "callout",
        tone: "tip",
        title: "Answer the question they actually asked",
        text: "They asked whether they had been hacked. Whatever else you cover, answer that directly — it is the thing they are worried about.",
      },
    ],
  },

  {
    slug: "remote-session-boundaries",
    title: "A remote session that drifts",
    summary:
      "A routine remote session where the user makes reasonable-sounding requests that cross a boundary.",
    category: "remote-support",
    difficulty: "core",
    visibility: "public",
    status: "published",
    updatedAt: "2026-08-09",
    updatedBy: "Help Desk Leadership",
    revision: 2,
    verification: "unverified",
    articleSlugs: ["remote-support-session-conduct"],
    ticket: {
      reference: "HD-10559",
      requesterType: "staff",
      device: "University-issued laptop",
      channel: "phone",
      subject: "Software will not launch",
      message:
        "The application crashes every time I open it. Can you just get on and sort it out? I'm happy to leave you to it, I've got a meeting.",
      context: ["User wants to leave during the session", "University-issued device"],
    },
    stages: [
      {
        id: "unattended",
        prompt: "They offer to leave you to it while they attend their meeting. What do you do?",
        kind: "single",
        options: [
          {
            id: "reschedule",
            text: "Explain that they need to stay present, and offer a specific alternative time",
            correct: true,
            feedback:
              "Correct. Never work on an unattended machine — the user must be able to see what is done and stop it. Offering a concrete time keeps it helpful.",
          },
          {
            id: "proceed",
            text: "Proceed — it is a university device and they gave permission",
            correct: false,
            feedback:
              "Device ownership does not change this. Presence is what makes remote access accountable.",
          },
          {
            id: "quick",
            text: "Work quickly and try to finish before they leave",
            correct: false,
            feedback: "Rushing a fix to beat a deadline is how mistakes get made.",
          },
          {
            id: "record",
            text: "Proceed but record everything you do in the ticket",
            correct: false,
            feedback:
              "Documentation is good and is not a substitute for the user being present.",
          },
        ],
      },
      {
        id: "consent",
        prompt: "They agree to stay. Before connecting, what must happen?",
        kind: "multiple",
        options: [
          {
            id: "explain",
            text: "Explain what you will be able to see and what you will change",
            correct: true,
            feedback: "Consent requires them knowing what they are consenting to.",
          },
          {
            id: "close-personal",
            text: "Ask them to close anything personal first",
            correct: true,
            feedback:
              "Offering this unprompted is the easiest trust you will ever earn.",
          },
          {
            id: "explicit-yes",
            text: "Ask for permission and wait for a clear yes",
            correct: true,
            feedback: "“I'm connecting now” is an announcement. Wait for the yes.",
          },
          {
            id: "assume",
            text: "Treat their support request as consent to connect",
            correct: false,
            feedback:
              "Asking for help is not consent to remote access. They are different things and must be asked separately.",
          },
        ],
      },
      {
        id: "drift",
        prompt:
          "Mid-session they say: “While you're in there, could you take a look at my personal email? It's been slow.” How do you respond?",
        kind: "single",
        options: [
          {
            id: "decline-offer",
            text: "Explain you are working within this ticket, and offer to log a separate one",
            correct: true,
            feedback:
              "Correct. Access granted for one problem is not access for anything else — and a separate ticket is a genuinely helpful answer.",
          },
          {
            id: "quick-look",
            text: "Take a quick look since you are already connected",
            correct: false,
            feedback:
              "The exact drift to avoid. Their personal mail is outside both the ticket and the consent they gave.",
          },
          {
            id: "refuse-flat",
            text: "Say that is not something the Help Desk does and move on",
            correct: false,
            feedback:
              "The boundary is right but curt. Offering the separate ticket keeps it collaborative.",
          },
          {
            id: "after",
            text: "Agree to look once the main issue is resolved",
            correct: false,
            feedback: "Deferring the boundary is not holding it.",
          },
        ],
      },
      {
        id: "closing",
        prompt: "The application is fixed. How do you close out?",
        kind: "multiple",
        options: [
          {
            id: "announce",
            text: "Tell them you are finished and disconnecting",
            correct: true,
            feedback: "A silent disconnect leaves people unsure whether you are still watching.",
          },
          {
            id: "terminate",
            text: "End the session explicitly in the console and confirm it terminated",
            correct: true,
            feedback: "Closing a window is not the same as ending the session.",
          },
          {
            id: "summarise",
            text: "Summarise what you changed, on the call and in the ticket",
            correct: true,
            feedback: "Someone will inherit this machine's next problem. Make it easy for them.",
          },
          {
            id: "keep-open",
            text: "Leave the session available in case the problem returns today",
            correct: false,
            feedback:
              "That is standing access nobody consented to. End it, and start fresh if needed.",
          },
        ],
      },
    ],
    debrief: [
      {
        type: "paragraph",
        text: "Nothing in this scenario is hostile. The user is friendly and their requests sound reasonable — which is exactly why boundaries drift in real sessions.",
      },
      {
        type: "callout",
        tone: "warning",
        title: "Consent is specific",
        text: "Permission for one problem is not permission for the machine. When the scope of a session changes, the consent conversation has to happen again.",
      },
    ],
  },

  {
    slug: "printer-nothing-happens",
    title: "Nothing comes out of the printer",
    summary:
      "A high-frequency ticket that rewards working the path in order rather than jumping to a reinstall.",
    category: "printing",
    difficulty: "intro",
    visibility: "public",
    status: "published",
    updatedAt: "2026-07-30",
    updatedBy: "Help Desk Leadership",
    revision: 2,
    verification: "unverified",
    articleSlugs: ["printer-troubleshooting-path"],
    ticket: {
      reference: "HD-10441",
      requesterType: "student",
      device: "Personal laptop, campus wireless",
      channel: "chat",
      subject: "Printer not working in the library",
      message:
        "I sent my paper to the library printer like 20 minutes ago and nothing has printed. I've sent it four more times since. It's due at midnight.",
      context: ["Deadline at midnight", "Job sent five times total"],
    },
    stages: [
      {
        id: "first-check",
        prompt: "What do you check first?",
        kind: "single",
        options: [
          {
            id: "which-printer",
            text: "Which physical printer they are standing at, and whether the job needs releasing there",
            correct: true,
            feedback:
              "Correct. Release is the most common cause of “I printed it and nothing happened”, and people routinely send jobs to the wrong building.",
          },
          {
            id: "reinstall",
            text: "Have them remove and re-add the printer",
            correct: false,
            feedback:
              "Invasive, slow, and premature. There are several far more likely causes to rule out first.",
          },
          {
            id: "restart",
            text: "Have them restart their laptop",
            correct: false,
            feedback: "Unlikely to help, and it costs a student on a deadline several minutes.",
          },
          {
            id: "escalate",
            text: "Escalate to the team that manages library printers",
            correct: false,
            feedback: "Nothing has been established yet.",
          },
        ],
      },
      {
        id: "five-jobs",
        prompt:
          "They confirm the printer requires release at the device, and they have not done that. What else needs handling?",
        kind: "single",
        options: [
          {
            id: "clear-extras",
            text: "Note that five copies are queued — have them release one and cancel the rest",
            correct: true,
            feedback:
              "Correct. Releasing all five would print the paper five times, burning their quota and the paper. Small catch, real save.",
          },
          {
            id: "release-all",
            text: "Have them release everything so at least one comes out",
            correct: false,
            feedback:
              "That prints five copies. On a quota system, that may also block their next print job.",
          },
          {
            id: "ignore",
            text: "Nothing — the extra jobs will expire on their own",
            correct: false,
            feedback:
              "They expire eventually, but the user is at the device now and will release whatever is waiting.",
          },
          {
            id: "quota",
            text: "Check their quota first",
            correct: false,
            feedback:
              "Worth knowing, but the immediate risk is five copies printing in the next thirty seconds.",
          },
        ],
      },
      {
        id: "close-out",
        prompt: "The paper prints. How do you close the ticket?",
        kind: "multiple",
        options: [
          {
            id: "confirm",
            text: "Confirm with the user that they physically have the pages",
            correct: true,
            feedback: "Confirm the outcome, not the action. “It should have printed” is not a resolution.",
          },
          {
            id: "explain-release",
            text: "Briefly explain how release printing works so it does not recur",
            correct: true,
            feedback:
              "Thirty seconds that prevents the next three tickets from the same person.",
          },
          {
            id: "record",
            text: "Record the cause as unreleased jobs rather than just “resolved”",
            correct: true,
            feedback:
              "Cause data is what makes the case for clearer signage at the release stations.",
          },
          {
            id: "close-silent",
            text: "Close it immediately — the job printed, so it is done",
            correct: false,
            feedback:
              "Closing without confirming or recording the cause loses both the check and the pattern.",
          },
        ],
      },
    ],
    debrief: [
      {
        type: "paragraph",
        text: "The whole ticket turned on one question about where they were standing. No reinstall, no escalation, no restart — just the path, in order.",
      },
      {
        type: "callout",
        tone: "tip",
        title: "Watch for the second problem",
        text: "Five queued copies was not what they asked about, and catching it saved their quota. Noticing the adjacent problem is a habit worth building.",
      },
    ],
  },
];
