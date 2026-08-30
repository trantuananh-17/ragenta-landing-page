"use client";

import { useCallback } from "react";
import { useI18n } from "./I18nProvider";
import type { Locale } from "./config";

type Vars = Record<string, string | number>;

/** Resolve a dot-path (e.g. "hero.title") against a nested object. */
function resolvePath(obj: unknown, path: string): unknown {
  return path.split(".").reduce<unknown>((acc, key) => {
    if (acc && typeof acc === "object") {
      return (acc as Record<string, unknown>)[key];
    }
    return undefined;
  }, obj);
}

function interpolate(template: string, vars?: Vars): string {
  if (!vars) return template;
  return template.replace(/\{(\w+)\}/g, (match, key) =>
    key in vars ? String(vars[key]) : match,
  );
}

export interface Translator {
  /** Translate a key to a string. Falls back to the key itself if missing. */
  t: (key: string, vars?: Vars) => string;
  /** Read a raw (non-string) value such as an array or object for `.map()`. */
  raw: <T = unknown>(key: string) => T;
  locale: Locale;
}

/**
 * Access translations inside client components. Pass a `namespace` to scope
 * keys (e.g. useTranslations("nav") then t("pricing")). The returned `t`/`raw`
 * are referentially stable across renders (React Compiler friendly).
 */
export function useTranslations(namespace?: string): Translator {
  const { dict, locale } = useI18n();

  const lookup = useCallback(
    (key: string): unknown => {
      const fullKey = namespace ? `${namespace}.${key}` : key;
      return resolvePath(dict, fullKey);
    },
    [dict, namespace],
  );

  const t = useCallback(
    (key: string, vars?: Vars): string => {
      const value = lookup(key);
      if (typeof value === "string") return interpolate(value, vars);
      // Missing or non-string — surface the key so gaps are visible, not blank.
      return namespace ? `${namespace}.${key}` : key;
    },
    [lookup, namespace],
  );

  const raw = useCallback(
    <T = unknown>(key: string): T => lookup(key) as T,
    [lookup],
  );

  return { t, raw, locale };
}
