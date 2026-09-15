"use client";

import { styled } from "@mui/material/styles";

const NAME = "Icon";

/** Sized by the glyph itself; the wrapper only keeps it on the text baseline. */
export const IconRoot = styled("span", { name: NAME, slot: "Root" })({
  display: "inline-flex",
  flexShrink: 0,
  verticalAlign: "middle",
  lineHeight: 0,
});
