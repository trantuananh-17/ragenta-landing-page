import Link from "next/link";
import { Search, X } from "lucide-react";
import { CatalogueCard } from "@/components/catalogue/CatalogueCard";
import { buttonClasses } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import { localizedHref } from "@/i18n/links";
import type { CatalogueItem } from "@/content/types";

const BASE_PATH = "/catalogue";

function filterHref(tag: string | null, searchQuery: string): string {
  const params = new URLSearchParams();
  if (searchQuery) params.set("search", searchQuery);
  if (tag) params.set("tag", tag);
  const query = params.toString();
  return query ? `${BASE_PATH}?${query}` : BASE_PATH;
}

/**
 * The whole catalogue on one page: a search box that submits as a GET, and a
 * tag filter that is a row of links.
 *
 * No client state at all. The catalogue is dozens of entries, not thousands, so
 * the entire list is rendered and filtering is a URL — which makes every filtered
 * view linkable, indexable and reachable with JavaScript off. The home page's
 * live-search panel is the interactive one; this is the reference.
 */
export function CatalogueList({
  items,
  tags,
  activeTag,
  searchQuery,
  lang,
  t,
}: {
  items: CatalogueItem[];
  tags: string[];
  activeTag: string | null;
  searchQuery: string;
  lang: Locale;
  t: Dictionary["catalogue"];
}) {
  return (
    <section className="pb-24">
      <Container>
        <form
          action={localizedHref(lang, BASE_PATH)}
          className="mb-6 flex flex-row gap-3"
        >
          {activeTag ? (
            <input type="hidden" name="tag" value={activeTag} />
          ) : null}
          <label className="relative flex-1">
            <span className="sr-only">{t.searchLabel}</span>
            <Search
              className="pointer-events-none absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-ink-faint"
              aria-hidden="true"
            />
            <input
              type="search"
              name="search"
              defaultValue={searchQuery}
              placeholder={t.searchPlaceholder}
              className="h-12 w-full rounded-xl border border-line bg-window pr-4 pl-11 text-sm text-ink transition-all outline-none placeholder:text-ink-faint focus:border-brand-400 focus:ring-2 focus:ring-brand-500/15"
            />
          </label>
          <div className="flex gap-3">
            <button
              type="submit"
              aria-label={t.searchButton}
              className={buttonClasses({ size: "md", className: "h-12 sm:px-6" })}
            >
              <Search className="h-4 w-4" aria-hidden="true" />
              <span className="hidden sm:inline">{t.searchButton}</span>
            </button>
            {searchQuery ? (
              <Link
                href={localizedHref(lang, filterHref(activeTag, ""))}
                aria-label={t.clearSearch}
                className={buttonClasses({ variant: "secondary", size: "md", className: "h-12 sm:px-5" })}
              >
                <X className="h-4 w-4" aria-hidden="true" />
                <span className="hidden sm:inline">{t.clear}</span>
              </Link>
            ) : null}
          </div>
        </form>

        <div className="mb-8 flex flex-wrap gap-2">
          <Link
            href={localizedHref(lang, filterHref(null, searchQuery))}
            className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition-colors ${
              activeTag === null
                ? "bg-brand-600 text-brand-on"
                : "bg-subtle text-ink-muted hover:text-brand-600"
            }`}
          >
            {t.allTags}
          </Link>
          {tags.map((tag) => (
            <Link
              key={tag}
              href={localizedHref(lang, filterHref(tag, searchQuery))}
              className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition-colors ${
                activeTag === tag
                  ? "bg-brand-600 text-brand-on"
                  : "bg-subtle text-ink-muted hover:text-brand-600"
              }`}
            >
              {tag}
            </Link>
          ))}
        </div>

        {items.length === 0 ? (
          <div className="rounded-2xl bg-card px-6 py-14 text-center">
            <h2 className="text-2xl font-semibold tracking-tight text-ink">
              {t.emptyTitle}
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-ink-subtle">
              {t.emptyDescription.replace("{query}", searchQuery || activeTag || "")}
            </p>
          </div>
        ) : (
          <>
            <p className="mb-4 text-sm text-ink-faint">
              {t.count.replace("{count}", String(items.length))}
            </p>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {items.map((item) => (
                <CatalogueCard
                  key={item.id ?? item.name}
                  item={item}
                  lang={lang}
                  featuredLabel={t.featured}
                />
              ))}
            </div>
          </>
        )}
      </Container>
    </section>
  );
}
