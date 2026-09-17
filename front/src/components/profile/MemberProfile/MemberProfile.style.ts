"use client";

import Avatar from "@mui/material/Avatar";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import { styled } from "@mui/material/styles";
import type { WithComponent } from "@/lib/mui/polymorphic";
import { space } from "@/theme/tokens";

const NAME = "MemberProfile";

export const MemberProfileRoot = styled(Paper, {
  name: NAME,
  slot: "Root",
})<WithComponent>(({ theme }) => ({
  margin: "0 auto",
  maxWidth: 560,
  padding: theme.spacing(space.md),
}));

export const MemberProfileIdentity = styled(Stack, {
  name: NAME,
  slot: "Identity",
})(({ theme }) => ({
  alignItems: "center",
  marginBottom: theme.spacing(space.sm),
}));

export const MemberProfileAvatar = styled(Avatar, {
  name: NAME,
  slot: "Avatar",
})({
  width: 88,
  height: 88,
  fontSize: "2rem",
});

export const MemberProfileQuote = styled("blockquote", {
  name: NAME,
  slot: "Quote",
})(({ theme }) => ({
  ...theme.typography.body1,
  margin: 0,
  marginBottom: theme.spacing(space.md),
}));

export const MemberProfileActions = styled(Stack, {
  name: NAME,
  slot: "Actions",
})(({ theme }) => ({
  alignItems: "flex-start",
  gap: theme.spacing(space.sm),
}));