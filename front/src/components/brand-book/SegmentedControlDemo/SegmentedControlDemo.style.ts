"use client";

import { styled } from "@mui/material";
import { space } from "@/theme/tokens";

export const SegmentedControlDemoRoot = styled("div", {
  name: "SegmentedControlDemo",
  slot: "Root",
})(({ theme }) => ({
  display: "flex",
  flexWrap: "wrap",
  gap: theme.spacing(space.sm),
}));
