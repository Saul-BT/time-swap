"use client";

import { IconButton, styled } from "@mui/material";
import { space } from "@/theme/tokens";

const NAME = "PasswordField";

/** Pulls the icon past the button padding so it lines up with the text inset. */
export const PasswordFieldToggle = styled(IconButton, {
  name: NAME,
  slot: "Toggle",
})(({ theme }) => ({
  marginRight: theme.spacing(-space.xs),
}));
