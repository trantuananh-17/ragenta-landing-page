"use client";

import { motion } from "framer-motion";
import { useSignupFlow } from "@/lib/SignupFlowContext";
import { WindowChrome } from "@/components/ui/WindowChrome";

/**
 * The three-up card used by every section of the product page: a small window
 * mockup, a heading, a body and a "learn more". Nine instances share it, so it
 * lives here rather than being retyped per section.
 */
export function ProductCard({
  index,
  chromeTitle,
  heading,
  body,
  learnMore,
  ctaLocation,
  children,
}: {
  index: number;
  chromeTitle: string;
  heading: string;
  body: string;
  learnMore: string;
  ctaLocation: string;
  /** The mockup body, rendered under the window chrome. */
  children: React.ReactNode;
}) {
  const { openSignup } = useSignupFlow();

  return (
    <motion.div
      className="flex flex-col rounded-2xl bg-card p-6"
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.45, delay: index * 0.06 }}
    >
      <div className="mb-5 overflow-hidden rounded-lg bg-window shadow-sm ring-1 ring-[var(--ring-window)]">
        <WindowChrome size="sm" title={chromeTitle} />
        {children}
      </div>
      <p className="mb-1.5 text-base font-bold text-ink">{heading}</p>
      <p className="mb-3 flex-1 text-sm leading-relaxed text-ink-muted">{body}</p>
      <button
        onClick={() =>
          openSignup({ cta_text: "Learn more", cta_location: ctaLocation })
        }
        className="w-fit rounded-sm text-sm font-semibold text-brand-600 transition-colors hover:text-brand-700 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
      >
        {learnMore}
      </button>
    </motion.div>
  );
}

/** Centered section heading shared by the product page's sections. */
export function ProductSectionHeader({
  title,
  subtitle,
}: {
  title: string;
  subtitle: string;
}) {
  return (
    <motion.div
      className="mx-auto mb-14 max-w-3xl text-center"
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="mb-3 text-3xl font-bold tracking-tight text-ink sm:text-4xl">
        {title}
      </h2>
      <p className="text-lg text-ink-subtle">{subtitle}</p>
    </motion.div>
  );
}
