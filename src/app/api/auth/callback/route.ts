import { NextResponse, type NextRequest } from "next/server";
import {
  AuthError,
  createSession,
  enabledProviders,
  providerById,
  sanitizeReturnTo,
} from "@/lib/auth";
import { clearTransaction, readTransaction } from "@/lib/auth/session";

/**
 * Completes authentication.
 *
 * The provider verifies the callback (state, nonce, PKCE, ID token signature)
 * and returns a user; this route's only jobs are to mint the learnIT session
 * and to send the visitor where they were going.
 *
 * Which provider handles the callback comes from the sign-in transaction
 * cookie, not from the query string — a caller cannot pick a different
 * provider than the one that issued the state it is echoing back.
 */
export async function GET(request: NextRequest) {
  const transaction = await readTransaction();
  const available = enabledProviders();

  const provider =
    providerById(transaction.provider ?? "") ??
    (available.length === 1 ? available[0]! : null);

  const returnTo = sanitizeReturnTo(
    transaction.returnTo ?? request.nextUrl.searchParams.get("returnTo"),
  );

  if (!provider) {
    await clearTransaction();
    const failure = new URL("/signin", request.url);
    failure.searchParams.set("error", "sign_in_failed");
    return NextResponse.redirect(failure);
  }

  try {
    const user = await provider.completeSignIn({
      params: request.nextUrl.searchParams,
      transaction,
    });

    await createSession(user, provider.id);
    await clearTransaction();

    return NextResponse.redirect(new URL(returnTo, request.url));
  } catch (error) {
    await clearTransaction();

    // `not_authorized` is the one case worth naming to the user — they signed
    // in successfully but are not authorised for learnIT. Everything else gets
    // a generic failure so we do not leak provider detail.
    const notAuthorized =
      error instanceof AuthError && error.code === "not_authorized";

    if (!notAuthorized) {
      console.error("[auth] callback failed", error);
    }

    const failure = new URL("/signin", request.url);
    failure.searchParams.set("error", notAuthorized ? "not_authorized" : "sign_in_failed");
    return NextResponse.redirect(failure);
  }
}
