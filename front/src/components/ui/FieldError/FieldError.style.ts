"use client";

import { styled } from "@mui/material/styles";
import { space } from "@/theme/tokens";

export const FieldErrorRoot = styled("p", { name: "FieldError", slot: "Root" })(
  ({ theme }) => ({
    ...theme.typography.body2,
    display: "flex",
    alignItems: "flex-start",
    gap: theme.spacing(space.xs / 2),
    margin: 0,
    marginTop: theme.spacing(space.xs / 2),
    color: theme.palette.error.main,
    fontWeight: theme.typography.fontWeightMedium,
  }),
);
