"use client";

import Avatar from "@mui/material/Avatar";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import { styled } from "@mui/material/styles";
import type { WithComponent } from "@/lib/mui/polymorphic";
import { space } from "@/theme/tokens";

const NAME = "MemberCard";

export const MemberCardRoot = styled(Paper, {
  name: NAME,
  slot: "Root",
})<WithComponent>(({ theme }) => ({
  flex: 1,
  margin: 0,
  padding: theme.spacing(space.sm + 1),
}));

export const MemberCardIdentity = styled(Stack, {
  name: NAME,
  slot: "Identity",
})(({ theme }) => ({
  alignItems: "center",
  marginBottom: theme.spacing(space.sm),
}));

export const MemberCardAvatar = styled(Avatar, { name: NAME, slot: "Avatar" })({
  width: 52,
  height: 52,
});

export const MemberCardQuote = styled("blockquote", {
  name: NAME,
  slot: "Quote",
})(({ theme }) => ({
  ...theme.typography.body2,
  margin: 0,
  marginBottom: theme.spacing(space.sm),
}));
