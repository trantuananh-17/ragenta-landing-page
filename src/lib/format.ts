import type { Locale } from "@/i18n/config";

const BCP47: Record<Locale, string> = {
  en: "en-GB",
  vi: "vi-VN",
};

/**
 * Format an ISO date for display. Rendered on the server with an explicit
 * locale and UTC time zone, so the markup does not depend on where the request
 * was served from and never mismatches on hydration.
 */
export function formatDate(iso: string, locale: Locale): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  return new Intl.DateTimeFormat(BCP47[locale], {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  }).format(date);
}
