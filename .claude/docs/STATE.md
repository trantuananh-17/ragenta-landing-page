# Current State

Last verified: 2026-08-30.

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
| `/changelog` | full timeline from the content layer |
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
- **No `app.ragenta.*`.** Every signup CTA points at `APP_URL/signup`, which
  does not exist yet. The buttons work; the destination 404s.
- No cookie banner, no search, no author pages, no RSS.

## Known gaps and open questions

1. **The domain is an assumption.** `SITE_URL` defaults to `https://ragenta.ai`
   and the OG/canonical URLs use it. Staging serves
   `ragenta.tranhtuananh-anhtt.site`. Confirm the real production domain before
   launch, then set `SITE_URL` on the environment.
2. **The legal documents are drafting placeholders**, not reviewed text.
   `src/content/fixtures/legal.ts` says so at the top. Replace before launch.
3. **Testimonials are illustrative**, not attributed to real customers. Decide
   whether to source real ones or reword them as personas before launch.
4. **SOC 2 / ISO 27001 appear in the trust strip.** If those certifications do
   not exist yet, that copy has to change — it is a factual claim.
5. Blog posts have no author byline and no hero images. The `PostSummary` type
   already carries `heroImageUrl`; nothing populates it.

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

Staging is `https://ragenta.tranhtuananh-anhtt.site`, on the shared VM described
in the workspace `.claude/docs/STATUS.md`. The compose service and the nginx
server block live in `ragenta-deployment`; this repository only publishes an
image and tells the VM which version to run.

Release by tag: `v0.1.0rc1` goes to staging, `v0.1.0` to production. Rollback is
the manual **Deploy** workflow with the previous tag — no rebuild, no revert.
