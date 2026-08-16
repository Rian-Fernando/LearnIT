import "server-only";
import { z } from "zod";

/**
 * Validated server environment.
 *
 * Parsing happens once, lazily, at first access. A misconfigured deployment
 * fails loudly at boot instead of silently degrading — the important case being
 * a production build that still has the mock identity provider wired up.
 */

const booleanish = z
  .string()
  .optional()
  .transform((v) => v === "true" || v === "1");

const ProviderIdSchema = z.enum(["mock", "google", "microsoft", "oidc"]);

/** Comma-separated provider list, e.g. `google,microsoft`. */
const providerList = z
  .string()
  .default("mock")
  .transform((raw) =>
    raw
      .split(",")
      .map((entry) => entry.trim().toLowerCase())
      .filter(Boolean),
  )
  .pipe(z.array(ProviderIdSchema).min(1));

const EnvSchema = z
  .object({
    NODE_ENV: z.enum(["development", "test", "production"]).default("development"),

    NEXT_PUBLIC_SITE_URL: z.string().url().default("https://learnit.rianfernando.com"),

    /**
     * Optional at parse time, mandatory at use time — see `sessionSecret()`.
     *
     * A build that only produces static, unauthenticated pages (the public
     * demo) never signs a session and should not require a signing key just to
     * compile. Anything that actually touches a session fails loudly instead.
     */
    SESSION_SECRET: z
      .string()
      .min(32, {
        message:
          "SESSION_SECRET must be at least 32 characters. Generate one with `openssl rand -base64 48`.",
      })
      .optional(),
    SESSION_MAX_AGE: z.coerce.number().int().positive().default(60 * 60 * 8),

    /* ---------------------------------------------------------------- auth */

    AUTH_PROVIDERS: providerList,
    AUTH_ALLOW_MOCK_IN_PRODUCTION: booleanish,

    /** Claim carrying group membership. Entra ID uses `groups`. */
    AUTH_GROUPS_CLAIM: z.string().default("groups"),
    AUTH_ADMIN_GROUP: z.string().optional(),
    AUTH_STAFF_GROUP: z.string().optional(),

    /**
     * Allowlists, for providers that do not expose group membership.
     * Google Workspace does not put groups in the ID token, so domain and
     * email allowlists are the mechanism there.
     */
    AUTH_ADMIN_EMAILS: z.string().optional(),
    AUTH_STAFF_EMAILS: z.string().optional(),
    AUTH_ALLOWED_DOMAINS: z.string().optional(),
    /** Entra tenant ids permitted to sign in. A hard gate when set. */
    AUTH_ALLOWED_TENANTS: z.string().optional(),

    GOOGLE_CLIENT_ID: z.string().optional(),
    GOOGLE_CLIENT_SECRET: z.string().optional(),

    MICROSOFT_CLIENT_ID: z.string().optional(),
    MICROSOFT_CLIENT_SECRET: z.string().optional(),
    /** Tenant id, or `common` for multi-tenant. */
    MICROSOFT_TENANT_ID: z.string().optional(),

    OIDC_DISPLAY_NAME: z.string().default("single sign-on"),
    OIDC_ISSUER: z.string().optional(),
    OIDC_CLIENT_ID: z.string().optional(),
    OIDC_CLIENT_SECRET: z.string().optional(),
    OIDC_SCOPES: z.string().default("openid profile email"),

    /* ------------------------------------------------------------- content */

    CONTENT_ADAPTER: z.enum(["file", "postgres"]).default("file"),
    DATABASE_URL: z.string().optional(),

    NEXT_PUBLIC_DEMO_MODE: booleanish,
  })
  .superRefine((env, ctx) => {
    const isProd = env.NODE_ENV === "production";
    const usesMock = env.AUTH_PROVIDERS.includes("mock");

    // The single most important guard in the application: a production
    // deployment must not accept mock personas unless it has been explicitly
    // and knowingly opted in (the public portfolio build).
    if (isProd && usesMock && !env.AUTH_ALLOW_MOCK_IN_PRODUCTION) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["AUTH_PROVIDERS"],
        message:
          'The "mock" provider is not permitted in production. Configure a real provider (AUTH_PROVIDERS="google" or "microsoft"), or set AUTH_ALLOW_MOCK_IN_PRODUCTION="true" if this is the sanitised public demo.',
      });
    }

    // A demo deployment must never be pointed at the internal content set.
    if (env.AUTH_ALLOW_MOCK_IN_PRODUCTION && isProd && !env.NEXT_PUBLIC_DEMO_MODE) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["NEXT_PUBLIC_DEMO_MODE"],
        message:
          'AUTH_ALLOW_MOCK_IN_PRODUCTION requires NEXT_PUBLIC_DEMO_MODE="true". Mock sign-in may only ever reach sanitised demo content.',
      });
    }

    const requiredFor: Record<string, readonly (keyof typeof env)[]> = {
      google: ["GOOGLE_CLIENT_ID", "GOOGLE_CLIENT_SECRET"],
      microsoft: ["MICROSOFT_CLIENT_ID", "MICROSOFT_CLIENT_SECRET"],
      oidc: ["OIDC_ISSUER", "OIDC_CLIENT_ID", "OIDC_CLIENT_SECRET"],
    };

    for (const provider of env.AUTH_PROVIDERS) {
      for (const key of requiredFor[provider] ?? []) {
        if (!env[key]) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: [key as string],
            message: `${String(key)} is required when "${provider}" is in AUTH_PROVIDERS.`,
          });
        }
      }
    }

    // A real provider with no way to authorise anyone would let every account
    // that can sign in be refused — which looks like a broken deployment.
    const hasRealProvider = env.AUTH_PROVIDERS.some((p) => p !== "mock");
    const hasRoleRule =
      env.AUTH_ADMIN_GROUP ||
      env.AUTH_STAFF_GROUP ||
      env.AUTH_ADMIN_EMAILS ||
      env.AUTH_STAFF_EMAILS ||
      env.AUTH_ALLOWED_DOMAINS;

    if (hasRealProvider && !hasRoleRule) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["AUTH_ALLOWED_DOMAINS"],
        message:
          "No authorisation rule is configured, so every sign-in would be refused. Set at least one of AUTH_ALLOWED_DOMAINS, AUTH_ADMIN_EMAILS, AUTH_STAFF_EMAILS, AUTH_ADMIN_GROUP, or AUTH_STAFF_GROUP.",
      });
    }

    if (env.CONTENT_ADAPTER === "postgres" && !env.DATABASE_URL) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["DATABASE_URL"],
        message: 'DATABASE_URL is required when CONTENT_ADAPTER="postgres".',
      });
    }
  });

export type Env = z.infer<typeof EnvSchema>;

let cached: Env | null = null;

function load(): Env {
  const parsed = EnvSchema.safeParse({
    NODE_ENV: process.env.NODE_ENV,
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
    SESSION_SECRET: process.env.SESSION_SECRET,
    SESSION_MAX_AGE: process.env.SESSION_MAX_AGE,

    AUTH_PROVIDERS: process.env.AUTH_PROVIDERS,
    AUTH_ALLOW_MOCK_IN_PRODUCTION: process.env.AUTH_ALLOW_MOCK_IN_PRODUCTION,
    AUTH_GROUPS_CLAIM: process.env.AUTH_GROUPS_CLAIM,
    AUTH_ADMIN_GROUP: process.env.AUTH_ADMIN_GROUP,
    AUTH_STAFF_GROUP: process.env.AUTH_STAFF_GROUP,
    AUTH_ADMIN_EMAILS: process.env.AUTH_ADMIN_EMAILS,
    AUTH_STAFF_EMAILS: process.env.AUTH_STAFF_EMAILS,
    AUTH_ALLOWED_DOMAINS: process.env.AUTH_ALLOWED_DOMAINS,
    AUTH_ALLOWED_TENANTS: process.env.AUTH_ALLOWED_TENANTS,

    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
    MICROSOFT_CLIENT_ID: process.env.MICROSOFT_CLIENT_ID,
    MICROSOFT_CLIENT_SECRET: process.env.MICROSOFT_CLIENT_SECRET,
    MICROSOFT_TENANT_ID: process.env.MICROSOFT_TENANT_ID,

    OIDC_DISPLAY_NAME: process.env.OIDC_DISPLAY_NAME,
    OIDC_ISSUER: process.env.OIDC_ISSUER,
    OIDC_CLIENT_ID: process.env.OIDC_CLIENT_ID,
    OIDC_CLIENT_SECRET: process.env.OIDC_CLIENT_SECRET,
    OIDC_SCOPES: process.env.OIDC_SCOPES,

    CONTENT_ADAPTER: process.env.CONTENT_ADAPTER,
    DATABASE_URL: process.env.DATABASE_URL,
    NEXT_PUBLIC_DEMO_MODE: process.env.NEXT_PUBLIC_DEMO_MODE,
  });

  if (!parsed.success) {
    const detail = parsed.error.issues
      .map((i) => `  • ${i.path.join(".") || "(root)"}: ${i.message}`)
      .join("\n");
    throw new Error(`Invalid learnIT environment configuration:\n${detail}\n`);
  }

  return parsed.data;
}

export function env(): Env {
  cached ??= load();
  return cached;
}

/** True when the deployment must only ever serve sanitised, public content. */
export function isDemoMode(): boolean {
  return env().NEXT_PUBLIC_DEMO_MODE;
}

/** Canonical origin. Every absolute URL in the app derives from this. */
export function siteUrl(): string {
  return env().NEXT_PUBLIC_SITE_URL.replace(/\/$/, "");
}

/** Development-only signing key, so `npm run dev` works on a fresh clone. */
const DEV_SESSION_SECRET = "dev-only-insecure-session-secret-do-not-ship-0000";

/**
 * The session signing key.
 *
 * Called only by code that actually mints or verifies a session. Missing it in
 * production is a hard error — a session signed with a predictable key is not a
 * session — but it is not a reason a static build cannot compile.
 */
export function sessionSecret(): string {
  const configured = env().SESSION_SECRET;
  if (configured) return configured;

  if (env().NODE_ENV === "production") {
    throw new Error(
      "SESSION_SECRET is not configured. Sessions cannot be signed. Generate one with `openssl rand -base64 48` and set it in the environment.",
    );
  }

  return DEV_SESSION_SECRET;
}
