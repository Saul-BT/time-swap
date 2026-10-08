"use client";

import { Button, styled, Typography } from "@mui/material";
import { softRule } from "@/theme/rules";
import { space } from "@/theme/tokens";

const NAME = "WaitingRow";

export const WaitingRowRoot = styled("li", { name: NAME, slot: "Root" })(
  ({ theme }) => ({
    display: "flex",
    alignItems: "center",
    gap: theme.spacing(space.sm),
    paddingBlock: theme.spacing(1.75),
    borderBottom: softRule(theme),
  }),
);

export const WaitingRowText = styled("div", { name: NAME, slot: "Text" })({
  flex: 1,
  minWidth: 0,
});

export const WaitingRowTitle = styled(Typography, {
  name: NAME,
  slot: "Title",
})({ fontWeight: 700 });

/** Quiet on purpose: withdrawing is possible, never pushed. */
export const WaitingRowAction = styled(Button, {
  name: NAME,
  slot: "Action",
})(({ theme }) => ({
  flexShrink: 0,
  minWidth: 0,
  paddingInline: theme.spacing(space.xs),
  color: theme.palette.text.secondary,
  fontWeight: 400,
  textTransform: "none",
  letterSpacing: 0,
}));
