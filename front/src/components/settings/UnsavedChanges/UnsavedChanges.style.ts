"use client";

import Dialog from "@mui/material/Dialog";
import { styled } from "@mui/material/styles";

const NAME = "UnsavedChanges";

export const UnsavedChangesDialog = styled(Dialog, {
  name: NAME,
  slot: "Dialog",
})({});
