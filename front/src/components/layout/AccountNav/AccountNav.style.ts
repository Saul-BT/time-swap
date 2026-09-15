"use client";

import { styled } from "@mui/material/styles";
import NextLink from "next/link";
import { bareList, rule } from "@/theme/rules";
import { space } from "@/theme/tokens";

const NAME = "AccountNav";

/** Second masthead row: the account areas, divided by the rule like the main nav. */
export const AccountNavRoot = styled("nav", { name: NAME, slot: "Root" })(
  ({ theme }) => ({
    display: "none",
    borderBottom: rule(theme),
    backgroundColor: theme.palette.background.paper,
    [theme.breakpoints.up("md")]: { display: "block" },
  }),
);

export const AccountNavList = styled("ul", { name: NAME, slot: "List" })(
  ({ theme }) => ({
    ...bareList,
    display: "flex",
    maxWidth: theme.system.contentWidth,
    marginInline: "auto",
    paddingInline: theme.spacing(space.lg),
  }),
);

export const AccountNavLink = styled(NextLink, {
  name: NAME,
  slot: "Link",
})<{ ownerState: { active: boolean } }>(({ theme, ownerState }) => ({
  display: "flex",
  alignItems: "center",
  minHeight: theme.system.controlHeight,
  paddingInline: theme.spacing(space.sm + 1),
  ...theme.typography.subtitle2,
  textDecoration: "none",
  color: theme.palette.text.primary,
  boxShadow: ownerState.active
    ? `inset 0 -${theme.system.focusRingWidth}px 0 ${theme.palette.primary.main}`
    : "none",
  "&:hover": { backgroundColor: theme.palette.divider },
}));
