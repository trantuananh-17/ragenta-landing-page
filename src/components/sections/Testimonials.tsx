"use client";

import { Container } from "@/components/ui/Container";
import { useTranslations } from "@/i18n/useTranslations";

type Quote = { quote: string; name: string; org: string };

/** Initials stand in for a photo — no avatar service, no layout shift. */
function initialsOf(name: string): string {
  return name
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

export function Testimonials() {
  const { t } = useTranslations("home.testimonials");
  const { raw } = useTranslations("testimonials");
  const items = raw<Quote[]>("items") ?? [];

  return (
    <section className="py-16">
      <Container>
        <h2 className="mb-10 text-center text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
          {t("title")}
        </h2>

        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
          {items.map((q, i) => (
            <div
              key={i}
              className="flex flex-col justify-between gap-5 rounded-xl border border-line bg-card p-5"
            >
              <p className="text-sm leading-[1.55] text-ink-muted">
                &ldquo;{q.quote}&rdquo;
              </p>
              <div className="flex items-center gap-2.5">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-100 text-[11px] font-semibold text-brand-600">
                  {initialsOf(q.name)}
                </span>
                <div>
                  <p className="text-sm leading-snug font-semibold text-ink">
                    {q.name}
                  </p>
                  <p className="text-[11px] text-ink-faint">{q.org}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
