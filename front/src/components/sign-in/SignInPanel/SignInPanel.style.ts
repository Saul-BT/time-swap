"use client";

import { styled } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import Eyebrow from "@/components/ui/Eyebrow";
import type { WithComponent } from "@/lib/mui/polymorphic";
import { space } from "@/theme/tokens";

const NAME = "SignInPanel";

/** Inverted: the one block of the screen that speaks for the community. */
export const SignInPanelRoot = styled("aside", { name: NAME, slot: "Root" })(
  ({ theme }) => ({
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    gap: theme.spacing(space.lg),
    padding: theme.spacing(space.md, space.sm + 1),
    backgroundColor: theme.palette.text.primary,
    color: theme.palette.background.default,
    [theme.breakpoints.up("md")]: {
      padding: theme.spacing(space.xl, space.lg),
    },
  }),
);

export const SignInPanelEyebrow = styled(Eyebrow, {
  name: NAME,
  slot: "Eyebrow",
})(({ theme }) => ({
  color: "inherit",
  opacity: 0.7,
  marginBottom: theme.spacing(space.md),
}));

export const SignInPanelTitle = styled(Typography, {
  name: NAME,
  slot: "Title",
})<WithComponent>(({ theme }) => ({
  maxWidth: 560,
  marginBottom: theme.spacing(space.md),
}));

export const SignInPanelBody = styled(Typography, {
  name: NAME,
  slot: "Body",
})({
  maxWidth: 400,
  opacity: 0.82,
});

export const SignInPanelFacts = styled("dl", { name: NAME, slot: "Facts" })(
  ({ theme }) => ({
    display: "grid",
    gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
    gap: theme.spacing(space.md),
    margin: 0,
    paddingTop: theme.spacing(space.md),
    borderTop: `${theme.system.borderWidth}px solid ${theme.palette.text.secondary}`,
  }),
);

export const SignInPanelDescription = styled("dd", {
  name: NAME,
  slot: "Description",
})(({ theme }) => ({
  ...theme.typography.caption,
  margin: 0,
  opacity: 0.82,
}));
