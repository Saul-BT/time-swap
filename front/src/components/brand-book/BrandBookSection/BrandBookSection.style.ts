"use client";

import Box from "@mui/material/Box";
import { styled } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import { rule } from "@/theme/rules";
import { space } from "@/theme/tokens";

const NAME = "BrandBookSection";

export const BrandBookSectionRoot = styled("section", {
  name: NAME,
  slot: "Root",
})(({ theme }) => ({
  borderTop: rule(theme),
  paddingTop: theme.spacing(space.md),
  paddingBottom: theme.spacing(space.lg),
}));

export const BrandBookSectionTitle = styled(Typography, {
  name: NAME,
  slot: "Title",
})(({ theme }) => ({ marginBottom: theme.spacing(space.md) }));

export const BrandBookSectionBody = styled(Box, { name: NAME, slot: "Body" })(
  ({ theme }) => ({
    display: "grid",
    gap: theme.spacing(space.md),
  }),
);
