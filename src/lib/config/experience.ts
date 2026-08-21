/**
 * ---------------------------------------------------------------------------
 * Experience mode
 * ---------------------------------------------------------------------------
 * learnIT ships as two experiences from one codebase.
 *
 *   course     A structured onboarding track. Ordered modules, steps,
 *              knowledge checks, and progress. For someone learning the job
 *              from nothing.
 *
 *   reference  A working reference. Systems directory, ticket anatomy, and
 *              what to collect — no walkthrough, no progress, no sequence.
 *              For someone who has a caller on the line right now.
 *
 * They share the landing page, knowledge base, troubleshooting workflows,
 * quick responses, reference tickets, and search. Only the learning area
 * differs, so both stay in step as content grows.
 *
 * This is a public variable because the shell reads it when deciding what to
 * put in the navigation. It carries no secret — it selects a presentation.
 */

export type Experience = "course" | "reference";

export function experience(): Experience {
  return process.env.NEXT_PUBLIC_EXPERIENCE === "reference" ? "reference" : "course";
}

export function isReferenceMode(): boolean {
  return experience() === "reference";
}

/** Labels that differ between the two experiences. */
export const EXPERIENCE_COPY: Record<
  Experience,
  { navLabel: string; navDescription: string; areaTitle: string; areaIntro: string }
> = {
  course: {
    navLabel: "Training",
    navDescription: "Structured onboarding modules",
    areaTitle: "Your onboarding track",
    areaIntro:
      "Modules are ordered so each one builds on the last. Work through them in sequence for your first pass — after that, come back to whichever you need.",
  },
  reference: {
    navLabel: "Reference",
    navDescription: "Systems, ticket anatomy, what to collect",
    areaTitle: "Reference",
    areaIntro:
      "The systems you will use, how a ticket is put together, and what to collect on a call. No sequence — open what you need, when you need it.",
  },
};
