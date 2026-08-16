import type { Article } from "@/lib/content/schema";

export const printingArticles: Article[] = [
  {
    slug: "printing-support-scope",
    title: "What printing the Help Desk supports — and what it does not",
    summary:
      "Scope is the whole game with printing. Knowing which devices are ours prevents long, unproductive troubleshooting on equipment we do not service.",
    category: "printing",
    tags: ["printing", "scope", "konica", "escalation"],
    visibility: "public",
    status: "published",
    updatedAt: "2026-08-05",
    updatedBy: "Help Desk Leadership",
    revision: 5,
    verification: "unverified",
    featured: true,
    related: ["printer-troubleshooting-path", "konica-device-redirect"],
    body: [
      {
        type: "paragraph",
        text: "Printing generates more out-of-scope tickets than any other category. The fastest thing you can do on a printing call is establish **which device** you are dealing with, before troubleshooting anything.",
      },
      { type: "heading", level: 2, text: "Identify the device first" },
      {
        type: "fields",
        items: [
          {
            label: "University-managed printer",
            value:
              "Supported. Queue problems, driver installation, and print release are all first-contact work.",
          },
          {
            label: "Konica multifunction device",
            value:
              "Out of scope. Serviced by the contracted vendor. Redirect and log the ticket — do not troubleshoot.",
          },
          {
            label: "Departmental printer bought locally",
            value:
              "Usually out of scope. Confirm ownership before committing to anything.",
          },
          {
            label: "Personal printer at home",
            value:
              "Out of scope. Point the user to the manufacturer. Be warm about it — the answer is still no.",
          },
        ],
      },
      {
        type: "callout",
        tone: "warning",
        title: "Konica devices are vendor-serviced",
        text: "Do not attempt driver, firmware, or hardware troubleshooting on a Konica multifunction device, even if you think you know the fix. Use the Konica Redirect response, log the ticket so volume is tracked, and move on.",
      },
      { type: "articleRef", slug: "konica-device-redirect" },
      { type: "heading", level: 2, text: "Saying “no” well" },
      {
        type: "paragraph",
        text: "Out of scope does not mean unhelpful. The strongest version of this call is short, certain, and leaves the person knowing exactly who to contact next. Vagueness is what makes people angry — not the redirect itself.",
      },
      {
        type: "list",
        ordered: false,
        items: [
          "Say clearly that the device is serviced by another team.",
          "Give them the specific next contact, not a general direction.",
          "Log the ticket anyway, so the pattern is visible.",
          "Do not apologise repeatedly — it reads as uncertainty and invites negotiation.",
        ],
      },
      { type: "responseRef", slug: "konica-redirect" },
    ],
  },
  {
    slug: "printer-troubleshooting-path",
    title: "Printer troubleshooting path",
    summary:
      "The ordered checks for a supported printer, from “nothing prints” through driver installation and print release.",
    category: "printing",
    tags: ["printing", "troubleshooting", "drivers", "queue"],
    visibility: "public",
    status: "published",
    updatedAt: "2026-07-30",
    updatedBy: "Help Desk Leadership",
    revision: 6,
    verification: "unverified",
    featured: false,
    related: ["printing-support-scope"],
    body: [
      {
        type: "callout",
        tone: "danger",
        title: "Confirm scope before you start",
        text: "If this is a Konica or personally-owned device, stop here and redirect. Everything below applies only to university-managed printers.",
      },
      { type: "heading", level: 2, text: "1. Narrow the failure" },
      {
        type: "fields",
        items: [
          {
            label: "Nothing happens at all",
            value: "Points at the queue, the driver, or the connection.",
          },
          {
            label: "Job is sent but never comes out",
            value: "Points at print release, quota, or the wrong device.",
          },
          {
            label: "Prints, but wrong",
            value: "Points at driver settings or the source document.",
          },
          {
            label: "Error on the device panel",
            value: "Read it verbatim — this is usually the answer.",
          },
        ],
      },
      { type: "heading", level: 2, text: "2. First-contact checks" },
      {
        type: "steps",
        items: [
          {
            title: "Confirm which physical printer they expect output from",
            detail:
              "People routinely send jobs to a device in a building they left an hour ago.",
          },
          {
            title: "Check the queue for stuck jobs",
            detail:
              "One failed job at the head of the queue blocks everything behind it. Clear it and resend.",
          },
          {
            title: "Confirm the job was released",
            detail:
              "On release-station printing, an unreleased job simply expires. This is the single most common “it never printed”.",
          },
          {
            title: "Check quota or balance if applicable",
            detail: "An exhausted quota fails quietly on many systems.",
          },
          {
            title: "Confirm network connection",
            detail:
              "A laptop on a guest network or a hotspot cannot reach campus print services.",
          },
          {
            title: "Reinstall the printer if the queue is healthy",
            detail:
              "Remove and re-add rather than repairing in place; a corrupted driver profile rarely recovers.",
          },
        ],
      },
      { type: "link", linkKey: "print-management-portal" },
      { type: "heading", level: 2, text: "3. Escalate when" },
      {
        type: "list",
        ordered: false,
        items: [
          "The device shows a hardware fault — jam, consumable, or panel error that persists after clearing.",
          "Multiple users cannot print to the same device.",
          "The queue itself is unreachable rather than empty.",
          "The user needs software or access you cannot grant.",
        ],
      },
      {
        type: "callout",
        tone: "tip",
        title: "Ask what they are printing",
        text: "Very large files, unusual page sizes, and protected documents fail in ways that look like printer faults. It is worth thirty seconds.",
      },
    ],
  },
  {
    slug: "konica-device-redirect",
    title: "Konica devices: the redirect procedure",
    summary:
      "Konica multifunction devices are serviced by the contracted vendor. This is the complete first-contact handling.",
    category: "printing",
    tags: ["printing", "konica", "vendor", "scope", "escalation"],
    visibility: "public",
    status: "published",
    updatedAt: "2026-08-05",
    updatedBy: "Help Desk Leadership",
    revision: 3,
    verification: "unverified",
    featured: false,
    related: ["printing-support-scope", "printer-troubleshooting-path"],
    body: [
      {
        type: "callout",
        tone: "warning",
        title: "Out of Help Desk scope",
        text: "Konica multifunction devices are maintained under a vendor service agreement. Help Desk technicians do not troubleshoot, service, or reconfigure them.",
      },
      { type: "heading", level: 2, text: "Recognising a Konica device" },
      {
        type: "list",
        ordered: false,
        items: [
          "Large floor-standing multifunction unit — copy, scan, fax, print in one device.",
          "Konica or Konica Minolta branding on the front panel.",
          "Usually located in a departmental copy room rather than a lab.",
          "Often has a vendor service sticker with a contact number on the unit itself.",
        ],
      },
      { type: "heading", level: 2, text: "Handling the contact" },
      {
        type: "steps",
        items: [
          {
            title: "Confirm the device is a Konica multifunction unit",
            detail:
              "Ask for the branding on the front. Do not guess from the description alone.",
          },
          {
            title: "Tell the user plainly who services it",
            detail:
              "Clear and confident. This is a routing answer, not a refusal, and it should not sound like one.",
          },
          {
            title: "Point them at the service contact on the device",
            detail:
              "The vendor sticker on the unit is the fastest path for them.",
          },
          {
            title: "Log the ticket anyway",
            detail:
              "Record it as an out-of-scope Konica contact. Volume data is how leadership makes the case for clearer signage.",
          },
          {
            title: "Offer a supported alternative if they are stuck",
            detail:
              "If they simply need something printed today, a nearby supported printer may solve the actual problem.",
          },
        ],
      },
      {
        type: "callout",
        tone: "tip",
        title: "The underlying need",
        text: "“The copier is broken” often really means “I need these forty pages before a 2pm meeting.” Solving that with a supported printer is a genuinely good outcome, and it takes one question.",
      },
      { type: "responseRef", slug: "konica-redirect" },
    ],
  },
];
