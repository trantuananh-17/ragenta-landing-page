"use client";

import { Container } from "@/components/ui/Container";
import { useTranslations } from "@/i18n/useTranslations";

// Model providers Ragenta can route to. Rendered as plain wordmarks rather
// than logo files: nothing to 404, and no third-party mark is reproduced.
const PROVIDERS = ["Anthropic", "OpenAI", "Google", "Meta", "Mistral", "Qwen"];

export function Providers() {
  const { t } = useTranslations("home.partners");
  return (
    <section className="py-16">
      <Container>
        <p className="mb-10 text-center text-xs tracking-widest text-ink-faint uppercase">
          {t("supportedBy")}
        </p>
        <div className="grid grid-cols-3 items-center justify-items-center gap-x-4 gap-y-8 sm:gap-x-10 md:grid-cols-6">
          {PROVIDERS.map((provider) => (
            <span
              key={provider}
              className="font-heading text-base font-semibold tracking-tight text-ink-faint transition-colors duration-200 hover:text-ink-subtle sm:text-lg"
            >
              {provider}
            </span>
          ))}
        </div>
      </Container>
    </section>
  );
}
