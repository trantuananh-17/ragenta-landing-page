"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSignupFlow } from "@/lib/SignupFlowContext";
import { Container } from "@/components/ui/Container";
import { WindowChrome } from "@/components/ui/WindowChrome";
import { useTranslations } from "@/i18n/useTranslations";

type AgentStep = {
  tool: string;
  action: string;
  time: string;
  windowTitle: string;
};
type RetrievalRow = {
  source: string;
  passage: string;
  score: number;
  used: boolean;
};
type ContextRow = { label: string; value: string };
type VerificationRow = { property: string; value: string; flag: boolean };

// The first two steps are finished, the third is still running — the same
// done/done/running rhythm the run list uses elsewhere on the page.
const STEP_DONE = [true, true, false];

function RetrievalTrace() {
  const { t, raw } = useTranslations("home.featureOrchestration");
  const rows = raw<RetrievalRow[]>("retrieval.rows");

  return (
    <div className="p-5">
      <p className="mb-3 font-mono text-[10px] tracking-widest text-ink-faint uppercase">
        {t("retrieval.caption")}
      </p>
      <table className="w-full text-xs">
        <thead>
          <tr className="border-b border-line-soft text-left font-mono text-[10px] text-ink-faint">
            <th className="pb-2 pr-4 font-medium">{t("retrieval.colSource")}</th>
            <th className="pb-2 pr-4 font-medium">{t("retrieval.colPassage")}</th>
            <th className="pb-2 pr-4 font-medium">{t("retrieval.colScore")}</th>
            <th className="pb-2 font-medium">{t("retrieval.colUsed")}</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-line-soft">
          {rows.map((row) => (
            <tr key={row.source} className="text-ink-muted">
              <td className="py-2.5 pr-4 font-mono text-[11px] text-brand-600">
                {row.source}
              </td>
              <td className="max-w-[10rem] truncate py-2.5 pr-4 text-ink-subtle">
                {row.passage}
              </td>
              <td className="py-2.5 pr-4">
                <div className="flex items-center gap-2">
                  <div className="h-1.5 w-14 overflow-hidden rounded-full bg-line">
                    <div
                      className="h-full rounded-full bg-brand-400"
                      style={{ width: `${row.score * 100}%` }}
                    />
                  </div>
                  <span className="text-[10px] text-ink-subtle">{row.score}</span>
                </div>
              </td>
              <td className="py-2.5">
                <span
                  className={`rounded px-1.5 py-0.5 text-[10px] font-semibold ${
                    row.used
                      ? "bg-ok-soft text-ok"
                      : "bg-panel text-ink-faint"
                  }`}
                >
                  {row.used ? t("retrieval.used") : t("retrieval.skipped")}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className="mt-4 font-mono text-[10px] text-ink-ghost">
        {t("retrieval.footer")}
      </p>
    </div>
  );
}

function ContextBundle() {
  const { t, raw } = useTranslations("home.featureOrchestration");
  const rows = raw<ContextRow[]>("context.rows");

  return (
    <div className="space-y-2 p-5">
      <p className="mb-3 font-mono text-[10px] tracking-widest text-ink-faint uppercase">
        {t("context.caption")}
      </p>
      {rows.map((row) => (
        <div
          key={row.label}
          className="flex items-center justify-between rounded-lg bg-panel px-3.5 py-2.5"
        >
          <span className="text-xs text-ink-subtle">{row.label}</span>
          <span className="text-xs font-medium text-brand-600">{row.value}</span>
        </div>
      ))}
    </div>
  );
}

function VerificationReport() {
  const { t, raw } = useTranslations("home.featureOrchestration");
  const rows = raw<VerificationRow[]>("verification.rows");

  return (
    <div className="space-y-2 p-5">
      <p className="mb-3 font-mono text-[10px] tracking-widest text-ink-faint uppercase">
        {t("verification.caption")}
      </p>
      {rows.map((row) => (
        <div
          key={row.property}
          className="flex items-center justify-between rounded-lg bg-panel px-3.5 py-2.5"
        >
          <span className="text-xs text-ink-subtle">{row.property}</span>
          <span
            className={`flex items-center gap-1.5 text-xs font-medium ${
              row.flag ? "text-warn" : "text-ok"
            }`}
          >
            <span
              className={`h-1.5 w-1.5 rounded-full ${
                row.flag ? "bg-warn" : "bg-ok"
              }`}
            />
            {row.value}
          </span>
        </div>
      ))}
    </div>
  );
}

const STEP_PANELS = [RetrievalTrace, ContextBundle, VerificationReport];

export function FeatureOrchestration() {
  const { openSignup } = useSignupFlow();
  const { t, raw } = useTranslations("home.featureOrchestration");
  const steps = raw<AgentStep[]>("agentSteps");
  const [openStep, setOpenStep] = useState<number | null>(null);

  const StepPanel = openStep !== null ? STEP_PANELS[openStep] : null;

  return (
    <section className="py-16">
      <Container>
        <div className="overflow-hidden rounded-3xl bg-card">
          <div className="grid grid-cols-1 items-stretch lg:grid-cols-[2fr_3fr]">
            {/* Text */}
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
              <button
                onClick={() =>
                  openSignup({
                    cta_text: "See how agents work",
                    cta_location: "feature_orchestration",
                    newTab: true,
                  })
                }
                className="w-fit text-[15px] font-semibold text-brand-600 transition-colors hover:text-brand-700"
              >
                {t("cta")}
              </button>
            </motion.div>

            {/* Desktop surface */}
            <motion.div
              className="flex items-center p-3 max-md:!bg-none sm:p-8 lg:p-10"
              style={{ background: "var(--wallpaper-a)" }}
              initial={{ opacity: 0, x: 24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.08 }}
            >
              {/* App window — relative so the step popup overlays it */}
              <div className="relative w-full overflow-hidden rounded-xl bg-window shadow-[var(--shadow-window)] ring-1 ring-[var(--ring-window)]">
                <WindowChrome title={t("windowTitle")} />

                <div className="space-y-4 p-6">
                  <div className="flex justify-end">
                    <div className="max-w-sm rounded-2xl rounded-tr-sm bg-bubble px-4 py-2.5 text-sm text-ink-muted">
                      {t("query")}
                    </div>
                  </div>

                  <div className="space-y-1 rounded-xl bg-panel p-5">
                    <p className="mb-3 font-mono text-[10px] tracking-widest text-ink-faint uppercase">
                      {t("workflowLabel", { count: steps.length })}
                    </p>
                    {steps.map((step, i) => (
                      <button
                        key={step.tool}
                        onClick={() => setOpenStep(i)}
                        className="flex w-full items-start gap-3 rounded-lg px-3 py-3 text-left transition-colors hover:bg-black/[0.04] dark:hover:bg-white/[0.04]"
                      >
                        <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-brand-200 bg-brand-50">
                          {STEP_DONE[i] ? (
                            <svg viewBox="0 0 10 10" className="h-2.5 w-2.5">
                              <path
                                d="M2 5l2.5 2.5 4-4"
                                stroke="var(--brand-500)"
                                strokeWidth="1.5"
                                fill="none"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                          ) : (
                            <motion.div
                              className="h-3 w-3 rounded-full border border-brand-500"
                              style={{ borderTopColor: "transparent" }}
                              animate={{ rotate: 360 }}
                              transition={{
                                duration: 0.7,
                                repeat: Infinity,
                                ease: "linear",
                              }}
                            />
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="mb-1 flex items-baseline justify-between gap-2">
                            <span className="text-xs font-semibold text-brand-600">
                              {step.tool}
                            </span>
                            <span className="shrink-0 font-mono text-[10px] text-ink-faint">
                              {step.time}
                            </span>
                          </div>
                          <p
                            className={`text-sm ${
                              STEP_DONE[i] ? "text-ink-faint" : "text-ink-muted"
                            }`}
                          >
                            {step.action}
                          </p>
                        </div>
                      </button>
                    ))}
                  </div>

                  <div className="rounded-xl bg-panel px-4 py-3 text-sm text-ink-faint">
                    <span className="font-semibold text-brand-600">
                      {t("summaryHighlight")}
                    </span>{" "}
                    {t("summaryRest")}
                  </div>

                  <div className="flex items-center gap-2 border-t border-line-soft pt-4 text-xs text-ink-faint">
                    <span className="h-2 w-2 animate-pulse rounded-full bg-ok" />
                    {t("agentStatus")}
                  </div>
                </div>

                {/* Step popup — overlays the app window */}
                <AnimatePresence>
                  {openStep !== null && StepPanel && (
                    <motion.div
                      className="absolute inset-0 flex items-center justify-center rounded-xl p-4 backdrop-blur-md"
                      style={{ backgroundColor: "var(--scrim)" }}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.15 }}
                      onClick={() => setOpenStep(null)}
                    >
                      <motion.div
                        className="flex w-full flex-col overflow-hidden rounded-xl bg-window shadow-[var(--shadow-window)] ring-1 ring-[var(--ring-window)]"
                        style={{ maxHeight: "calc(100% - 32px)" }}
                        initial={{ scale: 0.95, y: 8 }}
                        animate={{ scale: 1, y: 0 }}
                        exit={{ scale: 0.95, y: 8 }}
                        transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
                        onClick={(e) => e.stopPropagation()}
                      >
                        <WindowChrome size="sm" className="shrink-0 justify-between">
                          <span className="ml-2 flex-1 truncate font-mono text-[10px] text-ink-faint">
                            {steps[openStep].windowTitle}
                          </span>
                          <button
                            onClick={() => setOpenStep(null)}
                            className="text-xs leading-none text-ink-faint transition-colors hover:text-ink-muted"
                            aria-label="Close"
                          >
                            ✕
                          </button>
                        </WindowChrome>
                        <div className="flex-1 overflow-auto">
                          <StepPanel />
                        </div>
                      </motion.div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          </div>
        </div>
      </Container>
    </section>
  );
}
