"use client";

import { useEffect, useState } from "react";

/**
 * Motion and capability preferences, resolved on the client.
 *
 * `undefined` means "not yet determined" — the landing page renders the static
 * narrative until this resolves, so the cinematic canvas is never mounted for
 * someone who has asked for reduced motion, not even for one frame.
 */

export function usePrefersReducedMotion(): boolean | undefined {
  const [reduced, setReduced] = useState<boolean | undefined>(undefined);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(query.matches);

    const onChange = (event: MediaQueryListEvent) => setReduced(event.matches);
    query.addEventListener("change", onChange);
    return () => query.removeEventListener("change", onChange);
  }, []);

  return reduced;
}

/**
 * Whether this device should get the scroll-driven 3D experience at all.
 *
 * Small screens get a purpose-built vertical narrative instead — not a shrunken
 * version of the desktop one. A phone held in one hand while scrolling with a
 * thumb is a different reading experience, and pinning a WebGL canvas behind it
 * costs battery for very little.
 *
 * Also returns false when WebGL is unavailable.
 */
export function useSupportsCinematic(): boolean | undefined {
  const [supported, setSupported] = useState<boolean | undefined>(undefined);

  useEffect(() => {
    const query = window.matchMedia("(min-width: 900px) and (min-height: 600px)");

    const evaluate = () => {
      if (!query.matches) {
        setSupported(false);
        return;
      }
      setSupported(hasWebGL());
    };

    evaluate();
    query.addEventListener("change", evaluate);
    return () => query.removeEventListener("change", evaluate);
  }, []);

  return supported;
}

let webglCache: boolean | null = null;

function hasWebGL(): boolean {
  if (webglCache !== null) return webglCache;
  try {
    const canvas = document.createElement("canvas");
    const context =
      canvas.getContext("webgl2") ??
      canvas.getContext("webgl") ??
      canvas.getContext("experimental-webgl");
    webglCache = Boolean(context);
  } catch {
    webglCache = false;
  }
  return webglCache;
}
