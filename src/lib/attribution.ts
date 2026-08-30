"use client";

const UTM_KEYS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_content",
  "utm_term",
] as const;

const CLICK_ID_KEYS = ["gclid", "fbclid", "li_fat_id"] as const;

const FORWARDED_KEYS = [...UTM_KEYS, ...CLICK_ID_KEYS] as const;

type UtmKey = (typeof UTM_KEYS)[number];
type ClickIdKey = (typeof CLICK_ID_KEYS)[number];

export type Touch = {
  [K in UtmKey]: string | null;
} & {
  [K in ClickIdKey]: string | null;
} & {
  referrer: string | null;
  landing_page: string | null;
  timestamp: string;
};

const FIRST_COOKIE = "ragenta_attr_first";
const LAST_COOKIE = "ragenta_attr_last";

function readCookie(name: string): Touch | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(
    new RegExp("(?:^|; )" + name + "=([^;]+)"),
  );
  if (!match) return null;
  try {
    return JSON.parse(decodeURIComponent(match[1])) as Touch;
  } catch {
    return null;
  }
}

/**
 * Returns flattened attribution props for use as analytics event properties.
 * Keys: utm_* / click IDs / landing_page / referrer use last-touch.
 * first_utm_* / first_landing_page / first_referrer carry first-touch.
 *
 * Source of truth is cookies set by src/proxy.ts, because browsers (Chrome's
 * Link Tracking Protection, Firefox, etc.) strip UTM params from the URL bar
 * before any client JS runs.
 */
export function getAttributionProps(): Record<string, string | null> {
  const first = readCookie(FIRST_COOKIE);
  const last = readCookie(LAST_COOKIE);
  const props: Record<string, string | null> = {};

  if (last) {
    for (const key of FORWARDED_KEYS) props[key] = last[key];
    props.landing_page = last.landing_page;
    props.referrer = last.referrer;
  }
  if (first) {
    for (const key of FORWARDED_KEYS) props[`first_${key}`] = first[key];
    props.first_landing_page = first.landing_page;
    props.first_referrer = first.referrer;
    props.first_touch_at = first.timestamp;
  }
  return props;
}

/**
 * Append last-touch attribution as query params onto a destination URL. The
 * sibling app on the app.* subdomain receives the same cookies via the shared
 * parent domain, so this is defense-in-depth for any environment where the
 * cookie isn't shared.
 */
export function buildAppUrl(base: string): string {
  const last = readCookie(LAST_COOKIE);
  let url: URL;
  try {
    url = new URL(base);
  } catch {
    return base;
  }
  if (last) {
    for (const key of FORWARDED_KEYS) {
      const value = last[key];
      if (value && !url.searchParams.has(key)) {
        url.searchParams.set(key, value);
      }
    }
    if (last.landing_page && !url.searchParams.has("landing_page")) {
      url.searchParams.set("landing_page", last.landing_page);
    }
    if (last.referrer && !url.searchParams.has("referrer")) {
      url.searchParams.set("referrer", last.referrer);
    }
  }
  return url.toString();
}
