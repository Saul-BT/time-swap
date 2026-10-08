"use client";

import { styled, type Theme, Typography } from "@mui/material";
import Eyebrow from "@/components/ui/Eyebrow";
import { bareList, currentBar, rule, softRule } from "@/theme/rules";
import { fontFamily, space } from "@/theme/tokens";
import type { DayMarkTone } from "./WeekStrip.util";

const NAME = "WeekStrip";

type DayState = { selected: boolean; today: boolean };

const markColor = (theme: Theme, tone: DayMarkTone) =>
  ({
    accent: theme.palette.primary.main,
    ink: theme.palette.text.primary,
    brake: theme.palette.secondary.main,
    warning: theme.palette.warning.main,
  })[tone];

export const WeekStripRoot = styled("div", { name: NAME, slot: "Root" })(
  ({ theme }) => ({
    display: "flex",
    flexDirection: "column",
    gap: theme.spacing(space.xs),
    [theme.breakpoints.up("md")]: { gap: theme.spacing(1.5) },
  }),
);

export const WeekStripHeader = styled("div", { name: NAME, slot: "Header" })(
  ({ theme }) => ({
    display: "flex",
    alignItems: "baseline",
    justifyContent: "space-between",
    gap: theme.spacing(1.5),
    [theme.breakpoints.up("md")]: {
      alignItems: "center",
      justifyContent: "flex-start",
    },
  }),
);

export const WeekStripLabel = styled(Eyebrow, { name: NAME, slot: "Label" })(
  ({ theme }) => ({
    display: "none",
    [theme.breakpoints.up("md")]: { display: "block" },
  }),
);

export const WeekStripRangeWide = styled(Typography, {
  name: NAME,
  slot: "RangeWide",
})(({ theme }) => ({
  display: "none",
  fontWeight: 700,
  fontVariantNumeric: "tabular-nums",
  [theme.breakpoints.up("md")]: { display: "block" },
}));

export const WeekStripRangeNarrow = styled(Eyebrow, {
  name: NAME,
  slot: "RangeNarrow",
})(({ theme }) => ({
  fontVariantNumeric: "tabular-nums",
  [theme.breakpoints.up("md")]: { display: "none" },
}));

export const WeekStripNav = styled("div", { name: NAME, slot: "Nav" })(
  ({ theme }) => ({
    display: "none",
    [theme.breakpoints.up("md")]: { display: "block", marginLeft: "auto" },
  }),
);

export const WeekStripAside = styled("div", { name: NAME, slot: "Aside" })(
  ({ theme }) => ({
    [theme.breakpoints.up("md")]: { display: "none" },
  }),
);

export const WeekStripGrid = styled("div", { name: NAME, slot: "Grid" })(
  ({ theme }) => ({
    display: "grid",
    gridTemplateColumns: "repeat(7, minmax(0, 1fr))",
    border: rule(theme),
    backgroundColor: theme.palette.background.paper,
    [theme.breakpoints.up("md")]: { minHeight: 132 },
  }),
);

/**
 * Today carries the accent bar on top. The selected day inverts on phones and
 * gets an inner ink frame from `md` up, so the focus ring (outside) stays distinct.
 */
export const WeekStripDay = styled("button", {
  name: NAME,
  slot: "Day",
})<{ ownerState: DayState }>(({ theme, ownerState }) => ({
  position: "relative",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: theme.spacing(0.5),
  minWidth: 0,
  minHeight: 76,
  padding: theme.spacing(space.xs, 0, 1.25),
  border: 0,
  borderRadius: 0,
  font: "inherit",
  textAlign: "center",
  cursor: "pointer",
  backgroundColor: ownerState.selected
    ? theme.palette.text.primary
    : theme.palette.background.paper,
  color: ownerState.selected
    ? theme.palette.background.paper
    : theme.palette.text.primary,
  "& + &": { borderLeft: softRule(theme) },
  ...(ownerState.today && { "&::after": currentBar(theme, "top") }),
  "&:focus-visible": { zIndex: 1 },
  [theme.breakpoints.up("md")]: {
    alignItems: "stretch",
    gap: theme.spacing(0.75),
    padding: theme.spacing(1.5, 1.25),
    textAlign: "left",
    backgroundColor: theme.palette.background.paper,
    color: theme.palette.text.primary,
    "&:hover": { backgroundColor: theme.palette.background.default },
    ...(ownerState.selected && {
      "&::before": {
        content: '""',
        position: "absolute",
        inset: 0,
        border: `${theme.system.focusRingWidth}px solid ${theme.palette.text.primary}`,
        pointerEvents: "none",
      },
    }),
  },
}));

export const WeekStripDayHead = styled("span", {
  name: NAME,
  slot: "DayHead",
})(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: theme.spacing(0.5),
  [theme.breakpoints.up("md")]: {
    flexDirection: "row",
    alignItems: "baseline",
    gap: theme.spacing(space.xs),
  },
}));

export const WeekStripWeekday = styled("span", {
  name: NAME,
  slot: "Weekday",
})<{ ownerState: DayState }>(({ theme, ownerState }) => ({
  ...theme.typography.overline,
  fontSize: "0.6875rem",
  letterSpacing: "0.08em",
  [theme.breakpoints.up("md")]: {
    fontSize: theme.typography.overline.fontSize,
    letterSpacing: "0.16em",
    color: ownerState.today
      ? theme.palette.primary.main
      : theme.palette.text.secondary,
  },
}));

export const WeekStripNumber = styled("span", {
  name: NAME,
  slot: "Number",
})<{ ownerState: DayState }>(({ theme, ownerState }) => ({
  fontFamily: fontFamily.condensed,
  fontWeight: 700,
  fontSize: 22,
  lineHeight: 1.06,
  fontVariantNumeric: "tabular-nums",
  [theme.breakpoints.up("md")]: {
    fontSize: 24,
    color: ownerState.today ? theme.palette.primary.main : "inherit",
  },
}));

export const WeekStripTodayTag = styled("span", {
  name: NAME,
  slot: "TodayTag",
})(({ theme }) => ({
  display: "none",
  [theme.breakpoints.up("md")]: { display: "inline-flex", marginLeft: "auto" },
}));

export const WeekStripMarks = styled("ul", { name: NAME, slot: "Marks" })(
  ({ theme }) => ({
    ...bareList,
    display: "none",
    [theme.breakpoints.up("md")]: {
      display: "flex",
      flexDirection: "column",
      gap: theme.spacing(0.75),
    },
  }),
);

export const WeekStripMark = styled("li", {
  name: NAME,
  slot: "Mark",
})<{ ownerState: { tone: DayMarkTone | "more" } }>(({ theme, ownerState }) => {
  const color =
    ownerState.tone === "more"
      ? theme.palette.divider
      : markColor(theme, ownerState.tone);
  const outlined = ownerState.tone === "warning" || ownerState.tone === "more";

  return {
    ...theme.typography.caption,
    fontSize: "0.75rem",
    fontWeight: 700,
    lineHeight: 1.3,
    padding: theme.spacing(0.375, 0.75),
    overflow: "hidden",
    whiteSpace: "nowrap",
    textOverflow: "ellipsis",
    border: `${theme.system.borderWidth}px solid ${color}`,
    backgroundColor: outlined ? theme.palette.background.paper : color,
    color: outlined
      ? ownerState.tone === "more"
        ? theme.palette.text.secondary
        : color
      : theme.palette.background.paper,
  };
});

export const WeekStripFree = styled("span", { name: NAME, slot: "Free" })(
  ({ theme }) => ({
    display: "none",
    [theme.breakpoints.up("md")]: {
      display: "block",
      ...theme.typography.caption,
      color: theme.palette.text.secondary,
    },
  }),
);

export const WeekStripDots = styled("span", { name: NAME, slot: "Dots" })(
  ({ theme }) => ({
    display: "flex",
    gap: 3,
    height: 8,
    [theme.breakpoints.up("md")]: { display: "none" },
  }),
);

/** On the inverted selected day a hairline keeps the ink dot visible. */
export const WeekStripDot = styled("span", {
  name: NAME,
  slot: "Dot",
})<{ ownerState: { tone: DayMarkTone; onInk: boolean } }>(
  ({ theme, ownerState }) => ({
    display: "block",
    width: 8,
    height: 8,
    backgroundColor: markColor(theme, ownerState.tone),
    outline: ownerState.onInk
      ? `1px solid ${theme.palette.background.paper}`
      : "none",
  }),
);
