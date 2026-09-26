"use client";

import Box from "@mui/material/Box";
import { styled } from "@mui/material/styles";
import NextLink from "next/link";
import { bareList, softRule } from "@/theme/rules";
import { space } from "@/theme/tokens";
import { conversationListClasses } from "./ConversationList.util";

const NAME = "ConversationList";

export const ConversationListRoot = styled("ul", {
  name: NAME,
  slot: "Root",
})(({ theme }) => ({
  ...bareList,
  maxWidth: 720,
  borderTop: softRule(theme),
}));

export const ConversationListItem = styled("li", {
  name: NAME,
  slot: "Item",
})(({ theme }) => ({
  borderBottom: softRule(theme),
}));

export const ConversationListLink = styled(NextLink, {
  name: NAME,
  slot: "Link",
})(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  gap: theme.spacing(space.xs),
  paddingBlock: theme.spacing(space.sm + 1),
  textDecoration: "none",
  color: "inherit",
  [`&:hover .${conversationListClasses.preview}`]: {
    color: theme.palette.text.primary,
  },
}));

export const ConversationListMeta = styled(Box, {
  name: NAME,
  slot: "Meta",
})(({ theme }) => ({
  display: "flex",
  justifyContent: "space-between",
  gap: theme.spacing(space.sm),
  alignItems: "baseline",
}));
