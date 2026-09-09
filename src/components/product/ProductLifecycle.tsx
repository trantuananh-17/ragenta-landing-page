"use client";

import { Container } from "@/components/ui/Container";
import {
  ProductCard,
  ProductSectionHeader,
} from "@/components/product/ProductCard";
import { useTranslations } from "@/i18n/useTranslations";

type RetrievalRow = { stage: string; detail: string; value: string };
type ValidateStep = { action: string; target: string; result: string };

export function ProductLifecycle() {
  const { t, raw } = useTranslations("product");
  const planSteps = raw<string[]>("lifecycle.planSteps");
  const retrievalRows = raw<RetrievalRow[]>("lifecycle.retrievalRows");
  const validateSteps = raw<ValidateStep[]>("lifecycle.validateSteps");

  // Widths are relative to the widest stage so the funnel reads as a funnel.
  const widest = Math.max(
    ...retrievalRows.map((row) => Number(row.value) || 0),
    1,
  );

  return (
    <section className="py-24">
      <Container>
        <ProductSectionHeader
          title={t("lifecycle.title")}
          subtitle={t("lifecycle.subtitle")}
        />

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <ProductCard
            index={0}
            chromeTitle={t("lifecycle.planChrome")}
            heading={t("lifecycle.planHeading")}
            body={t("lifecycle.planBody")}
            learnMore={t("lifecycle.learnMore")}
            ctaLocation="product_lifecycle"
          >
            <div className="space-y-2 p-3">
              {planSteps.map((step, i) => (
                <div key={step} className="flex items-start gap-2">
                  <span className="mt-0.5 w-3 shrink-0 font-mono text-[10px] text-ink-faint">
                    {i + 1}
                  </span>
                  <p className="flex-1 text-[11px] leading-snug text-ink-muted">
                    {step}
                  </p>
                </div>
              ))}
              <div className="mt-1 flex gap-1.5 border-t border-line-soft pt-2">
                <span className="rounded-sm border border-line px-2.5 py-1 text-[10px] font-semibold text-ink-faint">
                  {t("lifecycle.skip")}
                </span>
                <span className="rounded-sm bg-brand-600 px-2.5 py-1 text-[10px] font-semibold text-brand-on">
                  {t("lifecycle.continue")}
                </span>
              </div>
            </div>
          </ProductCard>

          <ProductCard
            index={1}
            chromeTitle={t("lifecycle.designChrome")}
            heading={t("lifecycle.designHeading")}
            body={t("lifecycle.designBody")}
            learnMore={t("lifecycle.learnMore")}
            ctaLocation="product_lifecycle"
          >
            <div className="space-y-2 p-3">
              {retrievalRows.map((row) => (
                <div key={row.stage}>
                  <div className="mb-1 flex items-baseline justify-between gap-2">
                    <span className="text-[11px] font-medium text-ink-muted">
                      {row.stage}
                    </span>
                    <span className="font-mono text-[10px] text-ink-faint">
                      {row.detail}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-panel">
                      <div
                        className="h-full rounded-full bg-brand-500"
                        style={{
                          width: `${(Number(row.value) / widest) * 100}%`,
                        }}
                      />
                    </div>
                    <span className="w-6 shrink-0 text-right font-mono text-[10px] font-semibold text-brand-600">
                      {row.value}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </ProductCard>

          <ProductCard
            index={2}
            chromeTitle={t("lifecycle.validateChrome")}
            heading={t("lifecycle.validateHeading")}
            body={t("lifecycle.validateBody")}
            learnMore={t("lifecycle.learnMore")}
            ctaLocation="product_lifecycle"
          >
            <div className="space-y-1.5 p-3">
              {validateSteps.map((v) => (
                <div key={v.action} className="text-[10px]">
                  <p>
                    <span className="font-mono font-semibold text-brand-600">
                      {v.action}
                    </span>{" "}
                    <span className="text-ink-subtle">{v.target}</span>
                  </p>
                  <p className="mt-0.5 pl-1 text-ink-faint italic">
                    → {v.result}
                  </p>
                </div>
              ))}
              <div className="mt-2 border-t border-line-soft pt-2 text-[10px] text-ink-muted">
                {t("lifecycle.rootCauseLabel")}{" "}
                <span className="font-semibold text-warn">
                  {t("lifecycle.rootCauseValue")}
                </span>
              </div>
            </div>
          </ProductCard>
        </div>
      </Container>
    </section>
  );
}
