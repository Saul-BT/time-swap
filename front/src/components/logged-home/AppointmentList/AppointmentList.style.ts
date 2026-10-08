"use client";

import { Paper, styled, Typography } from "@mui/material";
import Eyebrow from "@/components/ui/Eyebrow";
import TabularFigure from "@/components/ui/TabularFigure";
import { bareList, softRule } from "@/theme/rules";
import { fontFamily, space } from "@/theme/tokens";

const NAME = "AppointmentList";

/** Phones keep the strip's marks and drop the list, so the first screen stays on what is due. */
export const AppointmentListRoot = styled("section", {
  name: NAME,
  slot: "Root",
})(({ theme }) => ({
  display: "none",
  [theme.breakpoints.up("md")]: { display: "block" },
}));

export const AppointmentListList = styled("ul", { name: NAME, slot: "List" })(
  bareList,
);

export const AppointmentListItem = styled("li", { name: NAME, slot: "Item" })(
  ({ theme }) => ({
    display: "flex",
    alignItems: "flex-start",
    gap: theme.spacing(1.75),
    paddingBlock: theme.spacing(2.25),
    borderBottom: softRule(theme),
  }),
);

export const AppointmentListDate = styled(Paper, { name: NAME, slot: "Date" })(
  ({ theme }) => ({
    flexShrink: 0,
    width: 56,
    paddingBlock: theme.spacing(0.5),
    textAlign: "center",
  }),
);

export const AppointmentListWeekday = styled(Eyebrow, {
  name: NAME,
  slot: "Weekday",
})({ letterSpacing: "0.1em" });

export const AppointmentListDay = styled(TabularFigure, {
  name: NAME,
  slot: "Day",
})({
  fontFamily: fontFamily.condensed,
  fontWeight: 700,
  fontSize: 26,
  lineHeight: 1.06,
});

export const AppointmentListText = styled("div", { name: NAME, slot: "Text" })(
  ({ theme }) => ({ minWidth: 0, paddingTop: theme.spacing(space.xs / 4) }),
);

export const AppointmentListTitle = styled(Typography, {
  name: NAME,
  slot: "Title",
})({ fontWeight: 700 });
