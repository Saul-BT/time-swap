"use client";

import { styled } from "@mui/material/styles";

const NAME = "ServerErrorNotice";

/** Keeps the notice in the tab order right where the form's focus lands. */
export const ServerErrorNoticeRoot = styled("div", {
  name: NAME,
  slot: "Root",
})({
  outline: "none",
});
