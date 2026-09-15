"use client";

import Paper from "@mui/material/Paper";
import { styled } from "@mui/material/styles";
import { bareList, softRule } from "@/theme/rules";
import { space } from "@/theme/tokens";

const NAME = "PublicProfile";

export const PublicProfileRoot = styled("article", {
  name: NAME,
  slot: "Root",
})(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  gap: theme.spacing(space.md),
  maxWidth: 760,
}));

export const PublicProfileHead = styled("header", {
  name: NAME,
  slot: "Head",
})(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(space.sm + 1),
}));

export const PublicProfileMeta = styled("ul", { name: NAME, slot: "Meta" })(
  ({ theme }) => ({
    ...bareList,
    display: "flex",
    flexWrap: "wrap",
    gap: theme.spacing(space.sm),
    ...theme.typography.body2,
    color: theme.palette.text.secondary,
    "& li": {
      display: "inline-flex",
      alignItems: "center",
      gap: theme.spacing(space.xs / 2),
    },
  }),
);

export const PublicProfileSection = styled("section", {
  name: NAME,
  slot: "Section",
})(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  gap: theme.spacing(space.xs),
  paddingTop: theme.spacing(space.sm),
  borderTop: softRule(theme),
}));

export const PublicProfileHidden = styled("p", { name: NAME, slot: "Hidden" })(
  ({ theme }) => ({
    ...theme.typography.body2,
    margin: 0,
    color: theme.palette.text.secondary,
    fontStyle: "italic",
  }),
);

export const PublicProfileAvailability = styled("ul", {
  name: NAME,
  slot: "Availability",
})(({ theme }) => ({
  ...bareList,
  display: "flex",
  flexWrap: "wrap",
  gap: theme.spacing(space.xs),
  ...theme.typography.body2,
  "& li": {
    padding: theme.spacing(space.xs / 2, space.xs),
    border: `${theme.system.borderWidth}px solid ${theme.palette.divider}`,
  },
}));

export const PublicProfileNotice = styled(Paper, {
  name: NAME,
  slot: "Notice",
})(({ theme }) => ({
  padding: theme.spacing(space.sm),
  ...theme.typography.body2,
}));

export const PublicProfileOwn = styled(Paper, { name: NAME, slot: "Own" })(
  ({ theme }) => ({
    borderColor: theme.palette.primary.main,
    padding: theme.spacing(space.sm + 1),
    display: "flex",
    flexWrap: "wrap",
    alignItems: "center",
    justifyContent: "space-between",
    gap: theme.spacing(space.sm),
  }),
);
