import type { Principle } from "@/lib/content/schema";

/**
 * The ten recurring Help Desk habits.
 *
 * These are surfaced **contextually** — one at a time, via a `principle` block,
 * at the moment in a workflow where the habit actually applies. Presenting all
 * ten on one page produces a list nobody reads; showing "Verify the account"
 * exactly when a technician is about to act on the wrong one is what makes it
 * stick.
 *
 * Each carries a `why`, because a rule without its failure mode gets skipped
 * the first time it is inconvenient.
 */
export const principles: Principle[] = [
  {
    id: "ask-before-assuming",
    order: 1,
    title: "Ask before assuming",
    summary:
      "Gather what you need before you start fixing. A question costs seconds; a wrong assumption costs the whole call.",
    why: "Most wasted Help Desk time is spent troubleshooting the wrong problem confidently. The information that would have prevented it was almost always one question away.",
  },
  {
    id: "verify-the-user",
    order: 2,
    title: "Verify the user",
    summary:
      "Confirm who you are speaking to through the approved process before taking any action on an account.",
    why: "Account access is the highest-risk thing the Help Desk touches. Social engineering does not sound suspicious — it sounds urgent, senior, and frustrated, because those are the pressures that make people skip steps.",
  },
  {
    id: "verify-the-account",
    order: 3,
    title: "Verify the account",
    summary:
      "A person is not an account. Confirm which username, which role, and which system before troubleshooting.",
    why: "Users can hold both a student and an employee account. Fixing the account they are not asking about looks like the problem is unfixable.",
  },
  {
    id: "check-previous-tickets",
    order: 4,
    title: "Check previous tickets",
    summary:
      "Look at the user's history before troubleshooting. Someone may have already solved this — or already tried what you are about to try.",
    why: "Repeating a colleague's failed troubleshooting wastes the user's time twice and tells them the Help Desk does not talk to itself.",
  },
  {
    id: "document-what-you-did",
    order: 5,
    title: "Document what you did",
    summary:
      "Write the ticket for the person who picks it up tomorrow knowing nothing. That person is often you.",
    why: "An undocumented fix is a fix that only happened once. The next technician starts from zero, and so does the user.",
  },
  {
    id: "assign-correctly",
    order: 6,
    title: "Assign to the correct team",
    summary:
      "Correct assignment is part of correct troubleshooting, not an afterthought once the work is done.",
    why: "A well-written ticket sent to the wrong queue still fails the user — it just fails them more slowly, and with nobody obviously at fault.",
  },
  {
    id: "double-check-before-saving",
    order: 7,
    title: "Double-check before saving",
    summary:
      "Re-read the contact, category, assignee, and notification settings before you save. Once it is sent, it is sent.",
    why: "Almost every ticket problem is caught by ten seconds of re-reading. Almost none are caught after the notification has gone out.",
  },
  {
    id: "notify-deliberately",
    order: 8,
    title: "Only notify the people who need to know",
    summary:
      "Check the notification boxes deliberately every time — including unchecking them when a ticket is only being closed.",
    why: "Unnecessary notifications train people to ignore ticket email, which means the one that mattered gets ignored too.",
  },
  {
    id: "investigate-dont-guess",
    order: 9,
    title: "If you do not know, investigate",
    summary:
      "Look it up, ask a colleague, or escalate. Never fill a gap with something that sounds plausible.",
    why: "A confident wrong answer is worse than no answer: the user acts on it, and nobody finds out it was wrong until the damage is done.",
  },
  {
    id: "protect-user-information",
    order: 10,
    title: "Protect user information",
    summary:
      "Never record credentials, and never expose more personal information than the ticket genuinely needs.",
    why: "Ticket text is retained, searchable, and read by many people. Anything written there should be fine for the user, a supervisor, and an auditor to read.",
  },
];

export function principleById(id: string): Principle | undefined {
  return principles.find((principle) => principle.id === id);
}
