# Authentication and authorization

## Principle

**learnIT does not invent an authentication process.** It has no password
field, no user table, and no credential storage. It defines an interface and
delegates identity to an external provider.

This matters for a university system: an internally-invented login for a Help
Desk tool would be a second credential to manage, a second thing to phish, and
almost certainly out of step with institutional policy.

---

## The abstraction

`src/lib/auth/types.ts`

```ts
type ProviderId = "mock" | "google" | "microsoft" | "oidc";

interface IdentityProvider {
  readonly id: ProviderId;
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
  role: "staff" | "admin";     // derived, never self-asserted
  title?: string;
  startedAt?: string;
}
```

**More than one provider can be enabled at once.** `AUTH_PROVIDERS` is a
comma-separated list, so `google,microsoft` puts both buttons on the sign-in
screen. That is what makes moving between them a configuration change rather
than a cutover: run both, migrate people, then drop the old one.

Sessions record which provider issued them, and a session from a provider that
is no longer enabled stops being honoured — so removing `mock` from the list
immediately invalidates every demo session.

---

## Google → Microsoft: the migration path

Both work today. They differ in one important way, and it drives the
configuration.

| | Google | Microsoft Entra ID |
| --- | --- | --- |
| Protocol | OIDC + PKCE | OIDC + PKCE |
| Group membership in ID token | **No** | **Yes**, via a `groups` claim |
| Organisation signal | `hd` (hosted domain) | `tid` (tenant id) |
| Best role mechanism | domain + email allowlist | directory groups |

**Google does not put group membership in the ID token.** So with Google,
authorisation is by verified domain plus explicit email allowlists. That is
perfectly workable for a Help Desk of a few dozen people, and it is the right
starting point.

**Microsoft Entra ID can emit groups**, which is the better long-term answer for
Adelphi — access follows a directory group maintained by IT, not a list in this
repository. Adelphi runs Microsoft 365, so this is the expected destination.

### Recommended sequence

**Now — Google, so sign-in works immediately:**

```env
AUTH_PROVIDERS="google"
GOOGLE_CLIENT_ID="…"
GOOGLE_CLIENT_SECRET="…"
AUTH_ALLOWED_DOMAINS="adelphi.edu"
AUTH_ADMIN_EMAILS="you@adelphi.edu"
```

**Transition — both, so nobody is locked out mid-move:**

```env
AUTH_PROVIDERS="google,microsoft"
MICROSOFT_TENANT_ID="<Adelphi tenant id>"
MICROSOFT_CLIENT_ID="…"
MICROSOFT_CLIENT_SECRET="…"
```

**Settled — Microsoft only, with groups:**

```env
AUTH_PROVIDERS="microsoft"
AUTH_ALLOWED_TENANTS="<Adelphi tenant id>"
AUTH_ADMIN_GROUP="<leadership group object id>"
AUTH_STAFF_GROUP="<technician group object id>"
```

Because the subject identifier changes between providers, a person who signed in
with Google and later signs in with Microsoft is a new subject to learnIT. That
only affects browser-stored learning progress, which is per-device anyway.

---

## Registration

### Google

Google Cloud Console → APIs & Services → Credentials → **Create OAuth client ID**

| Item | Value |
| --- | --- |
| Application type | Web application |
| Authorised redirect URI | `https://learnit.rianfernando.com/api/auth/callback?provider=google` |
| Scopes | `openid email profile` |

For local development add `http://localhost:3000/api/auth/callback?provider=google`.

learnIT sends `prompt=select_account` so a shared Help Desk workstation always
shows the account chooser rather than silently reusing whoever is signed in, and
passes the first configured domain as an `hd` hint. The hint is cosmetic — the
real restriction is `AUTH_ALLOWED_DOMAINS`, enforced server-side against the
verified `hd` claim after the token signature is checked.

### Microsoft Entra ID

Entra admin centre → App registrations → **New registration**

| Item | Value |
| --- | --- |
| Supported account types | Single tenant (recommended) |
| Redirect URI (Web) | `https://learnit.rianfernando.com/api/auth/callback?provider=microsoft` |
| Client secret | Certificates & secrets → New client secret |
| Token configuration | Add the **groups** claim to the ID token |
| API permissions | `openid`, `profile`, `email` |

Set `MICROSOFT_TENANT_ID` to the tenant id rather than `common`. Multi-tenant
`common` works — learnIT handles the templated issuer Microsoft returns for it —
but a specific tenant is one fewer thing to get wrong.

### Any other provider

`AUTH_PROVIDERS="oidc"` with `OIDC_ISSUER`, `OIDC_CLIENT_ID`,
`OIDC_CLIENT_SECRET`. Same implementation, generic configuration. Redirect URI
is `…/api/auth/callback?provider=oidc`.

---

## Role resolution

`src/lib/auth/roles.ts`

First match wins:

1. **Admin group** — `AUTH_ADMIN_GROUP` present in the groups claim
2. **Admin email** — verified email in `AUTH_ADMIN_EMAILS`
3. **Staff group** — `AUTH_STAFF_GROUP` present in the groups claim
4. **Staff email** — verified email in `AUTH_STAFF_EMAILS`
5. **Allowed domain** — `hd` claim, or verified email domain, in `AUTH_ALLOWED_DOMAINS`
6. **Refuse**

`AUTH_ALLOWED_TENANTS`, when set, is a hard gate applied *before* any of this —
an account from another directory is refused regardless of allowlists.

Three deliberate choices:

**Refuse rather than default to staff.** An account nobody has authorised should
not get a Help Desk session at all, and the user is told plainly why.

**Unverified emails are never used.** If `email_verified` is false, the address
proves nothing and is ignored for both allowlists and domain matching.

**`hd` beats the email domain.** The hosted-domain claim is asserted by the
provider about the account; an email local part is not. Where both exist, `hd`
wins.

The environment schema refuses to boot if a real provider is enabled with no
authorisation rule configured at all — otherwise every sign-in would be refused
and the deployment would look broken rather than misconfigured.

---

## Sessions

`src/lib/auth/session.ts`

A signed (HS256) JWT in an `httpOnly`, `SameSite=Lax`, `Secure` (in production)
cookie. Default lifetime is eight hours — one shift — configurable with
`SESSION_MAX_AGE`.

The token carries display name, role, job title, and start date. It carries **no
credential**, no IdP access or refresh token, and nothing damaging if decoded.
Because it is `httpOnly`, an XSS bug cannot lift it.

Verification failures of any kind — expired, tampered, signed with a rotated
key, issued by a now-disabled provider — resolve to "no session" rather than an
error. A forged cookie produces a redirect to sign-in, never a 500.

### If server-side sessions become a requirement

Immediate revocation and device listing need server-side storage. Two functions
in `session.ts` are marked `SWAP POINT`; replacing them with a store lookup is
the whole change.

---

## Flow security

- **PKCE `S256`** on every provider.
- **`state`** generated per attempt and verified on callback — the CSRF defence
  for the authorization response.
- **`nonce`** generated per attempt and compared against the ID token claim.
- **ID token signature** verified against the provider's JWKS, with audience
  checked against the client id.
- **Issuer** verified against the discovery document. Microsoft's multi-tenant
  discovery reports a `{tenantid}` template while the token carries the concrete
  tenant, so templates are matched by pattern — still an exact-shape check.
- **Provider selection on callback comes from the transaction cookie**, not the
  query string, so a caller cannot pair one provider's state with another's
  handler.
- **Token exchange failures never surface the provider's response**, which can
  echo the client secret in some implementations.

---

## Authorization layers

Role ranking is `guest (0) < staff (1) < admin (2)`.

| Layer | Location | Load-bearing? |
| --- | --- | --- |
| Navigation hiding | `components/app/navigation.ts` | **No** — cosmetic |
| Middleware | `src/middleware.ts` | **No** — cookie *presence* only |
| Route guard | `requireStaff()` / `requireAdmin()` in every protected server component and Server Action | **Yes** |
| Content filtering | `repository.ts` + `access.ts`, per viewer | **Yes** |

Server Actions re-check the role independently — a Server Action is a public
HTTP endpoint, and the fact that its form only renders inside `/admin` proves
nothing about who is calling it.

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
