"use client";

import { styled } from "@mui/material/styles";
import { softRule } from "@/theme/rules";
import { space } from "@/theme/tokens";

const NAME = "ConsequenceRow";

/** Text on the left, the switch on the right, a soft rule between rows. */
export const ConsequenceRowRoot = styled("div", { name: NAME, slot: "Root" })(
  ({ theme }) => ({
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: theme.spacing(space.md),
    paddingBlock: theme.spacing(space.sm + 1),
    borderBottom: softRule(theme),
    "&:first-of-type": { paddingTop: 0 },
  }),
);

export const ConsequenceRowText = styled("div", { name: NAME, slot: "Text" })(
  ({ theme }) => ({
    display: "flex",
    flexDirection: "column",
    gap: theme.spacing(space.xs / 2),
    minWidth: 0,
  }),
);

export const ConsequenceRowTitle = styled("p", { name: NAME, slot: "Title" })(
  ({ theme }) => ({
    ...theme.typography.h6,
    margin: 0,
  }),
);

export const ConsequenceRowBody = styled("p", { name: NAME, slot: "Body" })(
  ({ theme }) => ({
    ...theme.typography.body2,
    margin: 0,
    color: theme.palette.text.secondary,
  }),
);

export const ConsequenceRowNow = styled("p", { name: NAME, slot: "Now" })(
  ({ theme }) => ({
    ...theme.typography.subtitle2,
    margin: 0,
    marginTop: theme.spacing(space.xs / 2),
  }),
);

export const ConsequenceRowControl = styled("div", {
  name: NAME,
  slot: "Control",
})({
  flexShrink: 0,
  paddingTop: 2,
});
