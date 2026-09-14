"use client";

import Box from "@mui/material/Box";
import { styled } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import { space } from "@/theme/tokens";

const NAME = "SectionHeader";

export const SectionHeaderRoot = styled(Box, {
  name: NAME,
  slot: "Root",
})<{ ownerState: { hasIntro: boolean } }>(({ theme, ownerState }) => ({
  marginBottom: theme.spacing(ownerState.hasIntro ? space.md : space.sm + 1),
}));

export const SectionHeaderTopRow = styled(Box, {
  name: NAME,
  slot: "TopRow",
})(({ theme }) => ({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "baseline",
  flexWrap: "wrap",
  gap: theme.spacing(space.xs),
}));

export const SectionHeaderIntro = styled(Typography, {
  name: NAME,
  slot: "Intro",
})(({ theme }) => ({
  marginTop: theme.spacing(space.xs),
  maxWidth: 640,
}));
