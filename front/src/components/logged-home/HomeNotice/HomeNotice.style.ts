"use client";

import { Paper, styled, Typography } from "@mui/material";
import { space } from "@/theme/tokens";

const NAME = "HomeNotice";

/** Bordered, never tinted, like every notice in the system (ADR 0008). */
export const HomeNoticeRoot = styled(Paper, { name: NAME, slot: "Root" })(
  ({ theme }) => ({
    display: "flex",
    alignItems: "flex-start",
    gap: theme.spacing(1.75),
    padding: theme.spacing(space.sm),
  }),
);

export const HomeNoticeText = styled("div", { name: NAME, slot: "Text" })({
  flex: 1,
  minWidth: 0,
});

export const HomeNoticeTitle = styled(Typography, {
  name: NAME,
  slot: "Title",
})({ fontWeight: 700 });

export const HomeNoticeActions = styled("div", {
  name: NAME,
  slot: "Actions",
})(({ theme }) => ({
  display: "flex",
  flexWrap: "wrap",
  alignItems: "center",
  gap: theme.spacing(space.xs, space.sm),
  marginTop: theme.spacing(1.5),
}));
