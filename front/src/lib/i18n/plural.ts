import { interpolate } from "./interpolate";

/** Copy for a count, one entry per CLDR category the locale uses. */
export type PluralForms = { one: string; other: string };

/**
 * Picks the form for `count` and fills `{count}` plus any other values.
 *
 * @example
 * plural("es", 1, { one: "{count} mensaje", other: "{count} mensajes" }); // "1 mensaje"
 */
export function plural(
  locale: string,
  count: number,
  forms: PluralForms,
  values: Record<string, string | number> = {},
): string {
  const category = new Intl.PluralRules(locale).select(count);
  const template = category === "one" ? forms.one : forms.other;

  return interpolate(template, { count, ...values });
}
