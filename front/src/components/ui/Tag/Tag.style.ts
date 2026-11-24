"use client";

import { styled } from "@mui/material";
import { space } from "@/theme/tokens";
import type { TagTone } from "./Tag.util";

export const TagRoot = styled("span", {
  name: "Tag",
  slot: "Root",
})<{ ownerState: { tone: TagTone } }>(({ theme, ownerState }) => {
  const fill = {
    solid: theme.palette.text.primary,
    accent: theme.palette.primary.main,
    quiet: "transparent",
  }[ownerState.tone];

  return {
    ...theme.typography.overline,
    display: "inline-flex",
    alignItems: "center",
    alignSelf: "flex-start",
    gap: theme.spacing(space.xs / 2 + 0.25),
    minHeight: 26,
    paddingInline: theme.spacing(space.xs),
    letterSpacing: "0.06em",
    whiteSpace: "nowrap",
    fontVariantNumeric: "tabular-nums",
    border: `${theme.system.borderWidth}px solid ${
      ownerState.tone === "quiet" ? theme.palette.divider : fill
    }`,
    backgroundColor: fill,
    color:
      ownerState.tone === "quiet"
        ? theme.palette.text.secondary
        : theme.palette.primary.contrastText,
  };
});
