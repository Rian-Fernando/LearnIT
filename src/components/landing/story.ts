/**
 * The landing narrative, as data.
 *
 * The cinematic (scroll-driven 3D) experience and the reduced-motion / small
 * screen experience are genuinely different designs — but they tell the same
 * story with the same words. Keeping the copy here is what guarantees that,
 * and means the narrative can be revised without touching either renderer.
 *
 * `formation` names the point-cloud arrangement the 3D scene morphs into
 * during each act. See `scene/formations.ts`.
 */

export type Formation = "scatter" | "converge" | "complex" | "lattice" | "interface";

export interface Act {
  id: string;
  /** Small mono label, e.g. "01 — The problem". */
  index: string;
  eyebrow: string;
  /** Primary line. Rendered large. */
  headline: string;
  /** Optional second beat, revealed slightly after the headline. */
  subline?: string;
  /** Supporting paragraph. */
  body?: string;
  formation: Formation;
  /** Systems surfaced as floating labels during the "complexity" act. */
  systems?: string[];
  /** Product pillars revealed during the platform act. */
  pillars?: { title: string; description: string }[];
}

export const ACTS: Act[] = [
  {
    id: "problem",
    index: "01",
    eyebrow: "Every technician starts here",
    headline: "The challenge isn't knowing everything.",
    subline: "It's knowing where to look.",
    body: "A new Help Desk employee walks into a university's entire technology ecosystem on day one. Accounts, networks, printers, remote support, ticketing — all of it live, all of it in front of a real person who needs help now.",
    formation: "scatter",
  },
  {
    id: "helpdesk",
    index: "02",
    eyebrow: "The Help Desk",
    headline: "The Help Desk connects people to technology.",
    body: "Students, faculty, and staff. Accounts, devices, networks, and applications. Every one of those connections runs through a technician who has to know where to look — and has to be right.",
    formation: "converge",
  },
  {
    id: "complexity",
    index: "03",
    eyebrow: "The reality of the work",
    headline: "New tools. New procedures.",
    subline: "New problems every day.",
    body: "Procedures live in a dozen places — a shared document, a supervisor's memory, a message from six months ago. When something changes, nobody is sure which version is current.",
    formation: "complex",
    systems: [
      "Ticketing",
      "Remote Support",
      "Accounts",
      "VPN",
      "Printing",
      "Networks",
      "Escalation",
      "Scheduling",
      "Devices",
    ],
  },
  {
    id: "learnit",
    index: "04",
    eyebrow: "learnIT",
    headline: "What if learning it was simpler?",
    body: "One place where every procedure is current, every workflow is structured, and finding the answer takes seconds — whether it's your first week or your third year.",
    formation: "lattice",
  },
  {
    id: "platform",
    index: "05",
    eyebrow: "The platform",
    headline: "Learn the tools. Understand the workflow. Support the community.",
    formation: "interface",
    pillars: [
      {
        title: "Learn",
        description:
          "Structured onboarding modules with steps, knowledge checks, and progress you can actually see.",
      },
      {
        title: "Troubleshoot",
        description:
          "Guided decision trees that take you from a vague symptom to a confident next step.",
      },
      {
        title: "Knowledge Base",
        description:
          "Every procedure, searchable in milliseconds, with the date it was last reviewed.",
      },
      {
        title: "Quick Responses",
        description:
          "Copy-ready messages for the situations that come up twenty times a shift.",
      },
      {
        title: "Practice",
        description:
          "Realistic tickets with feedback, so the first hard call isn't the first time you've seen it.",
      },
    ],
  },
];

/** Ordered formations, used by the scene to interpolate between acts. */
export const FORMATIONS: Formation[] = ACTS.map((act) => act.formation);
