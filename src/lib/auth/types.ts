import type { Role } from "@/lib/content/schema";

/**
 * ---------------------------------------------------------------------------
 * Identity contracts
 * ---------------------------------------------------------------------------
 * learnIT deliberately does not depend on a specific identity provider. The
 * application only ever sees a `HelpDeskUser`; how that user is proven is the
 * job of an `IdentityProvider` implementation.
 *
 * Shipped implementations:
 *   mock       — seeded personas for local development and the public demo.
 *   google     — Google / Google Workspace, via OIDC.
 *   microsoft  — Microsoft Entra ID (Office 365), via OIDC.
 *   oidc       — any other conformant provider, configured generically.
 *
 * More than one can be enabled at once (`AUTH_PROVIDERS="google,microsoft"`),
 * which is what makes migrating between them a configuration change rather
 * than a cutover. See docs/authentication.md.
 */

/** Identifier for an identity provider. Recorded in the session. */
export type ProviderId = "mock" | "google" | "microsoft" | "oidc";

export interface HelpDeskUser {
  /** Stable subject identifier from the identity provider. Opaque to the app. */
  id: string;
  /** Display name, e.g. "Jordan Reyes". */
  name: string;
  /** Role within learnIT, derived from IdP group membership. */
  role: Exclude<Role, "guest">;
  /** Job title shown in the account menu, e.g. "Help Desk Technician". */
  title?: string;
  /**
   * ISO date the employee joined the Help Desk. Used only to tailor onboarding
   * copy ("Week 1 of your onboarding"). Optional and non-authoritative.
   */
  startedAt?: string;
}

export interface Session {
  user: HelpDeskUser;
  /** Which provider issued this session. A session from a provider that has
   *  since been disabled is no longer honoured. */
  provider: ProviderId;
  /** Unix seconds. */
  issuedAt: number;
  expiresAt: number;
}

/**
 * The request-scoped answer to "who is asking?". Every content read takes a
 * Viewer, which is how visibility filtering becomes impossible to forget.
 */
export type Viewer =
  | { role: "guest"; user: null; isAuthenticated: false }
  | {
      role: Exclude<Role, "guest">;
      user: HelpDeskUser;
      isAuthenticated: true;
    };

export const GUEST_VIEWER: Viewer = {
  role: "guest",
  user: null,
  isAuthenticated: false,
};

export interface SignInStart {
  /** Where the browser should be sent to begin authentication. */
  redirectTo: string;
  /**
   * Opaque values the provider needs echoed back on the callback (OIDC state /
   * PKCE verifier / nonce). Stored in short-lived, httpOnly cookies.
   */
  transaction?: Record<string, string>;
}

export interface IdentityProvider {
  readonly id: ProviderId;
  /** Human-readable name for the sign-in screen. */
  readonly displayName: string;

  /** Produce the redirect that starts authentication. */
  beginSignIn(input: { returnTo: string }): Promise<SignInStart>;

  /** Exchange callback parameters for a verified user. Throws on failure. */
  completeSignIn(input: {
    params: URLSearchParams;
    transaction: Record<string, string>;
  }): Promise<HelpDeskUser>;

  /**
   * Optional provider-side single logout URL. Returning `null` means learnIT
   * simply clears its own session cookie.
   */
  signOutUrl(input: { returnTo: string }): string | null;
}

export class AuthError extends Error {
  constructor(
    message: string,
    readonly code:
      | "invalid_state"
      | "invalid_credentials"
      | "not_authorized"
      | "provider_error"
      | "expired" = "provider_error",
  ) {
    super(message);
    this.name = "AuthError";
  }
}
