"use client";

import Box from "@mui/material/Box";
import InputBase from "@mui/material/InputBase";
import { styled, type Theme } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import NextLink from "next/link";
import type { WithComponent } from "@/lib/mui/polymorphic";
import { rule, softRule } from "@/theme/rules";
import { space } from "@/theme/tokens";
import { conversationPanelClasses as classes } from "./ConversationPanel.util";

const NAME = "ConversationPanel";

const inset = (theme: Theme) => ({
  paddingInline: theme.spacing(space.sm + 1),
  [theme.breakpoints.up("md")]: {
    paddingInline: theme.spacing(space.lg),
  },
});

const side = (from: "self" | "peer") =>
  from === "self" ? "flex-end" : "flex-start";

export const ConversationScreen = styled(Box, {
  name: NAME,
  slot: "Screen",
})(({ theme }) => ({
  position: "fixed",
  inset: 0,
  zIndex: 1,
  display: "flex",
  flexDirection: "column",
  overflow: "hidden",
  backgroundColor: theme.palette.background.default,
}));

export const ConversationPanelRoot = styled(Box, {
  name: NAME,
  slot: "Root",
})({
  flex: 1,
  minHeight: 0,
  display: "flex",
  flexDirection: "column",
});

export const ConversationPanelBar = styled(Box, {
  name: NAME,
  slot: "Bar",
})(({ theme }) => ({
  ...inset(theme),
  flexShrink: 0,
  display: "flex",
  flexDirection: "column",
  gap: theme.spacing(0.5),
  paddingBlock: theme.spacing(space.sm),
  borderBottom: softRule(theme),
  backgroundColor: theme.palette.background.paper,
}));

export const ConversationPanelRow = styled(Box, {
  name: NAME,
  slot: "Row",
})(({ theme }) => ({
  display: "flex",
  alignItems: "baseline",
  justifyContent: "space-between",
  flexWrap: "wrap",
  gap: theme.spacing(space.xs, space.sm),
  minWidth: 0,
}));

export const ConversationPanelLink = styled(NextLink, {
  name: NAME,
  slot: "Link",
})<{ ownerState: { tone: "accent" | "ink" } }>(({ theme, ownerState }) => ({
  ...theme.typography.subtitle2,
  flexShrink: 0,
  color:
    ownerState.tone === "accent"
      ? theme.palette.primary.main
      : theme.palette.text.primary,
  textDecoration: ownerState.tone === "accent" ? "none" : "underline",
  "&:hover": { textDecoration: "underline" },
}));

export const ConversationPanelTitle = styled(Typography, {
  name: NAME,
  slot: "Title",
})<WithComponent>({
  flex: "1 1 12rem",
  minWidth: 0,
  display: "-webkit-box",
  WebkitLineClamp: 2,
  WebkitBoxOrient: "vertical",
  overflow: "hidden",
});

export const ConversationPanelThread = styled("ul", {
  name: NAME,
  slot: "Thread",
})(({ theme }) => ({
  ...inset(theme),
  listStyle: "none",
  margin: 0,
  flex: 1,
  minHeight: 0,
  overflow: "auto",
  display: "flex",
  flexDirection: "column",
  gap: theme.spacing(space.sm),
  paddingBlock: theme.spacing(space.sm),
}));

export const ConversationPanelEmpty = styled("li", {
  name: NAME,
  slot: "Empty",
})(({ theme }) => ({
  margin: "auto",
  textAlign: "center",
  maxWidth: 420,
  color: theme.palette.text.secondary,
  ...theme.typography.body2,
}));

export const ConversationPanelMessage = styled("li", {
  name: NAME,
  slot: "Message",
})<{ ownerState: { from: "self" | "peer"; lead: boolean } }>(
  ({ theme, ownerState }) => ({
    display: "flex",
    flexDirection: "column",
    alignItems: side(ownerState.from),
    alignSelf: side(ownerState.from),
    gap: theme.spacing(0.5),
    maxWidth: "min(70%, 32rem)",
    marginTop: ownerState.lead ? "auto" : undefined,
    [`& .${classes.messageBody}`]: {
      padding: theme.spacing(space.sm),
      border: rule(theme),
      whiteSpace: "pre-wrap",
      wordBreak: "break-word",
      ...theme.typography.body2,
      ...(ownerState.from === "self"
        ? {
            backgroundColor: theme.palette.primary.main,
            borderColor: theme.palette.primary.main,
            color: theme.palette.primary.contrastText,
          }
        : { backgroundColor: theme.palette.background.paper }),
    },
  }),
);

export const ConversationPanelComposer = styled("form", {
  name: NAME,
  slot: "Composer",
})(({ theme }) => ({
  ...inset(theme),
  flexShrink: 0,
  display: "flex",
  alignItems: "stretch",
  backgroundColor: theme.palette.background.paper,
  borderTop: rule(theme),
}));

export const ConversationPanelComposerInput = styled(InputBase, {
  name: NAME,
  slot: "ComposerInput",
})(({ theme }) => ({
  flex: 1,
  minWidth: 0,
  minHeight: theme.system.controlHeight,
  paddingInline: theme.spacing(space.sm),
}));
