"use client";

import { styled } from "@mui/material/styles";
import NextLink from "next/link";
import { rule } from "@/theme/rules";
import { space } from "@/theme/tokens";

export type NavCellEmphasis = "quiet" | "solid";

/** Cells are divided by the rule, not by whitespace: a masthead, not a toolbar. */
export const NavCellRoot = styled(NextLink, {
  name: "NavCell",
  slot: "Root",
})<{ ownerState: { emphasis: NavCellEmphasis } }>(({ theme, ownerState }) => {
  const isSolid = ownerState.emphasis === "solid";

  return {
    display: "flex",
    alignItems: "center",
    paddingInline: theme.spacing(space.sm),
    borderLeft: rule(theme),
    textDecoration: "none",
    ...theme.typography.button,
    backgroundColor: isSolid ? theme.palette.primary.main : "transparent",
    color: isSolid
      ? theme.palette.primary.contrastText
      : theme.palette.text.primary,
    "&:hover": {
      backgroundColor: isSolid
        ? theme.palette.text.primary
        : theme.palette.divider,
    },
    [theme.breakpoints.up("md")]: {
      paddingInline: theme.spacing(isSolid ? 3.5 : 3),
    },
  };
});
