"use client";

import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import { styled } from "@mui/material/styles";
import Eyebrow from "@/components/ui/Eyebrow";
import { brakeRule } from "@/theme/rules";
import { space } from "@/theme/tokens";

const NAME = "DisputeNotice";

export const DisputeNoticePanel = styled(Paper, { name: NAME, slot: "Panel" })(
  ({ theme }) => ({
    border: brakeRule(theme),
  }),
);

export const DisputeNoticeBody = styled(Box, { name: NAME, slot: "Body" })(
  ({ theme }) => ({
    display: "flex",
    flexWrap: "wrap",
    gap: theme.spacing(space.sm + 1),
    padding: theme.spacing(space.sm + 1),
    [theme.breakpoints.up("md")]: { padding: theme.spacing(space.md) },
  }),
);

export const DisputeNoticeLabel = styled(Eyebrow, {
  name: NAME,
  slot: "Label",
})(({ theme }) => ({
  color: theme.palette.secondary.main,
  flexShrink: 0,
  minWidth: 96,
}));

export const DisputeNoticeText = styled(Box, { name: NAME, slot: "Text" })({
  flex: 1,
  minWidth: 280,
});
