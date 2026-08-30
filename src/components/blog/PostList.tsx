import Link from "next/link";
import { ChevronLeft, ChevronRight, Search, X } from "lucide-react";
import { PostCard } from "@/components/blog/PostCard";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import { localizedHref } from "@/i18n/links";
import type { PostListResult } from "@/content/types";

const BASE_PATH = "/blog";

function pageHref(page: number, searchQuery: string): string {
  const params = new URLSearchParams();
  if (searchQuery) params.set("search", searchQuery);
  if (page > 1) params.set("page", String(page));
  const query = params.toString();
  return query ? `${BASE_PATH}?${query}` : BASE_PATH;
}

/** First, last, and the window around the current page. */
function visiblePages(currentPage: number, totalPages: number): number[] {
  const pages = new Set([1, totalPages]);
  for (let page = currentPage - 1; page <= currentPage + 1; page += 1) {
    if (page >= 1 && page <= totalPages) pages.add(page);
  }
  return Array.from(pages).sort((a, b) => a - b);
}

export function PostList({
  result,
  pageSize,
  searchQuery = "",
  lang,
  t,
}: {
  result: PostListResult;
  pageSize: number;
  searchQuery?: string;
  lang: Locale;
  t: Dictionary["blogIndex"];
}) {
  const total = result.total;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const currentPage = Math.floor(result.offset / pageSize) + 1;
  const pages = visiblePages(currentPage, totalPages);

  return (
    <div>
      <form
        action={localizedHref(lang, BASE_PATH)}
        className="mb-10 flex flex-row gap-3"
      >
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
            className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-brand-600 px-4 text-sm font-semibold text-brand-on transition-all hover:-translate-y-0.5 hover:bg-brand-700 hover:shadow-lg sm:px-6"
          >
            <Search className="h-4 w-4" aria-hidden="true" />
            <span className="hidden sm:inline">{t.searchButton}</span>
          </button>
          {searchQuery ? (
            <Link
              href={localizedHref(lang, BASE_PATH)}
              aria-label={t.clearSearch}
              className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-subtle px-4 text-sm font-semibold text-ink-muted transition-colors hover:text-brand-600 sm:px-5"
            >
              <X className="h-4 w-4" aria-hidden="true" />
              <span className="hidden sm:inline">{t.clear}</span>
            </Link>
          ) : null}
        </div>
      </form>

      {result.items.length === 0 ? (
        <div className="rounded-2xl bg-card px-6 py-14 text-center">
          <h2 className="text-2xl font-semibold tracking-tight text-ink">
            {searchQuery ? t.emptySearchTitle : t.emptyTitle}
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-ink-subtle">
            {searchQuery
              ? t.emptySearchDescription.replace("{query}", searchQuery)
              : t.emptyDescription}
          </p>
        </div>
      ) : (
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {result.items.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              lang={lang}
              readingTimeLabel={t.readingTime.replace(
                "{count}",
                String(post.readingMinutes),
              )}
            />
          ))}
        </div>
      )}

      {total > 0 && totalPages > 1 ? (
        <nav
          aria-label={t.paginationLabel}
          className="mt-12 flex flex-wrap items-center justify-center gap-2"
        >
          <Link
            href={localizedHref(
              lang,
              pageHref(Math.max(1, currentPage - 1), searchQuery),
            )}
            aria-disabled={currentPage === 1}
            className="inline-flex h-10 items-center gap-2 rounded-xl bg-card px-3 text-sm font-semibold text-ink-muted transition-colors hover:text-brand-600 aria-disabled:pointer-events-none aria-disabled:opacity-45 sm:px-4"
          >
            <ChevronLeft className="h-4 w-4" aria-hidden="true" />
            <span className="hidden sm:inline">{t.previous}</span>
          </Link>

          {pages.map((page, index) => {
            const previous = pages[index - 1];
            const hasGap = previous !== undefined && page - previous > 1;
            return (
              <span key={page} className="inline-flex items-center gap-2">
                {hasGap ? (
                  <span className="px-1 text-sm text-ink-faint" aria-hidden="true">
                    ...
                  </span>
                ) : null}
                <Link
                  href={localizedHref(lang, pageHref(page, searchQuery))}
                  aria-current={page === currentPage ? "page" : undefined}
                  className={`inline-flex h-10 min-w-10 items-center justify-center rounded-xl px-3 text-sm font-semibold transition-colors ${
                    page === currentPage
                      ? "bg-brand-600 text-brand-on"
                      : "bg-card text-ink-muted hover:text-brand-600"
                  }`}
                >
                  {page}
                </Link>
              </span>
            );
          })}

          <Link
            href={localizedHref(
              lang,
              pageHref(Math.min(totalPages, currentPage + 1), searchQuery),
            )}
            aria-disabled={currentPage === totalPages}
            className="inline-flex h-10 items-center gap-2 rounded-xl bg-card px-3 text-sm font-semibold text-ink-muted transition-colors hover:text-brand-600 aria-disabled:pointer-events-none aria-disabled:opacity-45 sm:px-4"
          >
            <span className="hidden sm:inline">{t.next}</span>
            <ChevronRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </nav>
      ) : total > 0 ? (
        <p className="mt-12 text-center text-sm text-ink-subtle">
          {(total === 1 ? t.showingAllOne : t.showingAllOther).replace(
            "{count}",
            String(total),
          )}
        </p>
      ) : null}
    </div>
  );
}
