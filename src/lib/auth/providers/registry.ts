import "server-only";
import { env } from "@/lib/config/env";
import type { IdentityProvider, ProviderId } from "../types";
import { mockProvider } from "./mock";
import { createOidcProvider } from "./oidc";

/**
 * Enabled identity providers.
 *
 * `AUTH_PROVIDERS` is a comma-separated list, so more than one can be offered
 * at once. That is what makes the Google-now / Microsoft-later path smooth:
 * add `microsoft` alongside `google`, both appear on the sign-in screen, and
 * when Adelphi's tenant is the only one that should work, drop `google` and
 * set `AUTH_ALLOWED_TENANTS`.
 *
 * Provider ids are recorded in the session, so a session issued by a provider
 * that has since been disabled stops being honoured.
 */

function google(): IdentityProvider {
  return createOidcProvider({
    id: "google",
    displayName: "Google",
    issuer: "https://accounts.google.com",
    clientId: env().GOOGLE_CLIENT_ID!,
    clientSecret: env().GOOGLE_CLIENT_SECRET!,
    scopes: "openid email profile",
    authorizationParams: {
      // Always show the account chooser. On a shared Help Desk workstation,
      // silently reusing whichever Google account happens to be signed in is a
      // genuine hazard.
      prompt: "select_account",
      // Hints the Workspace domain on the Google sign-in screen. It is a hint
      // only — the real restriction is AUTH_ALLOWED_DOMAINS, enforced against
      // the verified `hd` claim after the token is validated.
      ...(env().AUTH_ALLOWED_DOMAINS
        ? { hd: env().AUTH_ALLOWED_DOMAINS!.split(",")[0]!.trim() }
        : {}),
    },
  });
}

function microsoft(): IdentityProvider {
  const tenant = env().MICROSOFT_TENANT_ID || "common";
  return createOidcProvider({
    id: "microsoft",
    displayName: "Microsoft",
    issuer: `https://login.microsoftonline.com/${tenant}/v2.0`,
    clientId: env().MICROSOFT_CLIENT_ID!,
    clientSecret: env().MICROSOFT_CLIENT_SECRET!,
    scopes: "openid email profile",
    authorizationParams: { prompt: "select_account" },
  });
}

function custom(): IdentityProvider {
  return createOidcProvider({
    id: "oidc",
    displayName: env().OIDC_DISPLAY_NAME,
    issuer: env().OIDC_ISSUER!,
    clientId: env().OIDC_CLIENT_ID!,
    clientSecret: env().OIDC_CLIENT_SECRET!,
    scopes: env().OIDC_SCOPES,
  });
}

const FACTORIES: Record<ProviderId, () => IdentityProvider> = {
  mock: () => mockProvider,
  google,
  microsoft,
  oidc: custom,
};

let cached: IdentityProvider[] | null = null;

/** Every provider this deployment offers, in configured order. */
export function enabledProviders(): IdentityProvider[] {
  cached ??= env().AUTH_PROVIDERS.map((id) => FACTORIES[id]());
  return cached;
}

/** Look up a provider by id, or null if it is not enabled here. */
export function providerById(id: string): IdentityProvider | null {
  return enabledProviders().find((provider) => provider.id === id) ?? null;
}

/** True when a session issued by this provider should still be honoured. */
export function providerIsEnabled(id: string): boolean {
  return providerById(id) !== null;
}
