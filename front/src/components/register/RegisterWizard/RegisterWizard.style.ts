"use client";

import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";
import { styled } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import type { WithComponent } from "@/lib/mui/polymorphic";
import { space } from "@/theme/tokens";

const NAME = "RegisterWizard";

export const RegisterWizardRoot = styled(Paper, { name: NAME, slot: "Root" })(
  ({ theme }) => ({
    width: "100%",
    maxWidth: 640,
    padding: theme.spacing(space.md, space.sm + 1),
    [theme.breakpoints.up("md")]: {
      padding: theme.spacing(space.lg),
    },
  }),
);

export const RegisterFormTitle = styled(Typography, {
  name: NAME,
  slot: "Title",
})<WithComponent>(({ theme }) => ({
  marginBottom: theme.spacing(space.sm),
}));

export const RegisterFormLead = styled(Typography, {
  name: NAME,
  slot: "Lead",
})(({ theme }) => ({
  marginBottom: theme.spacing(space.md),
}));

export const RegisterFieldHint = styled(Typography, {
  name: NAME,
  slot: "FieldHint",
})(({ theme }) => ({
  display: "block",
  marginBottom: theme.spacing(space.md),
}));

export const RegisterFormSubmit = styled(Button, {
  name: NAME,
  slot: "Submit",
})({
  width: "100%",
});

export const RegisterFormNav = styled("div", { name: NAME, slot: "Nav" })(
  ({ theme }) => ({
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap",
    gap: theme.spacing(space.sm),
    marginTop: theme.spacing(space.sm),
  }),
);

export const RegisterFormNavActions = styled("div", {
  name: NAME,
  slot: "NavActions",
})(({ theme }) => ({
  display: "flex",
  flexWrap: "wrap",
  gap: theme.spacing(space.xs),
}));

export const RegisterProfileGroup = styled("div", {
  name: NAME,
  slot: "ProfileGroup",
})(({ theme }) => ({
  marginBottom: theme.spacing(space.md),
}));
