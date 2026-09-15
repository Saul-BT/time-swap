"use client";

import Paper from "@mui/material/Paper";
import { styled } from "@mui/material/styles";
import { space } from "@/theme/tokens";

const NAME = "ZonePicker";

export const ZonePickerRoot = styled("div", { name: NAME, slot: "Root" })(
  ({ theme }) => ({
    display: "flex",
    flexDirection: "column",
    gap: theme.spacing(space.sm),
  }),
);

/** Unset or refused: a warning-ruled card with both ways forward. */
export const ZonePickerNotice = styled(Paper, {
  name: NAME,
  slot: "Notice",
})<{ ownerState: { tone: "warning" | "info" } }>(({ theme, ownerState }) => ({
  borderColor:
    ownerState.tone === "warning"
      ? theme.palette.warning.main
      : theme.palette.text.primary,
  padding: theme.spacing(space.sm + 1),
  display: "flex",
  flexDirection: "column",
  gap: theme.spacing(space.xs),
}));

export const ZonePickerNoticeTitle = styled("p", {
  name: NAME,
  slot: "NoticeTitle",
})(({ theme }) => ({
  ...theme.typography.h6,
  margin: 0,
}));

export const ZonePickerNoticeBody = styled("p", {
  name: NAME,
  slot: "NoticeBody",
})(({ theme }) => ({
  ...theme.typography.body2,
  margin: 0,
}));

export const ZonePickerActions = styled("div", { name: NAME, slot: "Actions" })(
  ({ theme }) => ({
    display: "flex",
    flexWrap: "wrap",
    gap: theme.spacing(space.sm),
    marginTop: theme.spacing(space.xs),
  }),
);

export const ZonePickerCurrent = styled(Paper, { name: NAME, slot: "Current" })(
  ({ theme }) => ({
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: theme.spacing(space.sm),
    padding: theme.spacing(space.sm, space.sm + 1),
  }),
);

export const ZonePickerCurrentValue = styled("p", {
  name: NAME,
  slot: "CurrentValue",
})(({ theme }) => ({
  ...theme.typography.h6,
  margin: 0,
}));
