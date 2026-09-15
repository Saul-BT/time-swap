"use client";

import Chip, { chipClasses } from "@mui/material/Chip";
import { styled } from "@mui/material/styles";
import { bareList } from "@/theme/rules";
import { space } from "@/theme/tokens";

const NAME = "CatalogPicker";

export const CatalogPickerRoot = styled("div", { name: NAME, slot: "Root" })(
  ({ theme }) => ({
    display: "flex",
    flexDirection: "column",
    gap: theme.spacing(space.sm),
  }),
);

export const CatalogPickerList = styled("ul", { name: NAME, slot: "List" })(
  ({ theme }) => ({
    ...bareList,
    display: "flex",
    flexWrap: "wrap",
    gap: theme.spacing(space.xs),
  }),
);

/** Chosen entries invert to ink; the cross is the only way to remove one. */
export const CatalogPickerChip = styled(Chip, { name: NAME, slot: "Chip" })(
  ({ theme }) => ({
    backgroundColor: theme.palette.text.primary,
    borderColor: theme.palette.text.primary,
    color: theme.palette.background.default,
    [`& .${chipClasses.deleteIcon}`]: {
      color: theme.palette.background.default,
      marginRight: theme.spacing(space.xs),
      "&:hover": { color: theme.palette.divider },
    },
    [`&.${chipClasses.focusVisible}`]: {
      backgroundColor: theme.palette.text.primary,
      outline: `${theme.system.focusRingWidth}px solid ${theme.palette.text.primary}`,
      outlineOffset: 2,
    },
  }),
);

export const CatalogPickerSuggestion = styled(Chip, {
  name: NAME,
  slot: "Suggestion",
})(({ theme }) => ({
  cursor: "pointer",
  [`& .${chipClasses.icon}`]: {
    color: theme.palette.text.primary,
    marginLeft: theme.spacing(space.xs),
    marginRight: -theme.spacing(space.xs / 2),
  },
  "&:hover": { backgroundColor: theme.palette.divider },
  [`&.${chipClasses.focusVisible}`]: {
    backgroundColor: theme.palette.divider,
  },
}));

export const CatalogPickerEmpty = styled("p", { name: NAME, slot: "Empty" })(
  ({ theme }) => ({
    ...theme.typography.body2,
    margin: 0,
    color: theme.palette.warning.main,
    fontWeight: theme.typography.fontWeightMedium,
  }),
);
