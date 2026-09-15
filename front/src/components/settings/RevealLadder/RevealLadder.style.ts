"use client";

import { keyframes, styled } from "@mui/material/styles";
import { accentRule, rule, visuallyHidden } from "@/theme/rules";
import { space } from "@/theme/tokens";
import { ARRIVAL_MS, revealLadderClasses } from "./RevealLadder.util";

const NAME = "RevealLadder";

const arrive = (accent: string) =>
  keyframes({
    from: { outlineColor: "transparent" },
    "12%": { outlineColor: accent },
    "70%": { outlineColor: accent },
    to: { outlineColor: "transparent" },
  });

/** Steps before the chosen one are greyed: those people do not see the data. */
export type StepState = "before" | "chosen" | "after";

export const RevealLadderRoot = styled("fieldset", {
  name: NAME,
  slot: "Root",
})<{ ownerState: { marked: boolean } }>(({ theme, ownerState }) => ({
  margin: 0,
  padding: 0,
  border: 0,
  minWidth: 0,
  display: "flex",
  flexDirection: "column",
  gap: theme.spacing(space.xs),
  scrollMarginBlock: theme.spacing(space.md),
  outline: ownerState.marked ? accentRule(theme) : "none",
  outlineOffset: theme.spacing(space.xs),
  animation: ownerState.marked
    ? `${arrive(theme.palette.primary.main)} ${ARRIVAL_MS}ms ease-out`
    : "none",
  "@media (prefers-reduced-motion: reduce)": { animation: "none" },
}));

export const RevealLadderLegend = styled("legend", {
  name: NAME,
  slot: "Legend",
})(({ theme }) => ({
  ...theme.typography.body2,
  fontWeight: theme.typography.fontWeightBold,
  padding: 0,
  marginBottom: theme.spacing(space.xs),
}));

export const RevealLadderSteps = styled("div", { name: NAME, slot: "Steps" })(
  ({ theme }) => ({
    display: "grid",
    gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
    border: rule(theme),
    [`& .${revealLadderClasses.step}:nth-of-type(even)`]: {
      borderLeft: rule(theme),
    },
    [`& .${revealLadderClasses.step}:nth-of-type(n + 3)`]: {
      borderTop: rule(theme),
    },
    [theme.breakpoints.up("md")]: {
      gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
      [`& .${revealLadderClasses.step}:not(:first-of-type)`]: {
        borderLeft: rule(theme),
        borderTop: 0,
      },
    },
  }),
);

export const RevealLadderStep = styled("label", {
  name: NAME,
  slot: "Step",
})<{ ownerState: { state: StepState } }>(({ theme, ownerState }) => ({
  position: "relative",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  minHeight: theme.system.controlHeight,
  padding: theme.spacing(space.xs, space.sm),
  cursor: "pointer",
  ...theme.typography.button,
  textAlign: "center",
  backgroundColor: {
    before: theme.palette.divider,
    chosen: theme.palette.primary.main,
    after: theme.palette.background.paper,
  }[ownerState.state],
  color: {
    before: theme.palette.text.secondary,
    chosen: theme.palette.primary.contrastText,
    after: theme.palette.text.primary,
  }[ownerState.state],
  "&:hover": {
    backgroundColor:
      ownerState.state === "chosen"
        ? theme.palette.text.primary
        : theme.palette.divider,
  },
  "&:has(input:focus-visible)": {
    outline: `${theme.system.focusRingWidth}px solid ${theme.palette.text.primary}`,
    outlineOffset: -theme.system.focusRingWidth,
  },
}));

/** Hidden but focusable: the label is the control people see. */
export const RevealLadderInput = styled("input", {
  name: NAME,
  slot: "Input",
})(visuallyHidden);

export const RevealLadderHint = styled("p", { name: NAME, slot: "Hint" })(
  ({ theme }) => ({
    ...theme.typography.body2,
    margin: 0,
    color: theme.palette.text.secondary,
  }),
);
