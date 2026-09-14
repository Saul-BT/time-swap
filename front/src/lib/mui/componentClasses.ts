import generateUtilityClasses from "@mui/material/generateUtilityClasses";

/**
 * `<Component>-<slot>` class names through MUI's generator, so no component
 * hand-writes a global class string.
 *
 * Call it from a module without `"use client"`: Next.js turns a plain object
 * exported from a client module into a client reference, and a server component
 * reading `.root` off it gets `undefined` with no error.
 *
 * @example
 * const ribbonClasses = createComponentClasses("Ribbon", ["root", "segment"]);
 * ribbonClasses.segment; // "Ribbon-segment"
 */
export function createComponentClasses<Slot extends string>(
  name: string,
  slots: Slot[],
): Record<Slot, string> {
  return generateUtilityClasses(name, slots);
}

/** Drops empty values. Order is preserved, so the last class wins on equal specificity. */
export function joinClasses(
  ...classNames: (string | false | null | undefined)[]
): string {
  return classNames.filter(Boolean).join(" ");
}
