"use client";

import { styled } from "@mui/material";
import NextLink from "next/link";
import { bareList, rule, softRule } from "@/theme/rules";
import { space } from "@/theme/tokens";
import type { SettingsNavVariant } from "./SettingsNav.util";

const NAME = "SettingsNav";

export const SettingsNavRoot = styled("nav", {
  name: NAME,
  slot: "Root",
})<{ ownerState: { variant: SettingsNavVariant } }>(({ theme, ownerState }) =>
  ownerState.variant === "tabs"
    ? {
        width: 300,
        height: "100%",
        flexShrink: 0,
        borderRight: rule(theme),
        backgroundColor: theme.palette.background.paper,
      }
    : {
        border: rule(theme),
        backgroundColor: theme.palette.background.paper,
      },
);

export const SettingsNavList = styled("ul", { name: NAME, slot: "List" })({
  ...bareList,
  display: "flex",
  flexDirection: "column",
});

export const SettingsNavItem = styled("li", { name: NAME, slot: "Item" })(
  ({ theme }) => ({
    "&:not(:last-of-type)": { borderBottom: softRule(theme) },
  }),
);

/** The active tab inverts to ink; the design never uses the accent for "where am I". */
export const SettingsNavLink = styled(NextLink, {
  name: NAME,
  slot: "Link",
})<{ ownerState: { active: boolean; variant: SettingsNavVariant } }>(
  ({ theme, ownerState }) => ({
    display: "flex",
    alignItems: "center",
    gap: theme.spacing(space.sm),
    minHeight: ownerState.variant === "tabs" ? 64 : 56,
    paddingInline: theme.spacing(space.sm + 1),
    paddingBlock: theme.spacing(space.xs),
    textDecoration: "none",
    color: ownerState.active
      ? theme.palette.background.default
      : theme.palette.text.primary,
    backgroundColor: ownerState.active
      ? theme.palette.text.primary
      : "transparent",
    "&:hover": {
      backgroundColor: ownerState.active
        ? theme.palette.text.primary
        : theme.palette.divider,
    },
  }),
);

export const SettingsNavName = styled("span", { name: NAME, slot: "Name" })(
  ({ theme }) => ({
    ...theme.typography.subtitle2,
    flex: 1,
  }),
);
