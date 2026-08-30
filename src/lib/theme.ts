export const THEME_COOKIE = "ragenta-theme";

export type Theme = "light" | "dark";
/** What the user chose. "system" defers to `prefers-color-scheme`. */
export type ThemePreference = Theme | "system";

export function isThemePreference(value: string): value is ThemePreference {
  return value === "light" || value === "dark" || value === "system";
}

/**
 * Inlined in <head> before first paint. It resolves the preference the same way
 * the client provider does and stamps `.dark` on <html>, so a dark-mode visitor
 * never sees a white flash. The cookie is also read on the server, which covers
 * an explicit choice; this script exists for the "system" case, which only the
 * browser can answer.
 */
export const THEME_INIT_SCRIPT = `(function(){try{
var m=document.cookie.match(/(?:^|; )${THEME_COOKIE}=([^;]+)/);
var p=m?decodeURIComponent(m[1]):"system";
var d=p==="dark"||(p!=="light"&&window.matchMedia("(prefers-color-scheme: dark)").matches);
document.documentElement.classList.toggle("dark",d);
}catch(e){}})();`;
