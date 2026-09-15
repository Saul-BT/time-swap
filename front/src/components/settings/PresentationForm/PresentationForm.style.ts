"use client";

import Avatar from "@mui/material/Avatar";
import { styled } from "@mui/material/styles";
import { space } from "@/theme/tokens";

const NAME = "PresentationForm";

export const PresentationFormIdentity = styled("div", {
  name: NAME,
  slot: "Identity",
})(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(space.sm),
  marginBottom: theme.spacing(space.md),
}));

export const PresentationFormAvatar = styled(Avatar, {
  name: NAME,
  slot: "Avatar",
})({
  width: 72,
  height: 72,
  fontSize: 28,
});
