"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Container } from "@/components/ui/Container";
import { WindowChrome } from "@/components/ui/WindowChrome";
import { useTranslations } from "@/i18n/useTranslations";
import { DEMO_REGISTRY, type SolutionId } from "@/components/solutions/demos";

type DictItem = {
  id: SolutionId;
  num: string;
  title: string;
  blurb: string;
  challenge: string;
  solution: string;
};

type DictGroup = { label: string; items: DictItem[] };

const MOBILE_BREAKPOINT = 1024;
/** Fraction of the viewport height a title must cross to become active. */
const ACTIVATION_LINE = 0.5;

export function SolutionsScrollDemo() {
  const { raw } = useTranslations("solutions");
  const { t: tDemo } = useTranslations("solutions.demo");
  const groups = raw<DictGroup[]>("groups") ?? [];
  const [activeId, setActiveId] = useState<SolutionId>("doc-search");
  const [isMobile, setIsMobile] = useState(false);
  const itemRefs = useRef<Map<SolutionId, HTMLElement>>(new Map());
  const userClickedRef = useRef(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  // Activate whichever item's title has most recently crossed the activation
  // line. This fires on scroll rather than using IntersectionObserver ratios,
  // so the demo switches the moment a new title crosses — not after the
  // previous item has scrolled most of the way out.
  useEffect(() => {
    let rafId: number | null = null;

    const compute = () => {
      if (userClickedRef.current) return;
      const trigger = window.innerHeight * ACTIVATION_LINE;
      let bestId: SolutionId | null = null;
      let bestTop = -Infinity;

      itemRefs.current.forEach((el, id) => {
        const top = el.getBoundingClientRect().top;
        if (top > trigger) return;
        if (top > bestTop) {
          bestTop = top;
          bestId = id;
        }
      });

      if (bestId) setActiveId(bestId);
    };

    const onScroll = () => {
      if (rafId !== null) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(compute);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (rafId !== null) cancelAnimationFrame(rafId);
    };
  }, []);

  const handleCardClick = (id: SolutionId) => {
    userClickedRef.current = true;
    setActiveId(id);
    setTimeout(() => {
      userClickedRef.current = false;
    }, 800);
  };

  const active = DEMO_REGISTRY[activeId];
  const ActiveComponent = active.Component;

  return (
    <section className="pt-12 pb-0 lg:pt-24">
      <Container>
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[2fr_3fr] lg:gap-16 xl:gap-20">
          {/* ── Left: vertical timeline ── */}
          <div className="relative">
            {/* The connecting line — desktop only */}
            <div
              className="absolute hidden w-px lg:block"
              style={{
                left: "15px",
                top: 0,
                bottom: 0,
                background:
                  "linear-gradient(to bottom, var(--line) 60%, transparent 100%)",
              }}
            />

            {groups.map((group, groupIdx) => {
              const isLastGroup = groupIdx === groups.length - 1;
              return (
                <div key={group.label} className={groupIdx > 0 ? "mt-6 lg:mt-0" : ""}>
                  <div className="relative mb-4 flex items-center gap-3 pl-0 lg:mb-6 lg:pl-10">
                    <div
                      className="absolute hidden h-[9px] w-[9px] rounded-full bg-line-strong ring-2 ring-page lg:block"
                      style={{ left: "11px" }}
                    />
                    <span className="font-mono text-[10px] font-semibold tracking-widest text-ink-faint uppercase">
                      {group.label}
                    </span>
                  </div>

                  <div>
                    {group.items.map((item, itemIdx) => {
                      const isActive = activeId === item.id;
                      const isLastItem =
                        isLastGroup && itemIdx === group.items.length - 1;
                      const ItemDemo = DEMO_REGISTRY[item.id].Component;
                      return (
                        <div
                          key={item.id}
                          ref={(el) => {
                            if (el) itemRefs.current.set(item.id, el);
                          }}
                          onClick={() => handleCardClick(item.id)}
                          className={`relative flex cursor-pointer flex-col justify-start pl-0 lg:pl-14 ${
                            isLastItem
                              ? "min-h-0 pb-8 lg:min-h-[55vh]"
                              : "min-h-0 pb-8 lg:min-h-[75vh] lg:pb-40"
                          }`}
                        >
                          {/* Numbered badge — desktop only */}
                          <motion.div
                            className="absolute left-0 hidden h-8 w-8 items-center justify-center rounded-lg text-sm font-bold select-none lg:flex"
                            style={{ top: "2px" }}
                            animate={{
                              backgroundColor: isActive
                                ? "var(--brand-600)"
                                : "var(--subtle)",
                              color: isActive
                                ? "var(--brand-on)"
                                : "var(--ink-faint)",
                            }}
                            transition={{ duration: 0.25 }}
                          >
                            {item.num}
                          </motion.div>

                          <motion.h3
                            className="mb-2 text-xl leading-snug font-bold"
                            animate={{
                              color: isMobile
                                ? "var(--ink)"
                                : isActive
                                  ? "var(--ink)"
                                  : "var(--ink-faint)",
                            }}
                            transition={{ duration: 0.25 }}
                          >
                            {item.title}
                          </motion.h3>

                          <motion.p
                            className="text-base leading-relaxed"
                            animate={{
                              color: isMobile
                                ? "var(--ink-subtle)"
                                : isActive
                                  ? "var(--ink-subtle)"
                                  : "var(--ink-ghost)",
                            }}
                            transition={{ duration: 0.25 }}
                          >
                            {item.blurb}
                          </motion.p>

                          <div className="mt-5 flex flex-col gap-2 lg:-ml-14">
                            <motion.div
                              className="overflow-hidden rounded-xl bg-card px-4 py-3"
                              animate={{
                                opacity: isMobile ? 1 : isActive ? 1 : 0.25,
                              }}
                              transition={{ duration: 0.25 }}
                            >
                              <p className="mb-1.5 font-mono text-[10px] tracking-widest text-ink-subtle uppercase">
                                {tDemo("challengeLabel")}
                              </p>
                              <p className="text-sm leading-relaxed text-ink-muted">
                                {item.challenge}
                              </p>
                            </motion.div>
                            <motion.div
                              className="overflow-hidden rounded-xl bg-brand-50 px-4 py-3"
                              animate={{
                                opacity: isMobile ? 1 : isActive ? 1 : 0.25,
                              }}
                              transition={{ duration: 0.25 }}
                            >
                              <p className="mb-1.5 font-mono text-[10px] tracking-widest text-brand-600 uppercase">
                                {tDemo("solutionLabel")}
                              </p>
                              <p className="text-sm leading-relaxed text-ink-muted">
                                {item.solution}
                              </p>
                            </motion.div>
                          </div>

                          {/* Mobile: the demo panel is inline and always expanded */}
                          <div className="mt-4 lg:hidden">
                            <div className="overflow-hidden rounded-2xl bg-window shadow-[var(--shadow-window)] ring-1 ring-[var(--ring-window)]">
                              <WindowChrome
                                title={tDemo(
                                  `${DEMO_REGISTRY[item.id].i18nKey}.windowTitle`,
                                )}
                              />
                              <div className="h-[360px] overflow-hidden">
                                <ItemDemo />
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>

          {/* ── Right: sticky demo panel ── */}
          <div className="hidden lg:block">
            <div className="sticky top-[calc(50vh-250px)]">
              <motion.div
                className="w-full overflow-hidden rounded-2xl bg-window shadow-[var(--shadow-window)] ring-1 ring-[var(--ring-window)]"
                initial={{ opacity: 0, x: 24 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.55, delay: 0.08 }}
              >
                <WindowChrome>
                  <AnimatePresence mode="wait">
                    <motion.span
                      key={activeId}
                      className="ml-3 truncate font-mono text-xs text-ink-faint"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.12 }}
                    >
                      {tDemo(`${active.i18nKey}.windowTitle`)}
                    </motion.span>
                  </AnimatePresence>
                </WindowChrome>

                <div className="h-[460px] overflow-hidden">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={activeId}
                      className="h-full"
                      initial={{ opacity: 0, y: 12, scale: 0.99 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -8, scale: 0.99 }}
                      transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                    >
                      <ActiveComponent />
                    </motion.div>
                  </AnimatePresence>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
