"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { useSignupFlow } from "@/lib/SignupFlowContext";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { useTranslations } from "@/i18n/useTranslations";

/**
 * Plan ids in the order they are sold, and their non-text behaviour. All copy
 * comes from the dictionary.
 *
 * There is no monthly/yearly toggle: every plan is billed monthly, and a toggle
 * offering a discount nobody can actually buy is a promise the checkout would
 * have to break.
 */
const PLANS = [
  { id: "free", featured: false, newTab: true, ctaAnalytics: "Start for free" },
  { id: "starter", featured: false, newTab: true, ctaAnalytics: "Start for free" },
  { id: "pro", featured: true, newTab: true, ctaAnalytics: "Start for free" },
  { id: "team", featured: false, newTab: true, ctaAnalytics: "Start a trial" },
  { id: "enterprise", featured: false, newTab: false, ctaAnalytics: "Contact us" },
];

type PlanText = {
  name: string;
  price: string;
  priceSuffix: string;
  credits: string;
  intro: string;
  cta: string;
  features: string[];
};

type NoteItem = { title: string; body: string };
type TopupText = { title: string; body: string; packs: string[] };

export function PricingPlans() {
  const { openSignup } = useSignupFlow();
  const { t, raw } = useTranslations("pricing");
  const notes = raw<NoteItem[]>("notes");
  const topup = raw<TopupText>("topup");

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
      </Container>

      <Container width="wide">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {PLANS.map((plan, index) => {
            const text = raw<PlanText>(`plans.${plan.id}`);
            return (
              <motion.div
                key={plan.id}
                className={`flex min-h-full flex-col rounded-2xl p-6 ${
                  plan.featured ? "bg-card ring-2 ring-brand-500" : "bg-card"
                }`}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.5, delay: index * 0.06 }}
              >
                <h2 className="text-xl font-semibold tracking-tight text-ink">
                  {text.name}
                </h2>

                <div className="mt-2 flex items-baseline gap-1">
                  <span className="text-3xl font-semibold tracking-tight text-ink">
                    {text.price}
                  </span>
                  {text.priceSuffix && (
                    <span className="text-sm font-medium text-ink-subtle">
                      {text.priceSuffix}
                    </span>
                  )}
                </div>

                <p className="mt-2 min-h-10 text-xs leading-5 font-medium text-brand-600">
                  {text.credits}
                </p>

                <Button
                  variant={plan.featured ? "primary" : "secondary"}
                  size="md"
                  className="mt-5 w-full"
                  onClick={() =>
                    openSignup({
                      cta_text: plan.ctaAnalytics,
                      cta_location: `pricing_${plan.id}`,
                      newTab: plan.newTab,
                    })
                  }
                >
                  {text.cta}
                </Button>

                <p className="mt-6 text-sm text-ink-subtle">{text.intro}</p>

                <ul className="mt-3 space-y-2.5">
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

      <Container className="mt-5">
        <div className="grid gap-6 rounded-2xl bg-card p-6 md:grid-cols-[1fr_1fr] md:p-8">
          <div>
            <p className="mb-1.5 text-lg font-semibold text-ink">
              {topup.title}
            </p>
            <p className="max-w-md text-sm leading-relaxed text-ink-subtle">
              {topup.body}
            </p>
          </div>
          <ul className="grid gap-2 sm:grid-cols-2">
            {topup.packs.map((pack) => (
              <li
                key={pack}
                className="rounded-xl border border-line bg-window px-3.5 py-2.5 text-sm font-medium text-ink-muted"
              >
                {pack}
              </li>
            ))}
          </ul>
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
