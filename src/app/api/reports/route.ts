import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { authorize } from "@/lib/auth";
import { getReportStore } from "@/lib/feedback/store";

/**
 * Content report intake.
 *
 * Authorization is enforced here, server-side, on every request — the fact that
 * the report form is only rendered for signed-in users is a UI convenience and
 * proves nothing.
 */

const BodySchema = z.object({
  resourceType: z.enum(["article", "module", "flow", "response", "scenario"]),
  resourceSlug: z
    .string()
    .min(1)
    .max(80)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  reason: z.enum(["outdated", "incorrect", "unclear", "broken-link", "other"]),
  detail: z.string().max(1000).optional(),
});

export async function POST(request: NextRequest) {
  // Reject cross-origin writes outright.
  const origin = request.headers.get("origin");
  if (origin && new URL(origin).host !== request.nextUrl.host) {
    return NextResponse.json({ error: "Cross-origin request refused" }, { status: 403 });
  }

  const auth = await authorize("staff");
  if (!auth.ok) {
    return NextResponse.json(
      {
        error:
          auth.status === 401
            ? "Sign in to report a documentation issue."
            : "You do not have permission to do that.",
      },
      { status: auth.status },
    );
  }

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "Malformed request." }, { status: 400 });
  }

  const parsed = BodySchema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json({ error: "That report could not be accepted." }, { status: 400 });
  }

  const store = getReportStore();
  await store.create({
    ...parsed.data,
    // Display name only — never an email or directory identifier. See
    // docs/security.md on keeping incidental PII out of operational records.
    reportedBy: auth.user.name,
  });

  return NextResponse.json({ ok: true, durable: store.durable }, { status: 201 });
}

/** Admin review queue. */
export async function GET() {
  const auth = await authorize("admin");
  if (!auth.ok) {
    return NextResponse.json({ error: "Not permitted." }, { status: auth.status });
  }

  const store = getReportStore();
  return NextResponse.json(
    { reports: await store.list(), durable: store.durable },
    { headers: { "cache-control": "no-store" } },
  );
}
