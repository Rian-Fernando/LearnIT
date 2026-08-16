# Discoverability: SEO and GEO

learnIT is deployed at **https://learnit.rianfernando.com** and linked from
https://rianfernando.com/projects. It needs to be findable two ways: by search
engines, and by AI answer engines that read pages and cite them.

Those want different things, so both are handled explicitly.

---

## GEO — being read and cited by answer engines

### `/llms.txt`

`src/app/llms.txt/route.ts` — served as `text/plain`, statically generated.

The llms.txt convention: one Markdown file an answer engine can read to
understand what a site is, without crawling a JavaScript-rendered app and
inferring it. Structure is an H1, a blockquote summary, then linked sections.

Two things make it useful rather than decorative:

**It is written to be quoted.** Answer engines lift sentences. Every line is a
plain factual statement that survives being pulled out of context — no
"revolutionary", no sentence that only parses next to the one before it.

**Counts come from the live content set**, not hardcoded, so the file cannot
drift out of date the way a hand-maintained summary would.

It also states plainly that the demo content is fictional, so a model
summarising learnIT does not present invented procedures as real Adelphi policy.

### AI crawlers in `robots.txt`

`src/app/robots.ts` lists nineteen agents by name, each with the same allow and
disallow rules as the wildcard.

Naming them matters. Several — `Google-Extended` and `Applebot-Extended` in
particular — are opt-out controls that only take effect when addressed by name.
The only way to positively signal "yes, you may read and cite this" is to list
them:

| Operator | Agents |
| --- | --- |
| OpenAI | `GPTBot`, `OAI-SearchBot`, `ChatGPT-User` |
| Anthropic | `ClaudeBot`, `Claude-Web`, `anthropic-ai`, `Claude-SearchBot`, `Claude-User` |
| Perplexity | `PerplexityBot`, `Perplexity-User` |
| Google / Apple | `Google-Extended`, `Applebot-Extended` |
| Others | `CCBot`, `Amazonbot`, `Bytespider`, `cohere-ai`, `Meta-ExternalAgent`, `DuckAssistBot`, `MistralAI-User` |

Closed to everyone: `/api/`, `/admin`, `/signin`, and the authenticated
application routes. Those redirect anonymous requests to sign-in, so crawling
them yields redirect chains rather than content.

### Structured data

`src/components/seo/structured-data.tsx`

| Schema | Where | Purpose |
| --- | --- | --- |
| `WebApplication` | Homepage | What the product is, its feature list, and `author` → Rian Fernando / rianfernando.com |
| `FAQPage` | Homepage | Six question/answer pairs, quoted directly by both Google rich results and answer engines |
| `TechArticle` | Demo articles | Marks each procedure as a technical article with its real review date |
| `BreadcrumbList` | Demo articles | Positions the page in the site hierarchy |

**The FAQ answers exist twice on purpose.** `landing-faq.tsx` renders them as a
visible `<dl>`, and `structured-data.tsx` repeats them byte-identically as
JSON-LD. Google requires FAQ markup to reflect content actually visible on the
page — invisible FAQ markup is a manual-action risk, not a shortcut. Keep the
two in sync when either changes.

They are rendered as a description list rather than an accordion so every answer
is in the DOM at load. Collapsed content is worth much less to a crawler, and
there are only six.

---

## SEO

### Canonical domain

`metadataBase` is `NEXT_PUBLIC_SITE_URL`, so every canonical tag, OG image URL,
and sitemap entry resolves against the real domain.

**Vercel serves every deployment on a `*.vercel.app` host as well as the custom
domain.** Left alone that is a second fully crawlable copy of the site competing
with itself. `src/middleware.ts` issues a `308` from any `*.vercel.app` host to
the canonical domain in production, so only one version is ever indexed.

Behind Cloudflare, keep SSL/TLS on **Full (strict)** and leave the Vercel
`CNAME` proxied or unproxied as you prefer — the redirect is host-based, not
proxy-dependent.

### Sitemap

`src/app/sitemap.ts` is built from the content repository **using the guest
viewer** — the same filter the pages apply. An internal procedure cannot appear
in the sitemap even by accident, because the repository never returns it for
that viewer.

`lastModified` uses each record's real review date, not the build time, so a
crawler can tell which procedures actually changed.

### Titles and descriptions

Every route sets its own. The pattern throughout is to say in plain words what
the thing is and who it is for, because that is the sentence an answer engine
will lift. "Guided decision trees that take a Help Desk technician from a vague
symptom to a specific next step" is extractable; "Powerful troubleshooting
tools" is not.

Title template is `%s · learnIT`, with the homepage owning the bare product
name.

### Social images

`src/app/opengraph-image.tsx` renders a real **PNG at 1200×630** via `next/og`
at build time. SVG is not an option — several platforms and answer engines will
not render it. `twitter-image.tsx` re-exports the same renderer rather than
maintaining a second design that would drift.

### Semantics and accessibility

- One `<h1>` per page; `<h2>`/`<h3>` follow the real outline.
- Real `<nav>`, `<main id="main">`, `<footer>`, and a skip link.
- Every narrative word on the landing page is DOM above the canvas, so the story
  reads with JavaScript disabled and is fully available to screen readers.
- The `alt` field is **required** by the image block schema — a screenshot with
  no alt text fails content validation.
- Contrast is verified against WCAG AA for every text/surface pairing in both
  themes; the lowest passing ratio in the palette is 4.74:1.
- Decorative SVG and icons carry `aria-hidden`; interactive elements are
  keyboard-reachable with a single consistent focus ring.

### Performance

- Three.js, React Three Fiber, and Lenis are code-split and only requested by
  visitors who will actually see the cinematic experience.
- The entire demo tree is statically generated — no server work per request.
- Fonts self-host at build time via `next/font`, so there is **no external
  request at runtime at all**: no CDN, no analytics, no tag manager.
- The scroll handler writes to a ref rather than React state, so scrolling costs
  no re-render.
- Reserved dimensions and static rendering keep cumulative layout shift at zero
  on the pages that matter.

---

## Checklist for a new deployment

- [ ] `NEXT_PUBLIC_SITE_URL` set to the real domain in Vercel
- [ ] Custom domain added in Vercel, DNS pointed via Cloudflare
- [ ] `https://learnit.rianfernando.com/robots.txt` reachable
- [ ] `https://learnit.rianfernando.com/llms.txt` reachable and `text/plain`
- [ ] `https://learnit.rianfernando.com/sitemap.xml` reachable
- [ ] Sitemap submitted in Google Search Console and Bing Webmaster Tools
- [ ] Rich Results Test passes for `WebApplication` and `FAQPage`
- [ ] A `*.vercel.app` URL `308`s to the canonical domain
- [ ] Project linked from https://rianfernando.com/projects
