"use client";

import { styled } from "@mui/material/styles";
import Eyebrow from "@/components/ui/Eyebrow";
import { space } from "@/theme/tokens";

const NAME = "HowItWorksSection";

export const HowItWorksEyebrow = styled(Eyebrow, {
  name: NAME,
  slot: "Eyebrow",
})(({ theme }) => ({
  // The block is inverted, so the label rides on the inherited light colour.
  color: "inherit",
  opacity: 0.7,
  marginBottom: theme.spacing(space.sm),
}));

export const HowItWorksFacts = styled("dl", { name: NAME, slot: "Facts" })(
  ({ theme }) => ({
    display: "grid",
    gridTemplateColumns: "1fr",
    gap: theme.spacing(space.md),
    margin: 0,
    [theme.breakpoints.up("sm")]: {
      gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
    },
  }),
);

export const HowItWorksDescription = styled("dd", {
  name: NAME,
  slot: "Description",
})(({ theme }) => ({
  ...theme.typography.body2,
  margin: 0,
  // Muted copy on the inverted block. 0.82 of the light text keeps it above 10:1.
  opacity: 0.82,
}));
