"use client";

import { Paper, styled, Typography } from "@mui/material";
import type { WithComponent } from "@/lib/mui/polymorphic";
import { space } from "@/theme/tokens";
import type { FormNoticeTone } from "./FormNotice.util";

const NAME = "FormNotice";

export const FormNoticeRoot = styled(Paper, {
  name: NAME,
  slot: "Root",
})<{ ownerState: { tone: FormNoticeTone } }>(({ theme, ownerState }) => ({
  borderColor: theme.palette[ownerState.tone].main,
  padding: theme.spacing(space.sm),
  marginBottom: theme.spacing(space.md),
}));

export const FormNoticeTitle = styled(Typography, {
  name: NAME,
  slot: "Title",
})<WithComponent & { ownerState: { tone: FormNoticeTone } }>(
  ({ theme, ownerState }) => ({
    color: theme.palette[ownerState.tone].main,
    marginBottom: theme.spacing(space.xs / 2),
  }),
);
