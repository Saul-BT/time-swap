"use client";

import { styled } from "@mui/material";
import { rule, softRule, visuallyHidden } from "@/theme/rules";
import { space } from "@/theme/tokens";

const NAME = "LoggedHomeSkeleton";

/** Same tracks as the board, so nothing jumps when the data lands. */
export const LoggedHomeSkeletonRoot = styled("div", {
  name: NAME,
  slot: "Root",
})(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  gap: theme.spacing(3),
  maxWidth: theme.system.contentWidth,
  marginInline: "auto",
  padding: theme.spacing(0, space.sm, 5),
  [theme.breakpoints.up("md")]: {
    display: "grid",
    gridTemplateColumns: `minmax(0, 1fr) ${theme.system.memberAsideWidth}px`,
    gridTemplateAreas: `"heading heading" "week week" "pending aside"`,
    alignItems: "start",
    columnGap: theme.spacing(space.lg),
    rowGap: theme.spacing(3.5),
    padding: theme.spacing(5, space.lg, space.lg),
  },
}));

export const LoggedHomeSkeletonStatus = styled("p", {
  name: NAME,
  slot: "Status",
})(visuallyHidden);

export const LoggedHomeSkeletonHeading = styled("div", {
  name: NAME,
  slot: "Heading",
})(({ theme }) => ({
  order: 1,
  display: "flex",
  flexDirection: "column",
  gap: theme.spacing(1.5),
  [theme.breakpoints.up("md")]: { gridArea: "heading" },
}));

export const LoggedHomeSkeletonWeek = styled("div", {
  name: NAME,
  slot: "Week",
})(({ theme }) => ({
  order: 0,
  display: "grid",
  gridTemplateColumns: "repeat(7, minmax(0, 1fr))",
  marginInline: theme.spacing(-space.sm),
  border: rule(theme),
  borderInline: 0,
  backgroundColor: theme.palette.background.paper,
  [theme.breakpoints.up("md")]: {
    gridArea: "week",
    marginInline: 0,
    marginTop: theme.spacing(4.5),
    border: rule(theme),
  },
}));

export const LoggedHomeSkeletonDay = styled("span", {
  name: NAME,
  slot: "Day",
})(({ theme }) => ({
  minHeight: 76,
  "& + &": { borderLeft: softRule(theme) },
  [theme.breakpoints.up("md")]: { minHeight: 132 },
}));

export const LoggedHomeSkeletonColumn = styled("div", {
  name: NAME,
  slot: "Column",
})<{ ownerState: { area: "pending" | "aside" } }>(({ theme, ownerState }) => ({
  order: 2,
  [theme.breakpoints.up("md")]: { gridArea: ownerState.area },
}));

export const LoggedHomeSkeletonRow = styled("div", {
  name: NAME,
  slot: "Row",
})(({ theme }) => ({
  display: "flex",
  gap: theme.spacing(2.25),
  paddingBlock: theme.spacing(2.5),
  borderBottom: softRule(theme),
}));

/** Flat line-coloured blocks: no shimmer, nothing in the system moves for decoration. */
export const LoggedHomeSkeletonBar = styled("span", {
  name: NAME,
  slot: "Bar",
})<{ ownerState: { width: number | string; height: number } }>(
  ({ theme, ownerState }) => ({
    display: "block",
    flexShrink: 0,
    width: ownerState.width,
    maxWidth: "100%",
    height: ownerState.height,
    backgroundColor: theme.palette.divider,
  }),
);
