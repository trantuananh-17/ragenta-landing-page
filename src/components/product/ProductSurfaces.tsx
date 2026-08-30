"use client";

import { motion } from "framer-motion";
import { useSignupFlow } from "@/lib/SignupFlowContext";
import { Container } from "@/components/ui/Container";
import { WindowChrome } from "@/components/ui/WindowChrome";
import { useTranslations } from "@/i18n/useTranslations";

function MiniWindow({ children }: { children: React.ReactNode }) {
  return (
    <div className="overflow-hidden rounded-lg bg-window shadow-sm ring-1 ring-[var(--ring-window)]">
      {children}
    </div>
  );
}

function WebAppVisual() {
  return (
    <MiniWindow>
      <WindowChrome size="sm" />
      <div className="space-y-1.5 p-3">
        <div className="h-2 w-full rounded bg-panel" />
        <div className="h-2 w-4/5 rounded bg-panel" />
        <div className="h-2 w-3/5 rounded bg-brand-100" />
        <div className="h-2 w-2/3 rounded bg-panel" />
      </div>
    </MiniWindow>
  );
}

function ApiVisual() {
  return (
    <div className="overflow-hidden rounded-lg bg-[#14121d] font-mono shadow-sm ring-1 ring-black/20">
      <div className="border-b border-white/10 px-3 py-2 text-[9px] text-slate-400">
        answer.ts
      </div>
      <div className="p-3 text-[10px] leading-relaxed">
        <p>
          <span className="text-fuchsia-300">import</span>{" "}
          <span className="text-slate-200">{"{ Ragenta }"}</span>{" "}
          <span className="text-fuchsia-300">from</span>{" "}
          <span className="text-emerald-300">&quot;ragenta&quot;</span>
        </p>
        <p className="mt-1.5">
          <span className="text-slate-200">const r = </span>
          <span className="text-fuchsia-300">await</span>
          <span className="text-slate-200"> agent.ask(</span>
        </p>
        <p className="pl-3 text-emerald-300">&quot;refund window?&quot;</p>
        <p className="text-slate-200">)</p>
      </div>
    </div>
  );
}

function WidgetVisual({ placeholder }: { placeholder: string }) {
  return (
    <MiniWindow>
      <div className="flex items-center justify-between border-b border-line bg-brand-600 px-3 py-1.5">
        <span className="text-[9px] font-semibold text-brand-on">Ragenta</span>
        <span className="text-[9px] text-brand-on/70">●</span>
      </div>
      <div className="space-y-2 p-3">
        <div className="ml-auto w-3/4 rounded-lg rounded-tr-sm bg-bubble px-2 py-1.5 text-[9px] text-ink-muted">
          {placeholder}
        </div>
        <div className="w-5/6 rounded-lg rounded-tl-sm bg-panel px-2 py-1.5">
          <div className="h-1.5 w-full rounded bg-line" />
          <div className="mt-1 h-1.5 w-2/3 rounded bg-line" />
        </div>
      </div>
    </MiniWindow>
  );
}

function SlackVisual({ message }: { message: string }) {
  return (
    <MiniWindow>
      <div className="border-b border-line bg-chrome px-3 py-1.5">
        <span className="font-mono text-[9px] text-ink-subtle">#ask-internal</span>
      </div>
      <div className="p-3 text-[10px]">
        <div className="flex gap-1.5">
          <div className="h-4 w-4 shrink-0 rounded bg-brand-100" />
          <div>
            <p className="font-semibold text-ink-muted">Ragenta</p>
            <p className="text-ink-subtle">{message}</p>
          </div>
        </div>
      </div>
    </MiniWindow>
  );
}

const SURFACES = [
  { key: "webApp", ctaLocation: "product_surface_web_app" },
  { key: "api", ctaLocation: "product_surface_api" },
  { key: "widget", ctaLocation: "product_surface_widget" },
  { key: "slackTeams", ctaLocation: "product_surface_slack_teams" },
] as const;

export function ProductSurfaces() {
  const { openSignup } = useSignupFlow();
  const { t } = useTranslations("product");

  const visuals: Record<(typeof SURFACES)[number]["key"], React.ReactNode> = {
    webApp: <WebAppVisual />,
    api: <ApiVisual />,
    widget: <WidgetVisual placeholder={t("surfaces.items.widget.previewMessage")} />,
    slackTeams: (
      <SlackVisual message={t("surfaces.items.slackTeams.previewMessage")} />
    ),
  };

  return (
    <section className="py-20">
      <Container>
        <motion.div
          className="mb-14 text-center"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="mb-3 text-3xl font-bold tracking-tight text-ink sm:text-4xl">
            {t("surfaces.title")}
          </h2>
          <p className="text-lg text-ink-subtle">{t("surfaces.subtitle")}</p>
        </motion.div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          {SURFACES.map((surface, i) => (
            <motion.div
              key={surface.key}
              className="flex flex-col rounded-2xl bg-card p-6"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: i * 0.06 }}
            >
              <div className="mb-5">{visuals[surface.key]}</div>
              <p className="mb-1.5 text-sm font-bold text-ink">
                {t(`surfaces.items.${surface.key}.label`)}
              </p>
              <p className="mb-3 flex-1 text-sm leading-relaxed text-ink-muted">
                {t(`surfaces.items.${surface.key}.headline`)}
              </p>
              <button
                onClick={() =>
                  openSignup({
                    cta_text: t(`surfaces.items.${surface.key}.cta`),
                    cta_location: surface.ctaLocation,
                  })
                }
                className="w-fit text-[13px] font-semibold text-brand-600 transition-colors hover:text-brand-700"
              >
                {t(`surfaces.items.${surface.key}.cta`)}
              </button>
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  );
}
