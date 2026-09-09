"use client";

import { motion } from "framer-motion";
import { useSignupFlow } from "@/lib/SignupFlowContext";
import { Container } from "@/components/ui/Container";
import {
  ProductCard,
  ProductSectionHeader,
} from "@/components/product/ProductCard";
import { useTranslations } from "@/i18n/useTranslations";

type Snapshot = { label: string; date: string };

/** Splits a "{chip1} text {chip2}" template and interleaves the given chip nodes. */
function renderTemplate(
  template: string,
  chips: Record<string, React.ReactNode>,
) {
  return template.split(/(\{\w+\})/g).map((part, i) => {
    const match = /^\{(\w+)\}$/.exec(part);
    if (match) return <span key={i}>{chips[match[1]]}</span>;
    return <span key={i}>{part}</span>;
  });
}

function Chip({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded-sm bg-brand-100 px-1.5 py-0.5 font-mono text-[10px] text-brand-600">
      {children}
    </span>
  );
}

export function ProductCapabilities() {
  const { openSignup } = useSignupFlow();
  const { t, raw } = useTranslations("product");
  const snapshots = raw<Snapshot[]>("capabilities.snapshots");

  return (
    <section className="py-24">
      <Container>
        <ProductSectionHeader
          title={t("capabilities.title")}
          subtitle={t("capabilities.subtitle")}
        />

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {/* Terminal card — dark in both themes on purpose, it is a terminal. */}
          <motion.div
            className="flex flex-col rounded-2xl bg-card p-6"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45 }}
          >
            <div className="mb-5 overflow-hidden rounded-lg bg-[#14121d] shadow-sm ring-1 ring-black/20">
              <div className="border-b border-white/10 px-3 py-2">
                <span className="font-mono text-[10px] text-slate-400">
                  {t("capabilities.terminal.title")}
                </span>
              </div>
              <div className="space-y-1 p-3 font-mono text-[10px] text-slate-200">
                <p>
                  <span className="text-brand-300">$</span>{" "}
                  {t("capabilities.terminal.retrieving")}
                </p>
                <p className="text-slate-400">
                  {t("capabilities.terminal.reranking")}
                </p>
                <p>
                  <span className="text-brand-300">$</span>{" "}
                  {t("capabilities.terminal.toolCall")}
                </p>
                <p className="text-emerald-300">
                  {t("capabilities.terminal.done")}
                </p>
              </div>
            </div>
            <p className="mb-1.5 text-base font-bold text-ink">
              {t("capabilities.runToolsHeading")}
            </p>
            <p className="mb-3 flex-1 text-sm leading-relaxed text-ink-muted">
              {t("capabilities.runToolsBody")}
            </p>
            <button
              onClick={() =>
                openSignup({
                  cta_text: "Learn more",
                  cta_location: "product_capabilities",
                })
              }
              className="w-fit rounded-sm text-sm font-semibold text-brand-600 transition-colors hover:text-brand-700 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
            >
              {t("capabilities.learnMore")}
            </button>
          </motion.div>

          <ProductCard
            index={1}
            chromeTitle={t("capabilities.composeChrome")}
            heading={t("capabilities.addContextHeading")}
            body={t("capabilities.addContextBody")}
            learnMore={t("capabilities.learnMore")}
            ctaLocation="product_capabilities"
          >
            <div className="space-y-2 p-3">
              <div className="rounded-lg bg-bubble px-3 py-2.5 text-[11px] leading-relaxed text-ink-muted">
                {renderTemplate(t("capabilities.composeAttach"), {
                  chip1: <Chip>@vendor-msa.pdf</Chip>,
                  chip2: <Chip>@legal-playbook</Chip>,
                  chip3: <Chip>@risk-rules.md</Chip>,
                })}
              </div>
              <div className="rounded-lg bg-panel px-3 py-2.5 text-[11px] text-ink-muted">
                {renderTemplate(t("capabilities.composeFollow"), {
                  chip1: <Chip>2026-01-01</Chip>,
                })}
              </div>
            </div>
          </ProductCard>

          <ProductCard
            index={2}
            chromeTitle={t("capabilities.snapshotsChrome")}
            heading={t("capabilities.snapshotsHeading")}
            body={t("capabilities.snapshotsBody")}
            learnMore={t("capabilities.learnMore")}
            ctaLocation="product_capabilities"
          >
            <div className="p-3">
              <div className="relative pl-4">
                <div className="absolute top-1.5 bottom-1.5 left-1 w-px bg-line" />
                {snapshots.map((s, i) => (
                  <div key={s.label} className="relative mb-2 last:mb-0">
                    <span
                      className={`absolute top-1 -left-3 h-1.5 w-1.5 rounded-full ${
                        i === snapshots.length - 1
                          ? "bg-brand-500 ring-2 ring-brand-100"
                          : "bg-line-strong"
                      }`}
                    />
                    <p className="text-[10px] leading-tight text-ink-muted">
                      {s.label}
                    </p>
                    <p className="mt-0.5 font-mono text-[10px] text-ink-faint">
                      {s.date}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </ProductCard>
        </div>
      </Container>
    </section>
  );
}
