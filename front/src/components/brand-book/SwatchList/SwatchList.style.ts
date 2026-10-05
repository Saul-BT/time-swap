"use client";

import { Box, styled } from "@mui/material";
import { rule } from "@/theme/rules";
import { space } from "@/theme/tokens";

const NAME = "SwatchList";

export const SwatchListRoot = styled("ul", { name: NAME, slot: "Root" })(
  ({ theme }) => ({
    listStyle: "none",
    margin: 0,
    padding: 0,
    display: "grid",
    gap: theme.spacing(space.sm),
    gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
  }),
);

export const SwatchSample = styled(Box, { name: NAME, slot: "Sample" })(
  ({ theme }) => ({
    height: 74,
    border: rule(theme),
    marginBottom: theme.spacing(space.xs),
  }),
);
