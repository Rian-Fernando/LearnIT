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

const EnvSchema = z
  .object({
    NODE_ENV: z.enum(["development", "test", "production"]).default("development"),

    NEXT_PUBLIC_SITE_URL: z.string().url().default("http://localhost:3000"),

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

    AUTH_PROVIDER: z.enum(["mock", "oidc"]).default("mock"),
    AUTH_ALLOW_MOCK_IN_PRODUCTION: booleanish,

    OIDC_ISSUER: z.string().optional(),
    OIDC_CLIENT_ID: z.string().optional(),
    OIDC_CLIENT_SECRET: z.string().optional(),
    OIDC_SCOPES: z.string().default("openid profile email"),
    OIDC_GROUPS_CLAIM: z.string().default("groups"),
    OIDC_ADMIN_GROUP: z.string().optional(),
    OIDC_STAFF_GROUP: z.string().optional(),

    CONTENT_ADAPTER: z.enum(["file", "postgres"]).default("file"),
    DATABASE_URL: z.string().optional(),

    NEXT_PUBLIC_DEMO_MODE: booleanish,
  })
  .superRefine((env, ctx) => {
    const isProd = env.NODE_ENV === "production";

    // The single most important guard in the application: a production
    // deployment must not accept mock personas unless it has been explicitly
    // and knowingly opted in (the public portfolio build).
    if (isProd && env.AUTH_PROVIDER === "mock" && !env.AUTH_ALLOW_MOCK_IN_PRODUCTION) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["AUTH_PROVIDER"],
        message:
          'AUTH_PROVIDER="mock" is not permitted in production. Configure the approved identity provider (AUTH_PROVIDER="oidc"), or set AUTH_ALLOW_MOCK_IN_PRODUCTION="true" if this is the sanitised public demo.',
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

    if (env.AUTH_PROVIDER === "oidc") {
      for (const key of ["OIDC_ISSUER", "OIDC_CLIENT_ID", "OIDC_CLIENT_SECRET"] as const) {
        if (!env[key]) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: [key],
            message: `${key} is required when AUTH_PROVIDER="oidc".`,
          });
        }
      }
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
    AUTH_PROVIDER: process.env.AUTH_PROVIDER,
    AUTH_ALLOW_MOCK_IN_PRODUCTION: process.env.AUTH_ALLOW_MOCK_IN_PRODUCTION,
    OIDC_ISSUER: process.env.OIDC_ISSUER,
    OIDC_CLIENT_ID: process.env.OIDC_CLIENT_ID,
    OIDC_CLIENT_SECRET: process.env.OIDC_CLIENT_SECRET,
    OIDC_SCOPES: process.env.OIDC_SCOPES,
    OIDC_GROUPS_CLAIM: process.env.OIDC_GROUPS_CLAIM,
    OIDC_ADMIN_GROUP: process.env.OIDC_ADMIN_GROUP,
    OIDC_STAFF_GROUP: process.env.OIDC_STAFF_GROUP,
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
