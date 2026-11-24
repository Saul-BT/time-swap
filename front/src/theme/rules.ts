import type { Theme } from "@mui/material";
import { space } from "./tokens";

/**
 * Shared style fragments. The rule carries hierarchy since elevation is off,
 * so its definition lives here and nowhere else.
 */

/** Structural rule: separates blocks and frames surfaces. */
export const rule = (theme: Theme) =>
  `${theme.system.borderWidth}px solid ${theme.palette.text.primary}`;

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

/** Resets a `ul` used purely for grouping. */
export const bareList = {
  listStyle: "none",
  margin: 0,
  padding: 0,
} as const;

/**
 * 4 px accent bar on one edge, drawn as a pseudo-element: the current page in
 * a navigation, today in a calendar. Needs a positioned host.
 */
export const currentBar = (theme: Theme, edge: "top" | "bottom") =>
  ({
    content: '""',
    position: "absolute",
    insetInline: 0,
    [edge]: 0,
    height: 4,
    backgroundColor: theme.palette.primary.main,
    pointerEvents: "none",
  }) as const;

/** Hidden on screen, still read aloud. */
export const visuallyHidden = {
  position: "absolute",
  width: 1,
  height: 1,
  margin: -1,
  padding: 0,
  overflow: "hidden",
  clip: "rect(0 0 0 0)",
  whiteSpace: "nowrap",
  border: 0,
} as const;
