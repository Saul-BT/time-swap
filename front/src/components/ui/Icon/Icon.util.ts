import { createComponentClasses } from "@/lib/mui/componentClasses";
import type { iconSize } from "@/theme/tokens";

export type IconSize = keyof typeof iconSize;

export const ICON_STROKE_WIDTH = 2;

export const iconClasses = createComponentClasses("Icon", ["root"]);
