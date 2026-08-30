"use client";

import { LocaleLink } from "@/i18n/LocaleLink";
import { useSignupFlow } from "@/lib/SignupFlowContext";
import { useTranslations } from "@/i18n/useTranslations";

/**
 * The standard "Start for free" / "Book a demo" pair. Stacks full-width on
 * mobile (so labels never wrap mid-text) and sits inline from `sm` up.
 */
export function CtaButtons({
  location,
  className = "",
}: {
  location: string;
  className?: string;
}) {
  const { openSignup } = useSignupFlow();
  const { t } = useTranslations("common");

  return (
    <div
      className={`flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center sm:gap-5 ${className}`}
    >
      <button
        onClick={() =>
          openSignup({
            cta_text: "Start for free",
            cta_location: location,
            newTab: true,
          })
        }
        className="btn-primary w-full whitespace-nowrap sm:w-auto"
      >
        {t("tryRagenta")}
      </button>
      <LocaleLink
        href="/contact"
        className="btn-secondary w-full whitespace-nowrap sm:w-auto"
      >
        {t("requestDemo")} →
      </LocaleLink>
    </div>
  );
}
