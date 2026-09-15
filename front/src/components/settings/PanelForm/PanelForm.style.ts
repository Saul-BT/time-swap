"use client";

import { styled } from "@mui/material/styles";
import { bareFieldset } from "@/theme/rules";

export const PanelFormRoot = styled("form", {
  name: "PanelForm",
  slot: "Root",
})<{ ownerState: { pending: boolean } }>(({ ownerState }) => ({
  display: "flex",
  flexDirection: "column",
  opacity: ownerState.pending ? 0.6 : 1,
  transition: "opacity 150ms",
}));

export const PanelFormFields = styled("fieldset", {
  name: "PanelForm",
  slot: "Fields",
})<{ ownerState: { gap: number } }>(({ theme, ownerState }) => ({
  ...bareFieldset,
  display: "flex",
  flexDirection: "column",
  gap: theme.spacing(ownerState.gap),
}));
