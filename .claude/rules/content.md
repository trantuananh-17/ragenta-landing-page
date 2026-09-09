# The Content Layer

Ragenta has no content backend yet. The point of `src/content/` is that its
absence costs nothing later: the fetchers already return the payload shape the
API will return, and every page and route handler already goes through them.

## The rule

**Anything a backend will eventually own does not go in a component.**

| Belongs in `src/content/` | Belongs in the i18n dictionaries |
| --- | --- |
| Catalogue entries, blog posts, changelog entries | Section headings, button labels, form labels |
| The announcement bar's text and link | The announcement bar's *dismiss* label |
| Legal documents | The "Legal" eyebrow above them |
| Docs / community / status URLs | Their nav labels |

The test: *would an admin edit this without a deploy?* Yes then it is content.
No then it is a dictionary string.

## The seam

`src/content/source.ts` is the only file that knows whether a backend exists.

    const remote = await fromApi<RawShape>("/v1/public/thing", { locale });
    return (remote ? normalize(remote) : null) ?? localThing(locale);

`fromApi` returns `null` — never throws — when `RAGENTA_CONTENT_API_URL` is
unset, the host is unreachable, or the response is non-2xx. `normalize` returns
`null` on a malformed body. Both funnel into the same fallback, so a broken
backend degrades to the fixtures rather than to a 500.

Going live is one environment variable. Do not add a second switch, a feature
flag, or a `NODE_ENV` branch anywhere else.

## Adding a content type

1. Add its payload type to `src/content/types.ts`, written as the API will
   return it — not as the fixture happens to be shaped.
2. Add `src/content/fixtures/<thing>.ts`. Translatable fields are keyed by
   locale (`Record<Locale, string>`). Non-translatable identifiers — model
   names, slash-command names, version numbers — stay plain.
3. Add `src/content/<thing>.ts` with `server-only` at the top, a `normalize`
   that rejects anything malformed, and a fetcher that tries `fromApi` first.
4. If the browser needs it, add a route in `src/app/api/[[...route]]/route.ts`
   and a caller in `src/content/client.ts`. **The browser never calls the
   upstream directly** — that is what keeps the URL and any future credential
   server-side.
5. Server components read `src/content/*` directly. Do not make a server
   component fetch its own `/api/*` route.

## Fixtures are content, not lorem ipsum

They ship to production until the backend exists, so they are written to be read
by a visitor: real sentences, plausible numbers, both locales. When you edit
one, edit its `vi` entry in the same change.

## Current fixtures

| Module | Fixture | Future endpoint |
| --- | --- | --- |
| `catalogue.ts` | 33 models, tools, connectors, platform capabilities | `GET /v1/public/catalogue[/:slug]` |
| `posts.ts` | 6 blog posts with full markdown bodies | `GET /v1/public/posts[/:slug]` |
| `changelog.ts` | 8 entries | `GET /v1/public/changelog` |
| `announcement.ts` | inline | `GET /v1/public/announcement` |
| `legal.ts` | privacy policy, terms of service | `GET /v1/public/legal/:slug` |
| `site-metadata.ts` | inline | `GET /v1/public/site-metadata/:key` |
