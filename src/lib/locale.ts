/**
 * Helpers i18n par URL (stratégie préfixe /en).
 * ──────────────────────────────────────────────
 * FR = chemins nus (/blog, /tools/...). EN = mêmes chemins préfixés /en.
 * Source de vérité unique pour : détection de langue, construction de liens
 * localisés, et URLs canonical/hreflang (full-mesh, cf. skill SEO hreflang).
 */

export type Locale = "fr" | "en";

export const ORIGIN = "https://www.ghostmeta.online";

/** Langue déduite du pathname courant. */
export function localeFromPath(pathname: string): Locale {
  return pathname === "/en" || pathname.startsWith("/en/") ? "en" : "fr";
}

/** Retire le préfixe /en → chemin "base" FR (ex: /en/blog/x → /blog/x ; /en → /). */
export function basePath(pathname: string): string {
  if (pathname === "/en") return "/";
  if (pathname.startsWith("/en/")) return pathname.slice(3);
  return pathname;
}

/** Construit un chemin pour une locale donnée à partir d'un chemin base FR. */
export function localePath(path: string, locale: Locale): string {
  const base = path.startsWith("/en") ? basePath(path) : path;
  if (locale === "en") return base === "/" ? "/en" : `/en${base}`;
  return base;
}

/**
 * URLs SEO pour la page courante : canonical (self) + alternates full-mesh.
 * fr/en sont les deux variantes ; x-default pointe sur FR (langue par défaut).
 */
export function seoUrls(pathname: string) {
  const base = basePath(pathname);
  const fr = `${ORIGIN}${base}`;
  const en = base === "/" ? `${ORIGIN}/en` : `${ORIGIN}/en${base}`;
  const canonical = localeFromPath(pathname) === "en" ? en : fr;
  return { canonical, fr, en, xDefault: fr };
}
