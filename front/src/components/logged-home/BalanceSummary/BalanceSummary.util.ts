import { createComponentClasses } from "@/lib/mui/componentClasses";

export type BalanceSummaryVariant = "wide" | "compact" | "intro";

/**
 * Signed hours with a true minus sign: a negative balance is allowed, not a
 * debt, so it reads as plainly as a positive one.
 *
 * @example
 * formatSignedHours(2); // "+2"
 * formatSignedHours(-1); // "−1"
 */
export function formatSignedHours(hours: number): string {
  if (hours > 0) return `+${hours}`;
  if (hours < 0) return `−${Math.abs(hours)}`;
  return "0";
}

export const balanceSummaryClasses = createComponentClasses("BalanceSummary", [
  "root",
  "figureRow",
  "figure",
  "headroom",
  "note",
]);
