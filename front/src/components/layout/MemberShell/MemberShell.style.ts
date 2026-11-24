"use client";

import { styled } from "@mui/material";

const NAME = "MemberShell";

export const MemberShellRoot = styled("div", { name: NAME, slot: "Root" })({
  minHeight: "100vh",
  display: "flex",
  flexDirection: "column",
});

export const MemberShellMain = styled("main", { name: NAME, slot: "Main" })({
  flex: 1,
});
