"use client";

import { styled } from "@mui/material/styles";
import { space } from "@/theme/tokens";

const NAME = "PanelSkeleton";

export const PanelSkeletonRoot = styled("div", { name: NAME, slot: "Root" })(
  ({ theme }) => ({
    display: "flex",
    flexDirection: "column",
    gap: theme.spacing(space.md),
  }),
);

export const PanelSkeletonGroup = styled("div", { name: NAME, slot: "Group" })(
  ({ theme }) => ({
    display: "flex",
    flexDirection: "column",
    gap: theme.spacing(space.xs),
  }),
);

export const PanelSkeletonFoot = styled("div", { name: NAME, slot: "Foot" })(
  ({ theme }) => ({
    display: "flex",
    gap: theme.spacing(space.sm),
  }),
);
