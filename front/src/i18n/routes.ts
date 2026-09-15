import { LOCALES, type Locale } from "./config";

/** Folders under `app/(site)/[lang]` are named with this locale's slug. */
export const FOLDER_LOCALE: Locale = "en";

/**
 * Public path of each route per locale. The folder under `app/(site)/[lang]`
 * is the English slug; the others are served through rewrites in
 * `next.config.ts` and redirected from the English slug in `proxy.ts` (ADR 0011).
 * A `:name` segment is a dynamic parameter and must appear in every locale.
 */
export const ROUTES = {
  home: { es: "/", en: "/" },
  signIn: { es: "/entrar", en: "/sign-in" },
  recoverAccess: { es: "/recuperar", en: "/recover" },
  settingsProfile: { es: "/ajustes/perfil", en: "/settings/profile" },
  settingsProfilePresentation: {
    es: "/ajustes/perfil/presentacion",
    en: "/settings/profile/presentation",
  },
  settingsProfileSkills: {
    es: "/ajustes/perfil/habilidades",
    en: "/settings/profile/skills",
  },
  settingsProfileAvailability: {
    es: "/ajustes/perfil/disponibilidad",
    en: "/settings/profile/availability",
  },
  settingsProfileZone: {
    es: "/ajustes/perfil/zona",
    en: "/settings/profile/zone",
  },
  settingsPrivacy: { es: "/ajustes/privacidad", en: "/settings/privacy" },
  memberProfile: { es: "/miembros/:id", en: "/members/:id" },
} as const satisfies Record<string, Record<Locale, string>>;

export type RouteId = keyof typeof ROUTES;

/** A route id, or an in-page anchor that needs no locale. */
export type LinkTarget = RouteId | `#${string}`;

export type RouteParams = Record<string, string>;

const PARAM_PATTERN = /:(\w+)/g;

function fillParams(
  slug: string,
  params: RouteParams = {},
  { encode = true } = {},
): string {
  return slug.replace(PARAM_PATTERN, (match, name: string) => {
    if (!(name in params)) {
      return match;
    }

    return encode ? encodeURIComponent(params[name]) : params[name];
  });
}

/**
 * @example
 * localizePath("en", "signIn"); // "/en/sign-in"
 * localizePath("es", "#acceso"); // "#acceso"
 * localizePath("es", "memberProfile", { id: "m-1" }); // "/es/miembros/m-1"
 */
export function localizePath(
  locale: Locale,
  target: LinkTarget,
  params?: RouteParams,
): string {
  if (target.startsWith("#")) {
    return target;
  }

  const slug = fillParams(ROUTES[target as RouteId][locale], params);

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
 * from the folder one. Feeds both the rewrites and the redirects. Dynamic
 * segments keep their `:name` form, which Next's rewrites understand.
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

function toMatcher(pattern: string): RegExp {
  const escaped = pattern
    .replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
    .replace(/:(\w+)/g, "(?<$1>[^/]+)");

  return new RegExp(`^${escaped}$`);
}

/**
 * The public path a folder-slug request should be redirected to, or `undefined`
 * when the request already uses the public slug of its locale.
 *
 * @example
 * publicPathFor("/es/sign-in"); // "/es/entrar"
 * publicPathFor("/es/members/m-1"); // "/es/miembros/m-1"
 * publicPathFor("/es/entrar"); // undefined
 */
export function publicPathFor(pathname: string): string | undefined {
  for (const { publicPath, folderPath } of localizedSlugPairs()) {
    const match = toMatcher(folderPath).exec(pathname);

    if (match) {
      return fillParams(publicPath, match.groups ?? {}, { encode: false });
    }
  }

  return undefined;
}
