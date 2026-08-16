import type { TrainingModule } from "@/lib/content/schema";
import { foundationModules } from "./foundations";
import { operationsModules } from "./operations";
import { systemModules } from "./systems";
import { workflowModules } from "./workflows";

/**
 * The onboarding track, in order.
 *
 * `order` is the field that matters — it is the sequence a new technician works
 * through, and it deliberately interleaves the four source files rather than
 * grouping by them. Foundations first, then the operational mechanics of the
 * job (identity, tickets, email), then systems, then the named workflows.
 */
export const modules: TrainingModule[] = [
  ...foundationModules,
  ...operationsModules,
  ...systemModules,
  ...workflowModules,
].sort((a, b) => a.order - b.order);
