"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

/**
 * ---------------------------------------------------------------------------
 * Learning progress
 * ---------------------------------------------------------------------------
 * Progress is a technician's own record of what they have read and answered.
 * It is not sensitive, it is not authoritative, and it is not shared — which is
 * exactly why the default adapter is browser storage. That choice lets the demo
 * be fully functional with zero infrastructure, and lets the internal
 * deployment start collecting real completion data by swapping one trainingModule.
 *
 * SWAP POINT — replacing `readState` / `writeState` with calls to a server
 * action backed by the `training_progress` table is the entire migration. The
 * shape below is already the table shape. See docs/architecture.md.
 *
 * Deliberately NOT stored here: anything identifying, anything about the
 * requesters a technician has helped, and any timing data precise enough to be
 * used for performance monitoring. This is a learning aid, not surveillance.
 */

const STORAGE_KEY = "learnit-progress-v1";

export interface CheckResult {
  correct: boolean;
  /** ISO timestamp — used only to show "answered" state and recency. */
  at: string;
}

export interface ModuleProgress {
  completedSteps: string[];
  checks: Record<string, CheckResult>;
  completedAt?: string;
}

export interface ScenarioProgress {
  completedAt: string;
  correct: number;
  total: number;
}

export interface ProgressState {
  modules: Record<string, ModuleProgress>;
  scenarios: Record<string, ScenarioProgress>;
  /** Enables "continue where you left off" on the dashboard. */
  lastVisited?: { moduleSlug: string; stepId: string; at: string };
}

const EMPTY: ProgressState = { modules: {}, scenarios: {} };

/* -------------------------------------------------------------------------- */
/* Persistence                                                                */
/* -------------------------------------------------------------------------- */

function readState(): ProgressState {
  if (typeof window === "undefined") return EMPTY;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return EMPTY;
    const parsed = JSON.parse(raw) as Partial<ProgressState>;
    return {
      modules: parsed.modules ?? {},
      scenarios: parsed.scenarios ?? {},
      ...(parsed.lastVisited ? { lastVisited: parsed.lastVisited } : {}),
    };
  } catch {
    // Corrupted or unreadable storage should never break the app — a
    // technician mid-shift gets a fresh slate, not an error screen.
    return EMPTY;
  }
}

function writeState(state: ProgressState): void {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Quota exceeded or storage disabled. Progress stays in memory for this
    // session; nothing else degrades.
  }
}

/* -------------------------------------------------------------------------- */
/* Context                                                                    */
/* -------------------------------------------------------------------------- */

interface ProgressApi {
  state: ProgressState;
  /** True once storage has been read — guards against a hydration mismatch. */
  ready: boolean;
  completeStep(moduleSlug: string, stepId: string): void;
  uncompleteStep(moduleSlug: string, stepId: string): void;
  recordCheck(moduleSlug: string, checkId: string, correct: boolean): void;
  markModuleComplete(moduleSlug: string, totalSteps: number): void;
  recordScenario(slug: string, correct: number, total: number): void;
  noteVisit(moduleSlug: string, stepId: string): void;
  reset(): void;
}

const ProgressContext = createContext<ProgressApi | null>(null);

export function ProgressProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<ProgressState>(EMPTY);
  const [ready, setReady] = useState(false);

  // Read after mount: server and first client render must agree, so the
  // initial state is always empty and real progress arrives one tick later.
  useEffect(() => {
    setState(readState());
    setReady(true);
  }, []);

  const update = useCallback((mutate: (draft: ProgressState) => ProgressState) => {
    setState((current) => {
      const next = mutate(current);
      writeState(next);
      return next;
    });
  }, []);

  /**
   * Actions are memoised separately from `state`, and deliberately do not
   * depend on it.
   *
   * Every mutator below uses the functional updater form, so none of them needs
   * to read `state` directly — which means their identities can stay stable for
   * the lifetime of the provider. That matters: consumers list these in effect
   * dependency arrays, and if a mutator's identity changed on every state
   * change, any effect that both depends on it and calls it would re-trigger
   * itself forever.
   */
  const actions = useMemo(
    () => ({
      completeStep(moduleSlug: string, stepId: string) {
        update((current) => {
          const trainingModule = current.modules[moduleSlug] ?? { completedSteps: [], checks: {} };
          if (trainingModule.completedSteps.includes(stepId)) return current;
          return {
            ...current,
            modules: {
              ...current.modules,
              [moduleSlug]: {
                ...trainingModule,
                completedSteps: [...trainingModule.completedSteps, stepId],
              },
            },
          };
        });
      },

      uncompleteStep(moduleSlug: string, stepId: string) {
        update((current) => {
          const trainingModule = current.modules[moduleSlug];
          if (!trainingModule) return current;
          const { completedAt: _drop, ...rest } = trainingModule;
          return {
            ...current,
            modules: {
              ...current.modules,
              [moduleSlug]: {
                ...rest,
                completedSteps: trainingModule.completedSteps.filter((id) => id !== stepId),
              },
            },
          };
        });
      },

      recordCheck(moduleSlug: string, checkId: string, correct: boolean) {
        update((current) => {
          const trainingModule = current.modules[moduleSlug] ?? { completedSteps: [], checks: {} };
          return {
            ...current,
            modules: {
              ...current.modules,
              [moduleSlug]: {
                ...trainingModule,
                checks: {
                  ...trainingModule.checks,
                  [checkId]: { correct, at: new Date().toISOString() },
                },
              },
            },
          };
        });
      },

      markModuleComplete(moduleSlug: string, totalSteps: number) {
        update((current) => {
          const trainingModule = current.modules[moduleSlug] ?? { completedSteps: [], checks: {} };
          if (trainingModule.completedSteps.length < totalSteps) return current;
          if (trainingModule.completedAt) return current;
          return {
            ...current,
            modules: {
              ...current.modules,
              [moduleSlug]: { ...trainingModule, completedAt: new Date().toISOString() },
            },
          };
        });
      },

      recordScenario(slug: string, correct: number, total: number) {
        update((current) => ({
          ...current,
          scenarios: {
            ...current.scenarios,
            [slug]: { completedAt: new Date().toISOString(), correct, total },
          },
        }));
      },

      noteVisit(moduleSlug: string, stepId: string) {
        update((current) => {
          // Bail out when nothing actually moved. Without this the call writes
          // a fresh timestamp every time, producing a new state object on every
          // render — which is a re-render loop waiting to happen.
          const last = current.lastVisited;
          if (last?.moduleSlug === moduleSlug && last?.stepId === stepId) {
            return current;
          }
          return {
            ...current,
            lastVisited: { moduleSlug, stepId, at: new Date().toISOString() },
          };
        });
      },

      reset() {
        update(() => EMPTY);
      },
    }),
    [update],
  );

  const api = useMemo<ProgressApi>(
    () => ({ state, ready, ...actions }),
    [state, ready, actions],
  );

  return <ProgressContext.Provider value={api}>{children}</ProgressContext.Provider>;
}

export function useProgress(): ProgressApi {
  const context = useContext(ProgressContext);
  if (!context) {
    throw new Error("useProgress must be used inside <ProgressProvider>");
  }
  return context;
}

/* -------------------------------------------------------------------------- */
/* Derived values                                                             */
/* -------------------------------------------------------------------------- */

export interface ModuleSummary {
  slug: string;
  completedSteps: number;
  totalSteps: number;
  percent: number;
  complete: boolean;
  /** First step not yet completed — where "Continue" should land. */
  nextStepIndex: number;
}

export function summariseModule(
  state: ProgressState,
  slug: string,
  stepIds: string[],
): ModuleSummary {
  const trainingModule = state.modules[slug];
  const completed = trainingModule?.completedSteps ?? [];
  const completedSteps = stepIds.filter((id) => completed.includes(id)).length;
  const nextStepIndex = stepIds.findIndex((id) => !completed.includes(id));

  return {
    slug,
    completedSteps,
    totalSteps: stepIds.length,
    percent: stepIds.length ? Math.round((completedSteps / stepIds.length) * 100) : 0,
    complete: completedSteps === stepIds.length && stepIds.length > 0,
    nextStepIndex: nextStepIndex === -1 ? 0 : nextStepIndex,
  };
}

export function overallCompletion(
  state: ProgressState,
  modules: { slug: string; stepIds: string[] }[],
): { completedModules: number; totalModules: number; percent: number } {
  const totalSteps = modules.reduce((sum, m) => sum + m.stepIds.length, 0);
  const doneSteps = modules.reduce(
    (sum, m) => sum + summariseModule(state, m.slug, m.stepIds).completedSteps,
    0,
  );
  const completedModules = modules.filter(
    (m) => summariseModule(state, m.slug, m.stepIds).complete,
  ).length;

  return {
    completedModules,
    totalModules: modules.length,
    percent: totalSteps ? Math.round((doneSteps / totalSteps) * 100) : 0,
  };
}
