"use client";

import { Chip, Stack, styled } from "@mui/material";
import type { WithComponent } from "@/lib/mui/polymorphic";
import { bareList } from "@/theme/rules";
import { space } from "@/theme/tokens";

const NAME = "FilterList";

export const FilterListRoot = styled(Stack, {
  name: NAME,
  slot: "Root",
})<WithComponent>(({ theme }) => ({
  ...bareList,
  marginTop: theme.spacing(space.sm),
  flexWrap: "wrap",
}));

export const FilterChip = styled(Chip, { name: NAME, slot: "Chip" })<{
  ownerState: { active: boolean };
}>(({ theme, ownerState }) =>
  ownerState.active
    ? {
        backgroundColor: theme.palette.text.primary,
        color: theme.palette.background.default,
      }
    : {},
);
