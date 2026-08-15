import { NextResponse, type NextRequest } from "next/server";
import { identityProvider, sanitizeReturnTo } from "@/lib/auth";
import { saveTransaction } from "@/lib/auth/session";

/**
 * Begins authentication.
 *
 * With the OIDC provider this redirects to Adelphi's identity provider. With
 * the mock provider it redirects to the local persona picker. The route is
 * identical either way, which is the point of the abstraction — nothing outside
 * `src/lib/auth/providers` knows which is configured.
 */
export async function GET(request: NextRequest) {
  const returnTo = sanitizeReturnTo(request.nextUrl.searchParams.get("returnTo"));
  const provider = identityProvider();

  try {
    const start = await provider.beginSignIn({ returnTo });
    if (start.transaction) await saveTransaction(start.transaction);
    return NextResponse.redirect(new URL(start.redirectTo, request.url));
  } catch (error) {
    // Never surface provider internals to the browser.
    console.error("[auth] sign-in start failed", error);
    const failure = new URL("/signin", request.url);
    failure.searchParams.set("error", "provider_unavailable");
    return NextResponse.redirect(failure);
  }
}
