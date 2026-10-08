"use client";

import { Avatar, styled, Typography } from "@mui/material";
import NextLink from "next/link";
import type { WithComponent } from "@/lib/mui/polymorphic";
import { rule } from "@/theme/rules";
import { space } from "@/theme/tokens";

const NAME = "MemberHeader";

/** Sticks on phones so the week strip below it can stick too. */
export const MemberHeaderRoot = styled("header", { name: NAME, slot: "Root" })(
  ({ theme }) => ({
    position: "sticky",
    top: 0,
    zIndex: theme.zIndex.appBar,
    display: "flex",
    alignItems: "stretch",
    height: theme.system.memberHeaderHeight,
    borderBottom: rule(theme),
    backgroundColor: theme.palette.background.default,
    [theme.breakpoints.up("md")]: { position: "static" },
  }),
);

export const MemberHeaderBrand = styled(NextLink, {
  name: NAME,
  slot: "Brand",
})(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  marginRight: "auto",
  paddingInline: theme.spacing(space.sm),
  color: theme.palette.text.primary,
  textDecoration: "none",
  [theme.breakpoints.up("md")]: {
    paddingInline: theme.spacing(3),
    borderRight: rule(theme),
  },
}));

export const MemberHeaderBrandName = styled(Typography, {
  name: NAME,
  slot: "BrandName",
})<WithComponent>({ fontSize: 20 });

export const MemberHeaderNav = styled("nav", { name: NAME, slot: "Nav" })(
  ({ theme }) => ({
    display: "none",
    [theme.breakpoints.up("md")]: { display: "flex", alignItems: "stretch" },
  }),
);

/** What the tab bar cannot hold on phones: unread messages, one tap away. */
export const MemberHeaderNarrow = styled("div", {
  name: NAME,
  slot: "Narrow",
})(({ theme }) => ({
  display: "flex",
  alignItems: "stretch",
  [theme.breakpoints.up("md")]: { display: "none" },
}));

export const MemberHeaderAvatar = styled(Avatar, {
  name: NAME,
  slot: "Avatar",
})({
  width: 40,
  height: 40,
  fontSize: 16,
});
