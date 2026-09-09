"use client";

import { motion } from "framer-motion";
import { CornerDownRight, Sparkles } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { WindowChrome } from "@/components/ui/WindowChrome";
import { LocaleLink } from "@/i18n/LocaleLink";
import { useTranslations } from "@/i18n/useTranslations";

/**
 * The agent canvas, drawn as the flow the prompt below it would produce.
 *
 * Step types and tool ids are code, not copy — `categorize` and `gmail_search`
 * are the identifiers a person types into the real editor, and translating them
 * would teach the reader a name that does not exist. They are merged with the
 * translated labels by index, the same way the other sections do it.
 */
const TRUNK_KINDS = ["begin", "agent · gmail_search", "categorize"];
const BRANCH_KINDS = ["llm", "agent · github_create_issue", "agent · slack_post"];

type TrunkStep = { label: string };
type BranchStep = { when: string; label: string };

function StepBox({
  label,
  kind,
  accent = false,
}: {
  label: string;
  kind: string;
  accent?: boolean;
}) {
  return (
    <div
      className={`rounded-lg border bg-window px-3 py-2 ${
        accent ? "border-brand-300" : "border-line"
      }`}
    >
      <p className="text-xs font-semibold text-ink">{label}</p>
      <p className="mt-0.5 font-mono text-[10px] text-ink-faint">{kind}</p>
    </div>
  );
}

export function FeatureCanvas() {
  const { t, raw } = useTranslations("home.featureCanvas");
  const trunk = raw<TrunkStep[]>("trunk");
  const branches = raw<BranchStep[]>("branches");

  return (
    <section className="py-16">
      <Container>
        <div className="overflow-hidden rounded-3xl bg-card">
          <div className="grid grid-cols-1 items-stretch lg:grid-cols-[3fr_2fr]">
            <motion.div
              className="flex items-center p-3 max-md:!bg-none max-lg:order-last sm:p-8 lg:p-10"
              style={{ background: "var(--wallpaper-b)" }}
              initial={{ opacity: 0, x: -24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="w-full overflow-hidden rounded-xl bg-window shadow-[var(--shadow-window)] ring-1 ring-[var(--ring-window)]">
                <WindowChrome title={t("windowTitle")} />

                <div className="space-y-4 p-5">
                  <div className="rounded-xl bg-panel p-4">
                    <div className="space-y-2">
                      {trunk.map((step, index) => (
                        <div key={step.label}>
                          <StepBox
                            label={step.label}
                            kind={TRUNK_KINDS[index]}
                            accent={index === trunk.length - 1}
                          />
                          {index < trunk.length - 1 && (
                            <div className="ml-4 h-3 w-px bg-line-strong" />
                          )}
                        </div>
                      ))}

                      <div className="ml-4 space-y-2 border-l border-line-strong pl-4">
                        {branches.map((branch, index) => (
                          <div
                            key={branch.label}
                            className="flex items-center gap-2"
                          >
                            <CornerDownRight
                              className="h-3.5 w-3.5 shrink-0 text-ink-ghost"
                              aria-hidden="true"
                            />
                            <span className="shrink-0 rounded-full bg-subtle px-2 py-0.5 text-[10px] font-semibold text-ink-subtle">
                              {branch.when}
                            </span>
                            <div className="min-w-0 flex-1">
                              <StepBox
                                label={branch.label}
                                kind={BRANCH_KINDS[index]}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="rounded-xl border border-line p-3">
                    <p className="mb-2 flex items-center gap-1.5 text-[11px] font-semibold text-ink-muted">
                      <Sparkles className="h-3.5 w-3.5 text-brand-600" />
                      {t("promptLabel")}
                    </p>
                    <p className="rounded-lg bg-panel px-3 py-2 text-xs leading-relaxed text-ink-subtle">
                      {t("promptText")}
                    </p>
                    <div className="mt-2 flex items-center justify-between gap-3">
                      <span className="rounded-full bg-brand-600 px-3 py-1 text-[10px] font-semibold text-brand-on">
                        {t("draftButton")}
                      </span>
                      <span className="font-mono text-[10px] text-ink-faint">
                        {t("stepsLabel")}
                      </span>
                    </div>
                  </div>

                  <p className="text-[11px] text-ink-faint">
                    {t("publishNote")}
                  </p>
                </div>
              </div>
            </motion.div>

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
              <LocaleLink
                href="/product"
                className="w-fit text-[15px] font-semibold text-brand-600 transition-colors hover:text-brand-700"
              >
                {t("cta")}
              </LocaleLink>
            </motion.div>
          </div>
        </div>
      </Container>
    </section>
  );
}
