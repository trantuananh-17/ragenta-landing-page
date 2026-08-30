import "server-only";
import { defaultLocale, isLocale, type Locale } from "./config";
import en from "./dictionaries/en.json";

/**
 * English is the source of truth for the dictionary shape. `vi` must mirror
 * this structure; its JSON is cast to `Dictionary` so that translated
 * (non-literal) string values don't trip TypeScript's literal-type check.
 */
export type Dictionary = typeof en;

const loaders: Record<Locale, () => Promise<Dictionary>> = {
  en: () => Promise.resolve(en),
  vi: () => import("./dictionaries/vi.json").then((m) => m.default as Dictionary),
};

export function getDictionary(locale: Locale): Promise<Dictionary> {
  const safe = isLocale(locale) ? locale : defaultLocale;
  return loaders[safe]();
}
