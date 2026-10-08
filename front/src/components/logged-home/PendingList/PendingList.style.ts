"use client";

import { styled, Typography } from "@mui/material";
import { bareList, softRule } from "@/theme/rules";
import { space } from "@/theme/tokens";

const NAME = "PendingList";

export const PendingListSort = styled("div", { name: NAME, slot: "Sort" })(
  ({ theme }) => ({
    display: "none",
    [theme.breakpoints.up("md")]: { display: "block" },
  }),
);

export const PendingListList = styled("ul", { name: NAME, slot: "List" })(
  bareList,
);

export const PendingListNotice = styled("li", { name: NAME, slot: "Notice" })(
  ({ theme }) => ({ paddingTop: theme.spacing(space.sm) }),
);

export const PendingListItem = styled("li", { name: NAME, slot: "Item" })(
  ({ theme }) => ({ borderBottom: softRule(theme) }),
);

export const PendingListEmpty = styled(Typography, {
  name: NAME,
  slot: "Empty",
})(({ theme }) => ({
  paddingBlock: theme.spacing(space.sm + 1),
  color: theme.palette.text.secondary,
}));
