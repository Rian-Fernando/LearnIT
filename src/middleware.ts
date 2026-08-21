import { NextResponse, type NextRequest } from "next/server";

/**
 * Two jobs, both cheap.
 *
 * **1. Canonical host.** Vercel serves every deployment on a `*.vercel.app`
 * hostname as well as the custom domain. Left alone, that is a second fully
 * crawlable copy of the site competing with itself in search results. Any
 * request arriving on the deployment host is redirected permanently to the
 * canonical domain, so only one version is ever indexed.
 *
 * **2. Coarse route guard.** A convenience layer, **not** the authorization
 * boundary. It only checks whether a session cookie is present, so an
 * unauthenticated visitor is bounced at the edge instead of rendering a page
 * that would immediately redirect. It deliberately does not verify the token or
 * inspect the role.
 *
 * The real checks are `requireStaff()` / `requireAdmin()` at the top of every
 * protected server component and Server Action, plus visibility filtering
 * inside the content repository. A forged cookie gets past this middleware and
 * straight into a signature check it cannot pass.
 */

const SESSION_COOKIE = "learnit_session";

/** Route prefixes that require an authenticated Help Desk session. */
const PROTECTED = [
  "/dashboard",
  "/knowledge",
  "/training",
  "/troubleshoot",
  "/responses",
  "/practice",
  "/progress",
  "/checklists",
  "/tickets",
  "/reference",
  "/admin",
];

function canonicalHost(): string | null {
  try {
    return new URL(
      process.env.NEXT_PUBLIC_SITE_URL ?? "https://learnit.rianfernando.com",
    ).host;
  } catch {
    return null;
  }
}

export function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const host = request.headers.get("host");
  const canonical = canonicalHost();

  // --- 1. collapse duplicate hosts onto the canonical domain ---------------
  if (
    canonical &&
    host &&
    host !== canonical &&
    host.endsWith(".vercel.app") &&
    process.env.NODE_ENV === "production"
  ) {
    const target = new URL(request.nextUrl);
    target.host = canonical;
    target.protocol = "https:";
    target.port = "";
    return NextResponse.redirect(target, 308);
  }

  // --- 2. bounce obviously-anonymous requests to protected routes ----------
  const needsSession = PROTECTED.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );
  if (!needsSession) return NextResponse.next();

  if (request.cookies.has(SESSION_COOKIE)) return NextResponse.next();

  const signIn = new URL("/signin", request.url);
  signIn.searchParams.set("returnTo", `${pathname}${search}`);
  return NextResponse.redirect(signIn);
}

export const config = {
  matcher: [
    /*
     * Everything except static assets and the auth endpoints themselves —
     * matching those would create a redirect loop. `sitemap.xml`, `robots.txt`,
     * and `llms.txt` are excluded so crawlers are never redirected.
     */
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|llms.txt|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|txt|xml)$).*)",
  ],
};
