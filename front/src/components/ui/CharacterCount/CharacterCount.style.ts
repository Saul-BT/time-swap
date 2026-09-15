"use client";

import { styled } from "@mui/material/styles";
import { TabularFigureRoot } from "../TabularFigure/TabularFigure.style";

const NAME = "CharacterCount";

export const CharacterCountRoot = styled(TabularFigureRoot, {
  name: NAME,
  slot: "Root",
})<{ ownerState: { over: boolean } }>(({ theme, ownerState }) => ({
  display: "block",
  textAlign: "right",
  color: ownerState.over
    ? theme.palette.error.main
    : theme.palette.text.secondary,
}));
