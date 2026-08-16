import { NextResponse, type NextRequest } from "next/server";
import { enabledProviders, providerById, sanitizeReturnTo } from "@/lib/auth";
import { saveTransaction } from "@/lib/auth/session";

/**
 * Begins authentication with a named provider.
 *
 * `?provider=google` selects which of the enabled providers to use. When the
 * parameter is absent and only one provider is configured, that one is used —
 * so a single-provider deployment needs no parameter at all.
 */
export async function GET(request: NextRequest) {
  const returnTo = sanitizeReturnTo(request.nextUrl.searchParams.get("returnTo"));
  const requested = request.nextUrl.searchParams.get("provider");

  const available = enabledProviders();
  const provider = requested
    ? providerById(requested)
    : (available.length === 1 ? available[0]! : null);

  if (!provider) {
    // An unknown or ambiguous provider sends the visitor back to the chooser
    // rather than guessing on their behalf.
    const chooser = new URL("/signin", request.url);
    chooser.searchParams.set("returnTo", returnTo);
    if (requested) chooser.searchParams.set("error", "unknown_provider");
    return NextResponse.redirect(chooser);
  }

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
