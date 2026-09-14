"use client";

import { styled } from "@mui/material/styles";
import type { RibbonTone } from "./Ribbon.util";

const NAME = "Ribbon";

export const RibbonRoot = styled("div", {
  name: NAME,
  slot: "Root",
})<{ ownerState: { height: number } }>(({ ownerState }) => ({
  display: "flex",
  height: ownerState.height,
}));

export const RibbonSegment = styled("div", {
  name: NAME,
  slot: "Segment",
})<{ ownerState: { tone: RibbonTone; weight: number } }>(
  ({ theme, ownerState }) => ({
    flexGrow: ownerState.weight,
    backgroundColor: {
      accent: theme.palette.primary.main,
      ink: theme.palette.text.primary,
      brake: theme.palette.secondary.main,
      line: theme.palette.divider,
    }[ownerState.tone],
  }),
);
