# Decisions

Why the code looks the way it does. Read this before proposing a change that
cuts across the codebase — most of these were the second thing tried, not the
first.

## D-1 · Content goes through a seam, not into components

**Decision.** Anything a backend will eventually own is served by
`src/content/`, whose fetchers return API-shaped payloads and fall back to
fixtures. `RAGENTA_CONTENT_API_URL` is the only switch.

**Why.** The obvious alternative — write the copy into the JSX now, extract it
later — makes "later" a rewrite of every section instead of a change to one
file. The cost of doing it this way up front was a day; the cost of undoing it
later grows with every section added.

**Consequence.** Fixtures ship to production and must read like real content in
both locales, not like placeholders.

## D-2 · Colour is a semantic token, everywhere

**Decision.** No raw Tailwind palette class or hex in a section. `.dark`
re-points token names.

**Why.** The reference site is light-only, so cloning its markup verbatim would
have meant a `dark:` variant on almost every element — hundreds of them, each a
place to forget one. Tokens move that to one file and make dark mode the default
state of every new section rather than something to remember.

**Consequence.** Adding a colour means editing `globals.css`, not the component.

## D-3 · The theme never depends on a `mounted` flag

**Decision.** An explicit preference is resolved server-side; `system` is
resolved before paint by an inline script; `ThemeToggle` renders both icons and
lets `dark:` choose.

**Why.** The usual `const [mounted, setMounted] = useState(false)` pattern
renders nothing (or the wrong icon) on the first paint, which is a visible
flicker on every page load. It also trips the React Compiler's
`set-state-in-effect` rule, which this repo treats as an error rather than
disabling.

## D-4 · i18n is custom, and `en` / `vi`

**Decision.** Hand-rolled dictionaries and a `[lang]` segment, matching the
reference's approach rather than adopting next-intl.

**Why.** The whole surface used here is `t()`, `raw()` and a locale-aware link.
next-intl would add a dependency, a config format and a middleware to learn, for
features this site does not use. `en.json` typing the dictionary gives the one
guarantee that matters — a missing `vi` key is a type error at the call site.

## D-5 · The hero shows an answer, not a video

**Decision.** Where the reference frames a product demo video, this site frames
a static answer with its citations.

**Why.** There is no demo video, and a placeholder thumbnail in the most
prominent slot on the site is worse than no video. The citation panel also
happens to be the clearest possible statement of what the product does, so the
substitution is an improvement rather than a compromise.

## D-6 · The browser never calls the content backend directly

**Decision.** Client components fetch from this site's own `/api/*` routes,
which resolve through `src/content/`.

**Why.** Keeps the upstream URL and any future credential server-side, gives one
place to add caching, rate limiting or a circuit breaker, and means the client
cannot tell whether an answer came from a fixture or a real API.

## D-7 · The reference is read, never vendored

**Decision.** `vecura-landing-page/` stays a gitignored local clone, excluded
from tsconfig, eslint, Docker and Next's file tracing.

**Why.** Workspace ADR-012. Vendoring it would drag another product's naming,
dependencies and security assumptions into this repo, and every future reader
would have to work out which half is ours.

## D-8 · No `latest`, ever

**Decision.** Releases are immutable version tags in GHCR; environments pin an
exact version in `.env`.

**Why.** Workspace ADR-009. It makes a rollback a re-deploy of the previous tag
rather than a revert commit and a rebuild, and it stops `docker compose pull`
from silently upgrading something nobody asked to upgrade.

## D-9 · The content window is 300s, and it lives in `fromApi`

**Decision.** Content freshness comes from one place: the `next: { revalidate:
CONTENT_REVALIDATE_SECONDS }` on the fetch in `src/content/source.ts`. An edit in
`ragenta-content-backend` reaches the site within about five minutes. There is no
on-demand revalidation.

**Why the delay is wanted.** Every visitor and every crawler would otherwise be a
round trip to the content backend, which makes the marketing site's availability
depend on it — the seam in D-1 exists so that it does not. An indexable page
should also be stable between fetches: without a window, the HTML Googlebot sees
is a function of when it asked, and an edit mid-crawl gets half the old page and
half the new one indexed. Five minutes is also long enough to notice a mistake in
the content backend before it is what search engines have.

**Where the window is NOT.** Not in the pages. Every route under `[lang]` is
rendered per request, because the layout reads the theme cookie — `next build`
marks all of them `ƒ`, including the ones carrying `export const revalidate =
300`. Those exports are inert today. Next's Data Cache is what holds the content,
and it is independent of whether a route renders statically or dynamically.

`force-dynamic` on the home page does **not** defeat it. Next only downgrades a
fetch to `no-store` under `force-dynamic` when the fetch declares no cache
options of its own — `patch-fetch.js`, `noFetchConfigAndForceDynamic`, which
tests `!currentFetchRevalidate`. `fromApi` always declares one.

This is worth writing down because it is the opposite of what the route table
suggests. Do not "fix" the window by adding `revalidate` to a page, and do not
assume removing `force-dynamic` changes how fresh content is.

**Rejected.** On-demand revalidation — the content backend calling an
`/api/revalidate` route on publish, which is what the reference service does.
That makes the most exposed container accept an authenticated write from another
service, a new attack surface, to remove a delay we want. Revisit only if editors
find the window genuinely obstructive.

**Consequence.** The Docker build has no `RAGENTA_CONTENT_API_URL`, so anything
prerendered at build time holds fixture content. Today that is only the routes
outside `[lang]`. The fixtures being real content (D-1) is what makes that
acceptable.

Changing the window means changing `CONTENT_REVALIDATE_SECONDS`. The page-level
`revalidate` literals cannot import it, so if they ever start mattering they have
to be changed alongside it.
