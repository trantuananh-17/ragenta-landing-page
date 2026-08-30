"use client";

import { Container } from "@/components/ui/Container";
import { CtaButtons } from "@/components/sections/CtaButtons";
import { useTranslations } from "@/i18n/useTranslations";

export function FinalCTA() {
  const { t } = useTranslations("home.finalCta");
  return (
    <section className="border-t border-line-soft pt-20 pb-32">
      <Container width="narrow" className="text-center">
        <h2 className="mb-8 text-4xl font-bold tracking-tight text-ink sm:text-5xl">
          {t("title")}
        </h2>
        <CtaButtons location="final_cta" />
      </Container>
    </section>
  );
}
