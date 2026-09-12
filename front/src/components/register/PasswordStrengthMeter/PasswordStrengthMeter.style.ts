"use client";

import { styled } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import type { WithComponent } from "@/lib/mui/polymorphic";
import { space } from "@/theme/tokens";
import type { PasswordStrengthTone } from "./PasswordStrengthMeter.util";

const NAME = "PasswordStrengthMeter";

export const PasswordStrengthMeterRoot = styled("div", {
  name: NAME,
  slot: "Root",
})(({ theme }) => ({
  marginBottom: theme.spacing(space.sm + 0.5),
}));

export const PasswordStrengthMeterTrack = styled("div", {
  name: NAME,
  slot: "Track",
})(({ theme }) => ({
  display: "flex",
  gap: theme.spacing(space.xs / 2),
}));

export const PasswordStrengthMeterSegment = styled("span", {
  name: NAME,
  slot: "Segment",
})<{ ownerState: { filled: boolean; tone: PasswordStrengthTone } }>(
  ({ theme, ownerState }) => ({
    height: 6,
    flex: 1,
    backgroundColor: ownerState.filled
      ? theme.palette[ownerState.tone].main
      : theme.palette.divider,
  }),
);

export const PasswordStrengthMeterLabel = styled(Typography, {
  name: NAME,
  slot: "Label",
})<WithComponent & { ownerState: { tone: PasswordStrengthTone } }>(
  ({ theme, ownerState }) => ({
    display: "block",
    marginTop: theme.spacing(space.xs / 2),
    color: theme.palette[ownerState.tone].main,
  }),
);
