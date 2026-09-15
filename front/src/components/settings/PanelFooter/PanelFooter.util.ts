import { createComponentClasses } from "@/lib/mui/componentClasses";

/** Copy a footer needs, passed from a server component. */
export type PanelFooterCopy = {
  save: string;
  saving: string;
  saved: string;
  next?: string;
};

/** How long the confirmation stays after a successful save. */
export const SAVED_FEEDBACK_MS = 4000;

export const panelFooterClasses = createComponentClasses("PanelFooter", [
  "root",
  "save",
  "next",
  "feedback",
]);
