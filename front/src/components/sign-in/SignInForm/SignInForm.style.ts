"use client";

import Button from "@mui/material/Button";
import { styled } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import type { WithComponent } from "@/lib/mui/polymorphic";
import { space } from "@/theme/tokens";

const NAME = "SignInForm";

export const SignInFormRoot = styled("form", { name: NAME, slot: "Root" })({
  width: "100%",
  maxWidth: 440,
});

export const SignInFormTitle = styled(Typography, {
  name: NAME,
  slot: "Title",
})<WithComponent>(({ theme }) => ({
  marginBottom: theme.spacing(space.sm),
}));

export const SignInFormLead = styled(Typography, {
  name: NAME,
  slot: "Lead",
})(({ theme }) => ({
  marginBottom: theme.spacing(space.md),
}));

export const SignInFormRemember = styled("div", {
  name: NAME,
  slot: "Remember",
})(({ theme }) => ({
  marginBottom: theme.spacing(space.md),
}));

export const SignInFormSubmit = styled(Button, { name: NAME, slot: "Submit" })(
  ({ theme }) => ({
    width: "100%",
    marginBottom: theme.spacing(space.md),
  }),
);
