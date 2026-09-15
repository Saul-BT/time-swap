"use client";

import Link from "@mui/material/Link";
import { styled } from "@mui/material/styles";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import { visuallyHidden } from "@/theme/rules";
import { space } from "@/theme/tokens";

const NAME = "VisibilityMatrix";

/** Scrolls sideways on small screens; the data column stays put. */
export const VisibilityMatrixRoot = styled(TableContainer, {
  name: NAME,
  slot: "Root",
})(({ theme }) => ({
  overflowX: "auto",
  "& th:first-of-type, & td:first-of-type": {
    position: "sticky",
    left: 0,
    backgroundColor: theme.palette.background.paper,
    zIndex: 1,
  },
}));

export const VisibilityMatrixRowHead = styled(TableCell, {
  name: NAME,
  slot: "RowHead",
})(({ theme }) => ({
  ...theme.typography.subtitle2,
  minWidth: 160,
  paddingRight: theme.spacing(space.xs),
}));

/** The pencil rides the label as a subscript, so the whole name is the target. */
export const VisibilityMatrixEditLink = styled(Link, {
  name: NAME,
  slot: "Edit",
})(({ theme }) => ({
  display: "inline-flex",
  alignItems: "flex-end",
  gap: theme.spacing(0.5),
}));

export const VisibilityMatrixCell = styled(TableCell, {
  name: NAME,
  slot: "Cell",
})(({ theme }) => ({
  textAlign: "center",
  padding: 2,
  minWidth: 38,
  [theme.breakpoints.up("md")]: { padding: 4, minWidth: 92 },
}));

/** The initial carries the column below `md`; the full name takes over at `md`. */
export const VisibilityMatrixMomentShort = styled("span", {
  name: NAME,
  slot: "MomentShort",
})(({ theme }) => ({
  [theme.breakpoints.up("md")]: { display: "none" },
}));

export const VisibilityMatrixMomentFull = styled("span", {
  name: NAME,
  slot: "MomentFull",
})(({ theme }) => ({
  ...visuallyHidden,
  [theme.breakpoints.up("md")]: {
    position: "static",
    width: "auto",
    height: "auto",
    margin: 0,
    overflow: "visible",
    clip: "auto",
  },
}));

/** Says what an initial stands for; unnecessary once the names fit. */
export const VisibilityMatrixLegend = styled("dl", {
  name: NAME,
  slot: "Legend",
})(({ theme }) => ({
  ...theme.typography.caption,
  display: "grid",
  gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
  gap: theme.spacing(0.5, space.xs),
  margin: 0,
  marginTop: theme.spacing(space.xs),
  color: theme.palette.text.secondary,
  [theme.breakpoints.up("md")]: { display: "none" },
}));

export const VisibilityMatrixLegendItem = styled("div", {
  name: NAME,
  slot: "LegendItem",
})(({ theme }) => ({
  display: "flex",
  gap: theme.spacing(0.5),
  "& dt": { margin: 0, fontWeight: theme.typography.fontWeightBold },
  "& dd": { margin: 0 },
}));

/** An empty cell reads as a rendering failure; the dash says it is on purpose. */
export const VisibilityMatrixEmpty = styled("span", {
  name: NAME,
  slot: "Empty",
})(({ theme }) => ({
  color: theme.palette.divider,
}));

export const VisibilityMatrixFixed = styled("span", {
  name: NAME,
  slot: "Fixed",
})(({ theme }) => ({
  ...theme.typography.caption,
  color: theme.palette.text.secondary,
  marginLeft: theme.spacing(space.xs),
}));

export const VisibilityMatrixFootnote = styled("p", {
  name: NAME,
  slot: "Footnote",
})(({ theme }) => ({
  ...theme.typography.caption,
  margin: 0,
  marginTop: theme.spacing(space.xs),
  color: theme.palette.text.secondary,
}));
