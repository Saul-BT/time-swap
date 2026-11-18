"use client";

import Chip from "@mui/material/Chip";
import { styled } from "@mui/material/styles";
import { space } from "@/theme/tokens";

const NAME = "TagToggleGroup";

export const TagToggleGroupRoot = styled("fieldset", {
  name: NAME,
  slot: "Root",
})(({ theme }) => ({
  border: "none",
  margin: 0,
  padding: 0,
  marginBottom: theme.spacing(space.md),
}));

export const TagToggleGroupLegend = styled("legend", {
  name: NAME,
  slot: "Legend",
})(({ theme }) => ({
  ...theme.typography.body2,
  fontWeight: theme.typography.fontWeightBold,
  padding: 0,
  marginBottom: theme.spacing(space.xs),
}));

export const TagToggleGroupList = styled("div", { name: NAME, slot: "List" })(
  ({ theme }) => ({
    display: "flex",
    flexWrap: "wrap",
    gap: theme.spacing(space.xs),
  }),
);

/** Same look as the landing's read-only filter chips, but this one is clickable. */
export const TagToggleGroupChip = styled(Chip, {
  name: NAME,
  slot: "Chip",
})<{ ownerState: { active: boolean } }>(({ theme, ownerState }) =>
  ownerState.active
    ? {
        backgroundColor: theme.palette.text.primary,
        color: theme.palette.background.default,
      }
    : {},
);
