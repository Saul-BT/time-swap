"use client";

import ButtonBase from "@mui/material/ButtonBase";
import { styled } from "@mui/material/styles";
import { space } from "@/theme/tokens";

const NAME = "PasswordField";

/** A word, not an icon: the system has no icon set and the label is clearer. */
export const PasswordFieldToggle = styled(ButtonBase, {
  name: NAME,
  slot: "Toggle",
})(({ theme }) => ({
  ...theme.typography.overline,
  color: theme.palette.primary.main,
  textDecoration: "underline",
  textDecorationThickness: 2,
  textUnderlineOffset: 3,
  minHeight: 44,
  paddingInline: theme.spacing(space.xs),
  marginRight: -theme.spacing(space.xs),
  "&:hover": { color: theme.palette.text.primary },
}));
