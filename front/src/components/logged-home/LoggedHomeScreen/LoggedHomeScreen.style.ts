"use client";

import { styled, Typography } from "@mui/material";
import type { SyncStatus } from "@/data/types";
import { space } from "@/theme/tokens";

const NAME = "LoggedHomeScreen";

/** First-time layout has no board, so it brings its own page padding. */
export const LoggedHomeScreenRoot = styled("div", { name: NAME, slot: "Root" })(
  ({ theme }) => ({
    maxWidth: theme.system.contentWidth,
    marginInline: "auto",
    padding: theme.spacing(3, space.sm, 5),
    [theme.breakpoints.up("md")]: {
      padding: theme.spacing(5, space.lg, space.lg),
    },
  }),
);

export const LoggedHomeScreenDateLine = styled(Typography, {
  name: NAME,
  slot: "DateLine",
})(({ theme }) => ({
  display: "flex",
  flexWrap: "wrap",
  alignItems: "center",
  gap: theme.spacing(0.75, 1),
  marginTop: theme.spacing(space.xs),
  color: theme.palette.text.secondary,
}));

export const LoggedHomeScreenStatus = styled("span", {
  name: NAME,
  slot: "Status",
})(({ theme }) => ({
  ...theme.typography.overline,
  display: "inline-flex",
  alignItems: "center",
  gap: theme.spacing(0.75),
  letterSpacing: "0.08em",
}));

/** Green only while the page is in sync; ink when it is showing old data. */
export const LoggedHomeScreenStatusDot = styled("span", {
  name: NAME,
  slot: "StatusDot",
})<{ ownerState: { status: SyncStatus } }>(({ theme, ownerState }) => ({
  display: "block",
  width: 8,
  height: 8,
  backgroundColor:
    ownerState.status === "offline"
      ? theme.palette.text.secondary
      : theme.palette.success.main,
}));

export const LoggedHomeScreenUpToDate = styled("div", {
  name: NAME,
  slot: "UpToDate",
})(({ theme }) => ({
  display: "flex",
  alignItems: "flex-start",
  gap: theme.spacing(1.75),
  marginTop: theme.spacing(space.sm),
  padding: theme.spacing(space.sm + 1),
  border: `${theme.system.borderWidth}px solid ${theme.palette.divider}`,
  backgroundColor: theme.palette.background.paper,
}));
