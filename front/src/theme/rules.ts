import type { Theme } from "@mui/material/styles";
import { space } from "./tokens";

/**
 * Shared style fragments. The rule carries hierarchy since elevation is off,
 * so its definition lives here and nowhere else.
 */

/** Structural rule: separates blocks and frames surfaces. */
export const rule = (theme: Theme) =>
  `${theme.system.borderWidth}px solid ${theme.palette.text.primary}`;

/** Accent rule: marks what the reader was sent to look at. */
export const accentRule = (theme: Theme) =>
  `${theme.system.borderWidth}px solid ${theme.palette.primary.main}`;

/** Soft rule: divides the inside of a surface. */
export const softRule = (theme: Theme) =>
  `${theme.system.borderWidth}px solid ${theme.palette.divider}`;

/** Rule around something stopped or under review. The brake colour, only here. */
export const brakeRule = (theme: Theme) =>
  `${theme.system.borderWidth}px solid ${theme.palette.secondary.main}`;

/** Vertical rhythm of a page section: 56 px, 96 px from `md` up. */
export const sectionSpacingY = (
  theme: Theme,
  { top = true, bottom = true } = {},
) => ({
  paddingTop: top ? theme.spacing(space.lg) : 0,
  paddingBottom: bottom ? theme.spacing(space.lg) : 0,
  [theme.breakpoints.up("md")]: {
    paddingTop: top ? theme.spacing(space.xl) : 0,
    paddingBottom: bottom ? theme.spacing(space.xl) : 0,
  },
});

/** Off the screen, still in the accessibility tree. */
export const visuallyHidden = {
  position: "absolute",
  width: 1,
  height: 1,
  margin: -1,
  padding: 0,
  border: 0,
  overflow: "hidden",
  clip: "rect(0 0 0 0)",
  whiteSpace: "nowrap",
} as const;

/** Resets a `ul` used purely for grouping. */
export const bareList = {
  listStyle: "none",
  margin: 0,
  padding: 0,
} as const;

/** Resets a `fieldset` used purely for grouping. */
export const bareFieldset = {
  margin: 0,
  padding: 0,
  border: 0,
  minWidth: 0,
} as const;
