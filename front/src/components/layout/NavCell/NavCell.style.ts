"use client";

import { styled } from "@mui/material";
import NextLink from "next/link";
import { currentBar, rule } from "@/theme/rules";
import { space } from "@/theme/tokens";

export type NavCellEmphasis = "quiet" | "solid";

/** Cells are divided by the rule, not by whitespace: a masthead, not a toolbar. */
export const NavCellRoot = styled(NextLink, {
  name: "NavCell",
  slot: "Root",
})<{ ownerState: { emphasis: NavCellEmphasis; current: boolean } }>(
  ({ theme, ownerState }) => {
    const isSolid = ownerState.emphasis === "solid";

    return {
      display: "flex",
      alignItems: "center",
      gap: theme.spacing(space.xs),
      paddingInline: theme.spacing(space.sm),
      position: "relative",
      ...(ownerState.current && {
        "&::after": currentBar(theme, "bottom"),
      }),
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
  },
);
