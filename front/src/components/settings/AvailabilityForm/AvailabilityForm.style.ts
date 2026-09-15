"use client";

import { styled } from "@mui/material/styles";
import { space } from "@/theme/tokens";

export const AvailabilityFormHint = styled("p", {
  name: "AvailabilityForm",
  slot: "Hint",
})(({ theme }) => ({
  ...theme.typography.body2,
  margin: 0,
  marginTop: -theme.spacing(space.sm),
  color: theme.palette.text.secondary,
}));
