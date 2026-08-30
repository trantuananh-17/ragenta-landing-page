# Colour and Theming

Every colour in this site is a semantic token. `.dark` in `globals.css`
re-points the same token names, which is the entire mechanism behind the theme
toggle: a section written as `bg-card text-ink` flips without being touched.

**A raw palette class or hex in a section silently breaks dark mode.** It will
look correct in review, because review happens in light mode.

## The tokens

Surfaces, outermost first. This is a real nesting order, not a palette:

| Token | Where it is used |
| --- | --- |
| `page` | the page background |
| `card` | a section wrapper sitting on the page |
| `window` | the fake app window inside a section |
| `chrome` | that window's title bar |
| `panel` | a panel inside the window |
| `subtle` | secondary buttons, chips |
| `bubble` | the user's message bubble in a chat mockup |

Text, strongest to faintest: `ink`, `ink-muted`, `ink-subtle`, `ink-faint`,
`ink-ghost`. Plus `ink-inverse` for text on a solid brand fill.

Borders: `line`, `line-soft`, `line-strong`.

Brand: `brand-50` through `brand-900`, plus `brand-on` for text on a brand fill.
In dark mode `brand-50/100/200` become translucent washes and `brand-500/600/700`
lighten, so `text-brand-600` stays readable on a dark ground with no `dark:`
override at the call site.

Status: `ok`, `warn`, `bad`, each with a `-soft` background and a `-line` border.

Decoration: `--wallpaper-a/b/c` (the gradients behind app windows),
`--spotlight`, `--shadow-window`, `--shadow-hero`, `--ring-window`, `--scrim`.

## The two legitimate exceptions

Both are already in the tree. Do not add a third without saying why.

1. **Terminal and code mockups** — `#14121d` with `text-slate-200` and friends.
   A code editor is dark in both themes; that is the point of the mockup.
2. **macOS traffic-light dots** — `#ff5f57`, `#febc2e`, `#28c840`. They are the
   same colours in both themes on a real Mac.

The rotating industry accents on the solutions hero are also literal, because
they are a deliberate four-colour cycle rather than a themed surface.

## How the preference is resolved

Stored in the `ragenta-theme` cookie: `light`, `dark`, or `system`.

- An explicit `dark` is read **server-side** in the layout, so the markup ships
  with the class already on `html` and there is nothing to correct after
  hydration.
- `system` can only be answered by the browser, so `THEME_INIT_SCRIPT` runs
  inline in `head` and stamps the class before first paint.
- `ThemeContext` reads the media query through `useSyncExternalStore`. Its only
  effect syncs the class to the DOM.
- `ThemeToggle` renders **both** icons and lets the `dark:` variant pick one.

That last point is the rule: **never gate theme-dependent markup on a `mounted`
flag.** Under the `system` preference the server would render one thing and the
client another, which is a hydration mismatch and a visible flicker. Swap with
the `dark:` variant instead.

## Adding a colour

Add it to `:root` and to `.dark` in `globals.css`, then expose it in the
`@theme inline` block so Tailwind generates the utilities. Never introduce a
one-off hex in a component.
