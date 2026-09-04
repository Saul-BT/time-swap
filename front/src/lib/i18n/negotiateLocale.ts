import { DEFAULT_LOCALE, isLocale, LOCALES, type Locale } from "@/i18n/config";

type LanguageRange = { tag: string; quality: number };

/** Ranges ordered by quality, best first. Malformed entries are dropped, not thrown. */
function parseAcceptLanguage(header: string): LanguageRange[] {
  return header
    .split(",")
    .map((part) => {
      const [tag, ...params] = part.trim().split(";");
      const q = params.find((p) => p.trim().startsWith("q="));
      const quality = q ? Number.parseFloat(q.trim().slice(2)) : 1;
      return {
        tag: tag.trim().toLowerCase(),
        quality: Number.isNaN(quality) ? 0 : quality,
      };
    })
    .filter((range) => range.tag.length > 0 && range.quality > 0)
    .sort((a, b) => b.quality - a.quality);
}

/**
 * Exact tag, then primary subtag, then the default. Hand-written instead of
 * `negotiator` + `@formatjs/intl-localematcher`; revisit if region variants
 * (`en-GB` vs `en-US`) ever ship.
 */
export function negotiateLocale(acceptLanguage: string | null): Locale {
  if (!acceptLanguage) {
    return DEFAULT_LOCALE;
  }

  for (const { tag } of parseAcceptLanguage(acceptLanguage)) {
    if (tag === "*") {
      return DEFAULT_LOCALE;
    }
    if (isLocale(tag)) {
      return tag;
    }
    // `es-419`, `en-GB` and friends fall back to their primary subtag.
    const primary = tag.split("-")[0];
    if (isLocale(primary)) {
      return primary;
    }
  }

  return DEFAULT_LOCALE;
}

export { LOCALES };
