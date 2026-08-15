# Security

learnIT is an internal IT system. It is treated as one.

---

## Data it holds, and does not

**Holds:** published Help Desk documentation, a display name and role in the
session cookie, and learning progress in the technician's own browser.

**Does not hold:** passwords, API keys, ticket contents, student or staff
personal information, or any credential belonging to anyone. There is no user
table, because there are no learnIT accounts — identity is delegated entirely to
the configured provider.

No secret is committed to this repository. Every URL in `src/content/links.ts`
is a `#` placeholder that an administrator fills in at runtime.

---

## The authorization model

Four layers; two of them are real.

```
navigation hiding      cosmetic
middleware             cookie presence only — avoids a render-then-redirect flash
requireStaff/Admin()   ← boundary
repository(viewer)     ← boundary
```

`src/middleware.ts` deliberately does **not** verify the session token or check
the role. Its only job is bouncing obviously-anonymous requests at the edge. A
forged cookie passes it and lands on a signature check it cannot pass.

The real checks are:

1. **`requireStaff()` / `requireAdmin()`** — the first statement of every
   protected server component, and repeated independently inside every Server
   Action and route handler. A Server Action is a public HTTP endpoint; the fact
   that its form only renders inside `/admin` proves nothing about the caller.

2. **The content repository** — every read takes a `Viewer` and applies demo
   sanitisation and then visibility/status filtering. A page that forgets to
   filter still gets filtered content.

Content a viewer may not see returns **404, not 403** — a 403 confirms the
record exists.

---

## Demo mode

The public deployment must be incapable of serving internal documentation, not
merely configured not to.

With `NEXT_PUBLIC_DEMO_MODE=true`, the repository filters to
`visibility: "public"` **before** any role check. An authenticated demo persona
gets exactly what an anonymous visitor gets, because a demo sign-in is not a
Help Desk credential.

The environment schema (`src/lib/config/env.ts`) enforces the pairing:

- Production + `AUTH_PROVIDER=mock` → **refuses to start**, unless
  `AUTH_ALLOW_MOCK_IN_PRODUCTION=true` is set explicitly.
- That opt-in additionally **requires** `NEXT_PUBLIC_DEMO_MODE=true`.

So a deployment holding real Help Desk content cannot use mock sign-in, and a
deployment using mock sign-in cannot reach real content. Sessions also record
their issuing provider, and a `mock` session is rejected once the deployment
switches to `oidc`.

The demo knowledge base states that internal procedures exist and are excluded —
without titles, counts, or categories, since those are themselves information.

---

## Specific defences

**Session cookie** — signed HS256 JWT, `httpOnly` (XSS cannot read it),
`SameSite=Lax`, `Secure` in production, 8-hour default lifetime. Contains a
display name and role; no credential, no IdP token.

**CSRF** — Server Actions get Next.js's built-in origin validation. Route
handlers that mutate (`POST /api/reports`, `POST /api/auth/signout`) perform an
explicit same-origin check. Sign-out is `POST`-only, so an `<img src>` on
another site cannot log a technician out.

**Open redirect** — `sanitizeReturnTo()` accepts only same-origin relative
paths, rejecting `//evil.com` and backslash tricks. Without it the sign-in flow
becomes an open redirect.

**OIDC flow** — Authorization Code with PKCE `S256`; `state` and `nonce`
generated per attempt, stored in a short-lived httpOnly cookie, and verified on
callback; ID token signature verified against the provider's JWKS with issuer
and audience checks. Token-exchange failures never surface the provider's raw
response, which can echo the client secret.

**XSS** — no `dangerouslySetInnerHTML` anywhere. Content is a closed union of
block types rendered through a `switch`; inline markup is parsed to React
elements. Content-authored links must be `https://` or a same-origin path, so a
`javascript:` URL cannot be introduced through content.

**Error disclosure** — the error boundary shows a recovery path and a digest,
never a stack trace or message. Auth failures log server-side and return a
generic code, except "not a member of an authorised group", which is named
because the user needs to know.

**Search index** — built per-viewer, served with `cache-control: private` so a
shared cache cannot hand a staff index to an anonymous visitor.

**Response headers** — `next.config.ts` sets `X-Content-Type-Options`,
`X-Frame-Options: DENY`, `Referrer-Policy`, `Permissions-Policy` (camera,
microphone, geolocation all denied), and HSTS.

---

## Content-Security-Policy

**Not set by the application, on purpose.** A correct policy needs a per-request
nonce or a hash for the inline scripts Next.js emits, and the nonce approach
forces every route into dynamic rendering — a real cost for a mostly-static
application, and a decision that belongs to whoever operates the deployment.

Apply this at the reverse proxy or CDN:

```
Content-Security-Policy:
  default-src 'self';
  script-src 'self' 'unsafe-inline';
  style-src 'self' 'unsafe-inline';
  img-src 'self' data: blob:;
  font-src 'self';
  connect-src 'self';
  frame-ancestors 'none';
  base-uri 'self';
  form-action 'self';
  object-src 'none';
  upgrade-insecure-requests
```

`script-src 'unsafe-inline'` covers Next's bootstrap and the theme script in
`app/layout.tsx`. To remove it, compute the SHA-256 of that script's contents
and add `'sha256-…'` alongside a nonce strategy for Next's own inline scripts.

Note the app makes **no external requests at runtime**: fonts are self-hosted at
build time by `next/font`, and there are no third-party scripts, analytics, or
CDNs. `default-src 'self'` costs nothing.

---

## Keeping personal information out

Two rules, enforced in code and stated in the content itself:

**Operational records store display names only.** Content reports record
`reportedBy: user.name` — never an email, directory identifier, or IdP subject.

**Training content is never built from real tickets.** Every scenario reference,
requester, and message in `src/content/scenarios.ts` is invented. A real ticket
turned into training material carries someone's actual problem, phrasing, and
often their identity into a document read by every new hire.

The training modules themselves teach the same discipline — "what never belongs
in a ticket" is a required step of the ticketing module, and the report form
warns against including credentials or requester details.

---

## Known limitations

**Reports and admin overrides are in-memory.** They work immediately and reset
on restart. The admin console states this rather than implying durability.
Postgres implementations of `ReportStore` and `OverrideStore` fix it.

**No rate limiting.** `POST /api/reports` and the sign-in flow have none.
Behind an institutional reverse proxy this is usually handled upstream; if not,
add it before exposing the internal deployment.

**No audit log.** Admin actions (link edits, notice publication, report triage)
are not recorded. If Adelphi IT requires an audit trail, the Server Actions in
`src/features/admin/actions.ts` are the single place to add it — every mutation
already passes through one of them.

**Session revocation is not immediate.** Sessions are stateless JWTs valid until
expiry. If immediate revocation is required, see the `SWAP POINT` markers in
`src/lib/auth/session.ts`.

---

## Before the internal deployment

- [ ] `AUTH_PROVIDER=oidc`, registered with Adelphi's identity provider
- [ ] `SESSION_SECRET` generated with `openssl rand -base64 48`, stored in the
      platform's secret manager — never in the repository
- [ ] `NEXT_PUBLIC_DEMO_MODE=false`
- [ ] `AUTH_ALLOW_MOCK_IN_PRODUCTION` unset
- [ ] Every seed record reviewed by Help Desk leadership
      (see [content.md](content.md))
- [ ] Every Important Link configured from `/admin/links`
- [ ] CSP applied at the proxy
- [ ] HTTPS enforced; HSTS already set by the application
- [ ] Rate limiting confirmed, upstream or added
- [ ] `npm run check` green in CI, gating deploys
