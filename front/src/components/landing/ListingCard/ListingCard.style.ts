"use client";

import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import { styled } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import Eyebrow from "@/components/ui/Eyebrow";
import TabularFigure from "@/components/ui/TabularFigure";
import type { WithComponent } from "@/lib/mui/polymorphic";
import { rule } from "@/theme/rules";
import { space } from "@/theme/tokens";

const NAME = "ListingCard";

export const ListingCardRoot = styled(Paper, {
  name: NAME,
  slot: "Root",
})<WithComponent>({
  flex: 1,
  display: "flex",
  flexDirection: "column",
});

export const ListingCardBody = styled(Box, { name: NAME, slot: "Body" })(
  ({ theme }) => ({
    padding: theme.spacing(space.sm + 1),
    display: "flex",
    flexDirection: "column",
    flex: 1,
  }),
);

export const ListingCardMeta = styled(Eyebrow, { name: NAME, slot: "Meta" })(
  ({ theme }) => ({
    marginBottom: theme.spacing(space.xs),
  }),
);

export const ListingCardTitle = styled(Typography, {
  name: NAME,
  slot: "Title",
})(({ theme }) => ({
  marginBottom: theme.spacing(space.xs),
}));

export const ListingCardSummary = styled(Typography, {
  name: NAME,
  slot: "Summary",
})(({ theme }) => ({ marginBottom: theme.spacing(space.sm) }));

/** `marginTop: auto` keeps footers aligned across cards of unequal height. */
export const ListingCardFooter = styled(Box, { name: NAME, slot: "Footer" })(
  ({ theme }) => ({
    marginTop: "auto",
    paddingTop: theme.spacing(1.5),
    borderTop: rule(theme),
    display: "flex",
    justifyContent: "space-between",
    alignItems: "baseline",
    gap: theme.spacing(space.sm),
  }),
);

export const ListingCardHours = styled(TabularFigure, {
  name: NAME,
  slot: "Hours",
})(({ theme }) => ({
  color: theme.palette.primary.main,
  whiteSpace: "nowrap",
}));
