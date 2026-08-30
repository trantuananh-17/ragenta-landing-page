"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { usePostHog } from "@posthog/next";
import { ArrowRight, ChevronDown } from "lucide-react";
import { LocaleLink } from "@/i18n/LocaleLink";
import { Container } from "@/components/ui/Container";
import { getAttributionProps } from "@/lib/attribution";
import { useTranslations } from "@/i18n/useTranslations";

type Testimonial = { quote: string; name: string; org: string };

const QUOTE_ROTATE_MS = 7000;

export function ContactForm() {
  const posthog = usePostHog();
  const { t, raw } = useTranslations("contact");
  const { raw: rawTestimonials } = useTranslations("testimonials");
  const testimonials = rawTestimonials<Testimonial[]>("items");
  const helpOptions = raw<string[]>("helpOptions");

  // Starts blank on purpose: pre-selecting the first option would make it the
  // silent default on every submission that never touched the dropdown.
  const [help, setHelp] = useState("");
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [helpError, setHelpError] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [quoteIndex, setQuoteIndex] = useState(0);
  const formStarted = useRef(false);
  const helpRef = useRef<HTMLButtonElement>(null);

  // Fire form_start once, on first interaction — measures drop-off before submit.
  const handleFormStart = () => {
    if (formStarted.current) return;
    formStarted.current = true;
    posthog?.capture("form_start", {
      form_id: "contact",
      landing_page: getAttributionProps().landing_page ?? null,
    });
  };

  useEffect(() => {
    const id = window.setInterval(
      () => setQuoteIndex((i) => (i + 1) % testimonials.length),
      QUOTE_ROTATE_MS,
    );
    return () => window.clearInterval(id);
  }, [testimonials.length]);

  const quote = testimonials[quoteIndex];

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (submitting) return;

    // The topic control is a button, not a <select>, so the browser's own
    // required-field check never sees it — enforce it here.
    if (!help) {
      setHelpError(true);
      helpRef.current?.focus();
      return;
    }

    const data = new FormData(e.currentTarget);
    const attribution = getAttributionProps();
    const company = String(data.get("company") ?? "");
    const position = String(data.get("position") ?? "");
    const message = String(data.get("message") ?? "");

    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: String(data.get("email") ?? ""),
          name: String(data.get("name") ?? ""),
          company,
          position,
          help,
          message,
          attribution,
        }),
      });
      if (!res.ok) {
        const detail = (await res.json().catch(() => null)) as {
          message?: string;
        } | null;
        throw new Error(detail?.message ?? t("errorGeneric"));
      }
      setSubmitted(true);
      posthog?.capture("demo_request_submit", {
        form_id: "contact",
        help,
        has_message: message.trim().length > 0,
        has_company: company.trim().length > 0,
        has_position: position.trim().length > 0,
        ...attribution,
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : t("errorShort");
      setError(errorMessage);
      posthog?.capture("demo_request_failed", {
        form_id: "contact",
        error_message: errorMessage,
        ...attribution,
      });
    } finally {
      setSubmitting(false);
    }
  };

  const fieldClass =
    "w-full rounded-lg border border-line bg-window px-4 py-3 text-sm text-ink outline-none transition-all placeholder:text-ink-faint focus:border-brand-400 focus:ring-2 focus:ring-brand-500/15";

  return (
    <section className="pt-28 pb-16">
      <Container className="grid items-start gap-10 lg:grid-cols-2 lg:grid-rows-[auto_1fr] lg:gap-x-16 lg:gap-y-8">
        <motion.h1
          className="order-1 text-4xl leading-[1.1] font-semibold tracking-tight text-ink sm:text-5xl lg:col-start-1 lg:row-start-1"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {t("heading")}
        </motion.h1>

        {/* Testimonial — below the form on mobile, under the heading on desktop */}
        <motion.div
          className="order-3 rounded-2xl bg-card p-7 md:p-10 lg:order-none lg:col-start-1 lg:row-start-2"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <div className="relative min-h-[260px] md:min-h-[240px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={quoteIndex}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
              >
                <p className="mb-8 text-lg leading-relaxed text-ink-muted md:text-xl">
                  &ldquo;{quote.quote}&rdquo;
                </p>
                <div>
                  <p className="text-base leading-snug font-semibold text-ink">
                    {quote.name}
                  </p>
                  <p className="mt-0.5 text-sm text-ink-subtle">{quote.org}</p>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          <div
            className="mt-6 flex items-center gap-1.5"
            role="tablist"
            aria-label={t("testimonialsAria")}
          >
            {testimonials.map((_, i) => (
              <button
                key={i}
                type="button"
                role="tab"
                aria-selected={i === quoteIndex}
                aria-label={t("testimonialAria", { n: i + 1 })}
                onClick={() => setQuoteIndex(i)}
                className={`h-1.5 rounded-full transition-all ${
                  i === quoteIndex
                    ? "w-6 bg-brand-600"
                    : "w-1.5 bg-line-strong hover:bg-ink-faint"
                }`}
              />
            ))}
          </div>
        </motion.div>

        {/* Form */}
        <motion.div
          className="order-2 rounded-2xl bg-card p-7 md:p-10 lg:order-none lg:col-start-2 lg:row-span-2 lg:row-start-1"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
        >
          <h2
            className={`mb-7 text-2xl font-semibold text-ink transition-opacity duration-300 md:text-3xl ${
              submitted ? "opacity-0" : "opacity-100"
            }`}
            aria-hidden={submitted}
          >
            {t("formHeading")}
          </h2>

          {/* Grid-stack so the success state shares the form's natural height */}
          <div className="grid">
            <div
              className={`flex [grid-area:1/1] flex-col items-start text-left transition-opacity duration-300 ${
                submitted ? "opacity-100" : "pointer-events-none opacity-0"
              }`}
              aria-hidden={!submitted}
            >
              <AnimatePresence>
                {submitted && (
                  <>
                    <motion.h3
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1, duration: 0.35 }}
                      className="mb-3 text-2xl leading-tight font-semibold tracking-tight text-ink md:text-[28px]"
                    >
                      {t("successHeading")}
                    </motion.h3>
                    <motion.p
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.35, duration: 0.35 }}
                      className="mb-7 max-w-md text-base leading-relaxed text-ink-subtle"
                    >
                      {t("successBody")}
                    </motion.p>
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.45, duration: 0.35 }}
                      className="flex flex-wrap items-center gap-3"
                    >
                      <LocaleLink
                        href="/"
                        className="inline-flex items-center gap-1.5 rounded-xl bg-brand-600 px-5 py-2.5 text-sm font-semibold text-brand-on transition-all hover:-translate-y-0.5 hover:bg-brand-700 hover:shadow-lg"
                      >
                        {t("successBackHome")}
                      </LocaleLink>
                      <button
                        type="button"
                        onClick={() => setSubmitted(false)}
                        className="inline-flex items-center gap-1.5 rounded-xl bg-subtle px-5 py-2.5 text-sm font-semibold text-ink-muted transition-colors hover:text-brand-600"
                      >
                        {t("successSendAnother")}
                      </button>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>

            <form
              onSubmit={handleSubmit}
              onFocus={handleFormStart}
              className={`space-y-5 [grid-area:1/1] transition-opacity duration-300 ${
                submitted ? "pointer-events-none opacity-0" : "opacity-100"
              }`}
              aria-hidden={submitted}
            >
              <div>
                <label
                  htmlFor="email"
                  className="mb-1.5 block text-sm font-medium text-ink-muted"
                >
                  {t("emailLabel")} <span className="text-brand-600">*</span>
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  placeholder={t("emailPlaceholder")}
                  className={fieldClass}
                />
              </div>

              <div>
                <label
                  htmlFor="name"
                  className="mb-1.5 block text-sm font-medium text-ink-muted"
                >
                  {t("nameLabel")} <span className="text-brand-600">*</span>
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  placeholder={t("namePlaceholder")}
                  className={fieldClass}
                />
              </div>

              <div>
                <label
                  htmlFor="company"
                  className="mb-1.5 block text-sm font-medium text-ink-muted"
                >
                  {t("companyLabel")}
                </label>
                <input
                  id="company"
                  name="company"
                  type="text"
                  placeholder={t("companyPlaceholder")}
                  className={fieldClass}
                />
              </div>

              <div>
                <label
                  htmlFor="position"
                  className="mb-1.5 block text-sm font-medium text-ink-muted"
                >
                  {t("positionLabel")}
                </label>
                <input
                  id="position"
                  name="position"
                  type="text"
                  placeholder={t("positionPlaceholder")}
                  className={fieldClass}
                />
              </div>

              <div className="relative">
                <label
                  htmlFor="help"
                  className="mb-1.5 block text-sm font-medium text-ink-muted"
                >
                  {t("helpLabel")} <span className="text-brand-600">*</span>
                </label>
                <button
                  id="help"
                  ref={helpRef}
                  type="button"
                  onClick={() => setIsHelpOpen((v) => !v)}
                  // combobox rather than the implicit button role: this opens a
                  // listbox and holds a value, and only combobox carries
                  // aria-invalid for the required-field state below.
                  role="combobox"
                  aria-haspopup="listbox"
                  aria-expanded={isHelpOpen}
                  aria-controls="help-listbox"
                  aria-invalid={helpError}
                  aria-describedby={helpError ? "help-error" : undefined}
                  className={`flex w-full items-center justify-between rounded-lg border bg-window px-4 py-3 text-sm text-ink transition-all outline-none focus:ring-2 ${
                    helpError
                      ? "border-bad focus:border-bad focus:ring-bad/15"
                      : "border-line focus:border-brand-400 focus:ring-brand-500/15"
                  }`}
                >
                  <span className={help ? "" : "text-ink-faint"}>
                    {help || t("helpPlaceholder")}
                  </span>
                  <ChevronDown
                    className={`h-4 w-4 text-ink-faint transition-transform ${
                      isHelpOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {isHelpOpen && (
                  <ul
                    id="help-listbox"
                    role="listbox"
                    className="absolute z-10 mt-2 w-full overflow-hidden rounded-lg border border-line bg-window p-1 shadow-lg"
                  >
                    {helpOptions.map((opt) => (
                      <li
                        key={opt}
                        role="option"
                        aria-selected={help === opt}
                        onClick={() => {
                          setHelp(opt);
                          setHelpError(false);
                          setIsHelpOpen(false);
                        }}
                        className={`cursor-pointer rounded-md px-3 py-2 text-sm transition-colors ${
                          help === opt
                            ? "bg-brand-50 font-medium text-brand-600"
                            : "text-ink-muted hover:bg-panel"
                        }`}
                      >
                        {opt}
                      </li>
                    ))}
                  </ul>
                )}
                {helpError && (
                  <p
                    id="help-error"
                    role="alert"
                    className="mt-1.5 text-sm text-bad"
                  >
                    {t("helpRequired")}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="message"
                  className="mb-1.5 block text-sm font-medium text-ink-muted"
                >
                  {t("messageLabel")}
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={4}
                  placeholder={t("messagePlaceholder")}
                  className={`${fieldClass} resize-none`}
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="inline-flex items-center gap-2 rounded-xl bg-brand-600 px-6 py-3 text-sm font-semibold text-brand-on transition-all hover:-translate-y-0.5 hover:bg-brand-700 hover:shadow-lg focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 focus:ring-offset-card focus:outline-none disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0 disabled:hover:bg-brand-600 disabled:hover:shadow-none"
              >
                {submitting ? t("submitting") : t("submit")}
                <ArrowRight className="h-4 w-4" />
              </button>

              {error && (
                <p role="alert" className="text-sm leading-relaxed text-bad">
                  {error}
                </p>
              )}

              <p className="pt-1 text-xs leading-relaxed text-ink-subtle">
                {t("privacyPrefix")}{" "}
                <LocaleLink
                  href="/privacy-policy"
                  className="underline underline-offset-2 hover:text-brand-600"
                >
                  {t("privacyLink")}
                </LocaleLink>
                {t("privacySuffix")}
              </p>
            </form>
          </div>
        </motion.div>
      </Container>
    </section>
  );
}
