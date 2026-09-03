// Server-side app URL (e.g. for canonical/JSON-LD links in server components).
// Client components read this at runtime via usePublicEnv().appUrl instead.
export const APP_URL = process.env.APP_URL ?? "https://frontend.ragenta.cloud";
