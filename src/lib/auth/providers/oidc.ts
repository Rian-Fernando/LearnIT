import "server-only";
import { createRemoteJWKSet, jwtVerify } from "jose";
import { env } from "@/lib/config/env";
import { AuthError, type HelpDeskUser, type IdentityProvider } from "../types";

/**
 * OpenID Connect identity provider — Authorization Code flow with PKCE.
 *
 * This is the production path for Adelphi. It is written against the OIDC
 * standard rather than any one vendor, so it works with Entra ID, Okta,
 * Shibboleth's OIDC bridge, or anything else Adelphi IT designates. Nothing
 * here needs Adelphi-specific code — only the values in `.env.local`:
 *
 *   OIDC_ISSUER, OIDC_CLIENT_ID, OIDC_CLIENT_SECRET,
 *   OIDC_GROUPS_CLAIM, OIDC_ADMIN_GROUP, OIDC_STAFF_GROUP
 *
 * See docs/authentication.md for the registration checklist to hand to
 * Adelphi IT (redirect URI, scopes, claims required).
 */

interface DiscoveryDocument {
  authorization_endpoint: string;
  token_endpoint: string;
  jwks_uri: string;
  issuer: string;
  end_session_endpoint?: string;
}

let discoveryCache: { at: number; doc: DiscoveryDocument } | null = null;
const DISCOVERY_TTL_MS = 60 * 60 * 1000;

async function discover(): Promise<DiscoveryDocument> {
  if (discoveryCache && Date.now() - discoveryCache.at < DISCOVERY_TTL_MS) {
    return discoveryCache.doc;
  }
  const issuer = env().OIDC_ISSUER!.replace(/\/$/, "");
  const res = await fetch(`${issuer}/.well-known/openid-configuration`, {
    cache: "no-store",
  });
  if (!res.ok) {
    throw new AuthError(
      `Identity provider discovery failed (${res.status}).`,
      "provider_error",
    );
  }
  const doc = (await res.json()) as DiscoveryDocument;
  discoveryCache = { at: Date.now(), doc };
  return doc;
}

let jwks: ReturnType<typeof createRemoteJWKSet> | null = null;
async function keySet() {
  if (!jwks) {
    const doc = await discover();
    jwks = createRemoteJWKSet(new URL(doc.jwks_uri));
  }
  return jwks;
}

/* -------------------------------------------------------------------------- */
/* PKCE helpers                                                               */
/* -------------------------------------------------------------------------- */

function randomUrlSafe(bytes = 32): string {
  const buf = new Uint8Array(bytes);
  crypto.getRandomValues(buf);
  return base64Url(buf);
}

function base64Url(bytes: Uint8Array): string {
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

async function challengeFor(verifier: string): Promise<string> {
  const digest = await crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(verifier),
  );
  return base64Url(new Uint8Array(digest));
}

function redirectUri(): string {
  return new URL("/api/auth/callback", env().NEXT_PUBLIC_SITE_URL).toString();
}

/* -------------------------------------------------------------------------- */
/* Claim → role mapping                                                       */
/* -------------------------------------------------------------------------- */

/**
 * Role is derived from IdP group membership and is never self-asserted by the
 * client. If neither group matches, sign-in is refused rather than silently
 * granting the lower privilege — an unrecognised account should not get a
 * Help Desk session at all.
 */
function deriveRole(claims: Record<string, unknown>): HelpDeskUser["role"] {
  const { OIDC_GROUPS_CLAIM, OIDC_ADMIN_GROUP, OIDC_STAFF_GROUP } = env();
  const raw = claims[OIDC_GROUPS_CLAIM];
  const groups = Array.isArray(raw)
    ? raw.filter((g): g is string => typeof g === "string")
    : typeof raw === "string"
      ? [raw]
      : [];

  if (OIDC_ADMIN_GROUP && groups.includes(OIDC_ADMIN_GROUP)) return "admin";
  if (OIDC_STAFF_GROUP && groups.includes(OIDC_STAFF_GROUP)) return "staff";

  throw new AuthError(
    "Your account is not a member of a Help Desk group authorised for learnIT.",
    "not_authorized",
  );
}

/* -------------------------------------------------------------------------- */
/* Provider                                                                   */
/* -------------------------------------------------------------------------- */

export const oidcProvider: IdentityProvider = {
  id: "oidc",
  displayName: "Adelphi single sign-on",

  async beginSignIn({ returnTo }) {
    const doc = await discover();
    const state = randomUrlSafe();
    const nonce = randomUrlSafe();
    const verifier = randomUrlSafe(48);

    const url = new URL(doc.authorization_endpoint);
    url.searchParams.set("response_type", "code");
    url.searchParams.set("client_id", env().OIDC_CLIENT_ID!);
    url.searchParams.set("redirect_uri", redirectUri());
    url.searchParams.set("scope", env().OIDC_SCOPES);
    url.searchParams.set("state", state);
    url.searchParams.set("nonce", nonce);
    url.searchParams.set("code_challenge", await challengeFor(verifier));
    url.searchParams.set("code_challenge_method", "S256");

    return {
      redirectTo: url.toString(),
      transaction: { state, nonce, verifier, returnTo },
    };
  },

  async completeSignIn({ params, transaction }) {
    const error = params.get("error");
    if (error) {
      throw new AuthError(
        params.get("error_description") ?? `Identity provider returned: ${error}`,
        "provider_error",
      );
    }

    const code = params.get("code");
    const state = params.get("state");
    if (!code) throw new AuthError("Missing authorization code.", "provider_error");

    // Constant-ish comparison is unnecessary here (state is single-use and
    // high-entropy), but the check itself is mandatory: it is the CSRF defence
    // for the authorization response.
    if (!state || !transaction.state || state !== transaction.state) {
      throw new AuthError("Sign-in state did not match.", "invalid_state");
    }

    const doc = await discover();
    const body = new URLSearchParams({
      grant_type: "authorization_code",
      code,
      redirect_uri: redirectUri(),
      client_id: env().OIDC_CLIENT_ID!,
      client_secret: env().OIDC_CLIENT_SECRET!,
      code_verifier: transaction.verifier ?? "",
    });

    const tokenRes = await fetch(doc.token_endpoint, {
      method: "POST",
      headers: { "content-type": "application/x-www-form-urlencoded" },
      body,
      cache: "no-store",
    });

    if (!tokenRes.ok) {
      // Never surface the provider's raw response — it can contain the client
      // secret echoed back in some implementations.
      throw new AuthError("Token exchange with the identity provider failed.");
    }

    const tokens = (await tokenRes.json()) as { id_token?: string };
    if (!tokens.id_token) {
      throw new AuthError("Identity provider did not return an ID token.");
    }

    const { payload } = await jwtVerify(tokens.id_token, await keySet(), {
      issuer: doc.issuer,
      audience: env().OIDC_CLIENT_ID!,
    });

    if (payload.nonce !== transaction.nonce) {
      throw new AuthError("Sign-in nonce did not match.", "invalid_state");
    }

    const claims = payload as Record<string, unknown>;
    const name =
      (typeof claims.name === "string" && claims.name) ||
      (typeof claims.preferred_username === "string" && claims.preferred_username) ||
      "Help Desk user";

    return {
      id: String(payload.sub),
      name,
      role: deriveRole(claims),
    };
  },

  signOutUrl({ returnTo }) {
    const endpoint = discoveryCache?.doc.end_session_endpoint;
    if (!endpoint) return null;
    const url = new URL(endpoint);
    url.searchParams.set(
      "post_logout_redirect_uri",
      new URL(returnTo, env().NEXT_PUBLIC_SITE_URL).toString(),
    );
    return url.toString();
  },
};
