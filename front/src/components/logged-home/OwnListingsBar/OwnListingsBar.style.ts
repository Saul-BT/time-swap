"use client";

import { styled } from "@mui/material";
import NextLink from "next/link";
import { softRule } from "@/theme/rules";
import { space } from "@/theme/tokens";
import type { OwnListingsTone } from "./OwnListingsBar.util";

const NAME = "OwnListingsBar";

/** One line, last on the page: the member's listings matter, but less than what is due. */
export const OwnListingsBarRoot = styled(NextLink, {
  name: NAME,
  slot: "Root",
})(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(1.75),
  paddingBlock: theme.spacing(2.25),
  borderBottom: softRule(theme),
  color: theme.palette.text.primary,
  textDecoration: "none",
  [theme.breakpoints.up("md")]: {
    padding: theme.spacing(1.75, 2.25),
    border: softRule(theme),
    backgroundColor: theme.palette.background.paper,
  },
}));

export const OwnListingsBarText = styled("span", { name: NAME, slot: "Text" })(
  ({ theme }) => ({
    flex: 1,
    minWidth: 0,
    display: "flex",
    flexDirection: "column",
    [theme.breakpoints.up("md")]: {
      flexDirection: "row",
      flexWrap: "wrap",
      columnGap: theme.spacing(0.75),
      ...theme.typography.body2,
    },
  }),
);

export const OwnListingsBarTitle = styled("strong", {
  name: NAME,
  slot: "Title",
})({ fontWeight: 700 });

export const OwnListingsBarLine = styled("span", { name: NAME, slot: "Line" })(
  ({ theme }) => ({
    ...theme.typography.caption,
    color: theme.palette.text.secondary,
    [theme.breakpoints.up("md")]: { display: "none" },
  }),
);

export const OwnListingsBarWide = styled("span", { name: NAME, slot: "Wide" })(
  ({ theme }) => ({
    display: "none",
    [theme.breakpoints.up("md")]: { display: "contents" },
  }),
);

export const OwnListingsBarPart = styled("span", {
  name: NAME,
  slot: "Part",
})<{ ownerState: { tone: OwnListingsTone } }>(({ theme, ownerState }) => ({
  color: {
    plain: "inherit",
    warning: theme.palette.warning.main,
    brake: theme.palette.secondary.main,
  }[ownerState.tone],
}));

export const OwnListingsBarManage = styled("span", {
  name: NAME,
  slot: "Manage",
})(({ theme }) => ({
  display: "none",
  [theme.breakpoints.up("md")]: {
    display: "inline",
    flexShrink: 0,
    fontWeight: 600,
    color: theme.palette.primary.main,
    textDecoration: "underline",
    textDecorationThickness: 2,
    textUnderlineOffset: 3,
  },
}));

export const OwnListingsBarChevron = styled("span", {
  name: NAME,
  slot: "Chevron",
})(({ theme }) => ({
  display: "inline-flex",
  marginLeft: theme.spacing(space.xs / 2),
  [theme.breakpoints.up("md")]: { display: "none" },
}));
