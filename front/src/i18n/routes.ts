import { LOCALES, type Locale } from "./config";

/** Folders under `app/(site)/[lang]` are named with this locale's slug. */
export const FOLDER_LOCALE: Locale = "en";

/**
 * Public path of each route per locale. The folder under `app/(site)/[lang]`
 * is the English slug; the others are served through rewrites in
 * `next.config.ts` and redirected from the English slug in `proxy.ts` (ADR 0011).
 */
export const ROUTES = {
  home: { es: "/", en: "/" },
  signIn: { es: "/entrar", en: "/sign-in" },
  register: { es: "/crear-cuenta", en: "/register" },
  recoverAccess: { es: "/recuperar", en: "/recover" },
} as const satisfies Record<string, Record<Locale, string>>;

export type RouteId = keyof typeof ROUTES;

/** A route id, or an in-page anchor that needs no locale. */
export type LinkTarget = RouteId | `#${string}`;

/**
 * @example
 * localizePath("en", "signIn"); // "/en/sign-in"
 * localizePath("es", "#acceso"); // "#acceso"
 */
export function localizePath(locale: Locale, target: LinkTarget): string {
  if (target.startsWith("#")) {
    return target;
  }

  const slug = ROUTES[target as RouteId][locale];

  return slug === "/" ? `/${locale}` : `/${locale}${slug}`;
}

/** `hreflang` map for `generateMetadata`, one entry per locale. */
export function routeAlternates(id: RouteId): Record<Locale, string> {
  return Object.fromEntries(
    LOCALES.map((locale) => [locale, localizePath(locale, id)]),
  ) as Record<Locale, string>;
}

/**
 * Pairs of (public path, folder path) for every locale whose slug differs
 * from the folder one. Feeds both the rewrites and the redirects.
 */
export function localizedSlugPairs(): {
  locale: Locale;
  publicPath: string;
  folderPath: string;
}[] {
  const pairs = [];

  for (const id of Object.keys(ROUTES) as RouteId[]) {
    for (const locale of LOCALES) {
      const publicPath = localizePath(locale, id);
      const folderPath = `/${locale}${ROUTES[id][FOLDER_LOCALE]}`;

      if (publicPath !== folderPath) {
        pairs.push({ locale, publicPath, folderPath });
      }
    }
  }

  return pairs;
}
