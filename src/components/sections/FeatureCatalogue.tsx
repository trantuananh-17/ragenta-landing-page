"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Search } from "lucide-react";
import { usePostHog } from "@posthog/next";
import { Container } from "@/components/ui/Container";
import { WindowChrome } from "@/components/ui/WindowChrome";
import { getAttributionProps } from "@/lib/attribution";
import { LocaleLink } from "@/i18n/LocaleLink";
import { useTranslations } from "@/i18n/useTranslations";
import { fetchCatalogueClient } from "@/content/client";
import type { CatalogueItem, CatalogueResult } from "@/content/types";

const SEARCH_DEBOUNCE_MS = 300;

/**
 * The catalogue is rendered from `initial` (fetched server-side) and then
 * searched live through `/api/catalogue`. Both paths resolve through
 * `src/content/catalogue.ts`, so this component is unaffected by whether the
 * data currently comes from the fixtures or from the content backend.
 */
export function FeatureCatalogue({ initial }: { initial: CatalogueResult }) {
  const posthog = usePostHog();
  const { t, locale } = useTranslations("home.featureCatalogue");

  const [query, setQuery] = useState("");
  const [items, setItems] = useState<CatalogueItem[]>(initial.items);
  const [total, setTotal] = useState(initial.total);
  const [totalPages, setTotalPages] = useState(initial.totalPages);
  const [page, setPage] = useState(initial.page);
  const [loading, setLoading] = useState(false);
  const [errored, setErrored] = useState(false);

  const abortRef = useRef<AbortController | null>(null);
  const reqIdRef = useRef(0);
  const didMountRef = useRef(false);

  const trackCTA = useCallback(
    (cta_text: string, cta_location: string, destination_url: string) => {
      posthog?.capture("cta_click", {
        cta_text,
        cta_location,
        page_type: "home",
        destination_url,
        form_id: "catalogue_explore",
        ...getAttributionProps(),
      });
    },
    [posthog],
  );

  const load = useCallback(
    async (search: string, nextPage: number) => {
      const reqId = ++reqIdRef.current;
      abortRef.current?.abort();
      const ac = new AbortController();
      abortRef.current = ac;
      setLoading(true);

      try {
        const data = await fetchCatalogueClient({
          locale,
          search,
          page: nextPage,
          signal: ac.signal,
        });
        if (reqId !== reqIdRef.current) return; // a newer request superseded this
        setItems(data.items);
        setTotal(data.total);
        setTotalPages(data.totalPages);
        setPage(data.page);
        setErrored(false);
      } catch (err) {
        if ((err as Error).name === "AbortError") return;
        // Keep the previous results on a mid-session failure; just flag it.
        if (reqId === reqIdRef.current) setErrored(true);
      } finally {
        if (reqId === reqIdRef.current) setLoading(false);
      }
    },
    [locale],
  );

  // Debounced live search — resets to page 1. Skips the first render since the
  // initial (empty-query) page is already provided by the server.
  useEffect(() => {
    if (!didMountRef.current) {
      didMountRef.current = true;
      return;
    }
    const timer = setTimeout(() => load(query, 1), SEARCH_DEBOUNCE_MS);
    return () => clearTimeout(timer);
  }, [query, load]);

  const goToPage = (p: number) => {
    if (p < 1 || p > totalPages || loading) return;
    load(query, p);
  };

  const trimmed = query.trim();
  const counterText = trimmed
    ? t(total === 1 ? "counterResult" : "counterResults", {
        count: total,
        query: trimmed,
      })
    : t("counterTotal", { count: total });

  return (
    /* Layer 1: page background visible as the gap between sections */
    <section className="py-16">
      {/* Layer 2: section wrapper card */}
      <Container>
        <div className="overflow-hidden rounded-3xl bg-card">
          <div className="grid grid-cols-1 items-stretch lg:grid-cols-[3fr_2fr]">
            {/* Layer 3: desktop wrapper */}
            <motion.div
              className="flex items-center p-3 max-md:!bg-none max-lg:order-last sm:p-8 lg:p-10"
              style={{ background: "var(--wallpaper-a)" }}
              initial={{ opacity: 0, x: -24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              {/* Layer 4: app window */}
              <div className="w-full overflow-hidden rounded-xl bg-window shadow-[var(--shadow-window)] ring-1 ring-[var(--ring-window)]">
                <WindowChrome title={t("windowTitle")} />

                <div className="p-5">
                  <div className="mb-3">
                    <p className="text-sm font-bold text-ink">
                      {t("panelTitle")}
                    </p>
                    <p className="mt-0.5 text-xs text-ink-subtle">
                      {t("panelSubtitle")}
                    </p>
                  </div>

                  <div className="relative mb-3">
                    <Search
                      className="pointer-events-none absolute top-1/2 left-3 h-3.5 w-3.5 -translate-y-1/2 text-ink-faint"
                      aria-hidden="true"
                    />
                    <input
                      type="text"
                      placeholder={t("searchPlaceholder")}
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      className="w-full rounded-lg border border-line bg-window py-2 pr-4 pl-9 text-sm text-ink-muted transition-colors placeholder:text-ink-faint focus:border-brand-400 focus:ring-2 focus:ring-brand-500/25 focus:outline-none"
                    />
                  </div>

                  <div
                    data-lenis-prevent
                    className={`grid max-h-[340px] min-h-[340px] grid-cols-1 content-start gap-2 overflow-y-auto transition-opacity duration-150 sm:grid-cols-3 ${
                      loading ? "opacity-60" : "opacity-100"
                    }`}
                  >
                    {items.map((item) => {
                      const inner = (
                        <>
                          <div className="mb-1.5 flex items-start justify-between gap-1">
                            <span className="text-xs leading-snug font-bold text-ink">
                              {item.name}
                            </span>
                            {item.featured && (
                              <span className="shrink-0 rounded-full bg-brand-600 px-1.5 py-0.5 text-[9px] font-semibold text-brand-on">
                                {t("featured")}
                              </span>
                            )}
                          </div>
                          <p className="mb-2 line-clamp-2 text-[11px] leading-relaxed text-ink-subtle">
                            {item.desc}
                          </p>
                          <div className="flex flex-wrap gap-1">
                            {item.tags.map((tag) => (
                              <span
                                key={tag}
                                className="rounded-full border border-line px-1.5 py-0.5 text-[9px] font-medium text-ink-subtle"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        </>
                      );

                      return item.id ? (
                        <LocaleLink
                          key={item.id}
                          href={`/catalogue/${item.id}`}
                          onClick={() =>
                            trackCTA(
                              `Open catalogue item: ${item.name}`,
                              "feature_catalogue_card",
                              `/catalogue/${item.id}`,
                            )
                          }
                          className="block rounded-lg border border-line bg-window p-3 transition-all duration-150 hover:border-brand-300 hover:shadow-sm"
                        >
                          {inner}
                        </LocaleLink>
                      ) : (
                        <div
                          key={item.name}
                          className="cursor-default rounded-lg border border-line bg-window p-3 transition-all duration-150 hover:border-brand-200 hover:shadow-sm"
                        >
                          {inner}
                        </div>
                      );
                    })}
                    {items.length === 0 && !loading && (
                      <div className="col-span-full flex items-center justify-center text-sm text-ink-faint">
                        {t("noMatch", { query })}
                      </div>
                    )}
                  </div>

                  <div className="mt-2.5 flex items-center justify-between gap-3">
                    <p className="min-w-0 text-xs text-ink-faint">
                      {counterText}
                      {errored && (
                        <span className="text-warn">{t("erroredSuffix")}</span>
                      )}
                    </p>
                    {totalPages > 1 && (
                      <div className="flex shrink-0 items-center gap-2 text-xs text-ink-subtle">
                        <button
                          type="button"
                          onClick={() => goToPage(page - 1)}
                          disabled={page <= 1 || loading}
                          className="rounded-md border border-line bg-window px-2 py-1 transition-colors hover:border-brand-300 disabled:cursor-not-allowed disabled:opacity-40"
                        >
                          {t("prev")}
                        </button>
                        <span className="tabular-nums whitespace-nowrap">
                          {page} / {totalPages}
                        </span>
                        <button
                          type="button"
                          onClick={() => goToPage(page + 1)}
                          disabled={page >= totalPages || loading}
                          className="rounded-md border border-line bg-window px-2 py-1 transition-colors hover:border-brand-300 disabled:cursor-not-allowed disabled:opacity-40"
                        >
                          {t("next")}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Text — sits on the section card */}
            <motion.div
              className="flex flex-col justify-center px-6 py-10 md:px-14 md:py-20"
              initial={{ opacity: 0, x: 16 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.55, delay: 0.08 }}
            >
              <h2 className="mb-4 text-2xl leading-snug font-bold tracking-tight text-ink sm:text-3xl">
                {t("heading")}
              </h2>
              <p className="mb-6 text-[17px] leading-relaxed text-ink-muted">
                {t("description")}
              </p>
              <LocaleLink
                href="/catalogue"
                onClick={() =>
                  trackCTA("Browse the catalogue", "feature_catalogue", "/catalogue")
                }
                className="w-fit text-[15px] font-semibold text-brand-600 transition-colors hover:text-brand-700"
              >
                {t("cta")}
              </LocaleLink>
            </motion.div>
          </div>
        </div>
      </Container>
    </section>
  );
}
