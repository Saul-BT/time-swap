import { createComponentClasses } from "@/lib/mui/componentClasses";

export type ServerErrorCopy = {
  title: string;
  body: string;
  retry: string;
};

export const serverErrorNoticeClasses = createComponentClasses(
  "ServerErrorNotice",
  ["root", "retry"],
);
