"use client";

import { styled } from "@mui/material/styles";
import { space } from "@/theme/tokens";

const NAME = "PrivacyForm";

export const PrivacyFormSwitches = styled("div", {
  name: NAME,
  slot: "Switches",
})({
  display: "flex",
  flexDirection: "column",
});

export const PrivacyFormMatrixHead = styled("div", {
  name: NAME,
  slot: "MatrixHead",
})(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  gap: theme.spacing(space.xs / 2),
  marginBottom: theme.spacing(space.sm),
}));

export const PrivacyFormMatrixTitle = styled("h3", {
  name: NAME,
  slot: "MatrixTitle",
})(({ theme }) => ({
  ...theme.typography.h5,
  margin: 0,
}));

export const PrivacyFormMatrixHint = styled("p", {
  name: NAME,
  slot: "MatrixHint",
})(({ theme }) => ({
  ...theme.typography.body2,
  margin: 0,
  color: theme.palette.text.secondary,
}));
