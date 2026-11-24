"use client";

import { styled } from "@mui/material";
import TabularFigure from "@/components/ui/TabularFigure";
import type { WithComponent } from "@/lib/mui/polymorphic";
import { space } from "@/theme/tokens";
import type { BalanceSummaryVariant } from "./BalanceSummary.util";

const NAME = "BalanceSummary";

export const BalanceSummaryRoot = styled("div", {
  name: NAME,
  slot: "Root",
})<{ ownerState: { variant: BalanceSummaryVariant } }>(
  ({ theme, ownerState }) => ({
    display: "flex",
    flexDirection: "column",
    gap: theme.spacing(space.xs / 4),
    ...(ownerState.variant === "wide" && {
      alignItems: "flex-end",
      textAlign: "right",
    }),
  }),
);

export const BalanceSummaryFigureRow = styled("p", {
  name: NAME,
  slot: "FigureRow",
})<{ ownerState: { variant: BalanceSummaryVariant } }>(
  ({ theme, ownerState }) => ({
    margin: 0,
    display: "flex",
    alignItems: "baseline",
    gap: theme.spacing(ownerState.variant === "compact" ? 0.75 : 1.5),
    flexDirection: ownerState.variant === "intro" ? "column" : "row",
  }),
);

export const BalanceSummaryFigure = styled(TabularFigure, {
  name: NAME,
  slot: "Figure",
})<WithComponent & { ownerState: { positive: boolean } }>(
  ({ theme, ownerState }) => ({
    fontWeight: 700,
    textTransform: "none",
    color: ownerState.positive
      ? theme.palette.primary.main
      : theme.palette.text.primary,
    whiteSpace: "nowrap",
  }),
);

export const BalanceSummaryHeadroom = styled("b", {
  name: NAME,
  slot: "Headroom",
})(({ theme }) => ({
  fontWeight: 700,
  color: theme.palette.text.primary,
  fontVariantNumeric: "tabular-nums",
}));
