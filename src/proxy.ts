import { NextResponse, type NextRequest } from "next/server";
import { locales, defaultLocale, isLocale, type Locale } from "@/i18n/config";
import { SITE_URL } from "@/lib/site";

const LOCALE_COOKIE = "NEXT_LOCALE";

// Capture attribution from the URL on the server side. Chrome's Link Tracking
// Protection (and equivalents in Firefox/Brave) strips UTM/click-id params from
// the URL bar on navigation BEFORE any client JS runs, but the HTTP request to
// the server still carries them — so the proxy is the only reliable place to
// observe them. Stored as cookies so the client (and the sibling app on the
// app.* subdomain, via the shared parent domain) can read them on every
// subsequent request. Source of truth for src/lib/attribution.ts.
const ATTRIBUTION_KEYS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_content",
  "utm_term",
  "gclid",
  "fbclid",
  "li_fat_id",
] as const;
const FIRST_COOKIE = "ragenta_attr_first";
const LAST_COOKIE = "ragenta_attr_last";
const ATTR_MAX_AGE_SECONDS = 60 * 60 * 24 * 365; // 1 year

/** Apex host of the deployment, derived from SITE_URL rather than hardcoded. */
const SITE_HOST = (() => {
  try {
    return new URL(SITE_URL).hostname;
  } catch {
    return "";
  }
})();

function cookieDomainFor(hostname: string): string | undefined {
  // Share across ragenta.ai + app.ragenta.ai. In local dev (localhost, preview
  // hosts) skip the domain attribute so the browser scopes the cookie to the
  // current host.
  if (!SITE_HOST || SITE_HOST === "localhost") return undefined;
  if (hostname === SITE_HOST || hostname.endsWith(`.${SITE_HOST}`)) {
    return `.${SITE_HOST}`;
  }
  return undefined;
}

function applyAttribution(request: NextRequest, response: NextResponse) {
  const url = request.nextUrl;

  const found: Record<string, string | null> = {};
  let any = false;
  for (const key of ATTRIBUTION_KEYS) {
    const v = url.searchParams.get(key);
    found[key] = v ?? null;
    if (v) any = true;
  }
  if (!any) return;

  const touch = {
    ...found,
    referrer: request.headers.get("referer") ?? null,
    landing_page: url.pathname + url.search,
    timestamp: new Date().toISOString(),
  };
  const value = JSON.stringify(touch);
  const opts = {
    domain: cookieDomainFor(url.hostname),
    path: "/",
    sameSite: "lax" as const,
    secure: url.protocol === "https:",
    httpOnly: false,
    maxAge: ATTR_MAX_AGE_SECONDS,
  };

  response.cookies.set(LAST_COOKIE, value, opts);
  if (!request.cookies.has(FIRST_COOKIE)) {
    response.cookies.set(FIRST_COOKIE, value, opts);
  }
}

function detectLocale(request: NextRequest): Locale {
  // 1. Explicit choice persisted by the language switcher.
  const cookie = request.cookies.get(LOCALE_COOKIE)?.value;
  if (cookie && isLocale(cookie)) return cookie;

  // 2. Accept-Language header, best match by quality order.
  const header = request.headers.get("accept-language");
  if (header) {
    const ranked = header
      .split(",")
      .map((part) => {
        const [tag, q] = part.trim().split(";q=");
        return { tag: tag.toLowerCase(), q: q ? parseFloat(q) : 1 };
      })
      .sort((a, b) => b.q - a.q);
    for (const { tag } of ranked) {
      const base = tag.split("-")[0];
      if (isLocale(base)) return base;
    }
  }

  return defaultLocale;
}

// Next.js 16 proxy convention: the handler MUST be a NAMED export `proxy`
// (a default export is silently ignored).
export function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  const hasLocale = locales.some(
    (locale) => pathname === `/${locale}` || pathname.startsWith(`/${locale}/`),
  );
  if (hasLocale) {
    const response = NextResponse.next();
    applyAttribution(request, response);
    return response;
  }

  const locale = detectLocale(request);
  const url = request.nextUrl.clone();
  url.pathname = `/${locale}${pathname === "/" ? "" : pathname}`;
  url.search = search;
  // Preserve UTM/click-id params through the locale redirect and set the
  // attribution cookies on the redirect response itself, so first-touch is
  // captured even though the URL is about to change.
  const response = NextResponse.redirect(url);
  applyAttribution(request, response);
  return response;
}

export const config = {
  matcher: [
    // Run on everything EXCEPT: api routes, Next internals, PostHog ingest,
    // metadata/asset routes, and any path containing a file extension.
    "/((?!api|_next/static|_next/image|ingest|sitemap.xml|robots.txt|llms.txt|opengraph-image|favicon|.*\\..*).*)",
  ],
};
