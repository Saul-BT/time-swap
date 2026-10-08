"use client";

import { styled } from "@mui/material";
import NextLink from "next/link";
import { bareList, currentBar, rule } from "@/theme/rules";
import { space } from "@/theme/tokens";

const NAME = "MemberTabBar";

/** Thumb reach on phones; from `md` up the header carries the same links. */
export const MemberTabBarRoot = styled("nav", { name: NAME, slot: "Root" })(
  ({ theme }) => ({
    position: "sticky",
    bottom: 0,
    zIndex: theme.zIndex.appBar,
    borderTop: rule(theme),
    backgroundColor: theme.palette.background.paper,
    [theme.breakpoints.up("md")]: { display: "none" },
  }),
);

export const MemberTabBarList = styled("ul", { name: NAME, slot: "List" })({
  ...bareList,
  display: "flex",
});

export const MemberTabBarTab = styled(NextLink, {
  name: NAME,
  slot: "Tab",
})<{ ownerState: { current: boolean; solid: boolean } }>(
  ({ theme, ownerState }) => ({
    position: "relative",
    flex: "1 1 0",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 2,
    minHeight: 60,
    padding: theme.spacing(1.25, 0, 1.5),
    ...theme.typography.caption,
    fontWeight: 600,
    textDecoration: "none",
    backgroundColor: ownerState.solid
      ? theme.palette.primary.main
      : "transparent",
    color: ownerState.solid
      ? theme.palette.primary.contrastText
      : ownerState.current
        ? theme.palette.primary.main
        : theme.palette.text.primary,
    ...(ownerState.current && { "&::after": currentBar(theme, "top") }),
    "&:focus-visible": { outlineOffset: -theme.system.focusRingWidth },
  }),
);

export const MemberTabBarItem = styled("li", { name: NAME, slot: "Item" })({
  flex: "1 1 0",
  display: "flex",
});

/** Pinned to the glyph's top-right corner, not to the label. */
export const MemberTabBarBadge = styled("span", { name: NAME, slot: "Badge" })(
  ({ theme }) => ({
    position: "absolute",
    top: theme.spacing(0.75),
    left: `calc(50% + ${theme.spacing(space.xs)})`,
  }),
);
