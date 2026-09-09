import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { CatalogueCard } from "@/components/catalogue/CatalogueCard";
import { Markdown } from "@/components/Markdown";
import { CtaButtons } from "@/components/sections/CtaButtons";
import { Container } from "@/components/ui/Container";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import { localizedHref } from "@/i18n/links";
import type { CatalogueItemDetail } from "@/content/types";

/**
 * One model, tool or connector.
 *
 * The page answers four questions in the order somebody asks them: what is it,
 * what is it good at, what does it cost me, and what else is like it. The spec
 * table is the second of those — it is the part a reader scans before deciding
 * whether the prose is worth reading.
 */
export function CatalogueDetail({
  item,
  lang,
  t,
}: {
  item: CatalogueItemDetail;
  lang: Locale;
  t: Dictionary["catalogue"];
}) {
  return (
    <>
      <article className="pt-32 pb-16">
        <Container width="medium">
          <Link
            href={localizedHref(lang, "/catalogue")}
            className="mb-8 inline-flex items-center gap-1.5 text-sm font-medium text-ink-subtle transition-colors hover:text-brand-600"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            {t.backToCatalogue}
          </Link>

          <div className="mb-4 flex flex-wrap items-center gap-1.5">
            {item.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-brand-50 px-2.5 py-1 text-xs font-medium text-brand-600"
              >
                {tag}
              </span>
            ))}
            {item.featured ? (
              <span className="rounded-full bg-brand-600 px-2.5 py-1 text-xs font-semibold text-brand-on">
                {t.featured}
              </span>
            ) : null}
          </div>

          <h1 className="mb-4 text-3xl leading-[1.15] font-semibold tracking-tight text-ink sm:text-4xl">
            {item.name}
          </h1>

          <p className="mb-10 max-w-2xl text-lg leading-relaxed text-ink-muted">
            {item.desc}
          </p>

          <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_18rem]">
            <div className="min-w-0">
              {item.body ? (
                <Markdown>{item.body}</Markdown>
              ) : (
                <p className="text-ink-subtle">{t.noBody}</p>
              )}
            </div>

            {item.specs.length > 0 ? (
              <aside className="h-fit rounded-2xl bg-card p-6">
                <h2 className="mb-4 text-xs font-semibold tracking-widest text-ink-faint uppercase">
                  {t.specsTitle}
                </h2>
                <dl className="space-y-3.5">
                  {item.specs.map((spec) => (
                    <div key={spec.label}>
                      <dt className="text-xs font-medium text-ink-faint">
                        {spec.label}
                      </dt>
                      <dd className="mt-0.5 text-sm font-medium text-ink">
                        {spec.value}
                      </dd>
                    </div>
                  ))}
                </dl>
              </aside>
            ) : null}
          </div>
        </Container>
      </article>

      <section className="pb-16">
        <Container width="narrow">
          <div className="rounded-2xl bg-card p-8 text-center md:p-10">
            <h2 className="mb-3 text-2xl font-semibold tracking-tight text-ink">
              {t.ctaTitle.replace("{name}", item.name)}
            </h2>
            <p className="mx-auto mb-7 max-w-md text-ink-subtle">{t.ctaBody}</p>
            <CtaButtons location="catalogue_detail_cta" />
          </div>
        </Container>
      </section>

      {item.related.length > 0 ? (
        <section className="pb-24">
          <Container>
            <h2 className="mb-6 text-2xl font-semibold tracking-tight text-ink">
              {t.relatedTitle}
            </h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {item.related.map((related) => (
                <CatalogueCard
                  key={related.id ?? related.name}
                  item={related}
                  lang={lang}
                  featuredLabel={t.featured}
                />
              ))}
            </div>
          </Container>
        </section>
      ) : null}
    </>
  );
}
