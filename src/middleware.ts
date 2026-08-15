import { NextResponse, type NextRequest } from "next/server";

/**
 * Coarse route guard.
 *
 * This is a **convenience layer, not the authorization boundary.** It only
 * checks whether a session cookie is present, so an unauthenticated visitor is
 * bounced at the edge instead of rendering a page that would immediately
 * redirect. It deliberately does not verify the token or inspect the role.
 *
 * The real checks are `requireStaff()` / `requireAdmin()` at the top of every
 * protected server component, plus visibility filtering inside the content
 * repository. A forged cookie gets past this middleware and straight into a
 * signature check it cannot pass.
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
  "/admin",
];

export function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

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
     * matching those would create a redirect loop.
     */
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
  ],
};
