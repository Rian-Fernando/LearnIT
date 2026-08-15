# Authentication and authorization

## Principle

**learnIT does not invent an authentication process.** It has no password
field, no user table, and no credential storage. It defines an interface and
delegates identity entirely to whatever provider Adelphi IT designates.

This matters for a university system: an internally-invented login for a Help
Desk tool would be a second credential to manage, a second thing to phish, and
almost certainly out of step with institutional policy.

---

## The abstraction

`src/lib/auth/types.ts`

```ts
interface IdentityProvider {
  readonly id: "mock" | "oidc";
  readonly displayName: string;
  beginSignIn(input: { returnTo: string }): Promise<SignInStart>;
  completeSignIn(input: {
    params: URLSearchParams;
    transaction: Record<string, string>;
  }): Promise<HelpDeskUser>;
  signOutUrl(input: { returnTo: string }): string | null;
}
```

The application only ever sees a `HelpDeskUser`:

```ts
interface HelpDeskUser {
  id: string;                  // opaque IdP subject identifier
  name: string;                // display name
  role: "staff" | "admin";     // derived from IdP group membership
  title?: string;
  startedAt?: string;
}
```

Nothing outside `src/lib/auth/providers/` knows which provider is configured.
Switching is `AUTH_PROVIDER=mock|oidc` in the environment.

---

## Provider: `mock`

`src/lib/auth/providers/mock.ts`

Exists so learnIT can be built, reviewed, and demonstrated before the
application is registered with Adelphi's identity provider. It performs **no
credential verification** — a persona is chosen from a fixed list of three
fictional users (a first-week technician, an experienced technician, and a
coordinator with admin rights).

Two guards keep this from becoming a liability:

1. `src/lib/config/env.ts` refuses to start a production deployment with
   `AUTH_PROVIDER=mock` unless `AUTH_ALLOW_MOCK_IN_PRODUCTION=true` is set
   explicitly.
2. That opt-in additionally requires `NEXT_PUBLIC_DEMO_MODE=true`, so mock
   sign-in can only ever reach sanitised content. A deployment holding real
   Help Desk documentation cannot use it at all.

Sessions also record which provider issued them, and a session minted by `mock`
is rejected outright once the deployment switches to `oidc`.

## Provider: `oidc`

`src/lib/auth/providers/oidc.ts`

Standard OpenID Connect Authorization Code flow with PKCE. Written against the
specification rather than any one vendor, so it works with Microsoft Entra ID,
Okta, a Shibboleth OIDC bridge, or anything else Adelphi designates.

Implemented:

- Provider metadata discovery (`/.well-known/openid-configuration`), cached for
  an hour
- `state` (CSRF), `nonce` (replay), and PKCE `S256` — all verified on callback
- ID token signature verification against the provider's JWKS
- Issuer and audience validation
- Role derived from a group claim
- Optional provider-side single logout

Sign-in transaction values (state, nonce, PKCE verifier, return path) are held
in a short-lived, httpOnly cookie for the ten minutes the flow takes.

### Registration checklist for Adelphi IT

What the identity provider administrator needs to configure:

| Item | Value |
| --- | --- |
| Application type | Confidential web application (server-side) |
| Grant type | Authorization Code with PKCE |
| Redirect URI | `https://<deployment-host>/api/auth/callback` |
| Post-logout redirect URI | `https://<deployment-host>/` |
| Scopes | `openid profile email` (minimum) |
| Required claims | `sub`, `name` (or `preferred_username`), and a groups claim |
| Groups | One group for Help Desk staff, one for Help Desk leadership |

What learnIT then needs in its environment:

```env
AUTH_PROVIDER="oidc"
OIDC_ISSUER="https://…"
OIDC_CLIENT_ID="…"
OIDC_CLIENT_SECRET="…"
OIDC_SCOPES="openid profile email"
OIDC_GROUPS_CLAIM="groups"
OIDC_ADMIN_GROUP="<group identifier for leadership>"
OIDC_STAFF_GROUP="<group identifier for technicians>"
```

### Role derivation

Role comes from group membership and is **never self-asserted by the client**:

- Member of the admin group → `admin`
- Member of the staff group → `staff`
- Neither → **sign-in is refused**

Refusing rather than defaulting to the lower privilege is deliberate. An account
that is not recognised as Help Desk should not receive a Help Desk session at
all, and the user is told plainly why.

---

## Sessions

`src/lib/auth/session.ts`

A signed (HS256) JWT in an `httpOnly`, `SameSite=Lax`, `Secure` (in production)
cookie. Default lifetime is eight hours — one shift — configurable with
`SESSION_MAX_AGE`.

The token carries display name, role, job title, and start date. It carries **no
credential**, no IdP access or refresh token, and nothing that would be damaging
if decoded. Because it is `httpOnly`, an XSS bug cannot lift it.

Verification failures of any kind — expired, tampered, signed with a rotated
key — resolve to "no session" rather than an error. A forged cookie produces a
redirect to sign-in, never a 500.

### If server-side sessions become a requirement

Immediate revocation and device listing need server-side storage. Two functions
in `session.ts` are marked `SWAP POINT`; replacing them with a store lookup is
the whole change.

---

## Authorization

Role ranking is `guest (0) < staff (1) < admin (2)`.

There are four layers, and only two of them are actually load-bearing:

| Layer | Location | Load-bearing? |
| --- | --- | --- |
| Navigation hiding | `components/app/navigation.ts` | **No** — cosmetic only |
| Middleware | `src/middleware.ts` | **No** — cookie *presence* check, avoids a render-then-redirect flash |
| Route guard | `requireStaff()` / `requireAdmin()` in every protected server component and Server Action | **Yes** |
| Content filtering | `repository.ts` + `access.ts`, per viewer | **Yes** |

The middleware deliberately does not verify the token or inspect the role. A
forged cookie passes it and lands directly on a signature check it cannot pass.

Server Actions re-check the role independently — a Server Action is a public
HTTP endpoint, and the fact that its form is only rendered inside `/admin`
proves nothing about who is calling it.

Route handlers use `authorize(role)`, which returns `401` or `403` rather than
redirecting.

### Verified behaviour

| Request | Result |
| --- | --- |
| Anonymous → `/dashboard` | `307` → `/signin?returnTo=/dashboard` |
| Forged session cookie → `/dashboard` | `307` → `/signin` (signature rejected) |
| Staff → `/admin` | `307` → `/dashboard?denied=1` |
| Admin → `/admin` | `200` |
| Anonymous → `POST /api/reports` | `401` |
| Staff → `GET /api/reports` | `403` |
| Guest search index | 44 documents, no internal records |
| Staff search index | 46 documents, internal records present |
| Guest → internal article by direct URL | `404` |

A `404` rather than a `403` for content a viewer may not see is intentional: a
`403` confirms the record exists.
