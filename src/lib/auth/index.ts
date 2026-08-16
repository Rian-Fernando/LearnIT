import "server-only";
import { redirect } from "next/navigation";
import { ROLE_RANK, type Role } from "@/lib/content/schema";
import { getViewer } from "./session";
import type { HelpDeskUser, Viewer } from "./types";

export * from "./types";
export {
  getSession,
  getViewer,
  createSession,
  destroySession,
  sanitizeReturnTo,
} from "./session";

export { enabledProviders, providerById } from "./providers/registry";

/* -------------------------------------------------------------------------- */
/* Authorization                                                              */
/* -------------------------------------------------------------------------- */

export function hasAtLeast(role: Role, required: Role): boolean {
  return ROLE_RANK[role] >= ROLE_RANK[required];
}

/**
 * Guard for server components and route handlers.
 *
 * This — not the navigation, not a hidden button — is the authorization
 * boundary. Every protected page calls it as its first statement, and the
 * middleware provides a second, coarser layer in front of it.
 */
export async function requireRole(
  required: Exclude<Role, "guest">,
  options: { returnTo?: string } = {},
): Promise<Extract<Viewer, { isAuthenticated: true }>> {
  const viewer = await getViewer();

  if (!viewer.isAuthenticated) {
    const target = options.returnTo ?? "/dashboard";
    redirect(`/signin?returnTo=${encodeURIComponent(target)}`);
  }

  if (!hasAtLeast(viewer.role, required)) {
    redirect("/dashboard?denied=1");
  }

  return viewer;
}

export const requireStaff = (options?: { returnTo?: string }) =>
  requireRole("staff", options);

export const requireAdmin = (options?: { returnTo?: string }) =>
  requireRole("admin", options);

/**
 * Non-redirecting variant for route handlers, which should answer with a status
 * code rather than an HTML redirect.
 */
export async function authorize(
  required: Exclude<Role, "guest">,
): Promise<
  | { ok: true; user: HelpDeskUser; viewer: Viewer }
  | { ok: false; status: 401 | 403 }
> {
  const viewer = await getViewer();
  if (!viewer.isAuthenticated) return { ok: false, status: 401 };
  if (!hasAtLeast(viewer.role, required)) return { ok: false, status: 403 };
  return { ok: true, user: viewer.user, viewer };
}
