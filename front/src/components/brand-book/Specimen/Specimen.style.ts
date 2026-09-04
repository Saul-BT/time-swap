"use client";

import Box from "@mui/material/Box";
import { styled } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import type { WithComponent } from "@/lib/mui/polymorphic";
import { rule, softRule } from "@/theme/rules";
import { space } from "@/theme/tokens";

const NAME = "Specimen";

export const SpecimenRoot = styled("article", { name: NAME, slot: "Root" })(
  ({ theme }) => ({
    border: rule(theme),
    backgroundColor: theme.palette.background.paper,
  }),
);

export const SpecimenName = styled(Typography, {
  name: NAME,
  slot: "Name",
})<WithComponent>(({ theme }) => ({
  padding: theme.spacing(space.sm, space.sm + 1),
  borderBottom: rule(theme),
}));

export const SpecimenVariants = styled("ul", { name: NAME, slot: "Variants" })({
  listStyle: "none",
  margin: 0,
  padding: 0,
});

export const SpecimenVariant = styled("li", { name: NAME, slot: "Variant" })(
  ({ theme }) => ({
    display: "grid",
    gridTemplateColumns: "1fr",
    gap: theme.spacing(space.xs),
    padding: theme.spacing(space.sm + 1),
    "& + &": { borderTop: softRule(theme) },
    [theme.breakpoints.up("md")]: {
      gridTemplateColumns: "240px 1fr",
      gap: theme.spacing(space.md),
      alignItems: "center",
    },
  }),
);

export const SpecimenStage = styled(Box, { name: NAME, slot: "Stage" })(
  ({ theme }) => ({
    display: "flex",
    flexWrap: "wrap",
    alignItems: "center",
    gap: theme.spacing(space.sm),
    minWidth: 0,
  }),
);
