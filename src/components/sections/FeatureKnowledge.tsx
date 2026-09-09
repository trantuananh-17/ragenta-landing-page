"use client";

import { motion } from "framer-motion";
import { useSignupFlow } from "@/lib/SignupFlowContext";
import { Container } from "@/components/ui/Container";
import { WindowChrome } from "@/components/ui/WindowChrome";
import { useTranslations } from "@/i18n/useTranslations";

// Non-text stream structure (source ids, tag keys, flag). Display titles come
// from the dictionary via raw("streamTitles") and are merged in by index.
const STREAM_META = [
  { id: "Confluence", tags: ["wiki", "synced"], flagged: false },
  { id: "Drive", tags: ["drive", "contract"], flagged: false },
  { id: "Zendesk #4821", tags: ["ticket", "synced"], flagged: true },
  { id: "Notion", tags: ["wiki", "synced"], flagged: false },
];

type PanelItem = { label: string; value: string };

export function FeatureKnowledge() {
  const { openSignup } = useSignupFlow();
  const { t, raw } = useTranslations("home.featureKnowledge");
  const streamTitles = raw<string[]>("streamTitles");
  const stream = STREAM_META.map((row, i) => ({
    ...row,
    title: streamTitles[i],
  }));
  const panel = raw<PanelItem[]>("panel");

  return (
    /* Layer 1: page background visible as the gap between sections */
    <section className="py-16">
      {/* Layer 2: section wrapper card */}
      <Container>
        <div className="overflow-hidden rounded-3xl bg-card">
          <div className="grid grid-cols-1 items-stretch lg:grid-cols-[2fr_3fr]">
            {/* Text — sits on the section card */}
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
              <p className="mb-6 text-lg leading-relaxed text-ink-muted">
                {t("description")}
              </p>
              <button
                type="button"
                onClick={() =>
                  openSignup({
                    cta_text: "See the connectors",
                    cta_location: "feature_knowledge",
                    newTab: true,
                  })
                }
                className="w-fit rounded-sm text-prose font-semibold text-brand-600 transition-colors hover:text-brand-700 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
              >
                {t("cta")}
              </button>
            </motion.div>

            {/* Layer 3: desktop wrapper */}
            <motion.div
              className="flex items-center p-3 max-md:!bg-none sm:p-8 lg:p-10"
              style={{ background: "var(--wallpaper-c)" }}
              initial={{ opacity: 0, x: 24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.08 }}
            >
              {/* Layer 4: app window */}
              <div className="w-full overflow-hidden rounded-xl bg-window shadow-[var(--shadow-window)] ring-1 ring-[var(--ring-window)]">
                <WindowChrome title={t("windowTitle")} />

                <div className="space-y-3 p-6">
                  {/* Live indexing stream across connectors */}
                  <div className="overflow-hidden rounded-xl bg-panel">
                    <div className="flex items-center justify-between px-4 pt-3 pb-2">
                      <span className="font-mono text-[10px] tracking-widest text-ink-faint uppercase">
                        {t("evidenceStream")}
                        <span className="hidden sm:inline">
                          {t("evidenceStreamSuffix")}
                        </span>
                      </span>
                      <span className="flex items-center gap-1.5 text-[10px] text-ok">
                        <span className="block h-1.5 w-1.5 animate-pulse rounded-full bg-ok" />
                        {t("live")}
                      </span>
                    </div>
                    <div className="divide-y divide-line-soft">
                      {stream.map((row) => (
                        <div
                          key={row.id}
                          className={`flex items-center gap-3 px-4 py-2.5 ${
                            row.flagged ? "bg-warn-soft" : ""
                          }`}
                        >
                          <span className="w-20 shrink-0 font-mono text-xs text-ink-subtle sm:w-28">
                            {row.id}
                          </span>
                          <span className="min-w-0 flex-1 truncate text-[11px] text-ink-muted">
                            {row.title}
                          </span>
                          <div className="flex shrink-0 gap-1.5">
                            {row.tags.map((tag) => (
                              <span
                                key={tag}
                                className={`rounded-sm px-1.5 py-0.5 text-[10px] font-semibold ${
                                  tag === "synced"
                                    ? "bg-ok-soft text-ok"
                                    : "bg-subtle text-ink-subtle"
                                }`}
                              >
                                {t(`tags.${tag}`)}
                              </span>
                            ))}
                          </div>
                          {row.flagged && (
                            <span className="ml-2 hidden shrink-0 text-[10px] font-semibold text-warn sm:inline">
                              {t("conflictsInternal")}
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Retrieval scope summary */}
                  <div className="rounded-xl bg-panel">
                    <div className="flex items-start justify-between gap-2 border-b border-line-soft px-4 pt-3 pb-2">
                      <span className="font-mono text-[10px] tracking-widest text-ink-faint uppercase">
                        {t("sourcesLinked")}
                        <span className="hidden sm:inline">
                          {t("contextBundleSuffix")}
                        </span>
                      </span>
                      <span className="shrink-0 rounded-sm bg-brand-100 px-2 py-0.5 text-[10px] font-semibold whitespace-nowrap text-brand-600">
                        {t("tags.synced")}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-0 divide-y divide-line-soft">
                      {panel.map((item) => (
                        <div
                          key={item.label}
                          className="flex flex-col gap-0.5 px-4 py-2 sm:flex-row sm:items-center sm:justify-between sm:gap-2"
                        >
                          <span className="shrink-0 text-[11px] text-ink-subtle">
                            {item.label}
                          </span>
                          <span className="text-[11px] font-semibold text-brand-600 sm:text-right">
                            {item.value}
                          </span>
                        </div>
                      ))}
                    </div>
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
