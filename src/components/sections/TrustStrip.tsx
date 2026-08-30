"use client";

import { ShieldCheck, BadgeCheck, KeyRound, Server } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { useTranslations } from "@/i18n/useTranslations";

// Icons stay in code, ordered to match the dictionary `items` array.
const TRUST_ICONS = [ShieldCheck, BadgeCheck, KeyRound, Server];

export function TrustStrip() {
  const { t, raw } = useTranslations("home.trustStrip");
  const items = raw<{ label: string; sub: string }[]>("items");

  return (
    <section className="py-12">
      <Container>
        <p className="mb-8 text-center text-xs tracking-widest text-ink-faint uppercase">
          {t("eyebrow")}
        </p>
        <div className="grid grid-cols-2 gap-x-6 gap-y-8 md:flex md:flex-wrap md:items-center md:justify-center md:gap-x-14">
          {items.map((item, i) => {
            const Icon = TRUST_ICONS[i];
            return (
              <div key={item.label} className="flex items-center gap-3">
                <Icon
                  className="h-6 w-6 shrink-0 text-brand-600"
                  strokeWidth={1.5}
                  aria-hidden="true"
                />
                <div>
                  <p className="text-base leading-none font-semibold text-ink-muted">
                    {item.label}
                  </p>
                  <p className="mt-1 text-sm text-ink-faint">{item.sub}</p>
                </div>
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
