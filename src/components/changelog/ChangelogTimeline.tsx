import { Container } from "@/components/ui/Container";
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
          className="flex items-start gap-2 text-base text-ink-muted"
        >
          <span className="mt-0.5 text-xs text-brand-600">▸</span>
          <span>{bullet}</span>
        </li>
      ))}
    </ul>
  );
}

/**
 * Server component — the full changelog, read through the content layer. The
 * date column is sticky on desktop so the entry stays anchored while its body
 * scrolls, the same behaviour as the vecura timeline.
 */
export async function ChangelogTimeline({ lang }: { lang: Locale }) {
  const [dict, entries] = await Promise.all([
    getDictionary(lang),
    fetchChangelog({ locale: lang }),
  ]);
  const t = dict.changelog;

  return (
    <section className="pb-32">
      <Container className="space-y-16">
        {entries.map((entry) => (
          <div
            key={entry.id}
            className="grid grid-cols-1 gap-x-12 md:grid-cols-[180px_1fr]"
          >
            <div className="mb-4 md:sticky md:top-28 md:mb-0 md:self-start">
              <p className="font-mono text-sm text-ink-subtle">
                {formatDate(entry.date, lang)}
              </p>
              <p className="mt-1 font-mono text-xs tracking-widest text-ink-faint uppercase">
                {t.types[entry.type]}
                {entry.version && (
                  <>
                    <span className="mx-1.5 text-ink-ghost">·</span>
                    <span className="text-brand-600">v{entry.version}</span>
                  </>
                )}
              </p>
            </div>

            <article className="max-w-2xl">
              <h2 className="mb-3 text-2xl leading-tight font-semibold tracking-tight text-ink md:text-3xl">
                {entry.title}
              </h2>
              <p className="text-base leading-relaxed text-ink-muted">
                {entry.excerpt}
              </p>

              {entry.bullets && <Bullets items={entry.bullets} />}

              {entry.sections && entry.sections.length > 0 && (
                <div className="mt-8 space-y-8">
                  {entry.sections.map((section) => (
                    <div key={section.heading}>
                      <h3 className="mb-2 text-lg font-semibold text-ink">
                        {section.heading}
                      </h3>
                      <p className="text-base leading-relaxed text-ink-muted">
                        {section.body}
                      </p>
                      {section.bullets && <Bullets items={section.bullets} />}
                    </div>
                  ))}
                </div>
              )}
            </article>
          </div>
        ))}

        <p className="mt-16 text-center text-sm text-ink-faint">{t.footer}</p>
      </Container>
    </section>
  );
}
