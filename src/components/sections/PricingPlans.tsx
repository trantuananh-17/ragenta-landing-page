"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { useSignupFlow } from "@/lib/SignupFlowContext";
import { Container } from "@/components/ui/Container";
import { useTranslations } from "@/i18n/useTranslations";

type BillingCycle = "monthly" | "yearly";

// Plan ids and their non-text behaviour; all copy comes from the dictionary.
const PLANS = [
  { id: "free", featured: false, newTab: true, ctaAnalytics: "Start for free" },
  { id: "pro", featured: true, newTab: true, ctaAnalytics: "Start for free" },
  { id: "team", featured: false, newTab: true, ctaAnalytics: "Start a trial" },
  { id: "enterprise", featured: false, newTab: false, ctaAnalytics: "Contact us" },
];

type PlanText = {
  name: string;
  price: { monthly: string; yearly: string };
  priceSuffix: string;
  priceSuffixYearly?: string;
  intro: string;
  cta: string;
  features: string[];
};

type NoteItem = { title: string; body: string };

export function PricingPlans() {
  const [billingCycle, setBillingCycle] = useState<BillingCycle>("monthly");
  const { openSignup } = useSignupFlow();
  const { t, raw } = useTranslations("pricing");
  const notes = raw<NoteItem[]>("notes");

  return (
    <section className="pt-28 pb-16">
      <Container className="mb-10 text-center md:mb-12">
        <motion.h1
          className="mb-3 text-4xl leading-[1.1] font-semibold tracking-tight text-ink sm:text-5xl"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {t("heading")}
        </motion.h1>

        <motion.p
          className="mx-auto max-w-xl text-base leading-relaxed font-normal text-ink-subtle md:text-lg"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.08 }}
        >
          {t("subheading")}
        </motion.p>

        <motion.div
          className="mt-6 inline-flex rounded-xl border border-line bg-window/70 p-1 backdrop-blur-sm"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          role="tablist"
          aria-label="Billing cycle"
        >
          {(["monthly", "yearly"] as const).map((cycle) => {
            const isActive = billingCycle === cycle;
            return (
              <button
                key={cycle}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => setBillingCycle(cycle)}
                className={`rounded-lg px-5 py-2 text-sm font-semibold transition-all ${
                  isActive
                    ? "bg-brand-600 text-brand-on shadow-sm"
                    : "text-ink-subtle hover:text-ink"
                }`}
              >
                {t(`billing.${cycle}`)}
              </button>
            );
          })}
        </motion.div>
      </Container>

      <Container>
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {PLANS.map((plan, index) => {
            const text = raw<PlanText>(`plans.${plan.id}`);
            const isProYearly = plan.id === "pro" && billingCycle === "yearly";
            return (
              <motion.div
                key={plan.id}
                className="flex min-h-full flex-col rounded-2xl bg-card p-7 md:p-8"
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.5, delay: index * 0.08 }}
              >
                <h2 className="text-2xl font-semibold tracking-tight text-ink">
                  {text.name}
                </h2>

                <div className="mt-2 flex items-baseline gap-1">
                  <span className="text-3xl font-semibold tracking-tight text-ink">
                    {text.price[billingCycle]}
                  </span>
                  {text.priceSuffix && (
                    <span className="text-sm font-medium text-ink-subtle">
                      {isProYearly && text.priceSuffixYearly
                        ? text.priceSuffixYearly
                        : text.priceSuffix}
                    </span>
                  )}
                </div>

                <p
                  className={`mt-2 text-xs font-medium text-brand-600 transition-opacity duration-200 ${
                    isProYearly ? "opacity-100" : "opacity-0"
                  }`}
                  aria-hidden={!isProYearly}
                >
                  {t("proYearlyNote")}
                </p>

                <button
                  type="button"
                  onClick={() =>
                    openSignup({
                      cta_text: plan.ctaAnalytics,
                      cta_location: `pricing_${plan.id}`,
                      newTab: plan.newTab,
                    })
                  }
                  className={`mt-6 inline-flex w-full items-center justify-center rounded-full px-6 py-3 text-sm font-semibold transition-all ${
                    plan.featured
                      ? "bg-brand-600 text-brand-on hover:bg-brand-700"
                      : "bg-subtle text-ink-muted hover:text-brand-600"
                  }`}
                >
                  {text.cta}
                </button>

                <p className="mt-7 text-sm text-ink-subtle">{text.intro}</p>

                <ul className="mt-4 space-y-2.5">
                  {text.features.map((feature) => (
                    <li
                      key={feature}
                      className="flex gap-2 text-sm leading-6 text-ink-muted"
                    >
                      <Check className="mt-1 h-3.5 w-3.5 shrink-0 text-brand-600" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            );
          })}
        </div>
      </Container>

      <Container className="mt-5 grid gap-4 sm:grid-cols-3">
        {notes.map((item) => (
          <div key={item.title} className="rounded-2xl bg-card p-5">
            <p className="mb-1.5 text-sm font-semibold text-ink">{item.title}</p>
            <p className="text-sm leading-relaxed text-ink-subtle">{item.body}</p>
          </div>
        ))}
      </Container>
    </section>
  );
}
