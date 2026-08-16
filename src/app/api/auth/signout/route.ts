import { NextResponse, type NextRequest } from "next/server";
import { destroySession, enabledProviders, getSession } from "@/lib/auth";

/**
 * Ends the session.
 *
 * POST only. A GET sign-out can be triggered by any `<img src>` on any page,
 * which turns logout into a trivial cross-site annoyance; requiring POST plus a
 * same-origin check makes that impossible.
 */
export async function POST(request: NextRequest) {
  // Same-origin check. Server Actions get this from Next automatically; a route
  // handler has to do it itself.
  const origin = request.headers.get("origin");
  if (origin && new URL(origin).host !== request.nextUrl.host) {
    return new NextResponse("Cross-origin request refused", { status: 403 });
  }

  // Ask the issuing provider for a single-logout URL before clearing the
  // session, since we need to know which provider issued it.
  const session = await getSession();
  const issuer = enabledProviders().find((p) => p.id === session?.provider);
  const idpLogout = issuer?.signOutUrl({ returnTo: "/" }) ?? null;

  await destroySession();

  return NextResponse.redirect(new URL(idpLogout ?? "/", request.url), {
    // 303 so the browser follows with GET after the POST.
    status: 303,
  });
}
