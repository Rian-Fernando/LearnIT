import type { RubricItem, TicketSimulation } from "@/lib/content/schema";

/**
 * ---------------------------------------------------------------------------
 * Ticket grading
 * ---------------------------------------------------------------------------
 * Deterministic, explainable, and honest about its limits.
 *
 * **What this does:** checks whether specific facts were captured, whether the
 * title follows the documented format, and whether routing and notification
 * choices match what the workflow expects.
 *
 * **What this does not do:** judge whether a description is well written,
 * whether the reasoning is sound, or whether the tone is appropriate. It is
 * substring and pattern matching. A trainee could pass every item and still
 * have written something disjointed.
 *
 * That limitation is stated in the UI rather than hidden, because a grader
 * presented as smarter than it is teaches people to write for the grader. The
 * model answer is always shown afterwards so a human comparison is possible —
 * that is where judgement actually gets assessed.
 *
 * Matching is deliberately generous: `anyOf` carries several phrasings, so
 * "no signal" and "No Signal" both count. Marking a trainee wrong for
 * capitalisation would teach nothing.
 */

export interface TicketDraft {
  title: string;
  category: string;
  assignee: string;
  description: string;
  notifyAssignees: boolean;
  notifyContact: boolean;
}

export interface GradedItem {
  item: RubricItem;
  earned: boolean;
  feedback: string;
}

export interface GradeResult {
  items: GradedItem[];
  earnedWeight: number;
  totalWeight: number;
  percent: number;
  /** Rubric items grouped by the field they examine, for display. */
  byTarget: Record<RubricItem["target"], GradedItem[]>;
}

function fieldFor(draft: TicketDraft, target: RubricItem["target"]): string {
  switch (target) {
    case "title":
      return draft.title;
    case "description":
      return draft.description;
    case "category":
      return draft.category;
    case "assignee":
      return draft.assignee;
    case "notifications":
      return "";
  }
}

function passes(item: RubricItem, draft: TicketDraft): boolean {
  if (item.target === "notifications") {
    const expected = item.expectNotification;
    if (!expected) return false;
    return (
      draft.notifyAssignees === expected.assignees &&
      draft.notifyContact === expected.contact
    );
  }

  const value = fieldFor(draft, item.target);
  if (!value.trim()) return false;

  if (item.pattern) {
    try {
      // Case-insensitive so a trainee is not penalised for capitalisation.
      return new RegExp(item.pattern, "i").test(value);
    } catch {
      // A malformed pattern is an authoring bug, not a trainee failure —
      // never fail someone because the rubric is broken.
      return false;
    }
  }

  if (item.anyOf.length === 0) return false;

  const haystack = value.toLowerCase();
  return item.anyOf.some((needle) => haystack.includes(needle.toLowerCase()));
}

export function gradeTicket(
  simulation: TicketSimulation,
  draft: TicketDraft,
): GradeResult {
  const items: GradedItem[] = simulation.rubric.map((item) => {
    const earned = passes(item, draft);
    return {
      item,
      earned,
      feedback: earned ? item.feedbackPass : item.feedbackFail,
    };
  });

  const totalWeight = simulation.rubric.reduce((sum, item) => sum + item.weight, 0);
  const earnedWeight = items
    .filter((graded) => graded.earned)
    .reduce((sum, graded) => sum + graded.item.weight, 0);

  const byTarget = items.reduce<Record<string, GradedItem[]>>((acc, graded) => {
    (acc[graded.item.target] ??= []).push(graded);
    return acc;
  }, {});

  return {
    items,
    earnedWeight,
    totalWeight,
    percent: totalWeight === 0 ? 0 : Math.round((earnedWeight / totalWeight) * 100),
    byTarget: byTarget as GradeResult["byTarget"],
  };
}

/**
 * A qualitative band rather than a grade.
 *
 * Deliberately not a letter or a pass mark: this is practice, and a technician
 * who "failed" a simulation should be reading the feedback, not their score.
 */
export function band(percent: number): {
  label: string;
  tone: "success" | "accent" | "warning";
  note: string;
} {
  if (percent >= 85) {
    return {
      label: "Strong",
      tone: "success",
      note: "This ticket would let a colleague pick the work up without asking you anything.",
    };
  }
  if (percent >= 60) {
    return {
      label: "Workable",
      tone: "accent",
      note: "The essentials are there. The gaps below are the ones that cost the next person time.",
    };
  }
  return {
    label: "Needs another pass",
    tone: "warning",
    note: "Enough is missing that someone picking this up would have to start over. Read the feedback, then compare against the model answer.",
  };
}
