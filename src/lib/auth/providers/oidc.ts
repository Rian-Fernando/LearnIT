import "server-only";
import { createRemoteJWKSet, jwtVerify, type JWTVerifyGetKey } from "jose";
import { env } from "@/lib/config/env";
import { claimsFrom, displayNameFrom, resolveRole } from "../roles";
import { AuthError, type IdentityProvider, type ProviderId } from "../types";

/**
 * Generic OpenID Connect provider — Authorization Code flow with PKCE.
 *
 * One implementation serves Google, Microsoft Entra ID, and any other
 * conformant provider Adelphi IT designates; only the configuration differs.
 * See `registry.ts` for the per-provider configuration and
 * docs/authentication.md for the registration checklist.
 */

export interface OidcConfig {
  id: ProviderId;
  displayName: string;
  /** Issuer URL. Discovery is `${issuer}/.well-known/openid-configuration`. */
  issuer: string;
  clientId: string;
  clientSecret: string;
  scopes: string;
  /** Extra authorization parameters, e.g. Google's `hd` domain hint. */
  authorizationParams?: Record<string, string>;
}

interface DiscoveryDocument {
  authorization_endpoint: string;
  token_endpoint: string;
  jwks_uri: string;
  issuer: string;
  end_session_endpoint?: string;
}

const DISCOVERY_TTL_MS = 60 * 60 * 1000;
const discoveryCache = new Map<string, { at: number; doc: DiscoveryDocument }>();
const jwksCache = new Map<string, JWTVerifyGetKey>();

async function discover(issuer: string): Promise<DiscoveryDocument> {
  const cached = discoveryCache.get(issuer);
  if (cached && Date.now() - cached.at < DISCOVERY_TTL_MS) return cached.doc;

  const base = issuer.replace(/\/$/, "");
  const response = await fetch(`${base}/.well-known/openid-configuration`, {
    cache: "no-store",
  });
  if (!response.ok) {
    throw new AuthError(
      `Identity provider discovery failed (${response.status}).`,
      "provider_error",
    );
  }

  const doc = (await response.json()) as DiscoveryDocument;
  discoveryCache.set(issuer, { at: Date.now(), doc });
  return doc;
}

async function keySet(issuer: string): Promise<JWTVerifyGetKey> {
  const cached = jwksCache.get(issuer);
  if (cached) return cached;
  const doc = await discover(issuer);
  const set = createRemoteJWKSet(new URL(doc.jwks_uri));
  jwksCache.set(issuer, set);
  return set;
}

/* -------------------------------------------------------------------------- */
/* PKCE                                                                       */
/* -------------------------------------------------------------------------- */

function base64Url(bytes: Uint8Array): string {
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function randomUrlSafe(bytes = 32): string {
  const buffer = new Uint8Array(bytes);
  crypto.getRandomValues(buffer);
  return base64Url(buffer);
}

async function challengeFor(verifier: string): Promise<string> {
  const digest = await crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(verifier),
  );
  return base64Url(new Uint8Array(digest));
}

function redirectUri(providerId: string): string {
  const url = new URL("/api/auth/callback", env().NEXT_PUBLIC_SITE_URL);
  url.searchParams.set("provider", providerId);
  return url.toString();
}

/* -------------------------------------------------------------------------- */
/* Issuer validation                                                          */
/* -------------------------------------------------------------------------- */

/**
 * Microsoft's multi-tenant (`common`) discovery document reports its issuer as
 * a template containing `{tenantid}`, while the ID token carries the concrete
 * tenant. Passing the template straight to `jwtVerify` would always fail, so
 * templates are matched by pattern instead — still an exact-shape check, just
 * one that permits the tenant segment to vary.
 */
function issuerMatches(expected: string, actual: unknown): boolean {
  if (typeof actual !== "string") return false;
  if (!expected.includes("{tenantid}")) return expected === actual;

  const pattern = new RegExp(
    `^${expected
      .split("{tenantid}")
      .map((part) => part.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"))
      .join("[0-9a-fA-F-]{36}")}$`,
  );
  return pattern.test(actual);
}

/* -------------------------------------------------------------------------- */
/* Provider                                                                   */
/* -------------------------------------------------------------------------- */

export function createOidcProvider(config: OidcConfig): IdentityProvider {
  return {
    id: config.id,
    displayName: config.displayName,

    async beginSignIn({ returnTo }) {
      const doc = await discover(config.issuer);
      const state = randomUrlSafe();
      const nonce = randomUrlSafe();
      const verifier = randomUrlSafe(48);

      const url = new URL(doc.authorization_endpoint);
      url.searchParams.set("response_type", "code");
      url.searchParams.set("client_id", config.clientId);
      url.searchParams.set("redirect_uri", redirectUri(config.id));
      url.searchParams.set("scope", config.scopes);
      url.searchParams.set("state", state);
      url.searchParams.set("nonce", nonce);
      url.searchParams.set("code_challenge", await challengeFor(verifier));
      url.searchParams.set("code_challenge_method", "S256");

      for (const [key, value] of Object.entries(config.authorizationParams ?? {})) {
        url.searchParams.set(key, value);
      }

      return {
        redirectTo: url.toString(),
        transaction: { state, nonce, verifier, returnTo, provider: config.id },
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

      // The CSRF defence for the authorization response. Mandatory.
      if (!state || !transaction.state || state !== transaction.state) {
        throw new AuthError("Sign-in state did not match.", "invalid_state");
      }

      const doc = await discover(config.issuer);
      const tokenResponse = await fetch(doc.token_endpoint, {
        method: "POST",
        headers: { "content-type": "application/x-www-form-urlencoded" },
        cache: "no-store",
        body: new URLSearchParams({
          grant_type: "authorization_code",
          code,
          redirect_uri: redirectUri(config.id),
          client_id: config.clientId,
          client_secret: config.clientSecret,
          code_verifier: transaction.verifier ?? "",
        }),
      });

      if (!tokenResponse.ok) {
        // Never surface the provider's raw response — some implementations
        // echo the client secret back in an error body.
        throw new AuthError("Token exchange with the identity provider failed.");
      }

      const tokens = (await tokenResponse.json()) as { id_token?: string };
      if (!tokens.id_token) {
        throw new AuthError("Identity provider did not return an ID token.");
      }

      const { payload } = await jwtVerify(tokens.id_token, await keySet(config.issuer), {
        audience: config.clientId,
        // Issuer is validated below so the Microsoft `common` template works.
      });

      if (!issuerMatches(doc.issuer, payload.iss)) {
        throw new AuthError("ID token issuer did not match.", "invalid_state");
      }

      if (payload.nonce !== transaction.nonce) {
        throw new AuthError("Sign-in nonce did not match.", "invalid_state");
      }

      const claims = payload as Record<string, unknown>;

      return {
        id: String(payload.sub),
        name: displayNameFrom(claims),
        role: resolveRole(claimsFrom(claims)),
      };
    },

    signOutUrl({ returnTo }) {
      const endpoint = discoveryCache.get(config.issuer)?.doc.end_session_endpoint;
      if (!endpoint) return null;
      const url = new URL(endpoint);
      url.searchParams.set(
        "post_logout_redirect_uri",
        new URL(returnTo, env().NEXT_PUBLIC_SITE_URL).toString(),
      );
      return url.toString();
    },
  };
}
