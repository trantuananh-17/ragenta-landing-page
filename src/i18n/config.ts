export const locales = ["en", "vi"] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "en";

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}

/** Human-readable labels for the language switcher (in their own language). */
export const localeLabels: Record<Locale, string> = {
  en: "English",
  vi: "Tiếng Việt",
};
