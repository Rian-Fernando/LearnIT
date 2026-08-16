import type { Article } from "@/lib/content/schema";

export const connectivityArticles: Article[] = [
  {
    slug: "vpn-what-it-is",
    title: "What the VPN is, and who actually needs it",
    summary:
      "A large share of VPN tickets come from people who do not need the VPN at all. Knowing what it is for lets you resolve those in one sentence.",
    category: "vpn",
    tags: ["vpn", "remote", "access", "fundamentals"],
    visibility: "public",
    status: "published",
    updatedAt: "2026-07-15",
    updatedBy: "Help Desk Leadership",
    revision: 5,
    verification: "unverified",
    featured: true,
    related: ["vpn-connection-troubleshooting", "wireless-connection-basics"],
    body: [
      {
        type: "paragraph",
        text: "A VPN creates an encrypted connection from a device to the university network, so that a computer sitting in an apartment can reach resources that are only published inside the campus network.",
      },
      {
        type: "callout",
        tone: "tip",
        title: "The question that resolves half of these tickets",
        text: "“What are you trying to reach that isn't working?” Most callers ask for the VPN because someone once told them to. If the destination is a service reachable from anywhere, they do not need the VPN — and connecting to it may actually make things slower.",
      },
      { type: "heading", level: 2, text: "Usually needs the VPN" },
      {
        type: "list",
        ordered: false,
        items: [
          "Reaching a department file share from off campus",
          "Administrative systems published only on the internal network",
          "Remote access to an on-campus workstation",
          "Certain licensed research or lab software that checks for a campus address",
        ],
      },
      { type: "heading", level: 2, text: "Usually does not need the VPN" },
      {
        type: "list",
        ordered: false,
        items: [
          "Email and calendar",
          "The learning management system",
          "Cloud document storage and collaboration tools",
          "Video meetings",
          "Anything the user reaches fine on campus wireless without signing in to anything extra",
        ],
      },
      {
        type: "callout",
        tone: "info",
        title: "On campus, on wireless",
        text: "A device already on the campus network normally should not run the VPN. If someone on campus reports that the VPN “won't connect”, first establish whether they need it at all.",
      },
      { type: "link", linkKey: "vpn-client-download" },
      { type: "articleRef", slug: "vpn-connection-troubleshooting" },
    ],
  },
  {
    slug: "vpn-connection-troubleshooting",
    title: "VPN connection troubleshooting",
    summary:
      "An ordered path through VPN failures — from the checks that resolve most tickets to the signals that mean it is time to escalate.",
    category: "vpn",
    tags: ["vpn", "troubleshooting", "network", "escalation"],
    visibility: "public",
    status: "published",
    updatedAt: "2026-08-06",
    updatedBy: "Help Desk Leadership",
    revision: 7,
    verification: "unverified",
    featured: true,
    related: ["vpn-what-it-is", "wireless-connection-basics"],
    body: [
      {
        type: "paragraph",
        text: "Work this in order. The sequence matters: each step rules out a whole class of cause, so skipping ahead usually means backtracking.",
      },
      { type: "heading", level: 2, text: "1. Establish what “not working” means" },
      {
        type: "list",
        ordered: false,
        items: [
          "Does the client open at all?",
          "Does it accept the sign-in, then drop?",
          "Does it connect but the destination still fails?",
          "What is the **exact** error text?",
        ],
      },
      {
        type: "callout",
        tone: "tip",
        title: "Connects, but nothing works",
        text: "That is not a VPN failure — it is a destination or permission problem. Stop troubleshooting the tunnel and start troubleshooting what they are trying to reach.",
      },
      { type: "heading", level: 2, text: "2. The checks that resolve most tickets" },
      {
        type: "steps",
        items: [
          {
            title: "Confirm general internet access first",
            detail:
              "If a normal website will not load, the VPN was never the problem. Fix connectivity first.",
          },
          {
            title: "Check for a captive portal",
            detail:
              "Hotel, airport, and café networks intercept traffic until a sign-in page is accepted. VPN clients fail confusingly behind these. Have them open any website and complete the portal.",
          },
          {
            title: "Verify credentials against a known-good service",
            detail:
              "Have them sign in to email in a browser. This separates an account problem from a VPN problem in about fifteen seconds.",
          },
          {
            title: "Confirm multi-factor completion",
            detail:
              "Many VPN failures are an unapproved or timed-out second factor. Ask specifically whether a prompt appeared and whether they approved it.",
          },
          {
            title: "Fully quit and reopen the client",
            detail:
              "Closing the window often leaves it running. On macOS quit it properly; on Windows close it from the system tray.",
          },
          {
            title: "Restart the device",
            detail:
              "Genuinely effective for stuck network adapters after sleep. Worth doing before anything invasive.",
          },
          {
            title: "Test a different network",
            detail:
              "A phone hotspot is the fastest way to prove whether the problem follows the device or stays with the network.",
          },
        ],
      },
      { type: "heading", level: 2, text: "3. Signals to escalate" },
      {
        type: "list",
        ordered: false,
        items: [
          "Multiple unrelated users report VPN failures in the same window — check service status before troubleshooting individuals.",
          "The client connects on one network but never on the user's home network, after a hotspot test.",
          "An error referencing certificates, licences, or capacity.",
          "The user's role requires VPN eligibility they may not have been granted.",
        ],
      },
      { type: "link", linkKey: "service-status", note: "Check before assuming an individual fault." },
      {
        type: "callout",
        tone: "warning",
        title: "Do not modify network settings blind",
        text: "Editing adapter settings, DNS entries, or firewall rules on a user's personal machine over the phone creates problems that outlive the ticket. If it has come to that, escalate.",
      },
      { type: "responseRef", slug: "vpn-first-contact" },
    ],
  },
  {
    slug: "wireless-connection-basics",
    title: "Wireless connection basics",
    summary:
      "How to triage campus wireless problems, and how to tell a device problem apart from a coverage problem.",
    category: "network",
    tags: ["wifi", "wireless", "network", "troubleshooting"],
    visibility: "public",
    status: "published",
    updatedAt: "2026-08-11",
    updatedBy: "Help Desk Leadership",
    revision: 4,
    verification: "unverified",
    featured: false,
    related: ["vpn-connection-troubleshooting"],
    body: [
      {
        type: "paragraph",
        text: "Wireless tickets spike at the start of every term. The volume is high but the causes are few, and they separate cleanly once you ask the right two questions.",
      },
      { type: "heading", level: 2, text: "The two questions" },
      {
        type: "fields",
        items: [
          {
            label: "Is this device new to campus?",
            value:
              "If yes, this is almost always first-time enrollment onto the secure network, not a fault.",
          },
          {
            label: "Does it fail everywhere, or in one place?",
            value:
              "Everywhere points at the device or the account. One location points at coverage, and belongs with the network team.",
          },
        ],
      },
      { type: "heading", level: 2, text: "First-contact checks" },
      {
        type: "steps",
        items: [
          {
            title: "Confirm they are joining the correct network",
            detail:
              "Guest and secure networks behave very differently. People join the guest network by accident constantly.",
          },
          {
            title: "Have them forget the network and rejoin",
            detail:
              "This clears a stale saved profile, which is the most common cause after a password change.",
          },
          {
            title: "Check that wireless is actually on",
            detail:
              "Airplane mode and hardware switches are worth ruling out early, without making the user feel foolish.",
          },
          {
            title: "Ask whether other devices work",
            detail:
              "A phone that connects fine while a laptop does not narrows this to the laptop immediately.",
          },
          {
            title: "Check the date and time on the device",
            detail:
              "A badly wrong clock breaks certificate validation and produces baffling errors.",
          },
        ],
      },
      {
        type: "callout",
        tone: "info",
        title: "Cluster check",
        text: "Before diving into an individual device, glance at whether others are reporting the same building or floor. Coverage and hardware faults look like user error one ticket at a time.",
      },
      { type: "link", linkKey: "service-status" },
      {
        type: "callout",
        tone: "warning",
        title: "Residence-hall wiring is not a phone fix",
        text: "Wall ports, in-room hardware, and structural coverage issues need a dispatch, not a walkthrough. Capture the room number and escalate.",
      },
    ],
  },
];
