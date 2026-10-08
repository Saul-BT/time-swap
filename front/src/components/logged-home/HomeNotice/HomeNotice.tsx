import { Typography } from "@mui/material";
import type { LucideIcon } from "lucide-react";
import IconBox from "@/components/ui/IconBox";
import {
  HomeNoticeActions,
  HomeNoticeRoot,
  HomeNoticeText,
  HomeNoticeTitle,
} from "./HomeNotice.style";
import { homeNoticeClasses } from "./HomeNotice.util";

export type HomeNoticeProps = {
  icon: LucideIcon;
  title?: string;
  children: React.ReactNode;
  /** Buttons or links, rendered under the text. */
  actions?: React.ReactNode;
};

/** Account or connection state that changes what the page lets the member do. */
export default function HomeNotice({
  icon,
  title,
  children,
  actions,
}: HomeNoticeProps) {
  return (
    <HomeNoticeRoot className={homeNoticeClasses.root} role="status">
      <IconBox icon={icon} />
      <HomeNoticeText className={homeNoticeClasses.text}>
        {title ? (
          <HomeNoticeTitle className={homeNoticeClasses.title} variant="body1">
            {title}
          </HomeNoticeTitle>
        ) : null}
        <Typography className={homeNoticeClasses.body} variant="body2">
          {children}
        </Typography>
        {actions ? (
          <HomeNoticeActions className={homeNoticeClasses.actions}>
            {actions}
          </HomeNoticeActions>
        ) : null}
      </HomeNoticeText>
    </HomeNoticeRoot>
  );
}
