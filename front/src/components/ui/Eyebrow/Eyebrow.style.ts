"use client";

import { styled, Typography } from "@mui/material";

export const EyebrowRoot = styled(Typography, {
  name: "Eyebrow",
  slot: "Root",
})(({ theme }) => ({
  color: theme.palette.text.secondary,
}));
