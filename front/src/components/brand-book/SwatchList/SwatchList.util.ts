import { createComponentClasses } from "@/lib/mui/componentClasses";
import { color, statusColor, statusColorOnInk } from "@/theme/tokens";

export const swatchListClasses = createComponentClasses("SwatchList", [
  "root",
  "item",
  "sample",
]);

export type Swatch = {
  /** Token path, e.g. `color.accent`. */
  token: string;
  value: string;
  /** The colour the ratio is measured against; `null` for surfaces, where a ratio says nothing. */
  measuredAgainst: string | null;
};

export const SWATCHES: readonly Swatch[] = [
  {
    token: "color.background",
    value: color.background,
    measuredAgainst: null,
  },
  { token: "color.surface", value: color.surface, measuredAgainst: null },
  { token: "color.line", value: color.line, measuredAgainst: null },
  { token: "color.ink", value: color.ink, measuredAgainst: color.background },
  {
    token: "color.inkMuted",
    value: color.inkMuted,
    measuredAgainst: color.background,
  },
  {
    token: "color.accent",
    value: color.accent,
    measuredAgainst: color.background,
  },
  {
    token: "color.brake",
    value: color.brake,
    measuredAgainst: color.background,
  },
  {
    token: "statusColor.error",
    value: statusColor.error,
    measuredAgainst: color.background,
  },
  {
    token: "statusColor.warning",
    value: statusColor.warning,
    measuredAgainst: color.background,
  },
  {
    token: "statusColor.info",
    value: statusColor.info,
    measuredAgainst: color.background,
  },
  {
    token: "statusColor.success",
    value: statusColor.success,
    measuredAgainst: color.background,
  },
  {
    token: "statusColorOnInk.warning",
    value: statusColorOnInk.warning,
    measuredAgainst: color.ink,
  },
  {
    token: "statusColorOnInk.success",
    value: statusColorOnInk.success,
    measuredAgainst: color.ink,
  },
];
