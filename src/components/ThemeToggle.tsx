"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/lib/ThemeContext";
import { useTranslations } from "@/i18n/useTranslations";

/**
 * Light/dark switch.
 *
 * Which icon is correct depends on the resolved theme, and with a "system"
 * preference the server cannot know it. Rather than deferring the render until
 * mounted, both states are always in the markup and the `dark:` variant picks
 * one — so the button is correct from the first paint and there is nothing to
 * reconcile on hydration.
 */
export function ThemeToggle({
  variant = "desktop",
}: {
  variant?: "desktop" | "mobile";
}) {
  const { toggle } = useTheme();
  const { t } = useTranslations("nav");

  if (variant === "mobile") {
    return (
      <button
        type="button"
        onClick={toggle}
        className="flex w-full items-center justify-between rounded-sm border-b border-line-soft py-2 text-base font-medium text-ink-muted focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
      >
        <span>{t("theme.label")}</span>
        <span className="flex items-center gap-2 text-sm text-ink-subtle">
          <Sun size={16} aria-hidden="true" className="dark:hidden" />
          <Moon size={16} aria-hidden="true" className="hidden dark:block" />
          <span className="dark:hidden">{t("theme.light")}</span>
          <span className="hidden dark:inline">{t("theme.dark")}</span>
        </span>
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={t("theme.toggle")}
      title={t("theme.toggle")}
      className="flex size-8 items-center justify-center rounded-lg text-ink-subtle transition-colors hover:bg-subtle hover:text-brand-600 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
    >
      <Sun size={16} aria-hidden="true" className="dark:hidden" />
      <Moon size={16} aria-hidden="true" className="hidden dark:block" />
    </button>
  );
}
