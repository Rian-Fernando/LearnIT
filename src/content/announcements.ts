import type { Announcement } from "@/lib/content/schema";

/**
 * Dashboard notices published by Help Desk leadership.
 *
 * Every announcement carries `expiresAt` so the dashboard does not silt up with
 * last semester's outages. Expiry is applied in the repository, not the UI.
 */
export const announcements: Announcement[] = [
  {
    id: "fall-move-in-coverage",
    title: "Extended coverage during move-in week",
    body: "Expect high call volume for wireless enrollment and account activation. Keep first-contact notes short and specific — a good ticket beats a long call. Escalate residence-hall wiring issues rather than troubleshooting them on the phone.",
    tone: "info",
    visibility: "public",
    publishedAt: "2026-08-12",
    expiresAt: "2026-09-05",
    author: "Help Desk Leadership",
  },
  {
    id: "konica-scope-reminder",
    title: "Reminder: Konica devices are out of scope",
    body: "Konica multifunction devices are serviced by the contracted vendor, not the Help Desk. Use the Konica Redirect quick response and log the ticket so we can track volume — do not attempt driver or hardware troubleshooting on these units.",
    tone: "warning",
    visibility: "public",
    publishedAt: "2026-08-05",
    expiresAt: "2026-12-31",
    author: "Help Desk Leadership",
  },
  {
    id: "onboarding-track-refresh",
    title: "Onboarding track updated for the fall cohort",
    body: "The Remote Support and Communication modules were revised this month. If you completed them before August, the changed steps are marked as updated in your progress view.",
    tone: "info",
    visibility: "public",
    publishedAt: "2026-08-08",
    expiresAt: "2026-10-01",
    author: "Help Desk Leadership",
  },
];
