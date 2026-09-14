"use client";

import Box from "@mui/material/Box";
import { styled } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import type { WithComponent } from "@/lib/mui/polymorphic";
import { rule } from "@/theme/rules";
import { space } from "@/theme/tokens";

const NAME = "SiteHeader";

export const SiteHeaderBar = styled(Box, { name: NAME, slot: "Bar" })(
  ({ theme }) => ({
    display: "flex",
    alignItems: "stretch",
    justifyContent: "space-between",
    flexWrap: "wrap",
    borderBottom: rule(theme),
  }),
);

export const SiteHeaderBrand = styled(Box, { name: NAME, slot: "Brand" })(
  ({ theme }) => ({
    display: "flex",
    alignItems: "center",
    paddingInline: theme.spacing(space.sm + 1),
    paddingBlock: theme.spacing(space.sm),
    [theme.breakpoints.up("md")]: {
      paddingInline: theme.spacing(space.lg),
      borderRight: rule(theme),
    },
  }),
);

export const SiteHeaderBrandName = styled(Typography, {
  name: NAME,
  slot: "BrandName",
})<WithComponent>(({ theme }) => ({
  fontSize: 22,
  [theme.breakpoints.up("md")]: { fontSize: 28 },
}));

export const SiteHeaderNav = styled("nav", { name: NAME, slot: "Nav" })({
  display: "flex",
  alignItems: "stretch",
});
