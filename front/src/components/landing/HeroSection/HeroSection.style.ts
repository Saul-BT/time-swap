"use client";

import Container from "@mui/material/Container";
import { styled } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import Eyebrow from "@/components/ui/Eyebrow";
import type { WithComponent } from "@/lib/mui/polymorphic";
import { space } from "@/theme/tokens";

const NAME = "HeroSection";

export const HeroSectionRoot = styled(Container, {
  name: NAME,
  slot: "Root",
})<WithComponent>(({ theme }) => ({
  paddingTop: theme.spacing(space.md),
  paddingBottom: theme.spacing(space.md),
  [theme.breakpoints.up("md")]: { paddingTop: theme.spacing(space.lg) },
}));

export const HeroSectionEyebrow = styled(Eyebrow, {
  name: NAME,
  slot: "Eyebrow",
})(({ theme }) => ({
  color: theme.palette.primary.main,
  marginBottom: theme.spacing(space.sm),
}));

export const HeroSectionTitle = styled(Typography, {
  name: NAME,
  slot: "Title",
})(({ theme }) => ({
  maxWidth: 900,
  marginBottom: theme.spacing(space.sm),
}));

export const HeroSectionLead = styled(Typography, { name: NAME, slot: "Lead" })(
  ({ theme }) => ({
    maxWidth: 640,
    marginBottom: theme.spacing(space.md),
  }),
);
