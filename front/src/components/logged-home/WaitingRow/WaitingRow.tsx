import { Typography } from "@mui/material";
import { Clock } from "lucide-react";
import IconBox from "@/components/ui/IconBox";
import {
  WaitingRowAction,
  WaitingRowRoot,
  WaitingRowText,
  WaitingRowTitle,
} from "./WaitingRow.style";
import { waitingRowClasses } from "./WaitingRow.util";

export type WaitingRowProps = {
  title: string;
  detail: string;
  actionLabel: string;
  disabled?: boolean;
};

/** Something the member started and someone else has to answer. */
export default function WaitingRow({
  title,
  detail,
  actionLabel,
  disabled,
}: WaitingRowProps) {
  return (
    <WaitingRowRoot className={waitingRowClasses.root}>
      <IconBox icon={Clock} tone="quiet" size="sm" />
      <WaitingRowText className={waitingRowClasses.text}>
        <WaitingRowTitle className={waitingRowClasses.title} variant="body2">
          {title}
        </WaitingRowTitle>
        <Typography
          className={waitingRowClasses.detail}
          variant="caption"
          component="p"
          color="textSecondary"
        >
          {detail}
        </Typography>
      </WaitingRowText>
      {/* TODO(api): wire withdraw and view once requests and agreements exist. */}
      <WaitingRowAction
        className={waitingRowClasses.action}
        variant="text"
        size="small"
        disabled={disabled}
      >
        {actionLabel}
      </WaitingRowAction>
    </WaitingRowRoot>
  );
}
