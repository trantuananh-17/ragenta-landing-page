"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "@/i18n/useTranslations";
import { cn } from "@/lib/utils";

export type ChangelogRailItem = {
  id: string;
  version: string | null;
  type: string;
  date: string;
};

/**
 * Floating version index beside the timeline.
 *
 * Anchors are plain links: LenisProvider is configured with `anchors`, so it
 * already scrolls smoothly and honours the entry's `scroll-margin`. Handling
 * the click here would fight both.
 */
export function ChangelogVersionRail({ items }: { items: ChangelogRailItem[] }) {
  const { t } = useTranslations("changelog");
  const [activeId, setActiveId] = useState(items[0]?.id ?? "");

  useEffect(() => {
    const elements = items
      .map((item) => document.getElementById(item.id))
      .filter((element): element is HTMLElement => element !== null);
    if (elements.length === 0) return;

    // The same reading band the blog table of contents uses: an entry becomes
    // current when it reaches reading position, not when it first appears at
    // the bottom of the screen.
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActiveId(entry.target.id);
        }
      },
      { rootMargin: "-20% 0px -65% 0px" },
    );
    for (const element of elements) observer.observe(element);

    return () => observer.disconnect();
  }, [items]);

  if (items.length === 0) return null;

  return (
    <aside className="hidden lg:block">
      <nav
        aria-label={t("versions.label")}
        className="sticky top-28 rounded-2xl border border-line bg-card p-5 shadow-[var(--shadow-window)]"
      >
        <div className="mb-4 flex items-baseline justify-between gap-2">
          <p className="font-mono text-xs tracking-widest text-ink-faint uppercase">
            {t("versions.heading")}
          </p>
          <span className="font-mono text-xs text-ink-ghost">
            {items.length}
          </span>
        </div>

        <ol className="relative">
          <span
            aria-hidden
            className="absolute top-3 bottom-3 left-[5px] w-px bg-line"
          />
          {items.map((item) => {
            const isActive = item.id === activeId;
            return (
              <li key={item.id}>
                <a
                  href={`#${item.id}`}
                  aria-current={isActive ? "true" : undefined}
                  className="group flex items-center gap-3 rounded-lg py-1.5 pr-2 transition-colors hover:bg-subtle"
                >
                  <span
                    className={cn(
                      "relative z-10 size-[11px] shrink-0 rounded-full border-2 transition-colors",
                      isActive
                        ? "border-brand-600 bg-brand-600"
                        : "border-line-strong bg-page group-hover:border-brand-400",
                    )}
                  />
                  <span className="min-w-0 flex-1">
                    <span
                      className={cn(
                        "block truncate font-mono text-sm transition-colors",
                        isActive
                          ? "font-semibold text-brand-600"
                          : "text-ink-muted group-hover:text-ink",
                      )}
                    >
                      {item.version ? `v${item.version}` : item.type}
                    </span>
                    <span className="block truncate font-mono text-xs text-ink-faint">
                      {item.date}
                    </span>
                  </span>
                </a>
              </li>
            );
          })}
        </ol>

        <p className="mt-4 border-t border-line-soft pt-3 text-xs leading-5 text-ink-faint">
          {t("versions.hint")}
        </p>
      </nav>
    </aside>
  );
}
