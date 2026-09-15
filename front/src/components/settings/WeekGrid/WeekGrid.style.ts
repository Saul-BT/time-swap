"use client";

import { styled } from "@mui/material/styles";
import { rule } from "@/theme/rules";
import type { WeekGridOrientation } from "./WeekGrid.util";

const NAME = "WeekGrid";

export const WeekGridRoot = styled("div", { name: NAME, slot: "Root" })({
  display: "flex",
  flexDirection: "column",
});

/**
 * Two tables, one per orientation, so the server sends both and CSS picks
 * one by viewport; the hidden one is inert. Each cell keeps 44 px either way.
 */
export const WeekGridTable = styled("table", {
  name: NAME,
  slot: "Table",
})<{ ownerState: { orientation: WeekGridOrientation } }>(
  ({ theme, ownerState }) => ({
    display: ownerState.orientation === "daysDown" ? "table" : "none",
    width: "100%",
    borderCollapse: "collapse",
    border: rule(theme),
    backgroundColor: theme.palette.background.paper,
    tableLayout: "fixed",
    [theme.breakpoints.up("md")]: {
      display: ownerState.orientation === "daysAcross" ? "table" : "none",
    },
  }),
);

export const WeekGridHead = styled("th", { name: NAME, slot: "Head" })(
  ({ theme }) => ({
    ...theme.typography.overline,
    color: theme.palette.text.secondary,
    padding: theme.spacing(1),
    textAlign: "center",
    borderBottom: rule(theme),
    borderRight: rule(theme),
    "&:last-of-type": { borderRight: 0 },
  }),
);

export const WeekGridRowHead = styled("th", { name: NAME, slot: "RowHead" })(
  ({ theme }) => ({
    ...theme.typography.subtitle2,
    padding: theme.spacing(1),
    textAlign: "left",
    borderRight: rule(theme),
    borderBottom: rule(theme),
    width: "26%",
    [theme.breakpoints.up("md")]: { width: "16%" },
  }),
);

export const WeekGridCell = styled("td", { name: NAME, slot: "Cell" })(
  ({ theme }) => ({
    padding: 0,
    borderRight: rule(theme),
    borderBottom: rule(theme),
    "&:last-of-type": { borderRight: 0 },
  }),
);

/** A whole cell is the target; the mark fills it so the state is unmistakable. */
export const WeekGridToggle = styled("button", {
  name: NAME,
  slot: "Toggle",
})<{ ownerState: { checked: boolean } }>(({ theme, ownerState }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  width: "100%",
  minHeight: theme.system.gridCellSize,
  height: 52,
  margin: 0,
  padding: 0,
  border: 0,
  cursor: "pointer",
  font: "inherit",
  color: theme.palette.primary.contrastText,
  backgroundColor: ownerState.checked
    ? theme.palette.primary.main
    : theme.palette.background.paper,
  "&:hover": {
    backgroundColor: ownerState.checked
      ? theme.palette.text.primary
      : theme.palette.divider,
  },
  "&:focus-visible": {
    outline: `${theme.system.focusRingWidth}px solid ${theme.palette.text.primary}`,
    outlineOffset: -theme.system.focusRingWidth,
  },
  "&:disabled": { cursor: "default", opacity: 0.6 },
}));
