"use client";

import { styled } from "@mui/material/styles";
import { softRule } from "@/theme/rules";
import { space } from "@/theme/tokens";

const NAME = "TypeScaleList";

export const TypeScaleListRoot = styled("ul", { name: NAME, slot: "Root" })({
  listStyle: "none",
  margin: 0,
  padding: 0,
});

export const TypeScaleListItem = styled("li", { name: NAME, slot: "Item" })(
  ({ theme }) => ({
    display: "grid",
    gridTemplateColumns: "1fr",
    gap: theme.spacing(space.xs),
    paddingBlock: theme.spacing(space.sm + 1),
    "& + &": { borderTop: softRule(theme) },
    [theme.breakpoints.up("md")]: {
      gridTemplateColumns: "240px 1fr",
      gap: theme.spacing(space.md),
      alignItems: "baseline",
    },
  }),
);
