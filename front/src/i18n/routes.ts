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
  recoverAccess: { es: "/recuperar", en: "/recover" },
  loggedHome: { es: "/inicio", en: "/home" },
  listings: { es: "/anuncios", en: "/listings" },
  // Before `listingDetail`, or `:id` would swallow the slug in rewrites and redirects.
  createAd: { es: "/anuncios/nuevo", en: "/listings/new" },
  listingDetail: { es: "/anuncios/:id", en: "/listings/:id" },
} as const satisfies Record<string, Record<Locale, string>>;

export type RouteId = keyof typeof ROUTES;

/** A route id, or an in-page anchor that needs no locale. */
export type LinkTarget = RouteId | `#${string}`;

/** Values for the `:name` segments of a slug. */
export type RouteParams = Record<string, string>;

/**
 * @example
 * localizePath("en", "signIn"); // "/en/sign-in"
 * localizePath("es", "listingDetail", { id: "l1" }); // "/es/anuncios/l1"
 * localizePath("es", "#acceso"); // "#acceso"
 */
export function localizePath(
  locale: Locale,
  target: LinkTarget,
  params: RouteParams = {},
): string {
  if (target.startsWith("#")) {
    return target;
  }

  const slug = ROUTES[target as RouteId][locale].replace(
    /:(\w+)/g,
    (segment, name: string) => params[name] ?? segment,
  );

  return slug === "/" ? `/${locale}` : `/${locale}${slug}`;
}

/** `hreflang` map for `generateMetadata`, one entry per locale. */
export function routeAlternates(
  id: RouteId,
  params?: RouteParams,
): Record<Locale, string> {
  return Object.fromEntries(
    LOCALES.map((locale) => [locale, localizePath(locale, id, params)]),
  ) as Record<Locale, string>;
}

/**
 * Pairs of (public path, folder path) for every locale whose slug differs
 * from the folder one. Feeds both the rewrites and the redirects. Paths keep
 * their `:name` segments, in the pattern syntax of `next.config.ts` rewrites.
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

/**
 * Fills `pattern`'s `:name` segments from `pathname`, or `null` if it does not match.
 *
 * @example
 * matchPath("/es/listings/:id", "/es/listings/l1"); // { id: "l1" }
 */
export function matchPath(
  pattern: string,
  pathname: string,
): RouteParams | null {
  const names: string[] = [];
  const source = pattern.replace(/:(\w+)/g, (_, name: string) => {
    names.push(name);
    return "([^/]+)";
  });
  const match = new RegExp(`^${source}$`).exec(pathname);

  if (!match) {
    return null;
  }

  return Object.fromEntries(
    names.map((name, index) => [name, match[index + 1]]),
  );
}
