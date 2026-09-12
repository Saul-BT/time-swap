"use client";

import { styled } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import NextLink from "next/link";
import type { WithComponent } from "@/lib/mui/polymorphic";
import { space } from "@/theme/tokens";

const NAME = "RegisterScreen";

export const RegisterScreenRoot = styled("div", { name: NAME, slot: "Root" })({
  minHeight: "100vh",
  display: "flex",
  flexDirection: "column",
});

export const RegisterScreenHeader = styled("header", {
  name: NAME,
  slot: "Header",
})(({ theme }) => ({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  flexWrap: "wrap",
  gap: theme.spacing(space.sm),
  padding: theme.spacing(space.sm, space.sm + 1),
  [theme.breakpoints.up("md")]: {
    padding: theme.spacing(space.md, space.xl),
  },
}));

export const RegisterScreenBrand = styled(NextLink, {
  name: NAME,
  slot: "Brand",
})(({ theme }) => ({
  color: theme.palette.text.primary,
  textDecoration: "none",
}));

export const RegisterScreenBrandName = styled(Typography, {
  name: NAME,
  slot: "BrandName",
})<WithComponent>(({ theme }) => ({
  fontSize: 22,
  [theme.breakpoints.up("md")]: { fontSize: 28 },
}));

/** Centers the wizard card; the card itself decides its own max width. */
export const RegisterScreenMain = styled("main", { name: NAME, slot: "Main" })(
  ({ theme }) => ({
    flex: 1,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: theme.spacing(space.sm, space.sm + 1, space.xl),
    [theme.breakpoints.up("md")]: {
      padding: theme.spacing(space.md, space.xl, space.xl),
    },
  }),
);
