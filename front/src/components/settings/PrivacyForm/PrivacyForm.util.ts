import type { PanelActionState } from "@/lib/forms/actionState";
import { createComponentClasses } from "@/lib/mui/componentClasses";
import type { PanelFormCopy } from "../PanelForm";

export type PrivacyActionState = PanelActionState<never, never>;

export type PrivacyValues = {
  visibleToVisitors: boolean;
  searchable: boolean;
};

export type PrivacyCopy = PanelFormCopy & {
  now: string;
  visibleToVisitors: { title: string; body: string; on: string; off: string };
  searchable: { title: string; body: string; on: string; off: string };
  matrixTitle: string;
  matrixHint: string;
};

export const privacyFormClasses = createComponentClasses("PrivacyForm", [
  "switches",
  "matrix",
  "matrixHead",
  "matrixTitle",
  "matrixHint",
]);
