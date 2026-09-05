# ragenta-landing-page

Ragenta's public marketing site: landing page, product, solutions, pricing, blog,
changelog and legal pages. Next.js 16 (App Router), React 19 with the React
Compiler, Tailwind v4, TypeScript strict.

## Commands

```bash
pnpm install
pnpm dev            # dev server (Turbopack) on :3000
pnpm build          # production build (output: "standalone")
pnpm start          # serve the built app on :8020
pnpm lint           # eslint (next/core-web-vitals + next/typescript)
```

There is no test suite yet. `pnpm lint`, `pnpm build` and `pnpm typecheck` are
the whole gate, and `.github/workflows/check.yml` runs the three of them on
every pull request and every push to main. Typecheck runs *after* the build,
because `next build` writes `next-env.d.ts` and `.next/types` — both of which
tsconfig includes, so running it first would typecheck a different program than
the one that ships.

## Releasing

A tag is the release. `v1.2.0` goes to production, `v1.2.0rc1` to staging — the
tag shape is the only thing that selects the environment. `release.yml` re-runs
the check gate, builds the image, pushes it to GHCR under that exact version,
and calls `deploy-template.yml`, which rewrites only this repository's own
`IMAGE_TAG_LANDING_PAGE` line in the VM's `.env` and brings up only the
`landing` service. Nothing else in the shared environment moves.

There is no `latest` and no moving `staging` pointer (ADR-009), so a rollback is
the manual **Deploy** workflow with the previous tag — no rebuild, no revert.

After each deploy the workflow polls `/api/health` on the VM and requires
`{"status":"ok"}`. That route sits under `/api/` deliberately: `src/proxy.ts`
would otherwise redirect a bare `/health` into the locale-prefixed router and
404 it.

`deploy-template.yml` is a copy of the one in `ragenta-backend`, differing only
in the default `health_url`. Keep the two in step — the divergence to avoid is
one repository fixing a deploy bug the other still has.

Docker: `docker compose up --build` builds the standalone image and serves on
:8020. Public config is read at **runtime** (`src/lib/public-env.ts` +
`RuntimeEnvProvider`), never baked into the bundle, so one image runs against
any environment. Copy `.env.example` to `.env` to configure it.

## Where the content comes from

Ragenta has no content backend yet. Rather than hard-coding copy into
components, everything a backend will eventually serve goes through
**`src/content/`**, which already returns API-shaped payloads:

| Module | Serves | Future endpoint |
| --- | --- | --- |
| `content/catalogue.ts` | models, agent tools, connectors | `GET /v1/public/catalogue` |
| `content/posts.ts` | blog list + detail + related | `GET /v1/public/posts[/:slug]` |
| `content/changelog.ts` | changelog entries | `GET /v1/public/changelog` |
| `content/announcement.ts` | the top announcement bar | `GET /v1/public/announcement` |
| `content/legal.ts` | privacy policy, terms | `GET /v1/public/legal/:slug` |
| `content/site-metadata.ts` | docs / community / status URLs | `GET /v1/public/site-metadata/:key` |

`src/content/source.ts` is the single seam. Set `RAGENTA_CONTENT_API_URL` and
`fromApi()` starts answering; the fixtures under `src/content/fixtures/` become
the graceful-degradation path. **No page, component or route handler changes.**

The browser never talks to the content layer directly — it goes through this
site's own `/api/*` routes (`src/app/api/[[...route]]/route.ts`, a Hono app),
so no upstream URL or credential reaches the bundle.

Static UI copy is **not** content: it lives in the i18n dictionaries.

## Architecture

### Internationalization
Locales are `en` / `vi` (`src/i18n/config.ts`), default `en`. i18n is custom,
not next-intl.

- All user-facing routes live under `src/app/[lang]/`; `generateStaticParams`
  in the layout pre-renders both locales.
- `src/proxy.ts` is Next 16 middleware (the handler **must** be a named
  `export function proxy` — a default export is silently ignored). It redirects
  locale-less paths to a detected locale (cookie `NEXT_LOCALE` → `Accept-Language`
  → default) and also captures UTM/click-id attribution into cookies.
- Server components read translations via `getDictionary(locale)`
  (`src/i18n/dictionaries.ts`, `server-only`). `en.json` is the source-of-truth
  shape; `vi.json` must mirror its keys and is cast to `Dictionary`.
- Client components use `useTranslations("namespace")` → `{ t, raw, locale }`.
  `t("key")` prints the key when missing, so gaps are visible.
- **Always use `LocaleLink` (`@/i18n/LocaleLink`) instead of `next/link`** for
  internal navigation. For non-link hrefs use `localizedHref(locale, path)`.
- Adding a translated string means editing **both** dictionary JSONs.

### Theming (light / dark)
Every colour in the site is a semantic token, never a raw Tailwind palette
class. `.dark` re-points the same token names in `globals.css`, so a section
written as `bg-card text-ink` flips without being touched.

Surfaces, outermost first: `page` → `card` → `window` → `chrome` → `panel`,
plus `subtle` (secondary buttons) and `bubble` (chat bubbles). Text is
`ink` / `ink-muted` / `ink-subtle` / `ink-faint` / `ink-ghost`; borders are
`line` / `line-soft` / `line-strong`; the accent is `brand-50…900` + `brand-on`.

Adding a hard-coded `slate-*` or `#fff` to a section breaks dark mode. The only
deliberate exceptions are the terminal/code mockups (dark in both themes) and
the macOS traffic-light dots.

The preference (`light` / `dark` / `system`) is stored in the `ragenta-theme`
cookie. An explicit choice is resolved **server-side** so the markup ships with
the right class; `system` is resolved before first paint by the inline
`THEME_INIT_SCRIPT` in `<head>`. `ThemeContext` reads the media query through
`useSyncExternalStore`, and `ThemeToggle` renders both icons and lets the
`dark:` variant pick one — so nothing theme-dependent can mismatch on hydration.

### SEO
Per-page metadata is built with `pageMetadata(lang, pageKey, path)` and
`hreflangAlternates(path, lang, page?)` (`src/lib/seo.ts`), which generate a
self-referencing canonical plus `en` / `vi` / `x-default` alternates. `path` is
always the un-prefixed route (`"/pricing"`, `"/"`). Search-filtered blog
listings are `noindex`. OG images render from `src/lib/og-image.tsx` through
`src/app/[lang]/opengraph-image.tsx`. `robots.ts`, `sitemap.ts` and
`llms.txt/route.ts` live at `src/app/`. JSON-LD (`Organization`, `WebSite`,
`FAQPage`, `BlogPosting`) is emitted by `src/lib/structured-data.ts`.

### Components
- `components/ui/` — `Container` (the `max-w-7xl px-4/md:px-8` boundary) and
  `WindowChrome` / `AppWindow` (the fake app-window shell the sections are
  built around). Use them rather than re-declaring those widths or chrome.
- `components/sections/` — the home page sections, plus the pieces shared with
  other pages (`CtaButtons`, `Testimonials`, `FinalCTA`, pricing, contact).
- `components/{product,solutions,blog,changelog,legal}/` — per-page sections.
- `components/solutions/demos.tsx` — the eight interactive panels behind the
  sticky frame on /solutions, registered in `DEMO_REGISTRY`.
- `LenisProvider` adds smooth scroll; client interactivity is isolated to
  `"use client"` leaves so pages stay server-rendered.

### Analytics
PostHog (`@posthog/next`) is env-gated: with no `POSTHOG_KEY` it is not loaded
at all. Signup CTAs go through `SignupFlowProvider`
(`src/lib/SignupFlowContext.tsx`): call
`useSignupFlow().openSignup({ cta_text, cta_location })`, which fires a
`cta_click` with the derived page type and attribution params before sending
the visitor to `APP_URL/signup`.

### Path alias
`@/*` → `src/*`.

## Build/runtime notes worth knowing

- `next.config.ts` pins `turbopack.root` and `outputFileTracingRoot` to this
  directory. This repo sits inside a multi-repo workspace; without the pin Next
  can infer a parent directory as the root and break `src/proxy.ts` detection.
  Don't remove these.
- Document responses (`/`, `/:lang`, `/:lang/*`) are sent `no-store` via
  `headers()` to avoid serving stale HTML that references CSS/JS chunks from a
  previous deploy (which causes unstyled first loads). This is intentional.
- The home page is `force-dynamic` so the content env is read at request time;
  a static prerender would bake the fixture answers into the image.
