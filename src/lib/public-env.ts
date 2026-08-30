import { APP_URL } from "@/lib/constants";
import { SITE_URL } from "@/lib/site";
import type { PublicEnv } from "@/lib/runtime-env";

/**
 * Assemble the browser-facing config from the runtime environment. Called in
 * the root layout (server) and passed to <RuntimeEnvProvider>. Reads happen at
 * request time, so the same standalone image reflects whatever env the running
 * container is given instead of values frozen at build.
 */
export function getPublicEnv(): PublicEnv {
  return {
    siteUrl: SITE_URL,
    appUrl: APP_URL,
    posthogKey: process.env.POSTHOG_KEY ?? null,
    posthogHost: process.env.POSTHOG_HOST ?? null,
  };
}
