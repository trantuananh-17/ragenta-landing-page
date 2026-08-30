"use client";

import { useState, useRef, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Globe, Check } from "lucide-react";
import { useI18n } from "@/i18n/I18nProvider";
import { locales, localeLabels, isLocale, type Locale } from "@/i18n/config";
import { useTranslations } from "@/i18n/useTranslations";

/** Persist the chosen locale so the proxy honors it on un-prefixed visits. */
function persistLocale(next: Locale): void {
  document.cookie = `NEXT_LOCALE=${next}; path=/; max-age=31536000; samesite=lax`;
}

/** Swap the leading /<locale> segment of the current path for `next`. */
function swapLocale(pathname: string, next: Locale): string {
  const segments = pathname.split("/"); // ["", "en", "pricing"]
  if (segments.length > 1 && isLocale(segments[1])) {
    segments[1] = next;
  } else {
    segments.splice(1, 0, next);
  }
  return segments.join("/") || `/${next}`;
}

export function LanguageSwitcher({
  variant = "desktop",
}: {
  variant?: "desktop" | "mobile";
}) {
  const { locale } = useI18n();
  const { t } = useTranslations("nav");
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [open]);

  const choose = (next: Locale) => {
    setOpen(false);
    if (next === locale) return;
    persistLocale(next);
    router.push(swapLocale(pathname, next));
  };

  if (variant === "mobile") {
    return (
      <div className="border-b border-line-soft pb-2">
        <p className="py-2 text-xs font-semibold tracking-wider text-ink-faint uppercase">
          {localeLabels[locale]}
        </p>
        <div className="flex flex-wrap gap-2 pt-1 pl-3">
          {locales.map((l) => (
            <button
              key={l}
              type="button"
              onClick={() => choose(l)}
              className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
                l === locale
                  ? "bg-brand-50 text-brand-600"
                  : "text-ink-muted hover:text-brand-600"
              }`}
            >
              {localeLabels[l]}
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="true"
        aria-expanded={open}
        aria-label={t("languageSwitcher.label")}
        className="flex items-center gap-1.5 text-sm font-medium text-ink-subtle transition-colors hover:text-brand-600"
      >
        <Globe size={16} aria-hidden="true" />
        <span>{localeLabels[locale]}</span>
      </button>
      {open && (
        <div className="absolute top-full right-0 z-10 w-40 origin-top-right pt-3">
          <div className="overflow-hidden rounded-xl border border-line bg-card/95 p-1.5 shadow-lg backdrop-blur-sm">
            {locales.map((l) => (
              <button
                key={l}
                type="button"
                onClick={() => choose(l)}
                className="flex w-full items-center justify-between rounded-lg px-3 py-1.5 text-sm font-medium text-ink-subtle transition-colors hover:text-brand-600"
              >
                <span>{localeLabels[l]}</span>
                {l === locale && (
                  <Check size={14} className="text-brand-600" aria-hidden="true" />
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
