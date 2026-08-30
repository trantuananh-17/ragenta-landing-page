"use client";

import { motion } from "framer-motion";
import { Container } from "@/components/ui/Container";
import { useSignupFlow } from "@/lib/SignupFlowContext";
import { useTranslations } from "@/i18n/useTranslations";
import { LocaleLink } from "@/i18n/LocaleLink";

export function SolutionsClosing() {
  const { openSignup } = useSignupFlow();
  const { t } = useTranslations("solutions");

  return (
    <section className="border-t border-line-soft py-24">
      <Container width="medium">
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          <blockquote className="mx-auto mb-10 max-w-2xl text-2xl leading-snug font-medium text-ink-muted sm:text-3xl">
            &ldquo;{t("closing.statement")}&rdquo;
          </blockquote>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={() =>
                openSignup({
                  cta_text: "Start for free",
                  cta_location: "solutions_closing",
                  newTab: true,
                })
              }
              className="btn-primary"
            >
              {t("closing.ctaPrimary")}
            </button>
            <LocaleLink href="/contact" className="btn-secondary">
              {t("closing.ctaSecondary")}
            </LocaleLink>
          </div>
        </motion.div>
      </Container>
    </section>
  );
}
