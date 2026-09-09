"use client";

import { motion } from "framer-motion";
import { useSignupFlow } from "@/lib/SignupFlowContext";
import { Container } from "@/components/ui/Container";
import { WindowChrome } from "@/components/ui/WindowChrome";
import { useTranslations } from "@/i18n/useTranslations";
import { LocaleLink } from "@/i18n/LocaleLink";
import { buttonClasses } from "@/components/ui/Button";

type AgentStatus = "running" | "done" | "pending";

const TODAY_STATUSES: AgentStatus[] = ["running", "running", "running", "done"];

function StatusDot({ status }: { status: AgentStatus }) {
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
        <motion.span
          className="block h-1.5 w-1.5 rounded-full bg-brand-500"
          animate={{ opacity: [1, 0.3, 1] }}
          transition={{ duration: 1.1, repeat: Infinity }}
        />
      </div>
    );
  }
  return (
    <div className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full border border-line">
      <span className="block h-1 w-1 rounded-full bg-line-strong" />
    </div>
  );
}

export function ProductHero() {
  const { openSignup } = useSignupFlow();
  const { t, raw } = useTranslations("product");
  const todayText =
    raw<{ title: string; sub: string; meta: string }[]>("hero.todayAgents");
  const todayAgents = todayText.map((agent, i) => ({
    ...agent,
    status: TODAY_STATUSES[i],
  }));
  const weekAgents = raw<{ title: string; sub: string }[]>("hero.weekAgents");

  return (
    <section className="pt-28 pb-16">
      <Container className="mt-18 text-left">
        <motion.p
          className="mb-4 font-mono text-sm tracking-widest text-brand-600 uppercase"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          {t("hero.eyebrow")}
        </motion.p>
        <motion.h1
          className="mb-4 text-4xl leading-[1.1] font-semibold tracking-tight text-ink sm:text-5xl"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.05 }}
        >
          {t("hero.title")}
        </motion.h1>
        <motion.p
          className="mb-8 max-w-2xl text-xl text-ink-subtle"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          {t("hero.subtitle")}
        </motion.p>

        <motion.div
          className="flex items-center justify-start gap-5"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
        >
          <button
            onClick={() =>
              openSignup({
                cta_text: "Start for free",
                cta_location: "product_hero",
                newTab: true,
              })
            }
            className={buttonClasses()}
          >
            {t("hero.ctaPrimary")}
          </button>
          <LocaleLink href="/contact" className={buttonClasses({ variant: "secondary" })}>
            {t("hero.ctaSecondary")}
          </LocaleLink>
        </motion.div>
      </Container>

      {/* Agent dashboard mock */}
      <motion.div
        className="mx-auto mt-14 w-full max-w-7xl px-4 md:px-8"
        initial={{ opacity: 0, y: 48 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
      >
        <div
          className="w-full overflow-hidden rounded-2xl p-8 shadow-[var(--shadow-hero)] ring-1 ring-[var(--ring-window)] md:p-14"
          style={{
            backgroundColor: "var(--spotlight)",
            backgroundImage:
              "radial-gradient(ellipse at 18% 65%, rgba(139,92,246,0.38) 0%, transparent 52%), " +
              "radial-gradient(ellipse at 78% 25%, rgba(109,40,217,0.34) 0%, transparent 48%), " +
              "radial-gradient(ellipse at 52% 90%, rgba(76,29,149,0.55) 0%, transparent 50%)",
          }}
        >
          <div className="w-full overflow-hidden rounded-xl bg-window shadow-[var(--shadow-window)] ring-1 ring-white/10">
            <WindowChrome>
              <span className="flex-1 text-center font-mono text-xs text-ink-faint">
                {t("hero.dashboardTitle")}
              </span>
            </WindowChrome>

            <div className="p-6 md:p-8">
              <div className="mb-5 flex items-baseline justify-between">
                <h2 className="text-lg font-bold text-ink">
                  {t("hero.panelHeading")}
                </h2>
                <span className="font-mono text-xs text-ink-faint">
                  {t("hero.activeCount")}
                </span>
              </div>

              <p className="mb-3 font-mono text-[10px] tracking-widest text-ink-faint uppercase">
                {t("hero.todayLabel")}
              </p>
              <div className="mb-6 space-y-1.5">
                {todayAgents.map((agent) => (
                  <div
                    key={agent.title}
                    className="flex cursor-default items-center gap-3 rounded-lg px-3 py-2.5 transition-colors hover:bg-panel"
                  >
                    <StatusDot status={agent.status} />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm text-ink-muted">
                        {agent.title}
                      </p>
                      <p className="mt-0.5 truncate text-xs text-ink-faint">
                        <span className="text-brand-600">{agent.sub}</span>
                        <span className="mx-1.5 text-ink-ghost">·</span>
                        <span className="font-mono">{agent.meta}</span>
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <p className="mb-3 font-mono text-[10px] tracking-widest text-ink-faint uppercase">
                {t("hero.weekLabel")}
              </p>
              <div className="mb-5 space-y-1.5">
                {weekAgents.map((agent) => (
                  <div
                    key={agent.title}
                    className="flex cursor-default items-center gap-3 rounded-lg px-3 py-2.5 transition-colors hover:bg-panel"
                  >
                    <StatusDot status="done" />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm text-ink-subtle">
                        {agent.title}
                      </p>
                      <p className="mt-0.5 truncate font-mono text-xs text-ink-faint">
                        {agent.sub}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex items-center gap-3 rounded-lg border border-line bg-window p-3">
                <input
                  type="text"
                  placeholder={t("hero.inputPlaceholder")}
                  className="flex-1 bg-transparent text-sm text-ink-muted placeholder:text-ink-faint outline-none"
                />
                <span className="shrink-0 font-mono text-xs text-ink-faint">
                  ⌘↵
                </span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
