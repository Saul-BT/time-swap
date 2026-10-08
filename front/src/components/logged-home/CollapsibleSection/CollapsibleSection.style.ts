"use client";

import { styled } from "@mui/material";
import { bareList } from "@/theme/rules";

export const CollapsibleSectionList = styled("ul", {
  name: "CollapsibleSection",
  slot: "List",
})<{ ownerState: { open: boolean } }>(({ theme, ownerState }) => ({
  ...bareList,
  display: ownerState.open ? "block" : "none",
  [theme.breakpoints.up("md")]: { display: "block" },
}));
