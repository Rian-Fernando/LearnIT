"use client";

import dynamic from "next/dynamic";
import {
  usePrefersReducedMotion,
  useSupportsCinematic,
} from "@/lib/hooks/use-motion-preference";
import { StaticStory } from "./static-story";

/**
 * Chooses which narrative to render.
 *
 * The cinematic bundle (three, @react-three/fiber, lenis) is code-split and
 * only requested once we know the visitor should get it — so a phone, or
 * someone with reduced motion enabled, never downloads roughly half a megabyte
 * of WebGL machinery to read a story that renders fine as HTML.
 *
 * Until the preference queries resolve, the static story renders. It is a
 * complete experience in its own right, not a placeholder, so there is no
 * flash of empty layout and no layout shift.
 */

const CinematicStory = dynamic(
  () => import("./cinematic-story").then((mod) => mod.CinematicStory),
  {
    ssr: false,
    loading: () => <StaticStory />,
  },
);

export function LandingExperience() {
  const reducedMotion = usePrefersReducedMotion();
  const supportsCinematic = useSupportsCinematic();

  // `undefined` = still resolving on the client.
  const resolved = reducedMotion !== undefined && supportsCinematic !== undefined;
  const cinematic = resolved && !reducedMotion && supportsCinematic;

  if (!cinematic) return <StaticStory />;
  return <CinematicStory />;
}
