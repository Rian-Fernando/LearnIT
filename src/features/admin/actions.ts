"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireAdmin } from "@/lib/auth";
import { getOverrideStore } from "@/lib/admin/overrides";
import { getReportStore } from "@/lib/feedback/store";

/**
 * Administrator mutations.
 *
 * Every action re-checks authorization on the server with `requireAdmin()`.
 * A Server Action is a public HTTP endpoint — the fact that the form is only
 * rendered inside the admin console proves nothing about who is calling it.
 *
 * Next.js applies its own origin check to Server Action invocations, which
 * covers CSRF; role enforcement is ours.
 */

export interface ActionResult {
  ok: boolean;
  message: string;
}

/* -------------------------------------------------------------------------- */
/* Important links                                                            */
/* -------------------------------------------------------------------------- */

const LinkPatchSchema = z.object({
  key: z.string().min(1).max(80),
  href: z
    .string()
    .trim()
    .max(500)
    .refine(
      (value) =>
        value === "" ||
        value === "#" ||
        /^https?:\/\//i.test(value) ||
        value.startsWith("/"),
      { message: "Enter an https:// address or a path beginning with /." },
    ),
  label: z.string().trim().min(1).max(80),
  description: z.string().trim().min(1).max(200),
});

export async function updateLink(
  _previous: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> {
  await requireAdmin();

  const parsed = LinkPatchSchema.safeParse({
    key: formData.get("key"),
    href: formData.get("href"),
    label: formData.get("label"),
    description: formData.get("description"),
  });

  if (!parsed.success) {
    return {
      ok: false,
      message: parsed.error.issues[0]?.message ?? "Those values could not be saved.",
    };
  }

  const { key, href, label, description } = parsed.data;
  await getOverrideStore().setLinkOverride(key, {
    href: href === "" ? "#" : href,
    label,
    description,
    updatedAt: new Date().toISOString().slice(0, 10),
  });

  // Links appear on the dashboard and inside articles, so invalidate broadly.
  revalidatePath("/", "layout");

  return { ok: true, message: `Saved. "${label}" is live everywhere it appears.` };
}

export async function resetLink(
  _previous: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> {
  await requireAdmin();

  const key = String(formData.get("key") ?? "");
  if (!key) return { ok: false, message: "Unknown link." };

  await getOverrideStore().clearLinkOverride(key);
  revalidatePath("/", "layout");

  return { ok: true, message: "Reverted to the authored value." };
}

/* -------------------------------------------------------------------------- */
/* Announcements                                                              */
/* -------------------------------------------------------------------------- */

const AnnouncementSchema = z.object({
  title: z.string().trim().min(1).max(160),
  body: z.string().trim().min(1).max(2000),
  tone: z.enum(["info", "warning", "critical"]),
  visibility: z.enum(["public", "staff"]),
  expiresAt: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Use a date in YYYY-MM-DD form.")
    .optional()
    .or(z.literal("")),
});

export async function publishAnnouncement(
  _previous: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> {
  const viewer = await requireAdmin();

  const parsed = AnnouncementSchema.safeParse({
    title: formData.get("title"),
    body: formData.get("body"),
    tone: formData.get("tone"),
    visibility: formData.get("visibility"),
    expiresAt: formData.get("expiresAt") ?? "",
  });

  if (!parsed.success) {
    return {
      ok: false,
      message: parsed.error.issues[0]?.message ?? "That notice could not be published.",
    };
  }

  const { title, body, tone, visibility, expiresAt } = parsed.data;
  const today = new Date().toISOString().slice(0, 10);

  if (expiresAt && expiresAt < today) {
    return { ok: false, message: "The expiry date is in the past." };
  }

  await getOverrideStore().addAnnouncement({
    id: `notice-${Date.now().toString(36)}`,
    title,
    body,
    tone,
    visibility,
    publishedAt: today,
    ...(expiresAt ? { expiresAt } : {}),
    author: viewer.user.name,
  });

  revalidatePath("/", "layout");
  return { ok: true, message: "Notice published to the dashboard." };
}

export async function removeAnnouncement(
  _previous: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> {
  await requireAdmin();

  const id = String(formData.get("id") ?? "");
  if (!id) return { ok: false, message: "Unknown notice." };

  await getOverrideStore().removeAnnouncement(id);
  revalidatePath("/", "layout");

  return { ok: true, message: "Notice removed." };
}

/* -------------------------------------------------------------------------- */
/* Review queue                                                               */
/* -------------------------------------------------------------------------- */

const StatusSchema = z.enum(["open", "reviewing", "resolved", "dismissed"]);

export async function setReportStatus(
  _previous: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> {
  await requireAdmin();

  const id = String(formData.get("id") ?? "");
  const status = StatusSchema.safeParse(formData.get("status"));

  if (!id || !status.success) {
    return { ok: false, message: "That report could not be updated." };
  }

  const updated = await getReportStore().updateStatus(id, status.data);
  if (!updated) return { ok: false, message: "That report no longer exists." };

  revalidatePath("/admin/review");
  revalidatePath("/admin");

  return { ok: true, message: `Marked as ${status.data}.` };
}
