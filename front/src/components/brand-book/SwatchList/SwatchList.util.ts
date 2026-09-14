import { createComponentClasses } from "@/lib/mui/componentClasses";
import { color, statusColor } from "@/theme/tokens";

export const swatchListClasses = createComponentClasses("SwatchList", [
  "root",
  "item",
  "sample",
]);

export type Swatch = {
  /** Token path, e.g. `color.accent`. */
  token: string;
  value: string;
  /** False for surfaces: a ratio against the background says nothing for them. */
  measureContrast: boolean;
};

export const SWATCHES: readonly Swatch[] = [
  {
    token: "color.background",
    value: color.background,
    measureContrast: false,
  },
  { token: "color.surface", value: color.surface, measureContrast: false },
  { token: "color.line", value: color.line, measureContrast: false },
  { token: "color.ink", value: color.ink, measureContrast: true },
  { token: "color.inkMuted", value: color.inkMuted, measureContrast: true },
  { token: "color.accent", value: color.accent, measureContrast: true },
  { token: "color.brake", value: color.brake, measureContrast: true },
  {
    token: "statusColor.error",
    value: statusColor.error,
    measureContrast: true,
  },
  {
    token: "statusColor.warning",
    value: statusColor.warning,
    measureContrast: true,
  },
  { token: "statusColor.info", value: statusColor.info, measureContrast: true },
  {
    token: "statusColor.success",
    value: statusColor.success,
    measureContrast: true,
  },
];
