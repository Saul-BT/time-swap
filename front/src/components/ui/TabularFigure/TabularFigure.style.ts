"use client";

import { styled } from "@mui/material/styles";
import Typography from "@mui/material/Typography";

/** MUI has no theme slot for `font-variant-numeric`, so it lives on a component. */
export const TabularFigureRoot = styled(Typography, {
  name: "TabularFigure",
  slot: "Root",
})({
  fontVariantNumeric: "tabular-nums",
});
