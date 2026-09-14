"use client";

import { styled } from "@mui/material/styles";
import { bareList } from "@/theme/rules";

const NAME = "MembersSection";

export const MembersSectionGrid = styled("ul", { name: NAME, slot: "Grid" })(
  ({ theme }) => ({
    ...bareList,
    display: "grid",
    gap: theme.spacing(2.5),
    gridTemplateColumns: "1fr",
    [theme.breakpoints.up("md")]: {
      gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
    },
  }),
);

export const MembersSectionItem = styled("li", { name: NAME, slot: "Item" })({
  display: "flex",
});
