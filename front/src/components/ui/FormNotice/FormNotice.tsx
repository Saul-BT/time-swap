import Typography from "@mui/material/Typography";
import {
  FormNoticeAction,
  FormNoticeRoot,
  FormNoticeTitle,
} from "./FormNotice.style";
import { type FormNoticeTone, formNoticeClasses } from "./FormNotice.util";

export type FormNoticeProps = {
  tone?: FormNoticeTone;
  title: React.ReactNode;
  children: React.ReactNode;
  /** One control under the text, such as a retry button. */
  action?: React.ReactNode;
};

/**
 * Status message above a form. Bordered, never tinted: the tone travels in
 * the rule and the title, so the text keeps full contrast.
 */
export default function FormNotice({
  tone = "info",
  title,
  children,
  action,
}: FormNoticeProps) {
  return (
    <FormNoticeRoot
      className={formNoticeClasses.root}
      ownerState={{ tone }}
      role={tone === "error" ? "alert" : "status"}
    >
      <FormNoticeTitle
        className={formNoticeClasses.title}
        ownerState={{ tone }}
        variant="h6"
        component="p"
      >
        {title}
      </FormNoticeTitle>
      <Typography className={formNoticeClasses.body} variant="body2">
        {children}
      </Typography>
      {action ? (
        <FormNoticeAction className={formNoticeClasses.action}>
          {action}
        </FormNoticeAction>
      ) : null}
    </FormNoticeRoot>
  );
}
