"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Scroll progress for the cinematic landing.
 *
 * Two things matter here:
 *
 *   1. The 3D scene must never re-render React on scroll. Progress is written
 *      into a ref that the render loop samples, so scrolling costs one number
 *      assignment per event rather than a React commit.
 *
 *   2. The narrative overlay *does* need to re-render, but only when the active
 *      act changes — not on every pixel. That is a separate, coarse subscription.
 *
 * Progress is normalised 0 → 1 across the scroll container's travel.
 */

export interface ScrollProgress {
  /** Live value, updated outside React. Read from a render loop. */
  ref: React.RefObject<number>;
  /** Attach to the tall scroll container. */
  containerRef: React.RefObject<HTMLDivElement | null>;
}

export function useScrollProgress(): ScrollProgress {
  const ref = useRef(0);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let frame = 0;

    const measure = () => {
      frame = 0;
      const rect = container.getBoundingClientRect();
      // Total distance the container travels past the viewport.
      const travel = rect.height - window.innerHeight;
      if (travel <= 0) {
        ref.current = 0;
        return;
      }
      const scrolled = -rect.top;
      ref.current = Math.min(1, Math.max(0, scrolled / travel));
    };

    const schedule = () => {
      if (frame) return;
      frame = requestAnimationFrame(measure);
    };

    measure();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);

    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, []);

  return { ref, containerRef };
}

/**
 * Coarse subscription: which act is currently on screen.
 *
 * Uses IntersectionObserver rather than sampling scroll, so the overlay only
 * re-renders at act boundaries.
 */
export function useActiveAct(count: number): {
  active: number;
  register: (index: number) => (node: HTMLElement | null) => void;
} {
  const [active, setActive] = useState(0);
  const nodes = useRef<(HTMLElement | null)[]>([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const index = nodes.current.indexOf(entry.target as HTMLElement);
          if (index >= 0) setActive(index);
        }
      },
      // A narrow band across the middle of the viewport: an act becomes active
      // when it reaches the reading position, not when it first appears.
      { rootMargin: "-45% 0px -45% 0px", threshold: 0 },
    );

    for (const node of nodes.current) {
      if (node) observer.observe(node);
    }
    return () => observer.disconnect();
  }, [count]);

  const register = (index: number) => (node: HTMLElement | null) => {
    nodes.current[index] = node;
  };

  return { active, register };
}

/**
 * Smooth scrolling via Lenis, enabled only for the cinematic experience.
 *
 * Deliberately opt-in per page: hijacking scroll across the whole application
 * would fight with keyboard navigation and in-page anchors in the Help Desk
 * tools, where responsiveness matters more than feel.
 */
export function useSmoothScroll(enabled: boolean): void {
  useEffect(() => {
    if (!enabled) return;

    let cancelled = false;
    let cleanup: (() => void) | undefined;

    void import("lenis").then(({ default: Lenis }) => {
      if (cancelled) return;

      const lenis = new Lenis({
        duration: 1.1,
        // Gentle exponential ease-out — momentum without the "ice rink" feel.
        easing: (t: number) => 1 - Math.pow(1 - t, 3),
        smoothWheel: true,
        touchMultiplier: 1.6,
      });

      let frame = requestAnimationFrame(function raf(time: number) {
        lenis.raf(time);
        frame = requestAnimationFrame(raf);
      });

      cleanup = () => {
        cancelAnimationFrame(frame);
        lenis.destroy();
      };
    });

    return () => {
      cancelled = true;
      cleanup?.();
    };
  }, [enabled]);
}
