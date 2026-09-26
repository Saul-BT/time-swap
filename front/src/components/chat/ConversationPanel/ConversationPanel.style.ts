"use client";

import Box from "@mui/material/Box";
import InputBase from "@mui/material/InputBase";
import { styled } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import NextLink from "next/link";
import type { WithComponent } from "@/lib/mui/polymorphic";
import { rule, softRule } from "@/theme/rules";
import { space } from "@/theme/tokens";

const NAME = "ConversationPanel";

export const ConversationPanelRoot = styled(Box, {
  name: NAME,
  slot: "Root",
})(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  gap: theme.spacing(space.sm + 1),
  maxWidth: 720,
}));

export const ConversationPanelContext = styled(NextLink, {
  name: NAME,
  slot: "Context",
})(({ theme }) => ({
  display: "block",
  textDecoration: "none",
  color: "inherit",
  backgroundColor: theme.palette.background.paper,
  border: rule(theme),
}));

export const ConversationPanelContextBody = styled(Box, {
  name: NAME,
  slot: "ContextBody",
})(({ theme }) => ({
  padding: theme.spacing(space.sm + 1),
  display: "flex",
  flexDirection: "column",
  gap: theme.spacing(space.xs),
}));

export const ConversationPanelThread = styled("ul", {
  name: NAME,
  slot: "Thread",
})(({ theme }) => ({
  listStyle: "none",
  margin: 0,
  padding: theme.spacing(space.sm, 0),
  display: "flex",
  flexDirection: "column",
  gap: theme.spacing(space.sm),
  minHeight: 280,
  borderTop: softRule(theme),
  borderBottom: softRule(theme),
}));

export const ConversationPanelEmpty = styled("li", {
  name: NAME,
  slot: "Empty",
})(({ theme }) => ({
  color: theme.palette.text.secondary,
  paddingBlock: theme.spacing(space.md),
  ...theme.typography.body2,
}));

type MessageOwnerState = { from: "self" | "peer" };

export const ConversationPanelMessage = styled("li", {
  name: NAME,
  slot: "Message",
})<{ ownerState: MessageOwnerState }>(({ theme, ownerState }) => ({
  display: "flex",
  flexDirection: "column",
  alignItems: ownerState.from === "self" ? "flex-end" : "flex-start",
  gap: theme.spacing(0.5),
  maxWidth: "85%",
  alignSelf: ownerState.from === "self" ? "flex-end" : "flex-start",
}));

export const ConversationPanelMessageBody = styled(Box, {
  name: NAME,
  slot: "MessageBody",
})<{ ownerState: MessageOwnerState }>(({ theme, ownerState }) => ({
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
    : {
        backgroundColor: theme.palette.background.paper,
      }),
}));

export const ConversationPanelMessageMeta = styled(Typography, {
  name: NAME,
  slot: "MessageMeta",
})<WithComponent>(({ theme }) => ({
  color: theme.palette.text.secondary,
}));

export const ConversationPanelComposer = styled("form", {
  name: NAME,
  slot: "Composer",
})(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "stretch",
  backgroundColor: theme.palette.background.paper,
  border: rule(theme),
  [theme.breakpoints.up("sm")]: {
    flexDirection: "row",
    alignItems: "stretch",
  },
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

export const ConversationPanelHint = styled(Typography, {
  name: NAME,
  slot: "Hint",
})<WithComponent>(({ theme }) => ({
  color: theme.palette.text.secondary,
}));
