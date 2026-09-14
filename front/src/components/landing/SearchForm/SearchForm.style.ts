"use client";

import Box from "@mui/material/Box";
import InputBase from "@mui/material/InputBase";
import Paper from "@mui/material/Paper";
import { styled } from "@mui/material/styles";
import type { WithFormComponent } from "@/lib/mui/polymorphic";
import { softRule } from "@/theme/rules";
import { space } from "@/theme/tokens";

const NAME = "SearchForm";

export const SearchFormRoot = styled(Paper, {
  name: NAME,
  slot: "Root",
})<WithFormComponent>(({ theme }) => ({
  maxWidth: 920,
  display: "flex",
  flexDirection: "column",
  alignItems: "stretch",
  [theme.breakpoints.up("sm")]: { flexDirection: "row" },
}));

export const SearchFormInput = styled(InputBase, { name: NAME, slot: "Input" })(
  ({ theme }) => ({
    flex: 1,
    minWidth: 0,
    minHeight: theme.system.controlHeight,
    paddingInline: theme.spacing(space.sm),
  }),
);

export const SearchFormAreaCell = styled(Box, { name: NAME, slot: "AreaCell" })(
  ({ theme }) => ({
    display: "flex",
    borderTop: softRule(theme),
    [theme.breakpoints.up("sm")]: {
      borderTop: "none",
      borderLeft: softRule(theme),
      width: 180,
    },
  }),
);
