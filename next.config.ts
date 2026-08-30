import type { NextConfig } from "next";
import path from "node:path";

// Locale segments allowed in the cache-header matchers below. Keep in sync with
// `src/i18n/config.ts` — Next needs them as a literal pattern here.
const LOCALE_PATTERN = "en|vi";

const nextConfig: NextConfig = {
  reactCompiler: true,
  output: "standalone",
  // Pin the workspace root: the reference clone in `vecura-landing-page/` ships
  // its own lockfile, which would otherwise make Next infer the wrong root and
  // break `src/proxy.ts` detection.
  turbopack: {
    root: path.resolve(__dirname),
  },
  outputFileTracingRoot: path.resolve(__dirname),
  outputFileTracingExcludes: {
    "*": ["./vecura-landing-page/**"],
  },
  async redirects() {
    return [
      {
        // `/vn` is a common mistake for the Vietnamese locale (the ISO 639-1
        // language code is `vi`; `vn` is the country code). next.config
        // redirects run before src/proxy.ts, so these fire before the
        // locale-detection redirect would send `/vn` to `/en/vn` → 404.
        source: "/vn",
        destination: "/vi",
        permanent: true,
      },
      {
        source: "/vn/:path*",
        destination: "/vi/:path*",
        permanent: true,
      },
    ];
  },
  async rewrites() {
    return [
      {
        source: "/ingest/static/:path*",
        destination: "https://us-assets.i.posthog.com/static/:path*",
      },
      {
        source: "/ingest/array/:path*",
        destination: "https://us-assets.i.posthog.com/array/:path*",
      },
      {
        source: "/ingest/:path*",
        destination: "https://us.i.posthog.com/:path*",
      },
    ];
  },
  async headers() {
    const documentCacheHeaders = [
      {
        key: "Cache-Control",
        value: "private, no-cache, no-store, max-age=0, must-revalidate",
      },
    ];

    // HSTS on every response so browsers only ever reach the site over HTTPS.
    // `preload` is intentionally omitted — submit to hstspreload.org once
    // confident, as removal from the preload list is slow.
    const hstsHeaders = [
      {
        key: "Strict-Transport-Security",
        value: "max-age=31536000; includeSubDomains",
      },
    ];

    return [
      {
        source: "/:path*",
        headers: hstsHeaders,
      },
      {
        // Do not cache document responses across deploys. Next emits build-hash
        // CSS/JS URLs in HTML; stale HTML can point at chunks that no longer
        // exist in the current container, causing unstyled first loads.
        source: "/",
        headers: documentCacheHeaders,
      },
      {
        source: `/:lang(${LOCALE_PATTERN})`,
        headers: documentCacheHeaders,
      },
      {
        source: `/:lang(${LOCALE_PATTERN})/:path*`,
        headers: documentCacheHeaders,
      },
    ];
  },
  // Let Next 308-redirect `/path/` → `/path` (trailingSlash defaults to false)
  // so each page has a single canonical URL.
};

export default nextConfig;
