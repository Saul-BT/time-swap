"use client";

import { styled } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import type { WithComponent } from "@/lib/mui/polymorphic";
import { space } from "@/theme/tokens";

const NAME = "CompletionMeter";

export const CompletionMeterRoot = styled("div", { name: NAME, slot: "Root" })(
  ({ theme }) => ({
    display: "flex",
    flexDirection: "column",
    gap: theme.spacing(space.xs),
  }),
);

export const CompletionMeterSentence = styled(Typography, {
  name: NAME,
  slot: "Sentence",
})<WithComponent>({});
