import { CATEGORY_IDS } from "@/data/categories";
import type { Dictionary } from "@/i18n/types";

export function getCategoryLabels(
  categories: Dictionary["categories"],
): readonly string[] {
  return CATEGORY_IDS.map((id) => categories.items[id]);
}
