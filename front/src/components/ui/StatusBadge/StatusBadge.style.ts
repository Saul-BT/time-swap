"use client";

import { styled } from "@mui/material/styles";
import { space } from "@/theme/tokens";
import type { SectionStatus, StatusTone } from "./StatusBadge.util";

const NAME = "StatusBadge";

/** `done` reads in success, the two pending states in warning (ADR 0008). */
export const StatusBadgeRoot = styled("span", {
  name: NAME,
  slot: "Root",
})<{ ownerState: { status: SectionStatus; tone: StatusTone } }>(
  ({ theme, ownerState }) => {
    const tone =
      ownerState.tone === "inverse"
        ? theme.palette.onInk
        : {
            success: theme.palette.success.main,
            warning: theme.palette.warning.main,
          };

    return {
      ...theme.typography.overline,
      display: "inline-flex",
      alignItems: "center",
      gap: theme.spacing(space.xs / 2),
      whiteSpace: "nowrap",
      color: ownerState.status === "done" ? tone.success : tone.warning,
    };
  },
);
