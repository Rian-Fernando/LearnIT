import type { TroubleshootingFlow } from "@/lib/content/schema";

/**
 * Troubleshooting decision trees.
 *
 * Each flow is a graph of `question` and `outcome` nodes. `scripts/validate-content.ts`
 * checks that every `next` resolves, that the start node exists, and that every
 * node is reachable — so a broken tree fails validation rather than dead-ending
 * a technician in the middle of a call.
 */
export const flows: TroubleshootingFlow[] = [
  {
    slug: "printer-issue",
    title: "Printer issue",
    entryLabel: "Printer",
    icon: "printer",
    summary:
      "Establish whether the device is in scope, then work the supported path from queue to driver to escalation.",
    category: "printing",
    visibility: "public",
    status: "published",
    updatedAt: "2026-08-05",
    updatedBy: "Help Desk Leadership",
    revision: 4,
    startNodeId: "device-type",
    nodes: [
      {
        id: "device-type",
        kind: "question",
        question: "What kind of printer is it?",
        help: "Scope first. Everything else depends on this answer, so do not skip it.",
        options: [
          {
            id: "managed",
            label: "University-managed printer",
            hint: "Lab, library, or department printer set up by IT",
            next: "symptom",
          },
          {
            id: "konica",
            label: "Konica multifunction device",
            hint: "Large copy/scan/print unit, Konica branding",
            next: "konica-outcome",
          },
          {
            id: "personal",
            label: "Personal printer",
            hint: "The user's own printer at home",
            next: "personal-outcome",
          },
          {
            id: "unknown",
            label: "Not sure",
            hint: "Identify it before going further",
            next: "identify-device",
          },
        ],
      },
      {
        id: "identify-device",
        kind: "question",
        question: "Ask the user: is there branding or a service sticker on the front of the device?",
        help: "The sticker usually carries the vendor, model, and a service number.",
        options: [
          {
            id: "konica-branding",
            label: "It says Konica or Konica Minolta",
            next: "konica-outcome",
          },
          {
            id: "in-campus-space",
            label: "No vendor branding, and it is in a lab or library",
            next: "symptom",
          },
          {
            id: "at-home",
            label: "It is at the user's home",
            next: "personal-outcome",
          },
          {
            id: "still-unclear",
            label: "Still cannot tell",
            next: "unknown-outcome",
          },
        ],
      },
      {
        id: "symptom",
        kind: "question",
        question: "What happens when they try to print?",
        options: [
          {
            id: "nothing",
            label: "Nothing happens at all",
            hint: "No job appears, no error",
            next: "queue-check",
          },
          {
            id: "sent-not-printed",
            label: "The job sends but nothing comes out",
            next: "release-check",
          },
          {
            id: "device-error",
            label: "The device shows an error",
            hint: "Jam, consumable, or panel message",
            next: "hardware-outcome",
          },
          {
            id: "wrong-output",
            label: "It prints, but wrong",
            hint: "Wrong size, garbled, or wrong tray",
            next: "driver-outcome",
          },
        ],
      },
      {
        id: "queue-check",
        kind: "question",
        question: "Is there a stuck job at the head of the print queue?",
        help: "One failed job blocks everything behind it. This is the most common cause of “nothing happens”.",
        options: [
          { id: "yes-stuck", label: "Yes — there is a stuck job", next: "clear-queue-outcome" },
          { id: "queue-empty", label: "No — the queue is empty", next: "connection-check" },
          {
            id: "cannot-reach",
            label: "The queue itself will not load",
            next: "service-outcome",
          },
        ],
      },
      {
        id: "connection-check",
        kind: "question",
        question: "Is the computer on the campus network?",
        help: "A guest network or a phone hotspot cannot reach campus print services.",
        options: [
          { id: "on-campus-net", label: "Yes, on the campus network", next: "reinstall-outcome" },
          { id: "guest-or-hotspot", label: "No — guest network or hotspot", next: "network-outcome" },
        ],
      },
      {
        id: "release-check",
        kind: "question",
        question: "Does this printer require the job to be released at the device?",
        options: [
          { id: "release-required", label: "Yes", next: "release-outcome" },
          { id: "no-release", label: "No", next: "quota-check" },
          { id: "unsure-release", label: "Not sure", next: "release-outcome" },
        ],
      },
      {
        id: "quota-check",
        kind: "question",
        question: "Does the user have print quota or balance remaining?",
        options: [
          { id: "has-quota", label: "Yes, quota is available", next: "reinstall-outcome" },
          { id: "no-quota", label: "No, quota is exhausted", next: "quota-outcome" },
        ],
      },

      /* ---------------------------- outcomes ---------------------------- */
      {
        id: "konica-outcome",
        kind: "outcome",
        title: "Out of scope — redirect to the Konica vendor",
        tone: "out-of-scope",
        articleSlugs: ["konica-device-redirect", "printing-support-scope"],
        responseSlugs: ["konica-redirect"],
        body: [
          {
            type: "callout",
            tone: "warning",
            title: "Do not troubleshoot this device",
            text: "Konica multifunction devices are maintained under a vendor service agreement. No driver, firmware, or hardware work by the Help Desk.",
          },
          {
            type: "steps",
            items: [
              { title: "Tell the user the device is vendor-serviced", detail: "Clear and confident — this is routing, not refusal." },
              { title: "Point them to the service sticker on the front of the unit" },
              { title: "Log the ticket as an out-of-scope Konica contact", detail: "Volume data is the reason this gets logged." },
              { title: "Offer a nearby supported printer if they need output today" },
            ],
          },
        ],
      },
      {
        id: "personal-outcome",
        kind: "outcome",
        title: "Out of scope — personal equipment",
        tone: "out-of-scope",
        articleSlugs: ["printing-support-scope"],
        responseSlugs: ["out-of-scope-general"],
        body: [
          {
            type: "paragraph",
            text: "The Help Desk does not service personally-owned printers. Point the user to their manufacturer's support, and be warm about it — the answer is still no, but it should not feel like a brush-off.",
          },
          {
            type: "callout",
            tone: "tip",
            title: "Check the real need first",
            text: "If they were trying to print university work, a supported campus printer may solve the actual problem in one sentence.",
          },
        ],
      },
      {
        id: "unknown-outcome",
        kind: "outcome",
        title: "Identify the device before proceeding",
        tone: "escalate",
        articleSlugs: ["printing-support-scope"],
        responseSlugs: ["information-request-generic"],
        body: [
          {
            type: "paragraph",
            text: "Do not troubleshoot an unidentified device — you may spend twenty minutes on equipment the Help Desk does not service.",
          },
          {
            type: "steps",
            items: [
              { title: "Ask for the building and room number" },
              { title: "Ask for any branding or model number on the front" },
              { title: "Ask whether there is a vendor service sticker" },
              { title: "Log the ticket with what you have and return to it once identified" },
            ],
          },
        ],
      },
      {
        id: "clear-queue-outcome",
        kind: "outcome",
        title: "Clear the stuck job and resend",
        tone: "resolved",
        articleSlugs: ["printer-troubleshooting-path"],
        responseSlugs: ["resolved-confirmation"],
        body: [
          {
            type: "steps",
            items: [
              { title: "Cancel the stuck job at the head of the queue" },
              { title: "Confirm the rest of the queue drains" },
              { title: "Have the user resend a single test page", detail: "One page, not the original forty-page document." },
              { title: "Confirm output before closing", detail: "Ask them to physically check the tray." },
            ],
          },
          {
            type: "callout",
            tone: "tip",
            title: "If it sticks again immediately",
            text: "A job that jams the queue twice points at the source document or the driver. Reinstall the printer and try a different file.",
          },
        ],
      },
      {
        id: "release-outcome",
        kind: "outcome",
        title: "The job was never released",
        tone: "resolved",
        articleSlugs: ["printer-troubleshooting-path"],
        responseSlugs: [],
        body: [
          {
            type: "paragraph",
            text: "On release-station printing, a job waits at the device until the user authenticates and releases it — and expires silently if they do not. This is the most common “I printed it and nothing happened”.",
          },
          {
            type: "steps",
            items: [
              { title: "Explain that the job waits at the printer until released" },
              { title: "Walk them through authenticating at the device" },
              { title: "Have them resend if the original has already expired" },
              { title: "Confirm output before closing" },
            ],
          },
        ],
      },
      {
        id: "quota-outcome",
        kind: "outcome",
        title: "Print quota exhausted",
        tone: "resolved",
        articleSlugs: ["printer-troubleshooting-path"],
        responseSlugs: ["out-of-scope-general"],
        body: [
          {
            type: "paragraph",
            text: "An exhausted quota fails quietly on most systems, which is why this looks like a fault. Explain what happened and point the user to the office that handles quota adjustments — the Help Desk does not set balances.",
          },
          { type: "link", linkKey: "print-management-portal" },
        ],
      },
      {
        id: "reinstall-outcome",
        kind: "outcome",
        title: "Reinstall the printer",
        tone: "resolved",
        articleSlugs: ["printer-troubleshooting-path"],
        responseSlugs: [],
        body: [
          {
            type: "paragraph",
            text: "Queue is healthy, network is fine, quota is available — that points at the local driver profile.",
          },
          {
            type: "steps",
            items: [
              { title: "Remove the printer from the user's device entirely" },
              { title: "Re-add it using the approved installation method", detail: "Remove and re-add; do not repair in place." },
              { title: "Send a single test page" },
              { title: "If it still fails, escalate with everything you tried recorded" },
            ],
          },
        ],
      },
      {
        id: "driver-outcome",
        kind: "outcome",
        title: "Driver or document settings",
        tone: "resolved",
        articleSlugs: ["printer-troubleshooting-path"],
        responseSlugs: [],
        body: [
          {
            type: "paragraph",
            text: "Output that appears but is wrong is a settings problem rather than a connectivity one.",
          },
          {
            type: "list",
            ordered: false,
            items: [
              "Check paper size and orientation in the print dialog before blaming the driver.",
              "Test with a different document — a corrupted source file mimics a driver fault convincingly.",
              "If only one application is affected, the problem is in that application.",
              "If everything is garbled, remove and reinstall the printer.",
            ],
          },
        ],
      },
      {
        id: "hardware-outcome",
        kind: "outcome",
        title: "Hardware fault — escalate",
        tone: "escalate",
        articleSlugs: ["printer-troubleshooting-path"],
        responseSlugs: ["escalation-acknowledgement"],
        body: [
          {
            type: "callout",
            tone: "warning",
            title: "Do not direct users to open the device",
            text: "Clearing a visible jam from an accessible tray is fine. Anything requiring tools, panels, or reaching into the machine needs a technician on site.",
          },
          {
            type: "steps",
            items: [
              { title: "Record the exact panel error text" },
              { title: "Record the building, room, and device identifier" },
              { title: "Note whether other users are affected" },
              { title: "Escalate for on-site service" },
            ],
          },
        ],
      },
      {
        id: "network-outcome",
        kind: "outcome",
        title: "Device is not on the campus network",
        tone: "resolved",
        articleSlugs: ["wireless-connection-basics"],
        responseSlugs: [],
        body: [
          {
            type: "paragraph",
            text: "Campus print services are not reachable from the guest network or a phone hotspot. Get the device onto the secure campus network first, then retry — the printing problem usually disappears with it.",
          },
          { type: "articleRef", slug: "wireless-connection-basics" },
        ],
      },
      {
        id: "service-outcome",
        kind: "outcome",
        title: "Print service may be down — check status",
        tone: "escalate",
        articleSlugs: ["printer-troubleshooting-path"],
        responseSlugs: ["escalation-acknowledgement"],
        body: [
          {
            type: "paragraph",
            text: "If the print queue itself is unreachable rather than empty, this is likely a service-level problem rather than anything to do with this user.",
          },
          { type: "link", linkKey: "service-status" },
          {
            type: "steps",
            items: [
              { title: "Check current service status before troubleshooting further" },
              { title: "Ask whether colleagues are affected too" },
              { title: "Escalate as a possible service issue if the pattern holds" },
            ],
          },
        ],
      },
    ],
  },

  {
    slug: "vpn-issue",
    title: "VPN issue",
    entryLabel: "VPN",
    icon: "shield",
    summary:
      "Confirm the VPN is actually needed, then work the connection path from captive portals through to escalation.",
    category: "vpn",
    visibility: "public",
    status: "published",
    updatedAt: "2026-08-06",
    updatedBy: "Help Desk Leadership",
    revision: 3,
    startNodeId: "need-check",
    nodes: [
      {
        id: "need-check",
        kind: "question",
        question: "What is the user trying to reach?",
        help: "A large share of VPN tickets are from people who do not need the VPN. Ask before troubleshooting.",
        options: [
          {
            id: "internal-resource",
            label: "A department file share or internal system",
            next: "failure-point",
          },
          {
            id: "cloud-service",
            label: "Email, the LMS, or a cloud service",
            hint: "These are normally reachable without the VPN",
            next: "not-needed-outcome",
          },
          { id: "on-campus", label: "They are on campus already", next: "on-campus-outcome" },
          { id: "unclear-need", label: "They are not sure", next: "not-needed-outcome" },
        ],
      },
      {
        id: "failure-point",
        kind: "question",
        question: "Where does it fail?",
        options: [
          { id: "wont-open", label: "The client will not open", next: "client-outcome" },
          { id: "signin-fails", label: "Sign-in is rejected", next: "credential-check" },
          { id: "connects-drops", label: "It connects, then drops", next: "network-test" },
          {
            id: "connects-nothing-works",
            label: "It connects but the resource still fails",
            next: "destination-outcome",
          },
        ],
      },
      {
        id: "credential-check",
        kind: "question",
        question: "Can the user sign in to their email in a browser right now?",
        help: "This separates an account problem from a VPN problem in about fifteen seconds.",
        options: [
          { id: "email-works", label: "Yes, email sign-in works", next: "mfa-check" },
          { id: "email-fails", label: "No, that fails too", next: "account-outcome" },
        ],
      },
      {
        id: "mfa-check",
        kind: "question",
        question: "Does a multi-factor prompt appear, and does the user approve it?",
        options: [
          { id: "mfa-ok", label: "Yes, approved successfully", next: "network-test" },
          { id: "mfa-missing", label: "No prompt ever arrives", next: "mfa-outcome" },
          { id: "mfa-expired", label: "It arrives but times out", next: "mfa-outcome" },
        ],
      },
      {
        id: "network-test",
        kind: "question",
        question: "Does it work on a phone hotspot?",
        help: "The single most useful test in VPN troubleshooting — it separates the device from the network.",
        options: [
          { id: "hotspot-works", label: "Yes, works on hotspot", next: "home-network-outcome" },
          { id: "hotspot-fails", label: "No, fails there too", next: "escalate-outcome" },
          { id: "cannot-test", label: "Cannot test right now", next: "captive-check" },
        ],
      },
      {
        id: "captive-check",
        kind: "question",
        question: "Is the user on a hotel, café, or airport network?",
        help: "These intercept traffic until a sign-in page is accepted, and VPN clients fail confusingly behind them.",
        options: [
          { id: "public-net", label: "Yes", next: "captive-outcome" },
          { id: "home-net", label: "No — home or office network", next: "escalate-outcome" },
        ],
      },

      /* ---------------------------- outcomes ---------------------------- */
      {
        id: "not-needed-outcome",
        kind: "outcome",
        title: "The VPN is probably not needed",
        tone: "resolved",
        articleSlugs: ["vpn-what-it-is"],
        responseSlugs: [],
        body: [
          {
            type: "paragraph",
            text: "Email, the learning management system, and cloud collaboration tools are reachable from anywhere. Running the VPN for them adds no access and can make things slower.",
          },
          {
            type: "steps",
            items: [
              { title: "Have them disconnect the VPN and retry the resource directly" },
              { title: "If it works, explain when the VPN is and is not needed", detail: "This prevents the next three tickets." },
              { title: "If it still fails, the problem is the resource — troubleshoot that instead" },
            ],
          },
        ],
      },
      {
        id: "on-campus-outcome",
        kind: "outcome",
        title: "On campus — the VPN is not required",
        tone: "resolved",
        articleSlugs: ["vpn-what-it-is", "wireless-connection-basics"],
        responseSlugs: [],
        body: [
          {
            type: "paragraph",
            text: "A device already on the campus network normally should not run the VPN. If they are on campus and something is unreachable, troubleshoot the wireless connection rather than the tunnel.",
          },
          { type: "articleRef", slug: "wireless-connection-basics" },
        ],
      },
      {
        id: "client-outcome",
        kind: "outcome",
        title: "Client will not launch",
        tone: "resolved",
        articleSlugs: ["vpn-connection-troubleshooting"],
        responseSlugs: [],
        body: [
          {
            type: "steps",
            items: [
              { title: "Fully quit the client", detail: "Check the system tray or menu bar — closing the window often leaves it running." },
              { title: "Restart the device" },
              { title: "Reinstall from the approved installer if it still will not open" },
            ],
          },
          { type: "link", linkKey: "vpn-client-download" },
        ],
      },
      {
        id: "account-outcome",
        kind: "outcome",
        title: "This is an account problem, not a VPN problem",
        tone: "resolved",
        articleSlugs: ["password-reset-walkthrough", "account-types-overview"],
        responseSlugs: ["password-reset-guidance"],
        body: [
          {
            type: "paragraph",
            text: "If web sign-in fails too, the VPN was never the issue. Switch to the account path — verify the user, check the account type and status, and work the password flow.",
          },
          { type: "articleRef", slug: "password-reset-walkthrough" },
        ],
      },
      {
        id: "mfa-outcome",
        kind: "outcome",
        title: "Multi-factor authentication issue",
        tone: "escalate",
        articleSlugs: ["password-reset-walkthrough"],
        responseSlugs: ["escalation-acknowledgement"],
        body: [
          {
            type: "paragraph",
            text: "A second factor that never arrives or always times out is an enrollment or device problem, not a VPN one.",
          },
          {
            type: "steps",
            items: [
              { title: "Confirm the enrolled device is the one they are holding" },
              { title: "Check whether that device has any network connection at all" },
              { title: "Escalate for re-enrollment if the enrolled device is lost or replaced" },
            ],
          },
          {
            type: "callout",
            tone: "danger",
            title: "Never accept a code read aloud",
            text: "Do not ask for, and do not accept, a one-time code from a user. There is no legitimate reason for a technician to hold one.",
          },
        ],
      },
      {
        id: "captive-outcome",
        kind: "outcome",
        title: "Captive portal is blocking the tunnel",
        tone: "resolved",
        articleSlugs: ["vpn-connection-troubleshooting"],
        responseSlugs: [],
        body: [
          {
            type: "steps",
            items: [
              { title: "Have them disconnect the VPN entirely" },
              { title: "Open any ordinary website in a browser", detail: "The portal sign-in page should appear." },
              { title: "Complete the network's sign-in or terms page" },
              { title: "Reconnect the VPN" },
            ],
          },
          {
            type: "callout",
            tone: "tip",
            title: "Why this is confusing",
            text: "The device reports a working connection, so the user is certain the network is fine. The portal is invisible until a browser asks for a page.",
          },
        ],
      },
      {
        id: "home-network-outcome",
        kind: "outcome",
        title: "Specific to the user's own network",
        tone: "escalate",
        articleSlugs: ["vpn-connection-troubleshooting"],
        responseSlugs: ["escalation-acknowledgement"],
        body: [
          {
            type: "paragraph",
            text: "Working on a hotspot but not at home isolates this to that network — commonly a home router blocking the protocol, or an ISP restriction.",
          },
          {
            type: "callout",
            tone: "warning",
            title: "Do not reconfigure a user's home router",
            text: "It is outside Help Desk scope and you cannot see what else depends on it. Escalate with the hotspot test result recorded.",
          },
          {
            type: "steps",
            items: [
              { title: "Record that the hotspot test succeeded", detail: "This is the key fact for whoever picks it up." },
              { title: "Record the router make and ISP if the user knows them" },
              { title: "Escalate to the network team" },
            ],
          },
        ],
      },
      {
        id: "destination-outcome",
        kind: "outcome",
        title: "Tunnel is fine — the destination is the problem",
        tone: "resolved",
        articleSlugs: ["vpn-connection-troubleshooting"],
        responseSlugs: [],
        body: [
          {
            type: "paragraph",
            text: "A connected VPN with an unreachable resource means the tunnel is working. Stop troubleshooting it.",
          },
          {
            type: "list",
            ordered: false,
            items: [
              "Confirm the exact address or share path they are using.",
              "Check whether they have permission to that resource at all — a permission gap looks exactly like a connectivity failure.",
              "Check whether the resource itself is up.",
              "Escalate to the team owning that system, not the network team.",
            ],
          },
        ],
      },
      {
        id: "escalate-outcome",
        kind: "outcome",
        title: "Escalate to the network team",
        tone: "escalate",
        articleSlugs: ["vpn-connection-troubleshooting", "writing-useful-ticket-notes"],
        responseSlugs: ["escalation-acknowledgement"],
        body: [
          {
            type: "paragraph",
            text: "First-contact steps are exhausted. Escalate — but escalate well, so nobody repeats what you already did.",
          },
          {
            type: "steps",
            items: [
              { title: "Exact error text, verbatim" },
              { title: "Operating system and whether the device is university-issued" },
              { title: "Networks tested, including the hotspot result" },
              { title: "Whether web sign-in works" },
              { title: "Whether multi-factor completed" },
              { title: "Everything already attempted" },
            ],
          },
          { type: "articleRef", slug: "writing-useful-ticket-notes" },
        ],
      },
    ],
  },

  {
    slug: "account-access",
    title: "Account or sign-in issue",
    entryLabel: "Account",
    icon: "key",
    summary:
      "Route an access problem to the right path — self-service reset, account lifecycle, or security escalation.",
    category: "accounts",
    visibility: "public",
    status: "published",
    updatedAt: "2026-08-08",
    updatedBy: "Help Desk Leadership",
    revision: 3,
    startNodeId: "security-triage",
    nodes: [
      {
        id: "security-triage",
        kind: "question",
        question: "Any sign this could be a security incident?",
        help: "Ask this first, every time. It changes everything that follows.",
        options: [
          {
            id: "suspicious",
            label: "Yes — unexpected prompts, a suspicious message, or unrecognised activity",
            next: "security-outcome",
          },
          { id: "routine", label: "No — routine sign-in trouble", next: "verified" },
        ],
      },
      {
        id: "verified",
        kind: "question",
        question: "Has the user completed identity verification?",
        options: [
          { id: "verified-yes", label: "Yes", next: "account-status" },
          { id: "verified-no", label: "No, or it could not be completed", next: "verification-outcome" },
        ],
      },
      {
        id: "account-status",
        kind: "question",
        question: "What is the account's situation?",
        options: [
          { id: "current", label: "Current student, faculty, or staff", next: "symptom" },
          { id: "graduated", label: "Recently graduated", next: "alumni-outcome" },
          { id: "guest", label: "Sponsored guest account", next: "guest-outcome" },
          { id: "never-activated", label: "Never activated the account", next: "activation-outcome" },
        ],
      },
      {
        id: "symptom",
        kind: "question",
        question: "What exactly happens?",
        options: [
          { id: "forgot", label: "They forgot the password", next: "reset-outcome" },
          { id: "repeated-lockout", label: "Locked out repeatedly, soon after resetting", next: "cached-outcome" },
          { id: "one-service", label: "Sign-in works, but one service refuses them", next: "service-outcome" },
          { id: "no-mfa", label: "Multi-factor prompt never arrives", next: "mfa-outcome" },
        ],
      },

      /* ---------------------------- outcomes ---------------------------- */
      {
        id: "security-outcome",
        kind: "outcome",
        title: "Treat as a security incident — escalate now",
        tone: "escalate",
        articleSlugs: ["recognising-phishing-reports", "account-lockout-escalation"],
        responseSlugs: ["escalation-acknowledgement"],
        body: [
          {
            type: "callout",
            tone: "danger",
            title: "Do not reset and move on",
            text: "A password reset on a possibly-compromised account can destroy useful signal and gives false reassurance. Escalate first.",
          },
          {
            type: "steps",
            items: [
              { title: "Ask whether they clicked anything or entered any information", detail: "The answer determines urgency." },
              { title: "Record the time they first noticed it" },
              { title: "Record sender and subject if a message was involved" },
              { title: "Escalate through the security path immediately" },
              { title: "Do not ask what the password was" },
            ],
          },
        ],
      },
      {
        id: "verification-outcome",
        kind: "outcome",
        title: "Stop — verification is required",
        tone: "out-of-scope",
        articleSlugs: ["account-types-overview"],
        responseSlugs: [],
        body: [
          {
            type: "callout",
            tone: "warning",
            title: "This is the answer, even under pressure",
            text: "Urgency, seniority, and frustration are exactly how a social engineering attempt presents. They never lower the bar.",
          },
          {
            type: "steps",
            items: [
              { title: "Explain what verification requires, warmly and without apology" },
              { title: "Offer the approved alternative path" },
              { title: "Escalate to a supervisor if they cannot complete it and the need is genuine" },
              { title: "Log the contact and what was not completed" },
            ],
          },
        ],
      },
      {
        id: "reset-outcome",
        kind: "outcome",
        title: "Guide them through self-service reset",
        tone: "resolved",
        articleSlugs: ["password-reset-walkthrough"],
        responseSlugs: ["password-reset-guidance"],
        body: [
          {
            type: "steps",
            items: [
              { title: "Confirm they can access their recovery method first", detail: "Skipping this is the most common dead end." },
              { title: "Direct them to the self-service portal" },
              { title: "Stay on the line while they complete it" },
              { title: "Have them sign in to email to confirm" },
              { title: "Remind them to update saved passwords on other devices" },
            ],
          },
          { type: "link", linkKey: "account-self-service" },
        ],
      },
      {
        id: "cached-outcome",
        kind: "outcome",
        title: "A saved password is re-locking the account",
        tone: "resolved",
        articleSlugs: ["password-reset-walkthrough"],
        responseSlugs: [],
        body: [
          {
            type: "paragraph",
            text: "Repeated lockouts shortly after a successful reset are almost always a device still presenting the old password — a phone mail app is the usual culprit.",
          },
          {
            type: "steps",
            items: [
              { title: "Ask what other devices are signed in", detail: "Phones, tablets, home computers, mail clients." },
              { title: "Have them update or remove the saved password on each" },
              { title: "Reset once more if the account is currently locked" },
              { title: "Confirm no further lockout before closing" },
            ],
          },
        ],
      },
      {
        id: "alumni-outcome",
        kind: "outcome",
        title: "Alumni transition — working as designed",
        tone: "resolved",
        articleSlugs: ["alumni-account-transition"],
        responseSlugs: ["alumni-account-transition"],
        body: [
          {
            type: "paragraph",
            text: "This is a scheduled change rather than a fault. Explain clearly what continues and what does not, and route policy questions to the right office instead of guessing.",
          },
          { type: "articleRef", slug: "alumni-account-transition" },
        ],
      },
      {
        id: "guest-outcome",
        kind: "outcome",
        title: "Check the sponsored guest expiry",
        tone: "resolved",
        articleSlugs: ["account-types-overview"],
        responseSlugs: ["out-of-scope-general"],
        body: [
          {
            type: "paragraph",
            text: "Sponsored accounts are time-limited and expire silently. An expired guest account looks exactly like a password problem.",
          },
          {
            type: "steps",
            items: [
              { title: "Check the expiry date before anything else" },
              { title: "If expired, identify the sponsoring department" },
              { title: "Explain that renewal is requested by the sponsor, not the account holder" },
              { title: "Log the ticket and route it to the sponsor" },
            ],
          },
        ],
      },
      {
        id: "activation-outcome",
        kind: "outcome",
        title: "Account was never activated",
        tone: "resolved",
        articleSlugs: ["account-types-overview"],
        responseSlugs: [],
        body: [
          {
            type: "paragraph",
            text: "You cannot reset a password that was never set. This is an activation, and it is a different path — common with new students in their first week.",
          },
          {
            type: "steps",
            items: [
              { title: "Confirm they never completed initial activation" },
              { title: "Walk them through the activation process from the beginning" },
              { title: "Confirm they can sign in to email afterwards" },
            ],
          },
        ],
      },
      {
        id: "service-outcome",
        kind: "outcome",
        title: "Single service refuses access",
        tone: "escalate",
        articleSlugs: ["account-types-overview"],
        responseSlugs: ["escalation-acknowledgement"],
        body: [
          {
            type: "paragraph",
            text: "If the account signs in elsewhere, the account is fine. This is a permission or provisioning question for the team that owns that service.",
          },
          {
            type: "list",
            ordered: false,
            items: [
              "Confirm the user should have access at all — often they never did.",
              "Check whether a recent role or department change removed it.",
              "Record the exact refusal wording.",
              "Escalate to the owning team, not to account services.",
            ],
          },
        ],
      },
      {
        id: "mfa-outcome",
        kind: "outcome",
        title: "Multi-factor enrollment issue",
        tone: "escalate",
        articleSlugs: ["password-reset-walkthrough"],
        responseSlugs: ["escalation-acknowledgement"],
        body: [
          {
            type: "steps",
            items: [
              { title: "Confirm which device is enrolled" },
              { title: "Check whether that device is lost, replaced, or offline" },
              { title: "Escalate for re-enrollment through the approved path" },
            ],
          },
          {
            type: "callout",
            tone: "danger",
            title: "Never accept a code from a user",
            text: "A technician has no legitimate need to hold a one-time code.",
          },
        ],
      },
    ],
  },

  {
    slug: "remote-support-request",
    title: "Remote support request",
    entryLabel: "Remote Support",
    icon: "monitor",
    summary:
      "Decide whether remote access is appropriate, and follow the consent path when it is.",
    category: "remote-support",
    visibility: "public",
    status: "published",
    updatedAt: "2026-08-09",
    updatedBy: "Help Desk Leadership",
    revision: 2,
    startNodeId: "appropriate",
    nodes: [
      {
        id: "appropriate",
        kind: "question",
        question: "Is remote control actually the right tool here?",
        help: "Remote access is high-trust. Use it when it is genuinely the fastest safe route, not by default.",
        options: [
          {
            id: "yes-control",
            label: "Yes — the fix needs hands on their machine",
            next: "device-ownership",
          },
          {
            id: "just-viewing",
            label: "No — they just need guiding through something",
            next: "screen-share-outcome",
          },
          {
            id: "phone-enough",
            label: "No — this can be solved on the phone",
            next: "phone-outcome",
          },
        ],
      },
      {
        id: "device-ownership",
        kind: "question",
        question: "Whose device is it?",
        options: [
          { id: "university", label: "University-issued", next: "user-present" },
          { id: "personal", label: "The user's personal device", next: "personal-consent" },
        ],
      },
      {
        id: "personal-consent",
        kind: "question",
        question: "Has the user been told what you will be able to see, and agreed?",
        help: "On a personal machine this conversation matters more, not less.",
        options: [
          { id: "informed-yes", label: "Yes, explicitly", next: "user-present" },
          { id: "informed-no", label: "Not yet", next: "consent-outcome" },
        ],
      },
      {
        id: "user-present",
        kind: "question",
        question: "Will the user stay at the computer for the whole session?",
        options: [
          { id: "present-yes", label: "Yes", next: "proceed-outcome" },
          { id: "present-no", label: "No — they want to step away", next: "unattended-outcome" },
        ],
      },

      /* ---------------------------- outcomes ---------------------------- */
      {
        id: "proceed-outcome",
        kind: "outcome",
        title: "Proceed with the remote session",
        tone: "resolved",
        articleSlugs: ["remote-support-session-conduct"],
        responseSlugs: ["remote-session-invite"],
        body: [
          {
            type: "steps",
            items: [
              { title: "Verify the user through the approved process" },
              { title: "Explain what you will see and what you will change" },
              { title: "Ask for permission and wait for a clear yes" },
              { title: "Ask them to close anything personal first" },
              { title: "Narrate what you are doing throughout" },
              { title: "End the session properly in the console, not by closing a window" },
              { title: "Summarise the changes and note that permission was obtained" },
            ],
          },
          { type: "link", linkKey: "remote-support-console" },
        ],
      },
      {
        id: "consent-outcome",
        kind: "outcome",
        title: "Get informed consent first",
        tone: "escalate",
        articleSlugs: ["remote-support-session-conduct"],
        responseSlugs: ["remote-session-invite"],
        body: [
          {
            type: "callout",
            tone: "danger",
            title: "Do not connect yet",
            text: "“I'm going to connect now” is an announcement, not consent. The user needs to know what you will be able to see before they agree.",
          },
          {
            type: "steps",
            items: [
              { title: "Explain in one plain sentence what you will see and do" },
              { title: "Tell them they can end the session at any point" },
              { title: "Ask them to close personal applications first" },
              { title: "Wait for a clear yes, then note it in the ticket" },
            ],
          },
        ],
      },
      {
        id: "unattended-outcome",
        kind: "outcome",
        title: "Do not work on an unattended machine",
        tone: "out-of-scope",
        articleSlugs: ["remote-support-session-conduct"],
        responseSlugs: ["ticket-follow-up"],
        body: [
          {
            type: "callout",
            tone: "warning",
            title: "The user stays present",
            text: "Working on an unattended computer removes the user's ability to see what was done and to stop it. Reschedule instead.",
          },
          {
            type: "steps",
            items: [
              { title: "Offer a specific alternative time" },
              { title: "Log the ticket as waiting on the user, with the reason stated" },
              { title: "Send a fresh session link at the agreed time" },
            ],
          },
        ],
      },
      {
        id: "screen-share-outcome",
        kind: "outcome",
        title: "Use screen sharing instead",
        tone: "resolved",
        articleSlugs: ["remote-support-session-conduct"],
        responseSlugs: ["it-meeting-room"],
        body: [
          {
            type: "paragraph",
            text: "If the user only needs guiding, have them share their screen rather than handing over control. They stay in charge, they learn the steps, and the trust cost is far lower.",
          },
          { type: "link", linkKey: "it-support-meeting-room" },
        ],
      },
      {
        id: "phone-outcome",
        kind: "outcome",
        title: "Handle it on the phone",
        tone: "resolved",
        articleSlugs: ["professional-communication"],
        responseSlugs: [],
        body: [
          {
            type: "paragraph",
            text: "Remote access is not the default. If clear instructions will resolve it, that is the better outcome — it is faster and the user can repeat it next time.",
          },
          {
            type: "callout",
            tone: "tip",
            title: "Slow down for instructions",
            text: "What is muscle memory to you is unfamiliar to them. Give one step, confirm, then give the next.",
          },
        ],
      },
    ],
  },
];
