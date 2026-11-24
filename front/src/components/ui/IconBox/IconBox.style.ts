"use client";

import { styled } from "@mui/material";
import {
  ICON_BOX_SIZE,
  type IconBoxSize,
  type IconBoxTone,
} from "./IconBox.util";

export const IconBoxRoot = styled("span", {
  name: "IconBox",
  slot: "Root",
})<{ ownerState: { tone: IconBoxTone; size: IconBoxSize } }>(
  ({ theme, ownerState }) => {
    const { palette } = theme;
    const tone = {
      plain: {
        border: palette.text.primary,
        fill: palette.background.paper,
        ink: palette.text.primary,
      },
      quiet: {
        border: palette.divider,
        fill: palette.background.paper,
        ink: palette.text.secondary,
      },
      warning: {
        border: palette.warning.main,
        fill: palette.background.paper,
        ink: palette.warning.main,
      },
      brake: {
        border: palette.secondary.main,
        fill: palette.secondary.main,
        ink: palette.secondary.contrastText,
      },
    }[ownerState.tone];

    return {
      flexShrink: 0,
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      width: ICON_BOX_SIZE[ownerState.size],
      height: ICON_BOX_SIZE[ownerState.size],
      border: `${theme.system.borderWidth}px solid ${tone.border}`,
      backgroundColor: tone.fill,
      color: tone.ink,
    };
  },
);
