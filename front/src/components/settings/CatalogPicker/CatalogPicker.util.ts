import type { CatalogEntry } from "@/data/types";
import { createComponentClasses } from "@/lib/mui/componentClasses";

export type CatalogPickerCopy = {
  search: string;
  selectedLabel: string;
  suggestionsLabel: string;
  /** With `{name}`. */
  add: string;
  /** With `{name}`. */
  remove: string;
  noMatch: string;
};

/** Catalogue entries not yet chosen, in catalogue order, capped. */
export function pickSuggestions(
  catalog: readonly CatalogEntry[],
  chosen: readonly string[],
  count: number,
): CatalogEntry[] {
  return catalog.filter((entry) => !chosen.includes(entry.id)).slice(0, count);
}

export const catalogPickerClasses = createComponentClasses("CatalogPicker", [
  "root",
  "search",
  "selected",
  "chip",
  "suggestions",
  "suggestion",
  "empty",
]);
