import type { TrainingModule } from "@/lib/content/schema";
import { foundationModules } from "./foundations";
import { systemModules } from "./systems";

export const modules: TrainingModule[] = [...foundationModules, ...systemModules];
