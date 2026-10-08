import { Typography } from "@mui/material";
import { Hourglass } from "lucide-react";
import IconBox from "@/components/ui/IconBox";
import {
  DueSoonNoticeAction,
  DueSoonNoticeRoot,
  DueSoonNoticeText,
  DueSoonNoticeTitle,
} from "./DueSoonNotice.style";
import { dueSoonNoticeClasses } from "./DueSoonNotice.util";

export type DueSoonNoticeProps = {
  title: string;
  children: React.ReactNode;
  actionLabel: string;
  onShow: () => void;
};

/** Keeps a near deadline in sight while another day is selected. */
export default function DueSoonNotice({
  title,
  children,
  actionLabel,
  onShow,
}: DueSoonNoticeProps) {
  return (
    <DueSoonNoticeRoot className={dueSoonNoticeClasses.root}>
      <IconBox icon={Hourglass} tone="warning" />
      <DueSoonNoticeText className={dueSoonNoticeClasses.text}>
        <DueSoonNoticeTitle className={dueSoonNoticeClasses.title}>
          {title}
        </DueSoonNoticeTitle>
        <Typography className={dueSoonNoticeClasses.body} variant="body2">
          {children}
        </Typography>
      </DueSoonNoticeText>
      <DueSoonNoticeAction
        className={dueSoonNoticeClasses.action}
        variant="outlined"
        size="small"
        onClick={onShow}
      >
        {actionLabel}
      </DueSoonNoticeAction>
    </DueSoonNoticeRoot>
  );
}
