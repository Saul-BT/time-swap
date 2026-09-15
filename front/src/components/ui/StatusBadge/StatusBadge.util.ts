import { createComponentClasses } from "@/lib/mui/componentClasses";

/** Completion of a settings section, as the API reports it. */
export type SectionStatus = "done" | "review" | "missing";

/** `inverse` is for the ink-backed surfaces, where the status palette fails AA. */
export type StatusTone = "default" | "inverse";

export const statusBadgeClasses = createComponentClasses("StatusBadge", [
  "root",
  "icon",
  "text",
]);
