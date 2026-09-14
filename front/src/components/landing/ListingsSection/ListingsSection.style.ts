"use client";

import Box from "@mui/material/Box";
import { styled } from "@mui/material/styles";
import { bareList } from "@/theme/rules";
import { space } from "@/theme/tokens";

const NAME = "ListingsSection";

export const ListingsSectionGrid = styled("ul", { name: NAME, slot: "Grid" })(
  ({ theme }) => ({
    ...bareList,
    display: "grid",
    gap: theme.spacing(2.5),
    gridTemplateColumns: "1fr",
    [theme.breakpoints.up("sm")]: {
      gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
    },
    [theme.breakpoints.up("md")]: {
      gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
    },
  }),
);

export const ListingsSectionItem = styled("li", { name: NAME, slot: "Item" })({
  display: "flex",
});

export const ListingsSectionMore = styled(Box, { name: NAME, slot: "More" })(
  ({ theme }) => ({
    textAlign: "center",
    marginTop: theme.spacing(space.md),
  }),
);
