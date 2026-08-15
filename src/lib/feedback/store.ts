import "server-only";
import { randomUUID } from "node:crypto";
import type { ContentReport } from "@/lib/content/schema";

/**
 * Content reports — the "this looks out of date" queue.
 *
 * The single most valuable signal in a documentation platform is a technician
 * saying "this is wrong" at the moment they discover it. Making that one click
 * from the article is the whole feature.
 *
 * The shipped adapter is in-memory. That is honest about what the file-backed
 * content adapter can offer: reports survive until the server restarts, which
 * is fine for the demo and for local development, and is not fine for the
 * internal deployment. `ReportStore` is the seam — a Postgres implementation of
 * these four methods is the entire migration. See docs/architecture.md.
 */

export interface ReportStore {
  create(input: Omit<ContentReport, "id" | "reportedAt" | "status">): Promise<ContentReport>;
  list(filter?: { status?: ContentReport["status"] }): Promise<ContentReport[]>;
  updateStatus(id: string, status: ContentReport["status"]): Promise<ContentReport | null>;
  /** True when reports outlive the process. Surfaced in the admin console. */
  readonly durable: boolean;
}

/**
 * Module-scoped map. In development Next.js re-evaluates modules on change, so
 * this is pinned to globalThis to avoid the queue appearing to empty itself
 * every time a file is saved.
 */
const globalForReports = globalThis as unknown as {
  __learnitReports?: Map<string, ContentReport>;
};

const reports = (globalForReports.__learnitReports ??= new Map<string, ContentReport>());

export const memoryReportStore: ReportStore = {
  durable: false,

  async create(input) {
    const report: ContentReport = {
      ...input,
      id: randomUUID(),
      reportedAt: new Date().toISOString(),
      status: "open",
    };
    reports.set(report.id, report);
    return report;
  },

  async list(filter) {
    const all = [...reports.values()].sort((a, b) =>
      b.reportedAt.localeCompare(a.reportedAt),
    );
    return filter?.status ? all.filter((r) => r.status === filter.status) : all;
  },

  async updateStatus(id, status) {
    const existing = reports.get(id);
    if (!existing) return null;
    const updated = { ...existing, status };
    reports.set(id, updated);
    return updated;
  },
};

export function getReportStore(): ReportStore {
  return memoryReportStore;
}
