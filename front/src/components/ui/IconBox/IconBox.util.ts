import { createComponentClasses } from "@/lib/mui/componentClasses";

/** `brake` is only for what is stopped or under review; `warning` for a deadline. */
export type IconBoxTone = "plain" | "quiet" | "warning" | "brake";

export type IconBoxSize = "sm" | "md";

export const ICON_BOX_SIZE: Record<IconBoxSize, number> = { sm: 32, md: 44 };

export const iconBoxClasses = createComponentClasses("IconBox", ["root"]);
