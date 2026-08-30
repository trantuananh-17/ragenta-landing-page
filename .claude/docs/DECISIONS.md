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
