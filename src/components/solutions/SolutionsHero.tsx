"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSignupFlow } from "@/lib/SignupFlowContext";
import { Container } from "@/components/ui/Container";
import { WindowChrome } from "@/components/ui/WindowChrome";
import { useTranslations } from "@/i18n/useTranslations";
import { LocaleLink } from "@/i18n/LocaleLink";
import { buttonClasses } from "@/components/ui/Button";
import { DEMO_REGISTRY } from "@/components/solutions/demos";

// One accent per rotating industry, cycled with the label.
const INDUSTRY_COLORS = [
  "var(--brand-600)",
  "#db2777",
  "#ea580c",
  "#0891b2",
];

const ROTATE_MS = 2800;

export function SolutionsHero() {
  const { openSignup } = useSignupFlow();
  const { t, raw } = useTranslations("solutions");
  const { t: tDemo } = useTranslations("solutions.demo");
  const industries = raw<string[]>("hero.industries") ?? [];
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    const count = industries.length || INDUSTRY_COLORS.length;
    const id = setInterval(() => setIdx((i) => (i + 1) % count), ROTATE_MS);
    return () => clearInterval(id);
  }, [industries.length]);

  const label = industries[idx] ?? "";
  const color = INDUSTRY_COLORS[idx % INDUSTRY_COLORS.length];
  const Preview = DEMO_REGISTRY["support-agent"].Component;

  return (
    <section className="border-b border-line-soft pt-24 pb-16 sm:pt-32 sm:pb-24">
      <Container>
        <motion.h1
          className="mb-4 text-3xl leading-[1.15] font-semibold tracking-tight text-ink sm:text-4xl lg:text-5xl"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {t("hero.titlePrefix")} <br className="hidden sm:block" />
          {t("hero.titleBuiltFor")}{" "}
          <span className="inline-block overflow-hidden align-bottom">
            <AnimatePresence mode="wait">
              <motion.span
                key={label}
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                exit={{ y: "-100%" }}
                transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                className="inline-block"
                style={{ color }}
              >
                {label}
              </motion.span>
            </AnimatePresence>
          </span>
        </motion.h1>

        <motion.p
          className="mb-8 max-w-xl text-base leading-relaxed text-ink-subtle sm:text-xl"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.08 }}
        >
          {t("hero.subtitle")}
        </motion.p>

        <motion.div
          className="flex flex-wrap items-center gap-3"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.14 }}
        >
          <button
            onClick={() =>
              openSignup({
                cta_text: "Start for free",
                cta_location: "solutions_hero",
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

      <motion.div
        className="mx-auto mt-14 w-full max-w-5xl px-4 md:px-8"
        initial={{ opacity: 0, y: 48 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
      >
        <div
          onMouseMove={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            e.currentTarget.style.setProperty("--mx", `${e.clientX - rect.left}px`);
            e.currentTarget.style.setProperty("--my", `${e.clientY - rect.top}px`);
          }}
          className="w-full p-0 max-md:!bg-none md:rounded-2xl md:p-14 md:shadow-[var(--shadow-hero)] md:ring-1 md:ring-[var(--ring-window)]"
          style={{
            backgroundColor: "var(--spotlight)",
            backgroundImage:
              "radial-gradient(circle 520px at var(--mx, 50%) var(--my, 50%), rgba(167,139,250,0.30) 0%, rgba(167,139,250,0.10) 35%, transparent 70%)," +
              "radial-gradient(ellipse at 18% 65%, rgba(139,92,246,0.38) 0%, transparent 52%)," +
              "radial-gradient(ellipse at 78% 25%, rgba(109,40,217,0.34) 0%, transparent 48%)," +
              "radial-gradient(ellipse at 52% 90%, rgba(76,29,149,0.55) 0%, transparent 50%)",
          }}
        >
          <div className="w-full overflow-hidden rounded-xl bg-window shadow-[var(--shadow-window)] ring-1 ring-[var(--ring-window)]">
            <WindowChrome title={tDemo("supportAgent.windowTitle")} />
            <div className="h-[420px] overflow-hidden">
              <Preview />
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
