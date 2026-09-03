import { Container } from "@/components/ui/Container";
import {
  ChangelogVersionRail,
  type ChangelogRailItem,
} from "@/components/changelog/ChangelogVersionRail";
import { fetchChangelog } from "@/content/changelog";
import { getDictionary } from "@/i18n/dictionaries";
import { formatDate } from "@/lib/format";
import type { Locale } from "@/i18n/config";

function Bullets({ items }: { items: string[] }) {
  return (
    <ul className="mt-3 space-y-2">
      {items.map((bullet) => (
        <li
          key={bullet}
          className="flex items-start gap-3 text-[0.9375rem] leading-6 text-ink-muted"
        >
          <span
            aria-hidden
            className="mt-2 size-1.5 shrink-0 rounded-full bg-brand-400"
          />
          <span>{bullet}</span>
        </li>
      ))}
    </ul>
  );
}

/**
 * Server component — the full changelog, read through the content layer. Each
 * entry hangs off a single continuous rail and carries the `id` the version
 * index on the right scrolls to.
 */
export async function ChangelogTimeline({ lang }: { lang: Locale }) {
  const [dict, entries] = await Promise.all([
    getDictionary(lang),
    fetchChangelog({ locale: lang }),
  ]);
  const t = dict.changelog;

  const railItems: ChangelogRailItem[] = entries.map((entry) => ({
    id: entry.id,
    version: entry.version,
    type: t.types[entry.type],
    date: formatDate(entry.date, lang),
  }));

  return (
    <section className="pb-32">
      <Container className="grid grid-cols-1 gap-x-16 lg:grid-cols-[minmax(0,1fr)_17rem]">
        <div>
          {entries.map((entry, index) => (
            <article
              key={entry.id}
              id={entry.id}
              className="relative scroll-mt-28 border-l border-line pb-14 pl-6 sm:pl-10"
            >
              <span
                aria-hidden
                className="absolute top-1 -left-[5px] flex size-[11px]"
              >
                {index === 0 && (
                  <span className="absolute inline-flex size-full animate-ping rounded-full bg-brand-500 opacity-60" />
                )}
                <span className="relative inline-flex size-[11px] rounded-full border-2 border-page bg-brand-600" />
              </span>

              <div className="max-w-2xl">
                <div className="mb-3 flex flex-wrap items-center gap-x-2.5 gap-y-2 text-xs">
                  {entry.version && (
                    <span className="rounded-full bg-brand-600 px-2.5 py-1 font-mono font-semibold tracking-wide text-brand-on">
                      v{entry.version}
                    </span>
                  )}
                  <span className="rounded-full border border-line bg-subtle px-2.5 py-1 font-mono tracking-widest text-ink-muted uppercase">
                    {t.types[entry.type]}
                  </span>
                  <time
                    dateTime={entry.date}
                    className="font-mono text-ink-faint"
                  >
                    {formatDate(entry.date, lang)}
                  </time>
                  {index === 0 && (
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-ok-line bg-ok-soft px-2.5 py-1 font-mono tracking-widest text-ok uppercase">
                      <span
                        aria-hidden
                        className="size-1.5 animate-pulse rounded-full bg-ok"
                      />
                      {t.latest}
                    </span>
                  )}
                </div>

                <h2 className="mb-2 text-xl leading-snug font-semibold tracking-tight text-ink sm:text-2xl">
                  {entry.title}
                </h2>
                <p className="text-base leading-7 text-ink-muted">
                  {entry.excerpt}
                </p>

                {entry.bullets && <Bullets items={entry.bullets} />}

                {entry.sections && entry.sections.length > 0 && (
                  <div className="mt-6 space-y-6 border-l-2 border-line-soft pl-5">
                    {entry.sections.map((section) => (
                      <div key={section.heading}>
                        <h3 className="mb-1.5 text-base font-semibold text-ink">
                          {section.heading}
                        </h3>
                        <p className="text-[0.9375rem] leading-7 text-ink-muted">
                          {section.body}
                        </p>
                        {section.bullets && <Bullets items={section.bullets} />}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </article>
          ))}

          <div className="relative pl-6 sm:pl-10">
            <span
              aria-hidden
              className="absolute top-0.5 -left-[5px] size-[11px] rounded-full border-2 border-page bg-line-strong"
            />
            <p className="text-sm text-ink-faint">{t.footer}</p>
          </div>
        </div>

        <ChangelogVersionRail items={railItems} />
      </Container>
    </section>
  );
}
