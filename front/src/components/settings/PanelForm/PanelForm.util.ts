import { createComponentClasses } from "@/lib/mui/componentClasses";
import type { PanelFooterCopy } from "../PanelFooter";
import type { ServerErrorCopy } from "../ServerErrorNotice";

/** The strings every section form shows around its own fields. */
export type PanelFormCopy = {
  footer: PanelFooterCopy;
  serverError: ServerErrorCopy;
};

export const panelFormClasses = createComponentClasses("PanelForm", [
  "root",
  "fields",
]);
