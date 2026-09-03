"use client";

import { motion } from "framer-motion";
import { Container } from "@/components/ui/Container";
import { useTranslations } from "@/i18n/useTranslations";

export function ChangelogHero() {
  const { t } = useTranslations("changelog");
  return (
    <section className="pt-32 pb-12">
      <Container className="text-center">
        <div className="mx-auto max-w-3xl">
          <motion.p
            className="mb-4 font-mono text-sm tracking-widest text-brand-600 uppercase"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            {t("eyebrow")}
          </motion.p>
          <motion.h1
            className="mb-4 text-3xl leading-[1.1] font-semibold tracking-tight text-ink sm:text-4xl md:text-5xl"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.05 }}
          >
            {t("heroTitle")}
          </motion.h1>
          <motion.p
            className="mx-auto max-w-2xl text-base leading-relaxed text-ink-subtle sm:text-lg"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            {t("heroSubtitle")}
          </motion.p>
        </div>
      </Container>
    </section>
  );
}
