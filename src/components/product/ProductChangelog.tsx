import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { fetchChangelog } from "@/content/changelog";
import { getDictionary } from "@/i18n/dictionaries";
import { localizedHref } from "@/i18n/links";
import { formatDate } from "@/lib/format";
import type { Locale } from "@/i18n/config";

/**
 * Server component: the compact "recently shipped" strip, reading the same
 * changelog content the /changelog page renders in full.
 */
export async function ProductChangelog({ lang }: { lang: Locale }) {
  const [dict, entries] = await Promise.all([
    getDictionary(lang),
    fetchChangelog({ locale: lang, limit: 4 }),
  ]);

  if (entries.length === 0) return null;

  return (
    <section className="py-20">
      <Container>
        <h2 className="mb-6 text-2xl font-semibold text-ink">
          {dict.product.changelog.heading}
        </h2>

        <div className="overflow-hidden rounded-2xl bg-card">
          {entries.map((entry, i) => (
            <div
              key={entry.id}
              className={`grid grid-cols-[auto_auto_1fr] items-center gap-3 px-4 py-4 sm:gap-6 sm:px-6 ${
                i > 0 ? "border-t border-line" : ""
              }`}
            >
              <span className="font-mono text-sm font-semibold text-brand-600">
                {entry.version ?? ""}
              </span>
              <span className="font-mono text-xs text-ink-faint">
                {formatDate(entry.date, lang)}
              </span>
              <span className="text-sm text-ink-muted">{entry.title}</span>
            </div>
          ))}
        </div>

        <div className="mt-6">
          <Link
            href={localizedHref(lang, "/changelog")}
            className="text-sm font-medium text-brand-600 transition-colors hover:text-brand-700"
          >
            {dict.product.changelog.seeMore}
          </Link>
        </div>
      </Container>
    </section>
  );
}
