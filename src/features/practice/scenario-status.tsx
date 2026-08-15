"use client";

import { Badge } from "@/components/ui/primitives";
import { useProgress } from "@/lib/progress/store";

/**
 * "Practised" marker on a scenario card.
 *
 * Split into its own tiny client component so the scenario index stays a server
 * component — only this badge needs the browser-stored progress state.
 */
export function ScenarioStatus({ slug }: { slug: string }) {
  const { state, ready } = useProgress();
  if (!ready) return null;

  const result = state.scenarios[slug];
  if (!result) return null;

  const perfect = result.correct === result.total;
  return (
    <Badge tone={perfect ? "success" : "neutral"}>
      {perfect ? "Practised" : `${result.correct}/${result.total}`}
    </Badge>
  );
}
