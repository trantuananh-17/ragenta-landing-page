# Current State

Last verified: 2026-08-30, against the deployed v0.1.0rc1.

Read this first in a new session. Keep it honest — if you find reality differs,
fix this file in the same change. A stale STATE.md is worse than none.

## What is built

Every route listed here renders, in both locales, and was checked against the
standalone production server — not just the dev server.

| Route | Notes |
| --- | --- |
| `/` | hero, providers, trust strip, 4 feature sections, testimonials, blog highlights, CTA |
| `/product` | hero dashboard, surfaces, understands, lifecycle, capabilities, extend, changelog strip |
| `/solutions` | hero + sticky scroll frame with 8 interactive demo panels + closing |
| `/pricing` | 4 plans with a monthly/yearly toggle, notes, FAQ (also emitted as FAQPage JSON-LD) |
| `/contact` | form posting to `/api/contact`, rotating testimonial |
| `/changelog` | full timeline from the content layer, sticky version index that scroll-spies the entries |
| `/blog`, `/blog/[slug]` | search, pagination, related posts, markdown bodies |
| `/privacy-policy`, `/terms-of-service` | markdown from the content layer |
| `/robots.txt`, `/sitemap.xml`, `/llms.txt` | 30 sitemap URLs with hreflang alternates |
| `/[lang]/opengraph-image` | rendered by Satori, Vietnamese subset fetched per title |
| `/api/*` | announcement, catalogue, posts, site-metadata, contact, health |

Also working: locale detection and the `NEXT_LOCALE` override, UTM/click-id
attribution cookies set in the proxy, the light/dark toggle with no hydration
flicker, self-referencing canonicals plus `en`/`vi`/`x-default` hreflang, and
JSON-LD for Organization, WebSite, FAQPage and BlogPosting.

## What is NOT built

- **No content backend.** Everything is served from `src/content/fixtures/`.
  See `.claude/rules/content.md` — flipping to a real API is one env var.
- **No tests.** `pnpm build` (TypeScript) and `pnpm lint` (React Compiler and
  hooks rules) are the whole gate.
- **No `CONTACT_WEBHOOK_URL`**, so `/api/contact` answers 503. The form shows
  the error correctly; it just cannot deliver anywhere yet.
- **No analytics.** PostHog is wired but env-gated, and `POSTHOG_KEY` is unset,
  so it is not loaded at all.
- **No `ragenta-frontend.ragenta.cloud`.** Every signup CTA points at
  `APP_URL/signup`, which does not exist yet. The buttons work; the destination 404s.
- No cookie banner, no search, no author pages, no RSS.

## Known gaps and open questions

1. **Staging is the only environment.** There is no production VM, no production
   GitHub Environment, and no production domain. `SITE_URL` falls back to
   `http://localhost:3000` on purpose: staging sets its own, and an environment
   that forgets to set it should produce obviously broken URLs rather than
   plausible ones pointing at a host nobody owns. `environments/production` in
   `ragenta-deployment` is kept in shape-parity with staging but runs nowhere.
2. **Testimonials are illustrative**, not attributed to real customers. Decide
   whether to source real ones or reword them as personas before launch.
3. Blog posts have no author byline and no hero images. The `PostSummary` type
   already carries `heroImageUrl`; nothing populates it.

Settled, so nobody re-opens them:

- **No certification claims.** SOC 2 and ISO 27001 were placeholder copy in the
  trust strip and are gone. Ragenta holds neither, and a certification is a
  third-party attestation that either exists or does not — unlike a product
  claim, it cannot be softened into honesty. What replaced them are four claims
  the software and the terms actually stand behind. Do not put a certification
  back until one is genuinely held. The SOC 2 wording still on /solutions is a
  customer use case — Ragenta assembling *your* evidence package — not a claim
  about Ragenta.
- **The legal documents ship as written.** They are not counsel-reviewed and the
  owner has accepted that for now.

## How to verify a change

    pnpm build      # TypeScript, and it prerenders every route
    pnpm lint       # React Compiler + hooks rules; set-state-in-effect fails here

For anything touching routing, i18n, SEO or the API, also run it for real:

    pnpm build && PORT=8020 node .next/standalone/server.js

then check the behaviour, not just the status code. The checks that caught real
problems while building this:

    curl -sI -H "Accept-Language: vi" localhost:8020/pricing | grep -i location
    curl -s -H "Cookie: ragenta-theme=dark" localhost:8020/en | grep -o '<html[^>]*>'
    curl -s localhost:8020/vi/pricing | grep -o '<link rel="canonical"[^>]*>'
    curl -s "localhost:8020/api/catalogue?locale=vi&search=embedding"

## Layout of the code

    src/app/[lang]/      pages; the layout owns fonts, providers and the theme cookie
    src/app/api/         one Hono app, basePath /api
    src/components/
      sections/          home page sections + the pieces other pages reuse
      product|solutions|blog|changelog|legal/   per-page sections
      ui/                Container, WindowChrome/AppWindow
    src/content/         the content layer; fixtures/ holds what ships today
    src/i18n/            config, dictionaries, useTranslations, LocaleLink
    src/lib/             seo, structured-data, theme, attribution, signup flow, og-image
    src/proxy.ts         locale detection + attribution cookies

## Deployment

**Staging is live at https://staging-ragenta-landing-page.ragenta.cloud**, running
`v0.1.0rc1` since 2026-08-30. It shares a VM with the backend and the
dev-infra datastores — see the workspace `.claude/docs/STATUS.md`.

The compose service (`landing`), the variables and the nginx server block live
in `ragenta-deployment`. This repository only publishes an image and tells the
VM which version to run: the deploy rewrites `IMAGE_TAG_LANDING_PAGE` and
recreates `landing` alone, so it cannot move the backend's version.

Release by tag — `v0.1.0rc1` to staging, `v0.1.0` to production. Rollback is
the manual **Deploy** workflow with the previous tag; no rebuild, no revert.

Production exists as configuration only. There is no production VM, no GitHub
Environment for it, and `SITE_URL` there is a placeholder — see gap 1 above.

### What staging is running with

| Variable | Value | Effect |
| --- | --- | --- |
| `SITE_URL` | the staging host | canonical, hreflang and OG URLs |
| `APP_URL` | from the backend's `APP_BASE_URL` | where signup CTAs go |
| `RAGENTA_CONTENT_API_URL` | `http://content:8084` | reads the content backend |
| `CONTACT_WEBHOOK_URL` | unset | `/api/contact` answers 503 |
| `POSTHOG_KEY` | unset | PostHog is not loaded |

`ragenta-content-backend` is live on staging as of 2026-09-03 and this site reads it —
verified through the public URL: 2 posts and 8 catalogue items from its database rather than the
fixtures' 6 and 26. The URL is a compose-network hostname, not an nginx one, so a server-side read
here costs no public round trip and works even if the proxy is down.

Every content type now comes from the backend, legal documents included. Its seed carries the
whole of what this repository used to ship in `src/content/fixtures/` — 26 catalogue items, 6
posts, 10 changelog entries and both legal documents, in both locales — converted from those
files. The fixtures here stay as the degradation path, not as the source.

An **empty** content backend would not fall back — `normalizeList` returns `null` only on a
malformed payload, and `{"items":[],"total":0}` is well-formed. Seed an environment before
pointing this site at it.

The container gets those and nothing else — deliberately no `env_file`, so the
most exposed container in the environment never sees the database password or
any provider key.
