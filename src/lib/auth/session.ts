import "server-only";
import { cookies } from "next/headers";
import { SignJWT, jwtVerify } from "jose";
import { z } from "zod";
import { env, sessionSecret } from "@/lib/config/env";
import { GUEST_VIEWER, type HelpDeskUser, type Session, type Viewer } from "./types";

/**
 * Session transport.
 *
 * The session is a signed (HS256) JWT in an httpOnly, SameSite=Lax cookie. It
 * is deliberately *not* readable from JavaScript, so an XSS bug cannot lift a
 * Help Desk session. The token carries only display data and a role — never a
 * credential, an IdP access token, or anything resembling PII beyond a name.
 *
 * If Adelphi IT later requires server-side session storage (immediate
 * revocation, device listing), replace the two functions marked SWAP POINT
 * with a store lookup; nothing else in the codebase needs to change.
 */

const COOKIE_NAME = "learnit_session";
const TRANSACTION_COOKIE = "learnit_auth_tx";

const ClaimsSchema = z.object({
  sub: z.string().min(1),
  name: z.string().min(1),
  role: z.enum(["staff", "admin"]),
  title: z.string().optional(),
  startedAt: z.string().optional(),
  provider: z.enum(["mock", "oidc"]),
  iat: z.number(),
  exp: z.number(),
});

function secret(): Uint8Array {
  return new TextEncoder().encode(sessionSecret());
}

function cookieOptions(maxAge: number) {
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: env().NODE_ENV === "production",
    path: "/",
    maxAge,
  };
}

/* -------------------------------------------------------------------------- */
/* Session lifecycle                                                          */
/* -------------------------------------------------------------------------- */

/** SWAP POINT — issue a session. */
export async function createSession(
  user: HelpDeskUser,
  provider: Session["provider"],
): Promise<void> {
  const maxAge = env().SESSION_MAX_AGE;
  const now = Math.floor(Date.now() / 1000);

  const token = await new SignJWT({
    name: user.name,
    role: user.role,
    ...(user.title ? { title: user.title } : {}),
    ...(user.startedAt ? { startedAt: user.startedAt } : {}),
    provider,
  })
    .setProtectedHeader({ alg: "HS256", typ: "JWT" })
    .setSubject(user.id)
    .setIssuedAt(now)
    .setExpirationTime(now + maxAge)
    .setIssuer("learnit")
    .setAudience("learnit-app")
    .sign(secret());

  const store = await cookies();
  store.set(COOKIE_NAME, token, cookieOptions(maxAge));
}

/** SWAP POINT — resolve the current session, or null. */
export async function getSession(): Promise<Session | null> {
  const store = await cookies();
  const token = store.get(COOKIE_NAME)?.value;
  if (!token) return null;

  try {
    const { payload } = await jwtVerify(token, secret(), {
      issuer: "learnit",
      audience: "learnit-app",
      algorithms: ["HS256"],
    });

    const claims = ClaimsSchema.parse(payload);

    // A session minted by the mock provider must never be honoured by a
    // deployment that has since been switched to real SSO.
    if (claims.provider !== env().AUTH_PROVIDER) return null;

    return {
      user: {
        id: claims.sub,
        name: claims.name,
        role: claims.role,
        ...(claims.title ? { title: claims.title } : {}),
        ...(claims.startedAt ? { startedAt: claims.startedAt } : {}),
      },
      provider: claims.provider,
      issuedAt: claims.iat,
      expiresAt: claims.exp,
    };
  } catch {
    // Expired, tampered with, or signed by a rotated secret. All three mean
    // "no session" — never a 500.
    return null;
  }
}

export async function destroySession(): Promise<void> {
  const store = await cookies();
  store.set(COOKIE_NAME, "", { ...cookieOptions(0), maxAge: 0 });
}

/**
 * The request-scoped Viewer. This is the value threaded into every content
 * query; see `src/lib/content/repository.ts`.
 */
export async function getViewer(): Promise<Viewer> {
  const session = await getSession();
  if (!session) return GUEST_VIEWER;
  return { role: session.user.role, user: session.user, isAuthenticated: true };
}

/* -------------------------------------------------------------------------- */
/* Sign-in transaction (OIDC state / PKCE verifier / returnTo)                 */
/* -------------------------------------------------------------------------- */

export async function saveTransaction(data: Record<string, string>): Promise<void> {
  const store = await cookies();
  store.set(TRANSACTION_COOKIE, JSON.stringify(data), cookieOptions(600));
}

export async function readTransaction(): Promise<Record<string, string>> {
  const store = await cookies();
  const raw = store.get(TRANSACTION_COOKIE)?.value;
  if (!raw) return {};
  try {
    const parsed: unknown = JSON.parse(raw);
    return z.record(z.string()).parse(parsed);
  } catch {
    return {};
  }
}

export async function clearTransaction(): Promise<void> {
  const store = await cookies();
  store.set(TRANSACTION_COOKIE, "", { ...cookieOptions(0), maxAge: 0 });
}

/**
 * Only same-origin relative paths may be used as post-sign-in destinations.
 * Without this an attacker can turn the sign-in flow into an open redirect.
 */
export function sanitizeReturnTo(value: string | null | undefined): string {
  if (!value) return "/dashboard";
  if (!value.startsWith("/") || value.startsWith("//") || value.includes("\\")) {
    return "/dashboard";
  }
  return value;
}
