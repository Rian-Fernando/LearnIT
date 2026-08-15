import { NextResponse, type NextRequest } from "next/server";
import { AuthError, createSession, identityProvider, sanitizeReturnTo } from "@/lib/auth";
import { clearTransaction, readTransaction } from "@/lib/auth/session";

/**
 * Completes authentication.
 *
 * The provider verifies the callback (state, nonce, PKCE, ID token signature)
 * and returns a user; this route's only jobs are to mint the learnIT session
 * and to send the visitor where they were going.
 */
export async function GET(request: NextRequest) {
  const provider = identityProvider();
  const transaction = await readTransaction();
  const returnTo = sanitizeReturnTo(
    transaction.returnTo ?? request.nextUrl.searchParams.get("returnTo"),
  );

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
    // in successfully but are not a member of a Help Desk group. Everything
    // else gets a generic failure so we do not leak provider detail.
    const code =
      error instanceof AuthError && error.code === "not_authorized"
        ? "not_authorized"
        : "sign_in_failed";

    if (code !== "not_authorized") {
      console.error("[auth] callback failed", error);
    }

    const failure = new URL("/signin", request.url);
    failure.searchParams.set("error", code);
    return NextResponse.redirect(failure);
  }
}
