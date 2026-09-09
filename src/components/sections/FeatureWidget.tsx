"use client";

import { motion } from "framer-motion";
import { MessageCircle } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { WindowChrome } from "@/components/ui/WindowChrome";
import { LocaleLink } from "@/i18n/LocaleLink";
import { useTranslations } from "@/i18n/useTranslations";

/**
 * The embed snippet, verbatim from the app's own embed screen. It is code, so
 * it is not translated and it is not paraphrased — a reader should be able to
 * recognise it when they get there.
 */
const SNIPPET = '<script src="https://app.ragenta.cloud/widget.js"\n        data-key="wk_live_8f2c…"></script>';

/** Illustrative figures, paired with the translated labels by index. */
const STAT_VALUES = ["128", "94%", "3,410"];

export function FeatureWidget() {
  const { t, raw } = useTranslations("home.featureWidget");
  const statLabels = raw<string[]>("statLabels");

  return (
    <section className="py-16">
      <Container>
        <div className="overflow-hidden rounded-3xl bg-card">
          <div className="grid grid-cols-1 items-stretch lg:grid-cols-[2fr_3fr]">
            <motion.div
              className="flex flex-col justify-center px-6 py-10 md:px-14 md:py-20"
              initial={{ opacity: 0, x: -16 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.55 }}
            >
              <h2 className="mb-4 text-2xl leading-snug font-bold tracking-tight text-ink sm:text-3xl">
                {t("heading")}
              </h2>
              <p className="mb-6 text-[17px] leading-relaxed text-ink-muted">
                {t("description")}
              </p>
              <LocaleLink
                href="/product"
                className="w-fit text-[15px] font-semibold text-brand-600 transition-colors hover:text-brand-700"
              >
                {t("cta")}
              </LocaleLink>
            </motion.div>

            <motion.div
              className="flex items-center p-3 max-md:!bg-none sm:p-8 lg:p-10"
              style={{ background: "var(--wallpaper-c)" }}
              initial={{ opacity: 0, x: 24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.08 }}
            >
              <div className="w-full overflow-hidden rounded-xl bg-window shadow-[var(--shadow-window)] ring-1 ring-[var(--ring-window)]">
                <WindowChrome title={t("windowTitle")} />

                <div className="space-y-4 p-5">
                  {/* The chat bubble as a visitor sees it, sitting on the page. */}
                  <div className="overflow-hidden rounded-xl border border-line">
                    <div className="flex items-center gap-2 border-b border-line bg-panel px-3.5 py-2.5">
                      <MessageCircle
                        className="h-3.5 w-3.5 text-brand-600"
                        aria-hidden="true"
                      />
                      <span className="text-xs font-semibold text-ink">
                        {t("bubbleTitle")}
                      </span>
                    </div>

                    <div className="space-y-2.5 p-3.5">
                      <div className="flex justify-end">
                        <p className="max-w-[85%] rounded-2xl rounded-tr-sm bg-bubble px-3 py-2 text-xs leading-relaxed text-ink-muted">
                          {t("visitorQuestion")}
                        </p>
                      </div>
                      <div className="max-w-[92%] rounded-2xl rounded-tl-sm bg-panel px-3 py-2">
                        <p className="text-xs leading-relaxed text-ink-muted">
                          <span className="font-semibold text-ink">
                            {t("answerLead")}
                          </span>
                          {t("answerRest")}
                        </p>
                        <p className="mt-1.5 font-mono text-[10px] text-ink-faint">
                          {t("sourcesLabel")}
                        </p>
                      </div>
                      <div className="rounded-full border border-line px-3 py-1.5 text-[11px] text-ink-faint">
                        {t("composerPlaceholder")}
                      </div>
                    </div>
                  </div>

                  {/* Legitimate dark mockup: a code block reads as code in both
                      themes. See .claude/rules/theming.md. */}
                  <div className="overflow-hidden rounded-xl bg-[#14121d] p-3.5">
                    <p className="mb-2 font-mono text-[10px] text-slate-400">
                      {t("snippetLabel")}
                    </p>
                    <pre className="overflow-x-auto font-mono text-[11px] leading-relaxed whitespace-pre text-slate-200">
                      {SNIPPET}
                    </pre>
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    {statLabels.map((label, index) => (
                      <div
                        key={label}
                        className="rounded-lg border border-line px-3 py-2"
                      >
                        <p className="text-sm font-semibold text-ink tabular-nums">
                          {STAT_VALUES[index]}
                        </p>
                        <p className="mt-0.5 text-[10px] leading-tight text-ink-faint">
                          {label}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </Container>
    </section>
  );
}
