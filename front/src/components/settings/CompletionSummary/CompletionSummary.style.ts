"use client";

import { styled } from "@mui/material/styles";
import { space } from "@/theme/tokens";

const NAME = "CompletionSummary";

export const CompletionSummaryRoot = styled("div", {
  name: NAME,
  slot: "Root",
})(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  gap: theme.spacing(space.xs),
}));
