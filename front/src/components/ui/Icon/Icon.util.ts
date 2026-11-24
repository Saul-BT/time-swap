import { createComponentClasses } from "@/lib/mui/componentClasses";
import type { iconSize } from "@/theme/tokens";

export type IconSize = keyof typeof iconSize;

export const ICON_STROKE_WIDTH = 2;

/** Radius 0 reaches the glyphs too: lucide's round caps and joins are squared off. */
export const ICON_STROKE_LINECAP = "square";
export const ICON_STROKE_LINEJOIN = "miter";

export const iconClasses = createComponentClasses("Icon", ["root"]);
