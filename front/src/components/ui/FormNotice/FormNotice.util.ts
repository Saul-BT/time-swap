import { createComponentClasses } from "@/lib/mui/componentClasses";

/** `error` interrupts; `info` is ink on surface, as ADR 0008 decides. */
export type FormNoticeTone = "error" | "info";

export const formNoticeClasses = createComponentClasses("FormNotice", [
  "root",
  "title",
  "body",
]);
