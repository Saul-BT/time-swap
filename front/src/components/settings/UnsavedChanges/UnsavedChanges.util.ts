import { createComponentClasses } from "@/lib/mui/componentClasses";

/** Copy the dialog needs, passed from a server component. */
export type UnsavedChangesCopy = {
  title: string;
  body: string;
  stay: string;
  leave: string;
};

export const unsavedChangesClasses = createComponentClasses("UnsavedChanges", [
  "dialog",
  "title",
  "body",
  "actions",
]);
