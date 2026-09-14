"use client";

import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import { styled } from "@mui/material/styles";
import { space } from "@/theme/tokens";

const NAME = "SignUpSection";

export const SignUpLayout = styled(Box, { name: NAME, slot: "Layout" })(
  ({ theme }) => ({
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap",
    gap: theme.spacing(space.md),
  }),
);

export const SignUpCopy = styled(Box, { name: NAME, slot: "Copy" })({
  maxWidth: 600,
});

export const SignUpActions = styled(Stack, { name: NAME, slot: "Actions" })({
  alignItems: "center",
});
