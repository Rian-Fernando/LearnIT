"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/cn";
import { useActiveAct, useScrollProgress, useSmoothScroll } from "@/lib/hooks/use-scroll-progress";
import { CinematicCanvas } from "./scene/cinematic-canvas";
import { ACTS } from "./story";

/**
 * The scroll-driven narrative.
 *
 * Structure: a tall container of full-height spacers drives an
 * IntersectionObserver, while a sticky layer holds the canvas and the copy. The
 * reading position therefore stays fixed while the 3D environment transforms
 * around it — the visitor is not chasing text down the page.
 *
 * Scroll position feeds the scene through a ref (no React re-render per frame);
 * only the act change re-renders, and only the small overlay subtree.
 */
export function CinematicStory() {
  const { ref: progressRef, containerRef } = useScrollProgress();
  const { active, register } = useActiveAct(ACTS.length);
  const [ready, setReady] = useState(false);

  useSmoothScroll(true);

  // Fade the whole experience in after mount so the first paint is not a
  // half-initialised particle field.
  useEffect(() => {
    const id = requestAnimationFrame(() => setReady(true));
    return () => cancelAnimationFrame(id);
  }, []);

  const act = ACTS[active]!;

  return (
    <div ref={containerRef} className="relative" data-surface="cinematic">
      {/* ---- pinned stage ---- */}
      <div className="sticky top-0 h-screen w-full overflow-hidden bg-[#08090b]">
        <CinematicCanvas
          progressRef={progressRef}
          className={cn(
            "absolute inset-0 transition-opacity duration-1000",
            ready ? "opacity-100" : "opacity-0",
          )}
        />

        {/* Scrim: guarantees text contrast over the brightest part of the
            field, without flattening the scene. */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-gradient-to-r from-[#08090b] via-[#08090b]/70 to-transparent lg:to-[#08090b]/10"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#08090b] to-transparent"
        />

        {/* ---- copy ---- */}
        <div className="absolute inset-0 flex items-center">
          <div className="mx-auto w-full max-w-[88rem] px-6 sm:px-10">
            <div className="max-w-2xl">
              {/* `key` remounts the subtree on act change, replaying the
                  entrance animation. */}
              <div key={act.id} className="animate-fade-up">
                <div className="flex items-center gap-3">
                  <span className="tabular font-mono text-xs tracking-[0.2em] text-[#e89f2c]">
                    {act.index}
                  </span>
                  <span aria-hidden className="h-px w-8 bg-white/20" />
                  <span className="font-mono text-[0.6875rem] uppercase tracking-[0.16em] text-white/50">
                    {act.eyebrow}
                  </span>
                </div>

                <h2 className="text-over-scene mt-6 text-3xl font-semibold leading-[1.08] tracking-[-0.03em] text-white sm:text-4xl lg:text-[3.25rem]">
                  {act.headline}
                </h2>

                {act.subline ? (
                  <p
                    className="text-over-scene mt-3 text-3xl font-semibold leading-[1.08] tracking-[-0.03em] text-white/55 sm:text-4xl lg:text-[3.25rem]"
                    style={{ animationDelay: "120ms" }}
                  >
                    {act.subline}
                  </p>
                ) : null}

                {act.body ? (
                  <p className="text-over-scene mt-7 max-w-xl text-base leading-relaxed text-white/65">
                    {act.body}
                  </p>
                ) : null}

                {act.pillars ? <PillarList pillars={act.pillars} /> : null}
              </div>
            </div>
          </div>
        </div>

        {act.systems ? <SystemCloud systems={act.systems} /> : null}

        <ActRail count={ACTS.length} active={active} />
        <ScrollHint visible={active === 0} />
      </div>

      {/* ---- scroll drivers ----
          Each act owns one viewport of scroll. They are empty by design: the
          copy lives in the sticky layer above. */}
      {ACTS.map((entry, index) => (
        <section
          key={entry.id}
          ref={register(index)}
          aria-hidden
          className="h-screen"
          data-act={entry.id}
        />
      ))}
    </div>
  );
}

/* -------------------------------------------------------------------------- */

function PillarList({ pillars }: { pillars: { title: string; description: string }[] }) {
  return (
    <ul className="mt-8 grid gap-x-8 gap-y-4 sm:grid-cols-2">
      {pillars.map((pillar, index) => (
        <li
          key={pillar.title}
          className="animate-fade-up border-l border-white/12 pl-4"
          style={{ animationDelay: `${140 + index * 70}ms` }}
        >
          <p className="text-sm font-medium text-white">{pillar.title}</p>
          <p className="mt-1 text-sm leading-6 text-white/50">{pillar.description}</p>
        </li>
      ))}
    </ul>
  );
}

/**
 * System labels for the "complexity" act.
 *
 * Rendered as DOM rather than 3D text: legibility at small sizes is far better,
 * they stay selectable and readable by assistive technology, and it avoids
 * loading a font atlas for nine words.
 */
function SystemCloud({ systems }: { systems: string[] }) {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 hidden lg:block"
    >
      {systems.map((system, index) => {
        // Distributed around the right two thirds of the stage, away from copy.
        const angle = (index / systems.length) * Math.PI * 2;
        const left = 62 + Math.cos(angle) * 26;
        const top = 50 + Math.sin(angle) * 32;
        return (
          <span
            key={system}
            className="animate-fade-in absolute -translate-x-1/2 -translate-y-1/2 rounded-md border border-white/10 bg-white/[0.03] px-2.5 py-1 font-mono text-[0.6875rem] uppercase tracking-[0.12em] text-white/45 backdrop-blur-sm"
            style={{
              left: `${left}%`,
              top: `${top}%`,
              animationDelay: `${index * 80}ms`,
            }}
          >
            {system}
          </span>
        );
      })}
    </div>
  );
}

/** Act indicator. Minimal, right-aligned, never competes with the copy. */
function ActRail({ count, active }: { count: number; active: number }) {
  return (
    <div
      aria-hidden
      className="absolute right-6 top-1/2 hidden -translate-y-1/2 flex-col gap-2.5 sm:flex"
    >
      {Array.from({ length: count }, (_, index) => (
        <span
          key={index}
          className={cn(
            "h-6 w-px transition-colors duration-500",
            index === active ? "bg-[#e89f2c]" : "bg-white/15",
          )}
        />
      ))}
    </div>
  );
}

function ScrollHint({ visible }: { visible: boolean }) {
  return (
    <div
      aria-hidden
      className={cn(
        "absolute bottom-8 left-1/2 -translate-x-1/2 transition-opacity duration-500",
        visible ? "opacity-100" : "opacity-0",
      )}
    >
      <div className="flex flex-col items-center gap-2">
        <span className="font-mono text-[0.625rem] uppercase tracking-[0.2em] text-white/35">
          Scroll
        </span>
        <span className="relative h-8 w-px overflow-hidden bg-white/15">
          <span className="absolute inset-x-0 top-0 h-3 animate-[lt-scroll-hint_2s_ease-in-out_infinite] bg-white/60" />
        </span>
      </div>
    </div>
  );
}
