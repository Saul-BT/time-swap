/** Spanish is the source language; its dictionary defines the shape. */
export const LOCALES = ["es", "en"] as const;

export type Locale = (typeof LOCALES)[number];

export const DEFAULT_LOCALE: Locale = "es";

export function isLocale(value: string): value is Locale {
  return (LOCALES as readonly string[]).includes(value);
}

/** Each name written in its own language. */
export const LOCALE_NAME: Record<Locale, string> = {
  es: "Español",
  en: "English",
};
