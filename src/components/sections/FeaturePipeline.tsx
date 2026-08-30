"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSignupFlow } from "@/lib/SignupFlowContext";
import { Container } from "@/components/ui/Container";
import { WindowChrome } from "@/components/ui/WindowChrome";
import { useTranslations } from "@/i18n/useTranslations";

type StepStatus = "done" | "running" | "pending";

// Non-text run structure (status flags). Display text comes from the dictionary
// via raw("runs") and is merged in by index at render time.
const RUN_STATUS: { status: StepStatus; detail: StepStatus[] }[] = [
  { status: "done", detail: ["done", "done", "done", "done"] },
  { status: "running", detail: ["done", "running", "pending"] },
  { status: "done", detail: ["done", "done", "done"] },
  { status: "done", detail: ["done", "done", "done"] },
];

type RunText = {
  query: string;
  tag: string;
  steps: string[];
  result: string;
  detail: { step: string; sub: string }[];
};

export function StepIcon({ status }: { status: StepStatus }) {
  if (status === "done") {
    return (
      <div className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full border border-ok-line bg-ok-soft">
        <svg viewBox="0 0 10 10" className="h-2 w-2">
          <path
            d="M2 5l2.5 2.5 4-4"
            stroke="var(--ok)"
            strokeWidth="1.5"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    );
  }
  if (status === "running") {
    return (
      <div className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full border border-brand-200 bg-brand-50">
        <span className="block h-1.5 w-1.5 animate-pulse rounded-full bg-brand-500" />
      </div>
    );
  }
  return (
    <div className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full border border-line">
      <span className="block h-1 w-1 rounded-full bg-line-strong" />
    </div>
  );
}

export function FeaturePipeline() {
  const { openSignup } = useSignupFlow();
  const { t, raw } = useTranslations("home.featurePipeline");
  const runsText = raw<RunText[]>("runs");
  const runs = runsText.map((run, i) => ({
    ...run,
    status: RUN_STATUS[i].status,
    detail: run.detail.map((d, j) => ({ ...d, status: RUN_STATUS[i].detail[j] })),
  }));
  const [selected, setSelected] = useState<number | null>(null);

  const activeRun = selected !== null ? runs[selected] : null;

  return (
    <section className="py-16">
      <Container>
        <div className="overflow-hidden rounded-3xl bg-card">
          <div className="grid grid-cols-1 items-stretch lg:grid-cols-[3fr_2fr]">
            {/* Desktop wrapper */}
            <motion.div
              className="flex items-center p-3 max-md:!bg-none max-lg:order-last sm:p-8 lg:p-10"
              style={{ background: "var(--wallpaper-b)" }}
              initial={{ opacity: 0, x: -24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="relative w-full rounded-xl bg-window shadow-[var(--shadow-window)] ring-1 ring-[var(--ring-window)]">
                <WindowChrome title={t("windowTitle")} className="rounded-t-xl" />

                <div className="space-y-2.5 p-5">
                  {runs.map((run, i) => (
                    <button
                      key={run.query}
                      onClick={() => setSelected(i)}
                      className="w-full space-y-2.5 rounded-xl bg-panel p-4 text-left transition-all duration-150 hover:ring-1 hover:ring-brand-300"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <p className="flex-1 text-sm leading-snug text-ink-muted">
                          {run.query}
                        </p>
                        <span className="mt-0.5 shrink-0 rounded-full bg-subtle px-2 py-0.5 text-[10px] font-semibold text-ink-subtle">
                          {run.tag}
                        </span>
                      </div>
                      <div className="flex flex-wrap items-center gap-1.5">
                        {run.steps.map((step, j) => (
                          <span key={step} className="flex items-center gap-1.5">
                            <span className="text-[11px] text-ink-faint">
                              {step}
                            </span>
                            {j < run.steps.length - 1 && (
                              <span className="text-[10px] text-ink-ghost">→</span>
                            )}
                          </span>
                        ))}
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-1.5 text-[11px]">
                          <span
                            className={`block h-1.5 w-1.5 rounded-full bg-ok ${
                              run.status === "running" ? "animate-pulse" : ""
                            }`}
                          />
                          <span className="font-medium text-ok">
                            {run.status === "running"
                              ? t("statusRunning")
                              : t("statusComplete")}
                          </span>
                        </span>
                        <span className="font-mono text-[11px] text-ink-faint">
                          {run.result}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>

                {/* Run detail overlay */}
                <AnimatePresence>
                  {activeRun && (
                    <motion.div
                      className="absolute inset-0 flex items-center justify-center rounded-xl p-4 backdrop-blur-md"
                      style={{ backgroundColor: "var(--scrim)" }}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.15 }}
                      onClick={() => setSelected(null)}
                    >
                      <motion.div
                        className="w-full max-w-sm overflow-hidden rounded-xl bg-window shadow-[var(--shadow-window)] ring-1 ring-[var(--ring-window)]"
                        initial={{ scale: 0.95, y: 8 }}
                        animate={{ scale: 1, y: 0 }}
                        exit={{ scale: 0.95, y: 8 }}
                        transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
                        onClick={(e) => e.stopPropagation()}
                      >
                        <WindowChrome size="sm" className="justify-between">
                          <span className="ml-2 flex-1 truncate font-mono text-[10px] text-ink-faint">
                            {t("workflowLabel", { tag: activeRun.tag })}
                          </span>
                          <button
                            onClick={() => setSelected(null)}
                            className="text-xs leading-none text-ink-faint transition-colors hover:text-ink-muted"
                            aria-label="Close"
                          >
                            ✕
                          </button>
                        </WindowChrome>

                        <div className="space-y-3 p-4">
                          <div className="flex justify-end">
                            <div className="max-w-[85%] rounded-2xl rounded-tr-sm bg-bubble px-3 py-2 text-xs text-ink-muted">
                              {activeRun.query}
                            </div>
                          </div>

                          <div className="space-y-3 rounded-xl bg-panel p-3.5">
                            <p className="font-mono text-[9px] tracking-widest text-ink-faint uppercase">
                              {t("planLabel", { count: activeRun.detail.length })}
                            </p>
                            {activeRun.detail.map((d) => (
                              <div key={d.step} className="flex items-start gap-2.5">
                                <StepIcon status={d.status} />
                                <div>
                                  <p
                                    className={`text-xs leading-snug ${
                                      d.status === "pending"
                                        ? "text-ink-faint"
                                        : "text-ink-muted"
                                    }`}
                                  >
                                    {d.step}
                                  </p>
                                  <p className="mt-0.5 text-[10px] text-ink-faint">
                                    {d.sub}
                                  </p>
                                </div>
                              </div>
                            ))}
                          </div>

                          <div className="flex items-center gap-2 text-xs text-ink-subtle">
                            <span
                              className={`h-1.5 w-1.5 shrink-0 rounded-full bg-ok ${
                                activeRun.status === "running" ? "animate-pulse" : ""
                              }`}
                            />
                            {activeRun.status === "running"
                              ? t("inProgress")
                              : activeRun.result}
                          </div>
                        </div>
                      </motion.div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>

            {/* Text */}
            <motion.div
              className="flex flex-col justify-center px-6 py-10 md:px-14 md:py-20"
              initial={{ opacity: 0, x: 16 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.55, delay: 0.08 }}
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
                    cta_text: "Explore capabilities",
                    cta_location: "feature_pipeline",
                    newTab: true,
                  })
                }
                className="w-fit text-[15px] font-semibold text-brand-600 transition-colors hover:text-brand-700"
              >
                {t("cta")}
              </button>
            </motion.div>
          </div>
        </div>
      </Container>
    </section>
  );
}
