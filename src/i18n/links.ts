import { isLocale, type Locale } from "./config";

/**
 * Prefix an internal path with a locale segment.
 *
 *   localizedHref("vi", "/pricing") -> "/vi/pricing"
 *   localizedHref("vi", "/")        -> "/vi"
 *   localizedHref("vi", "/en/blog") -> "/vi/blog"   (re-localizes an already-prefixed path)
 *
 * External URLs (http/https/mailto/tel) and hash/anchor links are returned untouched.
 */
export function localizedHref(locale: Locale, path: string): string {
  if (!path) return `/${locale}`;
  if (/^(https?:|mailto:|tel:|#)/.test(path)) return path;

  const withSlash = path.startsWith("/") ? path : `/${path}`;

  // Strip an existing locale prefix so we don't double up.
  const segments = withSlash.split("/"); // ["", "en", "pricing"]
  if (segments.length > 1 && isLocale(segments[1])) {
    segments.splice(1, 1);
  }
  const rest = segments.join("/"); // "/pricing" or ""

  if (rest === "" || rest === "/") return `/${locale}`;
  return `/${locale}${rest}`;
}
