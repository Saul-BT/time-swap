"use client";

import { styled } from "@mui/material/styles";
import Typography from "@mui/material/Typography";

export const EyebrowRoot = styled(Typography, {
  name: "Eyebrow",
  slot: "Root",
})(({ theme }) => ({
  color: theme.palette.text.secondary,
}));
