"use client";

import { styled } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import NextLink from "next/link";
import type { WithComponent } from "@/lib/mui/polymorphic";
import { space } from "@/theme/tokens";

const NAME = "SignInScreen";

export const SignInScreenRoot = styled("div", { name: NAME, slot: "Root" })({
  minHeight: "100vh",
  display: "flex",
  flexDirection: "column",
});

/** Editorial split: form and panel share the width from `md` up, stack below. */
export const SignInScreenSplit = styled("div", { name: NAME, slot: "Split" })(
  ({ theme }) => ({
    flex: 1,
    display: "grid",
    gridTemplateColumns: "1fr",
    [theme.breakpoints.up("md")]: {
      gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
    },
  }),
);

export const SignInScreenColumn = styled("div", {
  name: NAME,
  slot: "Column",
})(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  gap: theme.spacing(space.lg),
  padding: theme.spacing(space.md, space.sm + 1),
  [theme.breakpoints.up("md")]: {
    padding: theme.spacing(space.lg, space.xl),
  },
}));

export const SignInScreenBrand = styled(NextLink, {
  name: NAME,
  slot: "Brand",
})(({ theme }) => ({
  alignSelf: "flex-start",
  color: theme.palette.text.primary,
  textDecoration: "none",
}));

export const SignInScreenBrandName = styled(Typography, {
  name: NAME,
  slot: "BrandName",
})<WithComponent>(({ theme }) => ({
  fontSize: 22,
  [theme.breakpoints.up("md")]: { fontSize: 28 },
}));

export const SignInScreenMain = styled("main", { name: NAME, slot: "Main" })({
  flex: 1,
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
});
