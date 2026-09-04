"use client";

import Box from "@mui/material/Box";
import { styled } from "@mui/material/styles";
import { space } from "@/theme/tokens";

const NAME = "ScaleList";

export const ScaleListRoot = styled("ul", { name: NAME, slot: "Root" })(
  ({ theme }) => ({
    listStyle: "none",
    margin: 0,
    padding: 0,
    display: "grid",
    gap: theme.spacing(space.sm),
  }),
);

export const ScaleListItem = styled("li", { name: NAME, slot: "Item" })(
  ({ theme }) => ({
    display: "flex",
    alignItems: "center",
    gap: theme.spacing(space.sm),
  }),
);

export const ScaleBar = styled(Box, { name: NAME, slot: "Bar" })(
  ({ theme }) => ({
    height: 16,
    backgroundColor: theme.palette.primary.main,
    flexShrink: 0,
  }),
);
