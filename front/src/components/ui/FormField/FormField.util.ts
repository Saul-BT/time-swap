import { createComponentClasses } from "@/lib/mui/componentClasses";

export const formFieldClasses = createComponentClasses("FormField", [
  "root",
  "head",
  "label",
  "aside",
  "hint",
  "error",
]);

/**
 * Ids of the texts a control should list in `aria-describedby`.
 *
 * @example
 * const ids = formFieldIds("bio");
 * <textarea aria-describedby={`${ids.hint} ${ids.error}`} />
 */
export function formFieldIds(htmlFor: string) {
  return { hint: `${htmlFor}-hint`, error: `${htmlFor}-error` } as const;
}
