import type { TrainingModule } from "@/lib/content/schema";

export const systemModules: TrainingModule[] = [
  {
    slug: "accounts-and-access",
    title: "Accounts and access",
    summary:
      "Account types and lifecycles, the password reset path, and the verification rule that never bends.",
    order: 3,
    category: "accounts",
    visibility: "public",
    status: "published",
    updatedAt: "2026-08-04",
    updatedBy: "Help Desk Leadership",
    revision: 4,
    prerequisites: ["help-desk-fundamentals"],
    outcomes: [
      "Identify an account type and what it should be able to reach",
      "Guide a user through self-service password reset",
      "Recognise access problems that are policy rather than fault",
      "Hold the verification line under pressure",
    ],
    steps: [
      {
        id: "account-types",
        title: "Account types and lifecycles",
        minutes: 4,
        body: [
          {
            type: "paragraph",
            text: "Most account tickets become simple once you know which kind of account you are looking at. The type determines what works, for how long, and who owns the decision to change it.",
          },
          {
            type: "fields",
            items: [
              { label: "Student", value: "Created at admission, active while enrolled." },
              { label: "Faculty", value: "Created at hire; often adds VPN eligibility." },
              { label: "Staff", value: "Access follows role — the type most affected by a job change." },
              { label: "Alumni", value: "Reduced access after graduation. Many services intentionally end." },
              { label: "Sponsored guest", value: "Time-limited, requested by a department. Always expires." },
            ],
          },
          {
            type: "callout",
            tone: "tip",
            title: "One question, ten minutes saved",
            text: "“Are you a current student, or did you graduate?” prevents a long troubleshooting session on an account that is behaving exactly as designed.",
          },
          { type: "articleRef", slug: "account-types-overview" },
        ],
        check: {
          id: "accounts-type-id",
          prompt:
            "A caller graduated in May. They can sign in to some services but a campus system now refuses them. What is the most likely explanation?",
          kind: "single",
          options: [
            {
              id: "alumni",
              text: "Their account transitioned to alumni access and that service is no longer included",
              correct: true,
              explanation:
                "Correct. Partial access after graduation is the signature of an alumni transition — a scheduled change, not a fault.",
            },
            {
              id: "password",
              text: "Their password expired and needs resetting",
              correct: false,
              explanation:
                "An expired password would block everything, not one service. The partial pattern rules it out.",
            },
            {
              id: "outage",
              text: "That system is having an outage",
              correct: false,
              explanation: "Possible, but check status rather than assume — and the graduation timing is the stronger signal.",
            },
            {
              id: "browser",
              text: "A browser problem on their device",
              correct: false,
              explanation:
                "A browser fault would not selectively refuse one authenticated service while others work.",
            },
          ],
        },
      },
      {
        id: "verification",
        title: "Verification: the rule that does not bend",
        minutes: 4,
        body: [
          {
            type: "callout",
            tone: "danger",
            title: "No verification, no account action",
            text: "Account access is the highest-risk thing the Help Desk touches. If you cannot verify the person, you do not proceed. This is never rudeness — it is the protection the account holder is entitled to.",
          },
          {
            type: "paragraph",
            text: "Social engineering attempts do not sound suspicious. They sound urgent, senior, and frustrated — because those are the pressures that make people skip steps.",
          },
          {
            type: "list",
            ordered: false,
            items: [
              "“I have a class in five minutes” — urgency is a pressure tactic, not an exception.",
              "“Do you know who I am?” — seniority does not alter the requirement.",
              "“The last person just did it for me” — that would have been a mistake, not a precedent.",
              "“I'm calling on behalf of…” — third-party requests need their own approved path.",
            ],
          },
          {
            type: "callout",
            tone: "tip",
            title: "How to hold the line warmly",
            text: "“I want to get this sorted for you — I just need to confirm a couple of things first, and then we can move.” Firm, friendly, and it does not invite negotiation.",
          },
        ],
        check: {
          id: "accounts-verification",
          prompt:
            "A caller says they are a department head, cannot complete verification, and needs a password reset before a meeting in ten minutes. What do you do?",
          kind: "single",
          options: [
            {
              id: "reset",
              text: "Reset it — their seniority and the urgency justify an exception",
              correct: false,
              explanation:
                "This is exactly the scenario social engineering is built around. Authority and time pressure are the tools, not the exception.",
            },
            {
              id: "hold",
              text: "Explain the verification requirement warmly, offer the approved alternative, and escalate to a supervisor if needed",
              correct: true,
              explanation:
                "Correct. You stay helpful without lowering the bar, and a supervisor owns any genuine exception — not you, under pressure, on the phone.",
            },
            {
              id: "partial",
              text: "Do a partial reset that only works for the meeting",
              correct: false,
              explanation: "No such thing exists. Access is granted or it is not.",
            },
            {
              id: "hangup",
              text: "End the call and tell them to visit in person",
              correct: false,
              explanation:
                "The requirement is right but the handling is not. Explain, offer the approved path, and escalate rather than dismissing them.",
            },
          ],
        },
      },
      {
        id: "reset-path",
        title: "The password reset path",
        minutes: 5,
        body: [
          {
            type: "steps",
            items: [
              { title: "Verify the caller" },
              { title: "Confirm they can access their recovery method", detail: "Check this before starting — it is the most common dead end." },
              { title: "Direct them to the self-service portal", detail: "Read the address slowly. Lookalike sites exist." },
              { title: "Stay on the line while they complete it" },
              { title: "Have them sign in to email to confirm it worked" },
              { title: "Remind them to update saved passwords on phones and tablets" },
              { title: "Record the outcome and close" },
            ],
          },
          { type: "link", linkKey: "account-self-service" },
          {
            type: "callout",
            tone: "danger",
            title: "Never take a password",
            text: "Do not ask for one, do not type one for a user, and do not accept one they volunteer. If a user says it aloud, tell them plainly to change it and note that you did.",
          },
          { type: "articleRef", slug: "password-reset-walkthrough" },
        ],
        check: {
          id: "accounts-relock",
          prompt:
            "A user completes a reset successfully, then is locked out again forty minutes later. What is the most likely cause?",
          kind: "single",
          options: [
            {
              id: "cached",
              text: "A device still has the old password saved and keeps retrying it",
              correct: true,
              explanation:
                "Correct — usually a phone mail app. Walk through every signed-in device before escalating.",
            },
            {
              id: "failed",
              text: "The reset silently failed",
              correct: false,
              explanation: "They signed in successfully after it, so the reset worked.",
            },
            {
              id: "compromise",
              text: "The account is definitely compromised",
              correct: false,
              explanation:
                "Possible, but not the likeliest cause without other indicators. Rule out cached credentials first — and escalate if the user reports prompts they did not trigger.",
            },
            {
              id: "expiry",
              text: "The new password expired",
              correct: false,
              explanation: "No password policy expires a credential in forty minutes.",
            },
          ],
        },
      },
    ],
  },

  {
    slug: "remote-support",
    title: "Remote support",
    summary:
      "Consent, conduct, and closing out — how to run a remote session that a user would be glad to accept again.",
    order: 4,
    category: "remote-support",
    visibility: "public",
    status: "published",
    updatedAt: "2026-08-09",
    updatedBy: "Help Desk Leadership",
    revision: 5,
    prerequisites: ["help-desk-fundamentals", "communication"],
    outcomes: [
      "Decide whether remote control is the right tool",
      "Obtain and record informed consent",
      "Conduct a session professionally",
      "End a session properly and document it",
    ],
    steps: [
      {
        id: "right-tool",
        title: "Is remote control the right tool?",
        minutes: 3,
        body: [
          {
            type: "paragraph",
            text: "Remote access is the most trust-sensitive thing you will do. Use it when it is genuinely the fastest safe route — not as a default.",
          },
          {
            type: "fields",
            items: [
              { label: "Phone guidance", value: "Best when clear instructions will do it. The user learns it for next time." },
              { label: "Screen sharing", value: "Best when you need to see but not touch. The user stays in control." },
              { label: "Remote control", value: "For when the fix genuinely needs hands on their machine." },
            ],
          },
          { type: "link", linkKey: "it-support-meeting-room" },
        ],
      },
      {
        id: "consent",
        title: "Consent, properly",
        minutes: 5,
        body: [
          {
            type: "callout",
            tone: "danger",
            title: "“I'm going to connect now” is not consent",
            text: "It is an announcement. Consent means the user knows what you will be able to see, and has said yes.",
          },
          {
            type: "steps",
            items: [
              { title: "Verify the user through the approved process" },
              { title: "Explain in one plain sentence what you will see and change" },
              { title: "Ask for permission — and wait for a clear yes" },
              { title: "Ask them to close anything personal first", detail: "Offering this unprompted is the easiest trust you will ever earn." },
              { title: "Confirm they will stay at the machine throughout" },
              { title: "Note in the ticket that permission was obtained" },
            ],
          },
          { type: "responseRef", slug: "remote-session-invite" },
        ],
        check: {
          id: "remote-consent",
          prompt: "Which of these is acceptable? Select all that apply.",
          kind: "multiple",
          options: [
            {
              id: "ask-close",
              text: "Asking the user to close personal applications before you connect",
              correct: true,
              explanation: "Good practice, and it signals that you take their privacy seriously.",
            },
            {
              id: "narrate",
              text: "Narrating what you are doing while you work",
              correct: true,
              explanation:
                "Silence while their cursor moves on its own is unsettling. Narration keeps the user oriented.",
            },
            {
              id: "unattended",
              text: "Continuing after the user steps away to get coffee",
              correct: false,
              explanation:
                "Never work on an unattended machine. The user must be able to see what is happening and stop it.",
            },
            {
              id: "browse",
              text: "Opening an unrelated folder to check something while you are connected",
              correct: false,
              explanation:
                "Access granted for one problem is not access for anything else. This is the fastest way to lose a user's trust permanently.",
            },
          ],
        },
      },
      {
        id: "conduct-and-close",
        title: "Conduct and closing out",
        minutes: 5,
        body: [
          {
            type: "list",
            ordered: false,
            items: [
              "Stay inside the problem — do not open anything unrelated to the ticket.",
              "If you see something private, say nothing, move away from it, and carry on.",
              "Ask before installing, uninstalling, or restarting anything.",
              "If the user asks you to stop, stop immediately. No negotiation.",
            ],
          },
          {
            type: "steps",
            items: [
              { title: "Tell the user you are finished and disconnecting" },
              { title: "End the session properly in the console", detail: "Closing a window is not the same as terminating the session — confirm it ended." },
              { title: "Confirm with the user that control has returned to them" },
              { title: "Summarise what you changed, on the call and in the ticket" },
            ],
          },
          { type: "articleRef", slug: "remote-support-session-conduct" },
        ],
        check: {
          id: "remote-ending",
          prompt: "What is the correct way to end a remote session?",
          kind: "single",
          options: [
            {
              id: "close-window",
              text: "Close the console window",
              correct: false,
              explanation:
                "Closing a window may leave the session live. Always terminate it explicitly and confirm.",
            },
            {
              id: "proper",
              text: "Tell the user you are disconnecting, end the session in the console, confirm it terminated, and summarise the changes",
              correct: true,
              explanation:
                "Correct. Explicit termination plus a verbal close leaves the user certain that access has ended.",
            },
            {
              id: "silent",
              text: "Disconnect quietly once the problem is fixed",
              correct: false,
              explanation:
                "A silent disconnect leaves the user unsure whether you are still watching. Always close verbally.",
            },
            {
              id: "leave-open",
              text: "Leave it connected in case they need you again shortly",
              correct: false,
              explanation:
                "A session left open is standing access nobody consented to. End it, and start a fresh one if needed.",
            },
          ],
        },
      },
    ],
  },

  {
    slug: "printing",
    title: "Printing",
    summary:
      "Scope first, then the supported troubleshooting path — including the Konica redirect that saves everyone time.",
    order: 5,
    category: "printing",
    visibility: "public",
    status: "published",
    updatedAt: "2026-08-05",
    updatedBy: "Help Desk Leadership",
    revision: 4,
    prerequisites: ["help-desk-fundamentals"],
    outcomes: [
      "Identify whether a printer is in scope before troubleshooting",
      "Work the supported path from queue to driver",
      "Redirect Konica contacts cleanly",
    ],
    steps: [
      {
        id: "scope-first",
        title: "Scope first, always",
        minutes: 4,
        body: [
          {
            type: "paragraph",
            text: "Printing produces more out-of-scope tickets than any other category. The fastest thing you can do is establish which device you are dealing with, before troubleshooting anything.",
          },
          {
            type: "fields",
            items: [
              { label: "University-managed", value: "Supported. Queue, driver, and release are first-contact work." },
              { label: "Konica multifunction", value: "Out of scope — vendor-serviced. Redirect and log." },
              { label: "Departmental, locally bought", value: "Usually out of scope. Confirm ownership." },
              { label: "Personal, at home", value: "Out of scope. Manufacturer support." },
            ],
          },
          {
            type: "callout",
            tone: "warning",
            title: "Konica devices are vendor-serviced",
            text: "No driver, firmware, or hardware troubleshooting — even if you are confident you know the fix. Redirect, log the ticket, move on.",
          },
          { type: "articleRef", slug: "printing-support-scope" },
        ],
        check: {
          id: "printing-konica",
          prompt:
            "A staff member reports the large Konica copier in their office is jamming. What do you do?",
          kind: "single",
          options: [
            {
              id: "redirect",
              text: "Explain it is vendor-serviced, point them to the service sticker on the unit, and log the ticket",
              correct: true,
              explanation:
                "Correct on all three counts. The log matters — volume data is how leadership makes the case for clearer signage.",
            },
            {
              id: "troubleshoot",
              text: "Walk them through clearing the jam since you have done it before",
              correct: false,
              explanation:
                "Out of scope regardless of your confidence. These devices are under a vendor service agreement.",
            },
            {
              id: "dispatch",
              text: "Dispatch a Help Desk technician to the office",
              correct: false,
              explanation: "The Help Desk does not service these devices on site.",
            },
            {
              id: "decline",
              text: "Tell them it is not supported and end the contact",
              correct: false,
              explanation:
                "The scope call is right but the handling is not. Give them the specific next contact and log it.",
            },
          ],
        },
      },
      {
        id: "supported-path",
        title: "The supported troubleshooting path",
        minutes: 5,
        body: [
          {
            type: "steps",
            items: [
              { title: "Confirm which physical printer they expect output from", detail: "People routinely send jobs to a building they left an hour ago." },
              { title: "Check the queue for a stuck job", detail: "One failed job blocks everything behind it." },
              { title: "Confirm the job was released at the device", detail: "The most common “it never printed”." },
              { title: "Check quota or balance", detail: "An exhausted quota fails quietly." },
              { title: "Confirm they are on the campus network", detail: "Guest networks and hotspots cannot reach print services." },
              { title: "Remove and re-add the printer if the queue is healthy" },
            ],
          },
          { type: "link", linkKey: "print-management-portal" },
          {
            type: "callout",
            tone: "tip",
            title: "Ask what they are printing",
            text: "Very large files, unusual page sizes, and protected documents fail in ways that look exactly like printer faults.",
          },
        ],
        check: {
          id: "printing-release",
          prompt:
            "A student says they printed twenty minutes ago and nothing came out. The queue shows the job completed. What is the most likely cause?",
          kind: "single",
          options: [
            {
              id: "release",
              text: "The job was never released at the device and has since expired",
              correct: true,
              explanation:
                "Correct. On release-station printing, a job waits for the user to authenticate at the printer and expires silently otherwise.",
            },
            {
              id: "driver",
              text: "The driver is corrupted",
              correct: false,
              explanation: "A corrupted driver typically fails before the job reaches the queue at all.",
            },
            {
              id: "offline",
              text: "The printer is offline",
              correct: false,
              explanation: "Worth checking, but the queue reporting completion points at release rather than the device.",
            },
            {
              id: "quota",
              text: "They ran out of quota",
              correct: false,
              explanation: "An exhausted quota usually blocks the job rather than showing it as completed.",
            },
          ],
        },
      },
    ],
  },

  {
    slug: "vpn-and-connectivity",
    title: "VPN and connectivity",
    summary:
      "What the VPN is actually for, the ordered troubleshooting path, and the hotspot test that settles most tickets.",
    order: 6,
    category: "vpn",
    visibility: "public",
    status: "published",
    updatedAt: "2026-08-06",
    updatedBy: "Help Desk Leadership",
    revision: 4,
    prerequisites: ["help-desk-fundamentals"],
    outcomes: [
      "Decide whether a caller needs the VPN at all",
      "Work VPN failures in the right order",
      "Recognise when to stop and escalate",
    ],
    steps: [
      {
        id: "what-vpn-is",
        title: "What the VPN is for",
        minutes: 4,
        body: [
          {
            type: "paragraph",
            text: "A VPN creates an encrypted connection into the university network, so a computer off campus can reach resources published only inside it.",
          },
          {
            type: "callout",
            tone: "tip",
            title: "The question that resolves half these tickets",
            text: "“What are you trying to reach that isn't working?” Many callers ask for the VPN because someone once told them to. If the destination is reachable from anywhere, they do not need it.",
          },
          {
            type: "fields",
            items: [
              { label: "Needs VPN", value: "Department file shares, internal administrative systems, remote access to a campus workstation." },
              { label: "Does not need VPN", value: "Email, the LMS, cloud document tools, video meetings." },
            ],
          },
          { type: "articleRef", slug: "vpn-what-it-is" },
        ],
        check: {
          id: "vpn-need",
          prompt:
            "A student says they cannot connect to the VPN and needs it to submit an assignment to the learning management system. What is the best first response?",
          kind: "single",
          options: [
            {
              id: "not-needed",
              text: "Explain the LMS does not require the VPN, and have them try submitting directly",
              correct: true,
              explanation:
                "Correct. The VPN is not the problem here — and troubleshooting it would have delayed a deadline for no reason.",
            },
            {
              id: "troubleshoot",
              text: "Start working through VPN client troubleshooting",
              correct: false,
              explanation:
                "This is the most common time-waster in VPN tickets. Establish whether the VPN is needed before touching it.",
            },
            {
              id: "reinstall",
              text: "Have them reinstall the VPN client",
              correct: false,
              explanation: "An invasive step for a tool they do not need for this task.",
            },
            {
              id: "escalate",
              text: "Escalate to the network team",
              correct: false,
              explanation: "There is nothing to escalate — the requirement itself was mistaken.",
            },
          ],
        },
      },
      {
        id: "vpn-path",
        title: "The troubleshooting path",
        minutes: 6,
        body: [
          {
            type: "paragraph",
            text: "Work this in order. Each step rules out a whole class of cause, so skipping ahead usually means backtracking.",
          },
          {
            type: "steps",
            items: [
              { title: "Confirm general internet access first", detail: "If a normal website will not load, the VPN was never the problem." },
              { title: "Check for a captive portal", detail: "Hotel and café networks intercept traffic until a sign-in page is accepted." },
              { title: "Verify credentials against web email", detail: "Separates an account problem from a VPN problem in fifteen seconds." },
              { title: "Confirm multi-factor completed" },
              { title: "Fully quit and relaunch the client", detail: "Closing the window often leaves it running." },
              { title: "Restart the device" },
              { title: "Test on a phone hotspot", detail: "The decisive test — it separates the device from the network." },
            ],
          },
          {
            type: "callout",
            tone: "warning",
            title: "Do not modify network settings blind",
            text: "Editing adapter settings, DNS, or firewall rules on a user's personal machine over the phone creates problems that outlive the ticket. If it has come to that, escalate.",
          },
          { type: "articleRef", slug: "vpn-connection-troubleshooting" },
        ],
        check: {
          id: "vpn-hotspot",
          prompt:
            "The VPN connects on a phone hotspot but never on the user's home network. What does this tell you?",
          kind: "single",
          options: [
            {
              id: "network-specific",
              text: "The problem is specific to the home network — escalate with the hotspot result recorded",
              correct: true,
              explanation:
                "Correct. The client and account are proven working. That is a home router or ISP restriction, and reconfiguring a user's home network is out of scope.",
            },
            {
              id: "reinstall",
              text: "The client is corrupted and should be reinstalled",
              correct: false,
              explanation: "A corrupted client would fail on the hotspot too.",
            },
            {
              id: "account",
              text: "The account lacks VPN permission",
              correct: false,
              explanation: "A permission gap would block it on every network.",
            },
            {
              id: "router-fix",
              text: "Walk the user through reconfiguring their home router",
              correct: false,
              explanation:
                "Out of scope, and you cannot see what else depends on that configuration. Escalate instead.",
            },
          ],
        },
      },
    ],
  },
];
