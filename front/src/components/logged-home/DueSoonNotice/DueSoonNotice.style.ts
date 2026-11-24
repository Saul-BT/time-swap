"use client";

import { Button, styled } from "@mui/material";
import Eyebrow from "@/components/ui/Eyebrow";
import { space } from "@/theme/tokens";

const NAME = "DueSoonNotice";

/** Framed in `warning`, never filled: a deadline is close, nothing has stopped. */
export const DueSoonNoticeRoot = styled("div", { name: NAME, slot: "Root" })(
  ({ theme }) => ({
    display: "grid",
    gridTemplateColumns: "auto minmax(0, 1fr)",
    alignItems: "center",
    gap: theme.spacing(1.5, 1.75),
    padding: theme.spacing(1.75, space.sm),
    border: `${theme.system.borderWidth}px solid ${theme.palette.warning.main}`,
    backgroundColor: theme.palette.background.paper,
    [theme.breakpoints.up("sm")]: {
      gridTemplateColumns: "auto minmax(0, 1fr) auto",
    },
  }),
);

export const DueSoonNoticeText = styled("div", { name: NAME, slot: "Text" })({
  minWidth: 0,
});

export const DueSoonNoticeTitle = styled(Eyebrow, {
  name: NAME,
  slot: "Title",
})(({ theme }) => ({ color: theme.palette.warning.main }));

export const DueSoonNoticeAction = styled(Button, {
  name: NAME,
  slot: "Action",
})(({ theme }) => ({
  gridColumn: "1 / -1",
  justifySelf: "start",
  [theme.breakpoints.up("sm")]: { gridColumn: "auto" },
}));
