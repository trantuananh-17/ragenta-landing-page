"use client";

import { Container } from "@/components/ui/Container";
import {
  ProductCard,
  ProductSectionHeader,
} from "@/components/product/ProductCard";
import { useTranslations } from "@/i18n/useTranslations";

type Subagent = { name: string; status: string; model: string };
type Source = { tool: string; value: string };
type TeamRule = { rule: string; scope: string };

const SUBAGENT_DONE = [true, false, false, false];

export function ProductUnderstands() {
  const { t, raw } = useTranslations("product");
  const subagents = raw<Subagent[]>("understands.subagents");
  const sources = raw<Source[]>("understands.sources");
  const teamRules = raw<TeamRule[]>("understands.teamRules");

  return (
    <section className="py-24">
      <Container>
        <ProductSectionHeader
          title={t("understands.title")}
          subtitle={t("understands.subtitle")}
        />

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <ProductCard
            index={0}
            chromeTitle={t("understands.subagentsTitle")}
            heading={t("understands.subagentsHeading")}
            body={t("understands.subagentsBody")}
            learnMore={t("understands.learnMore")}
            ctaLocation="product_understands"
          >
            <div className="space-y-2 p-3">
              {subagents.map((s, i) => (
                <div key={s.name} className="flex items-center gap-2.5">
                  <span
                    className={`h-1.5 w-1.5 shrink-0 rounded-full ${
                      SUBAGENT_DONE[i] ? "bg-ok" : "bg-brand-500"
                    }`}
                  />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[11px] text-ink-muted">{s.name}</p>
                    <p className="mt-0.5 font-mono text-[10px] text-ink-faint">
                      {s.status} · {s.model}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </ProductCard>

          <ProductCard
            index={1}
            chromeTitle={t("understands.knowledgeTitle")}
            heading={t("understands.knowledgeHeading")}
            body={t("understands.knowledgeBody")}
            learnMore={t("understands.learnMore")}
            ctaLocation="product_understands"
          >
            <div className="p-3">
              <p className="mb-2.5 text-[11px] text-ink-subtle italic">
                {t("understands.knowledgeQuery")}
              </p>
              <div className="space-y-1">
                {sources.map((s) => (
                  <div key={s.tool} className="flex items-baseline gap-2 text-[10px]">
                    <span className="shrink-0 font-mono font-semibold text-brand-600">
                      {s.tool}
                    </span>
                    <span className="truncate text-ink-subtle">{s.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </ProductCard>

          <ProductCard
            index={2}
            chromeTitle={t("understands.rulesTitle")}
            heading={t("understands.rulesHeading")}
            body={t("understands.rulesBody")}
            learnMore={t("understands.learnMore")}
            ctaLocation="product_understands"
          >
            <div className="space-y-2 p-3">
              {teamRules.map((r) => (
                <div key={r.rule} className="flex gap-2">
                  <span className="mt-0.5 text-[10px] text-brand-600">▸</span>
                  <div>
                    <p className="text-[11px] leading-snug text-ink-muted">
                      {r.rule}
                    </p>
                    <p className="mt-0.5 font-mono text-[10px] text-ink-faint">
                      {r.scope}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </ProductCard>
        </div>
      </Container>
    </section>
  );
}
