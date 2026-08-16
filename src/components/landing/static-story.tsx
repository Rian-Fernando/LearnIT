import { cn } from "@/lib/cn";
import { ACTS, type Formation } from "./story";

/**
 * The narrative without motion.
 *
 * Served to anyone who has asked for reduced motion, to small screens, and to
 * devices without WebGL. It is deliberately *not* the cinematic layout with the
 * canvas removed — a phone scrolled with a thumb wants short, self-contained
 * sections, so this is a vertical story where each act stands on its own.
 *
 * Each act carries a static diagram of the same formation the 3D scene morphs
 * into, so the visual argument survives even when the animation does not.
 */
export function StaticStory() {
  return (
    <div className="mx-auto w-full max-w-3xl px-6 py-20 sm:px-8 sm:py-28">
      <ol className="space-y-20 sm:space-y-28">
        {ACTS.map((act) => (
          <li key={act.id}>
            <article>
              <div className="flex items-center gap-3">
                <span className="tabular font-mono text-xs tracking-[0.2em] text-accent-text">
                  {act.index}
                </span>
                <span aria-hidden className="h-px w-8 bg-default" />
                <span className="eyebrow">{act.eyebrow}</span>
              </div>

              <h2 className="mt-5 text-2xl font-semibold leading-[1.12] tracking-[-0.028em] text-primary sm:text-[2rem]">
                {act.headline}
              </h2>
              {act.subline ? (
                <p className="mt-1.5 text-2xl font-semibold leading-[1.12] tracking-[-0.028em] text-tertiary sm:text-[2rem]">
                  {act.subline}
                </p>
              ) : null}

              <FormationDiagram formation={act.formation} className="my-8" />

              {act.body ? (
                <p className="text-[0.9375rem] leading-7 text-secondary">{act.body}</p>
              ) : null}

              {act.systems ? (
                <ul className="mt-6 flex flex-wrap gap-2">
                  {act.systems.map((system) => (
                    <li
                      key={system}
                      className="rounded-md border border-subtle bg-surface-inset px-2.5 py-1 font-mono text-[0.6875rem] uppercase tracking-[0.12em] text-tertiary"
                    >
                      {system}
                    </li>
                  ))}
                </ul>
              ) : null}

              {act.pillars ? (
                <ul className="mt-7 space-y-4">
                  {act.pillars.map((pillar) => (
                    <li key={pillar.title} className="border-l border-default pl-4">
                      <p className="text-sm font-medium text-primary">{pillar.title}</p>
                      <p className="mt-1 text-sm leading-6 text-tertiary">
                        {pillar.description}
                      </p>
                    </li>
                  ))}
                </ul>
              ) : null}
            </article>
          </li>
        ))}
      </ol>
    </div>
  );
}

/* -------------------------------------------------------------------------- */

/**
 * Static representations of the five formations.
 *
 * Purely illustrative, so `aria-hidden` — the surrounding prose already carries
 * the meaning. Drawn inline rather than loaded as assets: five small diagrams
 * are cheaper as markup than as five network requests.
 */
function FormationDiagram({
  formation,
  className,
}: {
  formation: Formation;
  className?: string;
}) {
  return (
    <div
      aria-hidden
      className={cn(
        "overflow-hidden rounded-xl border border-subtle bg-surface-sunken",
        className,
      )}
    >
      <svg
        viewBox="0 0 320 120"
        className="h-auto w-full"
        role="presentation"
        focusable="false"
      >
        <defs>
          <radialGradient id={`glow-${formation}`}>
            <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.5" />
            <stop offset="100%" stopColor="var(--accent)" stopOpacity="0" />
          </radialGradient>
        </defs>
        {renderFormation(formation)}
      </svg>
    </div>
  );
}

/**
 * Round a computed coordinate before it reaches the DOM.
 *
 * `Math.sin` and `Math.cos` are not required by the spec to be correctly
 * rounded, and Node and the browser genuinely disagree in the final
 * floating-point digit — enough to render `14.966679003209201` on the server
 * and `14.966679003209208` on the client, which React reports as a hydration
 * mismatch. Two decimals is far more precision than a 320×120 diagram needs.
 */
const r = (n: number): number => Math.round(n * 100) / 100;

/** Deterministic pseudo-random so the diagrams never shift between renders. */
function seeded(seed: number) {
  let state = seed >>> 0;
  return () => {
    state = (state * 1664525 + 1013904223) >>> 0;
    return state / 0x100000000;
  };
}

function renderFormation(formation: Formation) {
  const dot = (
    x: number,
    y: number,
    radius: number,
    opacity: number,
    key: string,
  ) => (
    <circle
      key={key}
      cx={r(x)}
      cy={r(y)}
      r={radius}
      fill="currentColor"
      opacity={r(opacity)}
    />
  );

  switch (formation) {
    case "scatter": {
      const random = seeded(11);
      return (
        <g className="text-tertiary">
          {Array.from({ length: 90 }, (_, i) =>
            dot(
              random() * 320,
              random() * 120,
              0.7 + random() * 1.1,
              0.25 + random() * 0.4,
              `s${i}`,
            ),
          )}
        </g>
      );
    }

    case "converge": {
      const random = seeded(22);
      const cx = 160;
      const cy = 60;
      const spokes = 12;
      return (
        <g>
          <circle cx={cx} cy={cy} r={34} fill={`url(#glow-converge)`} />
          <g className="text-tertiary" stroke="currentColor" strokeWidth="0.5" opacity="0.35">
            {Array.from({ length: spokes }, (_, i) => {
              const angle = (i / spokes) * Math.PI * 2;
              return (
                <line
                  key={`l${i}`}
                  x1={cx}
                  y1={cy}
                  x2={r(cx + Math.cos(angle) * 140)}
                  y2={r(cy + Math.sin(angle) * 52)}
                />
              );
            })}
          </g>
          <g className="text-tertiary">
            {Array.from({ length: spokes }, (_, i) => {
              const angle = (i / spokes) * Math.PI * 2;
              const t = 0.4 + random() * 0.6;
              return dot(
                cx + Math.cos(angle) * 140 * t,
                cy + Math.sin(angle) * 52 * t,
                1.4,
                0.65,
                `n${i}`,
              );
            })}
          </g>
          <circle cx={cx} cy={cy} r={4.5} fill="var(--accent)" />
        </g>
      );
    }

    case "complex": {
      const random = seeded(33);
      const anchors = [
        [46, 32],
        [122, 84],
        [196, 28],
        [268, 74],
        [88, 60],
        [232, 100],
      ];
      return (
        <g className="text-tertiary">
          {anchors.flatMap(([ax, ay], ci) =>
            Array.from({ length: 16 }, (_, i) =>
              dot(
                ax! + (random() - 0.5) * 34,
                ay! + (random() - 0.5) * 34,
                0.7 + random() * 1.1,
                0.3 + random() * 0.35,
                `c${ci}-${i}`,
              ),
            ),
          )}
        </g>
      );
    }

    case "lattice": {
      const cols = 22;
      const rows = 6;
      return (
        <g className="text-accent-text">
          {Array.from({ length: rows }, (_, row) =>
            Array.from({ length: cols }, (_, c) => {
              const x = 18 + c * ((320 - 36) / (cols - 1));
              const y = 22 + row * ((120 - 44) / (rows - 1));
              return dot(x, y, 1.35, 0.55, `g${row}-${c}`);
            }),
          )}
        </g>
      );
    }

    case "interface": {
      const panels = 5;
      const width = 50;
      const gap = 10;
      const total = panels * width + (panels - 1) * gap;
      const start = (320 - total) / 2;
      return (
        <g>
          {Array.from({ length: panels }, (_, i) => (
            <rect
              key={`p${i}`}
              x={r(start + i * (width + gap))}
              y={22}
              width={width}
              height={76}
              rx={5}
              fill="none"
              stroke="var(--accent)"
              strokeOpacity="0.45"
              strokeWidth="1"
            />
          ))}
          {Array.from({ length: panels }, (_, i) => (
            <rect
              key={`b${i}`}
              x={r(start + i * (width + gap) + 10)}
              y={36}
              width={width - 20}
              height={3}
              rx={1.5}
              fill="var(--accent)"
              fillOpacity="0.5"
            />
          ))}
        </g>
      );
    }
  }
}
