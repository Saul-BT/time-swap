"use client";

import { styled, Typography } from "@mui/material";
import TabularFigure from "@/components/ui/TabularFigure";
import { bareList, rule, softRule } from "@/theme/rules";
import { fontFamily, space } from "@/theme/tokens";

const NAME = "FirstSteps";

export const FirstStepsRoot = styled("div", { name: NAME, slot: "Root" })(
  ({ theme }) => ({
    display: "grid",
    gap: theme.spacing(space.md),
    [theme.breakpoints.up("md")]: {
      gridTemplateColumns: `minmax(0, 1fr) ${theme.system.memberAsideWidth}px`,
      columnGap: theme.spacing(space.lg),
      alignItems: "start",
    },
  }),
);

export const FirstStepsMain = styled("div", { name: NAME, slot: "Main" })(
  ({ theme }) => ({
    display: "flex",
    flexDirection: "column",
    gap: theme.spacing(space.md),
  }),
);

export const FirstStepsLead = styled(Typography, {
  name: NAME,
  slot: "Lead",
})(({ theme }) => ({ marginTop: theme.spacing(space.xs), maxWidth: 560 }));

export const FirstStepsSteps = styled("ol", { name: NAME, slot: "Steps" })(
  bareList,
);

export const FirstStepsStep = styled("li", { name: NAME, slot: "Step" })(
  ({ theme }) => ({
    display: "flex",
    alignItems: "flex-start",
    gap: theme.spacing(2.25),
    paddingBlock: theme.spacing(2.5),
    borderBottom: softRule(theme),
  }),
);

export const FirstStepsNumber = styled("span", { name: NAME, slot: "Number" })(
  ({ theme }) => ({
    flexShrink: 0,
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    width: 44,
    height: 44,
    border: rule(theme),
    backgroundColor: theme.palette.background.paper,
    fontFamily: fontFamily.condensed,
    fontWeight: 700,
    fontSize: 22,
  }),
);

export const FirstStepsStepText = styled("div", {
  name: NAME,
  slot: "StepText",
})(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "flex-start",
  gap: theme.spacing(0.75),
}));

export const FirstStepsAside = styled("aside", { name: NAME, slot: "Aside" })(
  ({ theme }) => ({
    display: "flex",
    flexDirection: "column",
    gap: theme.spacing(space.md),
    padding: theme.spacing(space.sm + 1),
    border: rule(theme),
    backgroundColor: theme.palette.background.paper,
  }),
);

export const FirstStepsFacts = styled("dl", { name: NAME, slot: "Facts" })(
  ({ theme }) => ({
    display: "grid",
    gap: theme.spacing(1.5),
    margin: 0,
    marginTop: theme.spacing(space.xs),
  }),
);

export const FirstStepsFact = styled("div", { name: NAME, slot: "Fact" })(
  ({ theme }) => ({
    display: "grid",
    gridTemplateColumns: "64px minmax(0, 1fr)",
    alignItems: "baseline",
    gap: theme.spacing(1.5),
  }),
);

export const FirstStepsDescription = styled("dd", {
  name: NAME,
  slot: "Description",
})(({ theme }) => ({ margin: 0, ...theme.typography.caption }));

export const FirstStepsFigure = styled(TabularFigure, {
  name: NAME,
  slot: "Figure",
})({
  fontFamily: fontFamily.condensed,
  fontWeight: 700,
  fontSize: 22,
  lineHeight: 1.06,
});
