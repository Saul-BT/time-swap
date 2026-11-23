"use client";

import { Dialog, styled } from "@mui/material";

const NAME = "UnsavedChanges";

export const UnsavedChangesDialog = styled(Dialog, {
  name: NAME,
  slot: "Dialog",
})({});
