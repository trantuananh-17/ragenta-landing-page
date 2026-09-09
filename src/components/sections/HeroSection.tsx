"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Container } from "@/components/ui/Container";
import { CtaButtons } from "@/components/sections/CtaButtons";
import { WindowChrome } from "@/components/ui/WindowChrome";
import { useTranslations } from "@/i18n/useTranslations";

const WORD_INTERVAL_MS = 2500;

/**
 * The product surface shown under the headline: a live-looking answer with its
 * citations, which is the one thing the whole product is about.
 */
function HeroAnswerPreview() {
  const { t, raw } = useTranslations("home.preview");
  const sources = raw<string[]>("sources");

  return (
    <div className="w-full overflow-hidden rounded-xl bg-window shadow-[var(--shadow-window)] ring-1 ring-[var(--ring-window)]">
      <WindowChrome title={t("windowTitle")} />

      <div className="space-y-4 p-5 sm:p-6">
        <div className="flex justify-end">
          <div className="max-w-md rounded-2xl rounded-tr-sm bg-bubble px-4 py-2.5 text-left text-sm text-ink-muted">
            {t("question")}
          </div>
        </div>

        <div className="rounded-xl bg-panel p-4 text-left sm:p-5">
          <p className="text-sm leading-relaxed text-ink-muted">
            <span className="font-semibold text-ink">{t("answerLead")}</span>{" "}
            {t("answerRest")}
          </p>

          <div className="mt-4 border-t border-line-soft pt-3">
            <p className="mb-2 font-mono text-[10px] tracking-widest text-ink-faint uppercase">
              {t("sourcesLabel")}
            </p>
            <div className="space-y-1.5">
              {sources.map((source, i) => (
                <div key={source} className="flex items-center gap-2">
                  <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-sm bg-brand-100 font-mono text-[10px] font-semibold text-brand-600">
                    {i + 1}
                  </span>
                  <span className="truncate text-[11px] text-ink-subtle">
                    {source}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 rounded-xl border border-line bg-window px-4 py-3">
          <span className="flex-1 truncate text-left text-sm text-ink-faint">
            {t("composer")}
          </span>
          <span className="shrink-0 font-mono text-xs text-ink-faint">⌘↵</span>
        </div>

        <div className="flex items-center gap-2 text-left font-mono text-[11px] text-ink-faint">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-ok" />
          {t("grounded")}
        </div>
      </div>
    </div>
  );
}

export function HeroSection() {
  const { t, raw } = useTranslations("home.hero");
  const words = raw<string[]>("words");
  const [wordIndex, setWordIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(
      () => setWordIndex((i) => (i + 1) % words.length),
      WORD_INTERVAL_MS,
    );
    return () => clearInterval(id);
  }, [words.length]);

  return (
    <section className="pt-28 pb-24">
      <Container className="mt-18 text-center">
        <motion.h1
          className="mb-3 text-4xl leading-[1.1] font-semibold tracking-tight text-ink sm:text-5xl"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {t("headline")}
          <span className="block">
            <AnimatePresence mode="wait">
              <motion.span
                key={wordIndex}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.3 }}
                className="inline-block bg-gradient-to-r from-brand-600 to-brand-400 bg-clip-text text-transparent"
              >
                {words[wordIndex]}
              </motion.span>
            </AnimatePresence>
          </span>
        </motion.h1>

        <motion.p
          className="mb-8 text-xl font-normal text-ink-subtle sm:text-2xl"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.08 }}
        >
          {t("subhead")}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <CtaButtons location="hero_primary" />
        </motion.div>
      </Container>

      <motion.div
        className="mx-auto mt-14 w-full max-w-5xl px-4 md:px-8"
        initial={{ opacity: 0, y: 48 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
      >
        <div
          onMouseMove={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            e.currentTarget.style.setProperty("--mx", `${e.clientX - rect.left}px`);
            e.currentTarget.style.setProperty("--my", `${e.clientY - rect.top}px`);
          }}
          className="w-full p-0 max-md:!bg-none md:rounded-2xl md:p-14 md:shadow-[var(--shadow-hero)] md:ring-1 md:ring-[var(--ring-window)]"
          style={{
            backgroundColor: "var(--spotlight)",
            backgroundImage:
              "radial-gradient(circle 520px at var(--mx, 50%) var(--my, 50%), rgba(167,139,250,0.30) 0%, rgba(167,139,250,0.10) 35%, transparent 70%)," +
              "radial-gradient(ellipse at 18% 65%, rgba(139,92,246,0.38) 0%, transparent 52%)," +
              "radial-gradient(ellipse at 78% 25%, rgba(109,40,217,0.34) 0%, transparent 48%)," +
              "radial-gradient(ellipse at 52% 90%, rgba(76,29,149,0.55) 0%, transparent 50%)," +
              "radial-gradient(ellipse at 88% 72%, rgba(192,38,211,0.22) 0%, transparent 42%)",
          }}
        >
          <HeroAnswerPreview />
        </div>
      </motion.div>
    </section>
  );
}
