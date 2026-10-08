"use client";

import { styled } from "@mui/material";
import { space } from "@/theme/tokens";

export const CountBadgeRoot = styled("span", {
  name: "CountBadge",
  slot: "Root",
})(({ theme }) => ({
  ...theme.typography.overline,
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  minWidth: 22,
  height: 22,
  paddingInline: theme.spacing(space.xs * 0.75),
  letterSpacing: 0,
  fontVariantNumeric: "tabular-nums",
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.primary.contrastText,
}));
