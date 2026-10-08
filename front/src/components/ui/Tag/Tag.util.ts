import { createComponentClasses } from "@/lib/mui/componentClasses";

/** `solid` is ink, `accent` marks today, `quiet` is metadata on a line rule. */
export type TagTone = "solid" | "accent" | "quiet";

export const tagClasses = createComponentClasses("Tag", ["root"]);
