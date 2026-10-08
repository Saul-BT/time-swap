"use client";

import { ButtonBase, styled } from "@mui/material";
import { space } from "@/theme/tokens";

const NAME = "SegmentedControl";

export const SegmentedControlRoot = styled("div", { name: NAME, slot: "Root" })(
  { display: "inline-flex", flexShrink: 0 },
);

/** Neighbours overlap by one rule so two frames never stack into 4 px. */
export const SegmentedControlSegment = styled(ButtonBase, {
  name: NAME,
  slot: "Segment",
})<{ ownerState: { pressed: boolean } }>(({ theme, ownerState }) => ({
  ...theme.typography.button,
  fontSize: "0.875rem",
  gap: theme.spacing(space.xs),
  minHeight: theme.system.compactControlHeight,
  minWidth: theme.system.compactControlHeight,
  paddingInline: theme.spacing(space.sm),
  border: `${theme.system.borderWidth}px solid ${theme.palette.text.primary}`,
  "& + &": { marginLeft: -theme.system.borderWidth },
  backgroundColor: ownerState.pressed
    ? theme.palette.text.primary
    : theme.palette.background.paper,
  color: ownerState.pressed
    ? theme.palette.background.paper
    : theme.palette.text.primary,
  "&:hover": {
    backgroundColor: ownerState.pressed
      ? theme.palette.text.primary
      : theme.palette.divider,
  },
  "&:focus-visible": { position: "relative", zIndex: 1 },
}));
