"use client";

import { styled, Typography } from "@mui/material";
import Eyebrow from "@/components/ui/Eyebrow";
import type { WithComponent } from "@/lib/mui/polymorphic";
import { space } from "@/theme/tokens";

const NAME = "PendingRow";

/**
 * Phones: actions run under the text. From `md` up they sit in a right-hand
 * column under the meta line, as on a ledger of things to do.
 */
export const PendingRowRoot = styled("article", { name: NAME, slot: "Root" })(
  ({ theme }) => ({
    display: "grid",
    gridTemplateColumns: "auto minmax(0, 1fr) auto",
    gridTemplateAreas: `"icon label meta" "icon body body" "icon actions actions"`,
    alignItems: "start",
    columnGap: theme.spacing(1.75),
    rowGap: theme.spacing(0.5),
    paddingBlock: theme.spacing(space.sm + 0.5),
    [theme.breakpoints.up("md")]: {
      gridTemplateColumns: "auto minmax(0, 1fr) minmax(220px, auto)",
      gridTemplateAreas: `"icon label meta" "icon body actions"`,
      columnGap: theme.spacing(2.25),
      paddingBlock: theme.spacing(2.5),
    },
  }),
);

export const PendingRowIcon = styled("div", { name: NAME, slot: "Icon" })({
  gridArea: "icon",
});

export const PendingRowLabel = styled(Eyebrow, {
  name: NAME,
  slot: "Label",
})<{ ownerState: { isNew: boolean } }>(({ theme, ownerState }) => ({
  gridArea: "label",
  alignSelf: "center",
  color: ownerState.isNew
    ? theme.palette.primary.main
    : theme.palette.text.secondary,
}));

export const PendingRowMeta = styled(Typography, {
  name: NAME,
  slot: "Meta",
})<WithComponent>(({ theme }) => ({
  gridArea: "meta",
  alignSelf: "center",
  justifySelf: "end",
  maxWidth: "7.5rem",
  fontWeight: 700,
  textAlign: "right",
  color: theme.palette.text.secondary,
  fontVariantNumeric: "tabular-nums",
  [theme.breakpoints.up("md")]: { maxWidth: "none", whiteSpace: "nowrap" },
}));

export const PendingRowBody = styled("div", { name: NAME, slot: "Body" })(
  ({ theme }) => ({
    gridArea: "body",
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    gap: theme.spacing(0.5),
    minWidth: 0,
  }),
);

export const PendingRowTitle = styled(Typography, {
  name: NAME,
  slot: "Title",
})<WithComponent>(({ theme }) => ({
  marginTop: theme.spacing(0.5),
  overflowWrap: "anywhere",
}));

/** The counterpart changed what is on screen: say so before anyone acts on it. */
export const PendingRowAlert = styled("div", { name: NAME, slot: "Alert" })(
  ({ theme }) => ({
    alignSelf: "stretch",
    marginTop: theme.spacing(space.xs),
    padding: theme.spacing(1.25, 1.5),
    border: `${theme.system.borderWidth}px solid ${theme.palette.warning.main}`,
    backgroundColor: theme.palette.background.paper,
  }),
);

export const PendingRowAlertTitle = styled(Typography, {
  name: NAME,
  slot: "AlertTitle",
})(({ theme }) => ({ fontWeight: 700, color: theme.palette.warning.main }));

export const PendingRowActions = styled("div", { name: NAME, slot: "Actions" })(
  ({ theme }) => ({
    gridArea: "actions",
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    gap: theme.spacing(space.xs),
    marginTop: theme.spacing(1.5),
    [theme.breakpoints.up("md")]: {
      alignItems: "flex-end",
      marginTop: theme.spacing(0.5),
    },
  }),
);

export const PendingRowButtons = styled("div", { name: NAME, slot: "Buttons" })(
  ({ theme }) => ({
    display: "flex",
    flexWrap: "wrap",
    gap: theme.spacing(space.xs),
    [theme.breakpoints.up("md")]: { justifyContent: "flex-end" },
  }),
);

export const PendingRowReason = styled(Typography, {
  name: NAME,
  slot: "Reason",
})(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(0.75),
  color: theme.palette.text.secondary,
}));
