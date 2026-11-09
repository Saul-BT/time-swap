"use client";

import { styled } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import type { WithComponent } from "@/lib/mui/polymorphic";
import { space } from "@/theme/tokens";

const NAME = "RegisterStepper";

export const RegisterStepperRoot = styled("ol", { name: NAME, slot: "Root" })(
  ({ theme }) => ({
    display: "flex",
    alignItems: "flex-start",
    listStyle: "none",
    margin: 0,
    padding: 0,
    marginBottom: theme.spacing(space.lg),
  }),
);

export const RegisterStepperItem = styled("li", { name: NAME, slot: "Item" })({
  display: "flex",
  alignItems: "center",
  flex: "1 1 0%",
});

export const RegisterStepperCircle = styled("span", {
  name: NAME,
  slot: "Circle",
})<{ ownerState: { filled: boolean } }>(({ theme, ownerState }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  flexShrink: 0,
  width: 40,
  height: 40,
  border: `${theme.system.borderWidth}px solid ${theme.palette.text.primary}`,
  backgroundColor: ownerState.filled
    ? theme.palette.text.primary
    : theme.palette.background.paper,
  color: ownerState.filled
    ? theme.palette.background.default
    : theme.palette.text.primary,
  ...theme.typography.subtitle2,
}));

export const RegisterStepperLabel = styled(Typography, {
  name: NAME,
  slot: "Label",
})<WithComponent>(({ theme }) => ({
  marginLeft: theme.spacing(space.xs),
  whiteSpace: "nowrap",
  [theme.breakpoints.down("sm")]: { display: "none" },
}));

export const RegisterStepperConnector = styled("span", {
  name: NAME,
  slot: "Connector",
})<{ ownerState: { filled: boolean } }>(({ theme, ownerState }) => ({
  flex: 1,
  height: theme.system.borderWidth,
  marginInline: theme.spacing(space.xs),
  backgroundColor: ownerState.filled
    ? theme.palette.text.primary
    : theme.palette.divider,
}));
