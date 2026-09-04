/**
 * Fills `{name}` placeholders. A placeholder without a value is left as is,
 * so a missing value is visible on the page instead of disappearing.
 *
 * @example
 * interpolate("la gente de {city}", { city: "Madrid" }); // "la gente de Madrid"
 */
export function interpolate(
  template: string,
  values: Record<string, string | number>,
): string {
  return template.replace(/\{(\w+)\}/g, (match, key: string) =>
    key in values ? String(values[key]) : match,
  );
}
