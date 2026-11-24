"use client";

import { styled, Typography } from "@mui/material";
import type { WithComponent } from "@/lib/mui/polymorphic";
import { rule } from "@/theme/rules";
import { space } from "@/theme/tokens";

const NAME = "BoardSectionHead";

export const BoardSectionHeadRoot = styled("div", { name: NAME, slot: "Root" })(
  ({ theme }) => ({
    display: "flex",
    alignItems: "center",
    gap: theme.spacing(1.5),
    minHeight: theme.system.compactControlHeight,
    paddingBottom: theme.spacing(space.xs),
    borderBottom: rule(theme),
  }),
);

export const BoardSectionHeadTitle = styled(Typography, {
  name: NAME,
  slot: "Title",
})<WithComponent>({ flex: 1, minWidth: 0 });

export const BoardSectionHeadCount = styled("span", {
  name: NAME,
  slot: "Count",
})(({ theme }) => ({
  ...theme.typography.body1,
  marginLeft: theme.spacing(1.5),
  color: theme.palette.text.secondary,
  fontVariantNumeric: "tabular-nums",
}));

/** Collapses the section on phones only; from `md` up the list is always open. */
export const BoardSectionHeadToggle = styled("button", {
  name: NAME,
  slot: "Toggle",
})(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  width: "100%",
  minHeight: theme.system.compactControlHeight,
  padding: 0,
  border: 0,
  background: "none",
  font: "inherit",
  textTransform: "inherit",
  letterSpacing: "inherit",
  color: "inherit",
  textAlign: "left",
  cursor: "pointer",
  [theme.breakpoints.up("md")]: { display: "none" },
}));

export const BoardSectionHeadChevron = styled("span", {
  name: NAME,
  slot: "Chevron",
})<{ ownerState: { open: boolean } }>(({ ownerState }) => ({
  display: "inline-flex",
  marginLeft: "auto",
  transform: ownerState.open ? "rotate(180deg)" : "none",
}));

export const BoardSectionHeadStatic = styled("span", {
  name: NAME,
  slot: "Static",
})(({ theme }) => ({
  display: "none",
  [theme.breakpoints.up("md")]: { display: "inline" },
}));

export const BoardSectionHeadEnd = styled("div", { name: NAME, slot: "End" })({
  marginLeft: "auto",
  flexShrink: 0,
});
