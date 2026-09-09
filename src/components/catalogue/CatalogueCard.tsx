import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { Locale } from "@/i18n/config";
import { localizedHref } from "@/i18n/links";
import type { CatalogueItem } from "@/content/types";

/**
 * One catalogue entry, on the index and in a detail page's "related" strip.
 *
 * An item with no `id` is not linkable. That case only arises if a payload ever
 * arrives without one — the fixtures and the API both carry a slug — so it
 * renders as a plain card rather than a link to nowhere.
 */
export function CatalogueCard({
  item,
  lang,
  featuredLabel,
}: {
  item: CatalogueItem;
  lang: Locale;
  featuredLabel: string;
}) {
  const inner = (
    <>
      <div className="mb-2 flex items-start justify-between gap-2">
        <h3 className="text-base leading-snug font-semibold text-ink">
          {item.name}
        </h3>
        {item.featured ? (
          <span className="shrink-0 rounded-full bg-brand-600 px-2 py-0.5 text-[10px] font-semibold text-brand-on">
            {featuredLabel}
          </span>
        ) : (
          <ArrowUpRight
            className="mt-0.5 h-4 w-4 shrink-0 text-ink-ghost transition-colors group-hover:text-brand-600"
            aria-hidden="true"
          />
        )}
      </div>

      <p className="mb-4 line-clamp-3 text-sm leading-relaxed text-ink-subtle">
        {item.desc}
      </p>

      <div className="mt-auto flex flex-wrap gap-1.5">
        {item.tags.map((tag) => (
          <span
            key={tag}
            className="rounded-full border border-line px-2 py-0.5 text-[10px] font-medium text-ink-subtle"
          >
            {tag}
          </span>
        ))}
      </div>
    </>
  );

  const shell =
    "group flex h-full flex-col rounded-2xl border border-line bg-card p-5 transition-all duration-150";

  if (!item.id) {
    return <div className={shell}>{inner}</div>;
  }

  return (
    <Link
      href={localizedHref(lang, `/catalogue/${item.id}`)}
      className={`${shell} hover:-translate-y-0.5 hover:border-brand-300 hover:shadow-md`}
    >
      {inner}
    </Link>
  );
}
