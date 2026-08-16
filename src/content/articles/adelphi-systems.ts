import type { Article } from "@/lib/content/schema";

/**
 * Adelphi-specific systems.
 *
 * Written from what Help Desk staff have confirmed so far. Each one is
 * deliberately short and honest about its edges — these are reference cards a
 * technician checks mid-call, not essays, and the parts nobody has documented
 * are visible gaps rather than filler.
 */
export const adelphiSystemArticles: Article[] = [
  {
    slug: "andromeda-vpn",
    title: "Andromeda — the OpenSense VPN",
    summary:
      "Adelphi runs a second VPN at andromeda.adelphi.edu. Knowing which of the two a caller means is the first question on any VPN ticket.",
    category: "vpn",
    tags: ["vpn", "andromeda", "opensense", "remote-access"],
    visibility: "staff",
    status: "published",
    updatedAt: "2026-08-15",
    updatedBy: "Rian Fernando",
    revision: 1,
    verification: "needs-review",
    featured: true,
    related: ["vpn-what-it-is", "vpn-connection-troubleshooting"],
    body: [
      {
        type: "callout",
        tone: "warning",
        title: "There is more than one VPN",
        text: "Adelphi runs **two**. A caller saying \"the VPN isn't working\" has not yet told you which one. Establish that before troubleshooting anything — the setup, the sign-in, and the failure modes differ.",
      },
      {
        type: "fields",
        items: [
          { label: "Address", value: "andromeda.adelphi.edu" },
          { label: "Platform", value: "OpenSense" },
          { label: "Role", value: "The second VPN in use alongside the primary client." },
        ],
      },
      { type: "heading", level: 2, text: "Checking access" },
      {
        type: "paragraph",
        text: "Whether a user has VPN access is visible in **User Lookup**. Check there before walking someone through a setup they are not entitled to complete — an access problem and a configuration problem look identical from the caller's side.",
      },
      { type: "articleRef", slug: "vpn-what-it-is", note: "Whether they need a VPN at all is still the first question." },
      {
        type: "callout",
        tone: "tip",
        title: "Still ask what they are trying to reach",
        text: "The most common VPN ticket is from someone who does not need one. Two VPNs does not change that — it just adds a question about which.",
      },
      {
        type: "placeholder",
        label: "Andromeda setup, sign-in, and troubleshooting",
        needs: [
          "The setup process a user must complete before first use",
          "How a user signs in, and what the sign-in screen looks like",
          "Where VPN access appears in User Lookup, with a screenshot of a user who has it",
          "When Andromeda is used rather than the primary VPN",
          "The common failure modes and their fixes",
        ],
        owner: "Rian Fernando",
      },
    ],
  },

  {
    slug: "eplanner-stellic-access",
    title: "ePlanner (Stellic) access requests",
    summary:
      "ePlanner and Stellic are the same platform. Access requests go through a dedicated Footprints template, and the only thing you add is the role being requested.",
    category: "software",
    tags: ["eplanner", "stellic", "access", "footprints", "template"],
    visibility: "staff",
    status: "published",
    updatedAt: "2026-08-15",
    updatedBy: "Rian Fernando",
    revision: 1,
    verification: "needs-review",
    featured: false,
    related: [],
    body: [
      {
        type: "callout",
        tone: "info",
        title: "ePlanner and Stellic are the same thing",
        text: "Users and staff use the names interchangeably. If a caller says Stellic, they mean ePlanner — do not spend time working out whether these are two systems.",
      },
      { type: "heading", level: 2, text: "Two templates, two different jobs" },
      {
        type: "fields",
        items: [
          {
            label: "ePlanner Access",
            value:
              "For a user **requesting access**. Use the template as-is — the description is already set. The only thing you add is which role they are requesting.",
          },
          {
            label: "ePlanner Support and Training",
            value:
              "For a user who has access but does not know how to use the platform. This routes to learning material rather than a permissions change.",
          },
        ],
      },
      {
        type: "callout",
        tone: "tip",
        title: "The question that picks the template",
        text: "\"Can you get in at all?\" If no — Access. If yes, but they are stuck — Support and Training. Getting this wrong sends a training question to whoever grants permissions.",
      },
      { type: "heading", level: 2, text: "Raising an access request" },
      {
        type: "steps",
        items: [
          { title: "Select the ePlanner Access template in Footprints" },
          {
            title: "Leave the existing description in place",
            detail: "It is pre-written for this workflow. Do not replace it.",
          },
          {
            title: "Add the role being requested",
            detail: "This is the piece only you can supply — ask the user specifically what role they need.",
          },
          { title: "Verify the contact, then run the quality check before saving" },
        ],
      },
      { type: "checklistRef", slug: "ticket-quality-check" },
      {
        type: "placeholder",
        label: "ePlanner access — the role list and a sample ticket",
        needs: [
          "The roles a user can request, and who approves each",
          "A sanitised sample ticket showing the completed template",
          "What the pre-set description contains",
          "Who the request routes to",
        ],
        owner: "Rian Fernando",
      },
    ],
  },
];
