"use client";

import Button from "@mui/material/Button";
import { styled } from "@mui/material/styles";
import { rule } from "@/theme/rules";
import { space } from "@/theme/tokens";

const NAME = "PanelFooter";

/** Sticks to the bottom on small screens so Save is always one tap away. */
export const PanelFooterRoot = styled("footer", { name: NAME, slot: "Root" })(
  ({ theme }) => ({
    position: "sticky",
    bottom: 0,
    zIndex: 1,
    display: "flex",
    flexWrap: "wrap",
    alignItems: "center",
    gap: theme.spacing(space.sm),
    marginTop: theme.spacing(space.md),
    marginInline: -theme.spacing(space.sm + 1),
    padding: theme.spacing(space.sm, space.sm + 1),
    borderTop: rule(theme),
    backgroundColor: theme.palette.background.paper,
    [theme.breakpoints.up("md")]: {
      position: "static",
      marginInline: 0,
      padding: 0,
      paddingTop: theme.spacing(space.md),
      borderTop: `${theme.system.borderWidth}px solid ${theme.palette.divider}`,
    },
  }),
);

export const PanelFooterSave = styled(Button, { name: NAME, slot: "Save" })(
  ({ theme }) => ({
    flex: "1 1 auto",
    [theme.breakpoints.up("md")]: { flex: "0 0 auto" },
  }),
);

export const PanelFooterNext = styled(Button, { name: NAME, slot: "Next" })(
  ({ theme }) => ({
    flex: "1 1 auto",
    [theme.breakpoints.up("md")]: { flex: "0 0 auto" },
  }),
);

export const PanelFooterFeedback = styled("p", {
  name: NAME,
  slot: "Feedback",
})(({ theme }) => ({
  ...theme.typography.subtitle2,
  margin: 0,
  flexBasis: "100%",
  color: theme.palette.success.main,
  [theme.breakpoints.up("md")]: { flexBasis: "auto", marginLeft: "auto" },
}));
