"use client";

import { buttonBaseClasses } from "@mui/material/ButtonBase";
import MuiCheckbox from "@mui/material/Checkbox";
import FormControlLabel, {
  formControlLabelClasses,
} from "@mui/material/FormControlLabel";
import { styled } from "@mui/material/styles";
import { rule } from "@/theme/rules";
import { space } from "@/theme/tokens";

const NAME = "Checkbox";

export const CheckboxRoot = styled(MuiCheckbox, { name: NAME, slot: "Root" })(
  ({ theme }) => ({
    padding: theme.spacing(space.xs),
    color: theme.palette.text.primary,
    "&:hover": { backgroundColor: "transparent" },
    [`&.${buttonBaseClasses.focusVisible}`]: {
      outline: `${theme.system.focusRingWidth}px solid ${theme.palette.text.primary}`,
      outlineOffset: -theme.system.focusRingWidth,
    },
  }),
);

/**
 * MUI's default icons have rounded corners, so the box is drawn by hand.
 * Checked state fills with the accent: it is the only action colour.
 */
export const CheckboxBox = styled("span", {
  name: NAME,
  slot: "Box",
})<{ ownerState: { checked: boolean } }>(({ theme, ownerState }) => ({
  display: "block",
  width: 22,
  height: 22,
  border: rule(theme),
  backgroundColor: ownerState.checked
    ? theme.palette.primary.main
    : theme.palette.background.paper,
  boxShadow: ownerState.checked
    ? `inset 0 0 0 3px ${theme.palette.background.paper}`
    : "none",
}));

export const CheckboxLabel = styled(FormControlLabel, {
  name: NAME,
  slot: "Label",
})(({ theme }) => ({
  marginLeft: -theme.spacing(space.xs),
  marginRight: 0,
  minHeight: 44,
  gap: theme.spacing(space.xs / 2),
  [`& .${formControlLabelClasses.label}`]: { ...theme.typography.body2 },
}));
