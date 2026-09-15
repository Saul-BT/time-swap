"use client";

import { styled } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import type { WithComponent } from "@/lib/mui/polymorphic";
import { space } from "@/theme/tokens";

const NAME = "PanelHeader";

export const PanelHeaderRoot = styled("header", { name: NAME, slot: "Root" })(
  ({ theme }) => ({
    display: "flex",
    flexDirection: "column",
    gap: theme.spacing(space.xs),
    marginBottom: theme.spacing(space.md),
  }),
);

/** 40 px: a section title, below the page's h1 and above the field labels. */
export const PanelHeaderTitle = styled(Typography, {
  name: NAME,
  slot: "Title",
})<WithComponent>({
  fontSize: "2.5rem",
});

export const PanelHeaderLead = styled(Typography, {
  name: NAME,
  slot: "Lead",
})({
  maxWidth: 640,
});
