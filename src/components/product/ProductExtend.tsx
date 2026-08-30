"use client";

import { Container } from "@/components/ui/Container";
import {
  ProductCard,
  ProductSectionHeader,
} from "@/components/product/ProductCard";
import { useTranslations } from "@/i18n/useTranslations";

// Product and command names are identifiers, so they stay in code; the labels
// beside them (`connectorTags`, `skillDescs`, `mcpConnections`) are translated.
const CONNECTOR_NAMES = [
  "Google Drive",
  "Notion",
  "Confluence",
  "Slack",
  "Zendesk",
];

const SKILL_NAMES = [
  "/support-reply",
  "/contract-diff",
  "/rfp-answer",
  "/weekly-digest",
  "/clause-search",
];

export function ProductExtend() {
  const { t, raw } = useTranslations("product");
  const connectorTags = raw<string[]>("extend.connectorTags");
  const skillDescs = raw<string[]>("extend.skillDescs");
  const mcpConnections =
    raw<{ name: string; status: string }[]>("extend.mcpConnections");

  return (
    <section className="py-24">
      <Container>
        <ProductSectionHeader
          title={t("extend.title")}
          subtitle={t("extend.subtitle")}
        />

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <ProductCard
            index={0}
            chromeTitle={t("extend.connectorsChrome")}
            heading={t("extend.connectorsHeading")}
            body={t("extend.connectorsBody")}
            learnMore={t("extend.learnMore")}
            ctaLocation="product_extend"
          >
            <div className="space-y-1.5 p-3">
              {CONNECTOR_NAMES.map((name, i) => (
                <div
                  key={name}
                  className="flex items-center justify-between text-[10px]"
                >
                  <div className="flex items-center gap-2">
                    <div className="h-4 w-4 rounded bg-brand-100" />
                    <span className="text-ink-muted">{name}</span>
                  </div>
                  <span className="font-mono text-ink-faint">
                    {connectorTags[i]}
                  </span>
                </div>
              ))}
            </div>
          </ProductCard>

          <ProductCard
            index={1}
            chromeTitle={t("extend.skillsChrome")}
            heading={t("extend.skillsHeading")}
            body={t("extend.skillsBody")}
            learnMore={t("extend.learnMore")}
            ctaLocation="product_extend"
          >
            <div className="space-y-1.5 p-3">
              {SKILL_NAMES.map((name, i) => (
                <div key={name} className="text-[10px]">
                  <p className="font-mono font-semibold text-brand-600">{name}</p>
                  <p className="mt-0.5 pl-1 text-ink-subtle">{skillDescs[i]}</p>
                </div>
              ))}
            </div>
          </ProductCard>

          <ProductCard
            index={2}
            chromeTitle={t("extend.mcpChrome")}
            heading={t("extend.mcpHeading")}
            body={t("extend.mcpBody")}
            learnMore={t("extend.learnMore")}
            ctaLocation="product_extend"
          >
            <div className="space-y-1.5 p-3">
              {mcpConnections.map((c) => (
                <div
                  key={c.name}
                  className="flex items-center justify-between text-[10px]"
                >
                  <div className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-ok" />
                    <span className="font-mono text-ink-muted">{c.name}</span>
                  </div>
                  <span className="font-mono text-[9px] text-ok">{c.status}</span>
                </div>
              ))}
            </div>
          </ProductCard>
        </div>
      </Container>
    </section>
  );
}
