import "server-only";
import { env } from "@/lib/config/env";
import { AuthError, type HelpDeskUser } from "./types";

/**
 * ---------------------------------------------------------------------------
 * Role resolution
 * ---------------------------------------------------------------------------
 * Deciding whether a verified identity is Help Desk staff, Help Desk
 * leadership, or nobody we recognise.
 *
 * This is the one place where "who signed in" becomes "what they may do", and
 * it has to work across providers that expose very different claims:
 *
 *   Microsoft Entra ID  — can emit a `groups` claim. This is the right answer
 *                         for the Adelphi deployment: access follows directory
 *                         group membership, so it is managed by IT rather than
 *                         by a list in this repository.
 *
 *   Google Workspace    — does NOT emit group membership in the ID token. It
 *                         emits `hd` (hosted domain) for Workspace accounts.
 *                         So domain + explicit allowlists are the mechanism.
 *
 * Resolution order, first match wins:
 *   1. Admin group        (Entra)
 *   2. Admin email allowlist
 *   3. Staff group        (Entra)
 *   4. Staff email allowlist
 *   5. Allowed domain     → staff
 *   6. Refuse
 *
 * Refusing rather than defaulting to the lower privilege is deliberate. An
 * account nobody has authorised should not get a Help Desk session at all.
 */

interface Claims {
  email?: string;
  emailVerified?: boolean;
  /** Google Workspace hosted domain. Authoritative when present. */
  hostedDomain?: string;
  /** Entra tenant id. */
  tenantId?: string;
  groups: string[];
}

function normaliseList(raw: string | undefined): string[] {
  if (!raw) return [];
  return raw
    .split(",")
    .map((entry) => entry.trim().toLowerCase())
    .filter(Boolean);
}

/**
 * The domain an identity actually belongs to.
 *
 * `hd` is used in preference to the email domain because it is asserted by the
 * provider about the account, whereas an email local part can be anything. If
 * the email is not verified it is not used at all — an unverified address is
 * not evidence of anything.
 */
function domainOf(claims: Claims): string | null {
  if (claims.hostedDomain) return claims.hostedDomain.toLowerCase();
  if (!claims.email || claims.emailVerified === false) return null;
  const at = claims.email.lastIndexOf("@");
  return at === -1 ? null : claims.email.slice(at + 1).toLowerCase();
}

export function resolveRole(claims: Claims): HelpDeskUser["role"] {
  const {
    AUTH_ADMIN_GROUP,
    AUTH_STAFF_GROUP,
    AUTH_ADMIN_EMAILS,
    AUTH_STAFF_EMAILS,
    AUTH_ALLOWED_DOMAINS,
    AUTH_ALLOWED_TENANTS,
  } = env();

  const email = claims.email?.toLowerCase();
  const verified = claims.emailVerified !== false;
  const groups = claims.groups.map((group) => group.toLowerCase());

  const adminEmails = normaliseList(AUTH_ADMIN_EMAILS);
  const staffEmails = normaliseList(AUTH_STAFF_EMAILS);
  const domains = normaliseList(AUTH_ALLOWED_DOMAINS);
  const tenants = normaliseList(AUTH_ALLOWED_TENANTS);

  // A tenant restriction, when configured, is a hard gate applied before any
  // role is considered — it answers "is this even our directory?".
  if (tenants.length > 0) {
    const tenant = claims.tenantId?.toLowerCase();
    if (!tenant || !tenants.includes(tenant)) {
      throw new AuthError(
        "That account belongs to a directory that is not authorised for learnIT.",
        "not_authorized",
      );
    }
  }

  if (AUTH_ADMIN_GROUP && groups.includes(AUTH_ADMIN_GROUP.toLowerCase())) {
    return "admin";
  }
  if (email && verified && adminEmails.includes(email)) {
    return "admin";
  }
  if (AUTH_STAFF_GROUP && groups.includes(AUTH_STAFF_GROUP.toLowerCase())) {
    return "staff";
  }
  if (email && verified && staffEmails.includes(email)) {
    return "staff";
  }

  const domain = domainOf(claims);
  if (domain && domains.includes(domain)) {
    return "staff";
  }

  throw new AuthError(
    "That account is not authorised for learnIT. Access is granted to Help Desk staff — contact Help Desk leadership if you believe this is wrong.",
    "not_authorized",
  );
}

/**
 * Extract the claims role resolution needs from a verified ID token payload.
 * Providers name things differently; this is where that is absorbed.
 */
export function claimsFrom(payload: Record<string, unknown>): Claims {
  const groupsClaim = payload[env().AUTH_GROUPS_CLAIM];
  const groups = Array.isArray(groupsClaim)
    ? groupsClaim.filter((group): group is string => typeof group === "string")
    : typeof groupsClaim === "string"
      ? [groupsClaim]
      : [];

  return {
    ...(typeof payload.email === "string" ? { email: payload.email } : {}),
    ...(typeof payload.email_verified === "boolean"
      ? { emailVerified: payload.email_verified }
      : {}),
    ...(typeof payload.hd === "string" ? { hostedDomain: payload.hd } : {}),
    ...(typeof payload.tid === "string" ? { tenantId: payload.tid } : {}),
    groups,
  };
}

/** Display name, in order of preference across providers. */
export function displayNameFrom(payload: Record<string, unknown>): string {
  for (const key of ["name", "preferred_username", "given_name", "email"]) {
    const value = payload[key];
    if (typeof value === "string" && value.trim()) return value.trim();
  }
  return "Help Desk user";
}
