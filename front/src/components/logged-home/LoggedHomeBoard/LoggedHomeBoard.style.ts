"use client";

import { styled } from "@mui/material";
import { rule } from "@/theme/rules";
import { space } from "@/theme/tokens";

const NAME = "LoggedHomeBoard";

/**
 * Phones stack in reading order with the week first, stuck under the header.
 * From `md` up: greeting and balance, then the week, then the list beside the
 * side column, then the listings bar.
 */
export const LoggedHomeBoardRoot = styled("div", {
  name: NAME,
  slot: "Root",
})<{ ownerState: { hasNotice: boolean } }>(({ theme, ownerState }) => ({
  display: "flex",
  flexDirection: "column",
  gap: theme.spacing(3),
  maxWidth: theme.system.contentWidth,
  marginInline: "auto",
  padding: theme.spacing(0, space.sm, 5),
  [theme.breakpoints.up("md")]: {
    display: "grid",
    gridTemplateColumns: `minmax(0, 1fr) ${theme.system.memberAsideWidth}px`,
    gridTemplateAreas: [
      `"heading balance"`,
      ownerState.hasNotice ? `"notice notice"` : "",
      `"week week"`,
      `"pending aside"`,
      `"listings listings"`,
    ].join(" "),
    alignItems: "start",
    columnGap: theme.spacing(space.lg),
    rowGap: theme.spacing(3.5),
    padding: theme.spacing(5, space.lg, space.lg),
  },
}));

export const LoggedHomeBoardHeading = styled("div", {
  name: NAME,
  slot: "Heading",
})(({ theme }) => ({
  order: 2,
  [theme.breakpoints.up("md")]: { gridArea: "heading", alignSelf: "end" },
}));

export const LoggedHomeBoardBalance = styled("div", {
  name: NAME,
  slot: "Balance",
})(({ theme }) => ({
  display: "none",
  [theme.breakpoints.up("md")]: {
    display: "block",
    gridArea: "balance",
    alignSelf: "end",
  },
}));

export const LoggedHomeBoardNotice = styled("div", {
  name: NAME,
  slot: "Notice",
})(({ theme }) => ({
  order: 1,
  [theme.breakpoints.up("md")]: { gridArea: "notice" },
}));

/** Full-bleed and sticky on phones so the selected day never scrolls away. */
export const LoggedHomeBoardWeek = styled("div", {
  name: NAME,
  slot: "Week",
})(({ theme }) => ({
  order: 0,
  position: "sticky",
  top: theme.system.memberHeaderHeight,
  zIndex: theme.zIndex.appBar - 1,
  marginInline: theme.spacing(-space.sm),
  padding: theme.spacing(1.5, space.sm),
  borderBottom: rule(theme),
  backgroundColor: theme.palette.background.default,
  [theme.breakpoints.up("md")]: {
    gridArea: "week",
    position: "static",
    margin: 0,
    padding: 0,
    border: 0,
  },
}));

export const LoggedHomeBoardPending = styled("div", {
  name: NAME,
  slot: "Pending",
})(({ theme }) => ({
  order: 3,
  [theme.breakpoints.up("md")]: { gridArea: "pending" },
}));

export const LoggedHomeBoardAside = styled("div", {
  name: NAME,
  slot: "Aside",
})(({ theme }) => ({
  order: 4,
  display: "flex",
  flexDirection: "column",
  gap: theme.spacing(4.5),
  [theme.breakpoints.up("md")]: { gridArea: "aside" },
}));

export const LoggedHomeBoardListings = styled("div", {
  name: NAME,
  slot: "Listings",
})(({ theme }) => ({
  order: 5,
  [theme.breakpoints.up("md")]: { gridArea: "listings" },
}));
