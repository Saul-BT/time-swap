"use client";

import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import { styled } from "@mui/material/styles";
import NextLink from "next/link";
import type { WithComponent } from "@/lib/mui/polymorphic";
import { rule } from "@/theme/rules";
import { space } from "@/theme/tokens";
import { settingsShellClasses } from "./SettingsShell.util";

const NAME = "SettingsShell";

/**
 * One markup, two arrangements picked by `detail`: the index lists the sections
 * at every width, an open section shows the rail and its panel. What is left to
 * the breakpoint is only what changes inside an arrangement, so the server
 * renders the same HTML for every viewport and nothing flickers.
 */
export const SettingsShellRoot = styled("div", { name: NAME, slot: "Root" })({
  minHeight: "100vh",
  display: "flex",
  flexDirection: "column",
});

export const SettingsShellMain = styled(Container, {
  name: NAME,
  slot: "Main",
})<WithComponent & { ownerState: { detail: boolean } }>(
  ({ theme, ownerState }) => ({
    flex: 1,
    display: "flex",
    flexDirection: "column",
    gap: theme.spacing(space.md),
    paddingBlock: theme.spacing(space.md),
    ...(ownerState.detail ? { paddingInline: 0, paddingTop: 0 } : {}),
    [theme.breakpoints.up("md")]: {
      gap: theme.spacing(space.md),
      paddingBlock: theme.spacing(space.lg),
      ...(ownerState.detail ? { paddingInline: 56, paddingTop: 56 } : {}),
    },
  }),
);

export const SettingsShellHead = styled("header", {
  name: NAME,
  slot: "Head",
})<{ ownerState: { detail: boolean } }>(({ theme, ownerState }) => ({
  display: ownerState.detail ? "none" : "flex",
  flexDirection: "column",
  gap: theme.spacing(space.sm),
  [theme.breakpoints.up("md")]: {
    display: "flex",
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    gap: theme.spacing(space.md),
  },
}));

export const SettingsShellHeadText = styled("div", {
  name: NAME,
  slot: "HeadText",
})(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  gap: theme.spacing(space.xs),
  maxWidth: 640,
}));

/** Mobile shows it after the index; desktop puts it in the head. */
export const SettingsShellViewPublic = styled(Button, {
  name: NAME,
  slot: "ViewPublic",
})<{ ownerState: { placement: "head" | "foot" } }>(({ theme, ownerState }) => ({
  display: ownerState.placement === "head" ? "none" : "inline-flex",
  alignSelf: "stretch",
  gap: theme.spacing(space.xs),
  [theme.breakpoints.up("md")]: {
    display: ownerState.placement === "head" ? "inline-flex" : "none",
    alignSelf: "auto",
    flexShrink: 0,
  },
}));

export const SettingsShellMeter = styled("div", {
  name: NAME,
  slot: "Meter",
})<{ ownerState: { detail: boolean } }>(({ theme, ownerState }) => ({
  display: ownerState.detail ? "none" : "block",
  [theme.breakpoints.up("md")]: { display: "block" },
}));

/**
 * On the index the frame is the list itself, so it carries no chrome of its
 * own; with a section open it becomes the framed surface holding rail + panel.
 */
export const SettingsShellFrame = styled("div", {
  name: NAME,
  slot: "Frame",
})<{ ownerState: { detail: boolean } }>(({ theme, ownerState }) => ({
  display: "flex",
  flexDirection: "column",
  [theme.breakpoints.up("md")]: ownerState.detail
    ? {
        flexDirection: "row",
        alignItems: "stretch",
        border: rule(theme),
        backgroundColor: theme.palette.background.paper,
        minHeight: 640,
      }
    : {},
  [`& > .${settingsShellClasses.rail}`]: {
    display: "none",
    [theme.breakpoints.up("md")]: {
      display: ownerState.detail ? "block" : "none",
    },
  },
  [`& > .${settingsShellClasses.index}`]: {
    display: ownerState.detail ? "none" : "block",
  },
}));

export const SettingsShellPanel = styled("div", {
  name: NAME,
  slot: "Panel",
})<{ ownerState: { detail: boolean } }>(({ theme, ownerState }) => ({
  display: ownerState.detail ? "flex" : "none",
  flexDirection: "column",
  flex: 1,
  minWidth: 0,
  padding: theme.spacing(space.md, space.sm + 1, 0),
  [theme.breakpoints.up("md")]: {
    padding: theme.spacing(space.md),
  },
  [theme.breakpoints.up("lg")]: {
    padding: theme.spacing(space.lg),
  },
}));

export const SettingsShellDetailBar = styled("div", {
  name: NAME,
  slot: "DetailBar",
})(({ theme }) => ({
  position: "sticky",
  top: 0,
  zIndex: 1,
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  minHeight: theme.system.controlHeight,
  paddingInline: theme.spacing(space.sm),
  borderBottom: rule(theme),
  backgroundColor: theme.palette.background.paper,
  [theme.breakpoints.up("md")]: { display: "none" },
}));

export const SettingsShellDetailBack = styled(NextLink, {
  name: NAME,
  slot: "DetailBack",
})(({ theme }) => ({
  display: "inline-flex",
  alignItems: "center",
  gap: theme.spacing(space.xs),
  minHeight: 44,
  ...theme.typography.subtitle2,
  color: theme.palette.text.primary,
  textDecoration: "none",
}));
