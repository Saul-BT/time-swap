"use client";

import { autocompleteClasses } from "@mui/material/Autocomplete";
import { buttonBaseClasses } from "@mui/material/ButtonBase";
import { inputLabelClasses } from "@mui/material/InputLabel";
import { outlinedInputClasses } from "@mui/material/OutlinedInput";
import { switchClasses } from "@mui/material/Switch";
import { createTheme } from "@mui/material/styles";
import { toggleButtonClasses } from "@mui/material/ToggleButton";
import LinkBehavior from "@/lib/mui/LinkBehavior";
import {
  color,
  fontFamily,
  statusColor,
  statusColorOnInk,
  structure,
  typeScale,
} from "./tokens";

/** Exposes the tokens styles need as `theme.system` and `palette.onInk`. */
declare module "@mui/material/styles" {
  interface Theme {
    system: typeof structure;
  }
  interface ThemeOptions {
    system?: typeof structure;
  }
  interface Palette {
    onInk: typeof statusColorOnInk;
  }
  interface PaletteOptions {
    onInk?: typeof statusColorOnInk;
  }
}

const rule = `${structure.borderWidth}px solid ${color.ink}`;
const softRule = `${structure.borderWidth}px solid ${color.line}`;
const focusRing = {
  outline: `${structure.focusRingWidth}px solid ${color.ink}`,
  outlineOffset: 2,
};

const theme = createTheme({
  system: structure,

  // `modularCssLayers` stays off: with it on, `styleOverrides` land in a later
  // layer than `styled(el, { name, slot })` and silently win over components.

  shape: { borderRadius: 0 },

  spacing: 8,

  shadows: Array.from({ length: 25 }, () => "none") as never,

  palette: {
    mode: "light",
    background: { default: color.background, paper: color.surface },
    text: { primary: color.ink, secondary: color.inkMuted },
    divider: color.line,
    // `light` and `dark` repeat `main` on purpose: one accent, no derived tones.
    primary: {
      main: color.accent,
      light: color.accent,
      dark: color.accent,
      contrastText: color.onDark,
    },
    secondary: {
      main: color.brake,
      light: color.brake,
      dark: color.brake,
      contrastText: color.onDark,
    },
    error: { main: statusColor.error, contrastText: color.onDark },
    warning: { main: statusColor.warning, contrastText: color.onDark },
    info: { main: statusColor.info, contrastText: color.onDark },
    success: { main: statusColor.success, contrastText: color.onDark },
    onInk: statusColorOnInk,
  },

  typography: {
    fontFamily: fontFamily.body,
    fontWeightRegular: 400,
    fontWeightMedium: 600,
    fontWeightBold: 700,
    ...(Object.fromEntries(
      Object.entries(typeScale).map(([variant, step]) => [
        variant,
        {
          fontFamily: fontFamily[step.family],
          fontWeight: step.weight,
          fontSize: step.size,
          lineHeight: step.lineHeight,
          ...(step.uppercase ? { textTransform: "uppercase" as const } : {}),
          ...(step.family === "condensed" ? { letterSpacing: "0.01em" } : {}),
          ...(variant === "button" ? { letterSpacing: "0.04em" } : {}),
          ...(variant === "overline" ? { letterSpacing: "0.16em" } : {}),
        },
      ]),
    ) as Record<string, object>),
  },

  components: {
    MuiCssBaseline: {
      styleOverrides: {
        "*, *::before, *::after": { boxSizing: "border-box" },
        html: { WebkitTextSizeAdjust: "100%" },
        body: {
          margin: 0,
          backgroundColor: color.background,
          color: color.ink,
          fontFamily: fontFamily.body,
          fontSize: "1.0625rem",
          lineHeight: 1.55,
          WebkitFontSmoothing: "antialiased",
          MozOsxFontSmoothing: "grayscale",
        },
        // Ink reads on the light surface and on a filled accent button (ADR 0008).
        ":focus-visible": {
          outline: `${structure.focusRingWidth}px solid ${color.ink}`,
          outlineOffset: 2,
        },
      },
    },

    MuiButtonBase: {
      defaultProps: { LinkComponent: LinkBehavior },
    },

    MuiButton: {
      defaultProps: { disableElevation: true },
      styleOverrides: {
        root: {
          minHeight: structure.controlHeight,
          padding: "15px 24px",
          gap: 8,
          border: rule,
          borderRadius: 0,
          boxShadow: "none",
          "&:hover": { boxShadow: "none" },
        },
        contained: {
          backgroundColor: color.accent,
          borderColor: color.accent,
          color: color.onDark,
          "&:hover": { backgroundColor: color.ink, borderColor: color.ink },
        },
        outlined: {
          backgroundColor: "transparent",
          borderColor: color.ink,
          color: color.ink,
          "&:hover": { backgroundColor: color.line, borderColor: color.ink },
        },
        text: {
          backgroundColor: "transparent",
          borderColor: "transparent",
          color: color.accent,
          textDecoration: "underline",
          textUnderlineOffset: 4,
          textDecorationThickness: 2,
          "&:hover": {
            backgroundColor: "transparent",
            textDecoration: "underline",
          },
        },
      },
    },

    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          minHeight: structure.controlHeight,
          backgroundColor: color.surface,
          borderRadius: 0,
          fontSize: "1.0625rem",
          [`& .${outlinedInputClasses.notchedOutline}`]: {
            borderWidth: structure.borderWidth,
            borderColor: color.ink,
            borderRadius: 0,
          },
          [`&:hover .${outlinedInputClasses.notchedOutline}`]: {
            borderColor: color.ink,
          },
          [`&.${outlinedInputClasses.focused} .${outlinedInputClasses.notchedOutline}`]:
            {
              borderWidth: structure.borderWidth,
              borderColor: color.accent,
            },
        },
        input: { padding: "14px 16px" },
      },
    },

    MuiInputBase: {
      styleOverrides: {
        input: {
          "&::placeholder": { color: color.inkMuted, opacity: 1 },
        },
      },
    },

    MuiInputLabel: {
      styleOverrides: {
        root: {
          fontWeight: 600,
          color: color.ink,
          [`&.${inputLabelClasses.focused}`]: { color: color.accent },
        },
      },
    },

    MuiPaper: {
      defaultProps: { elevation: 0, variant: "outlined" },
      styleOverrides: {
        root: { backgroundImage: "none", boxShadow: "none", borderRadius: 0 },
        outlined: { border: rule },
      },
    },

    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 0,
          height: "auto",
          minHeight: 40,
          padding: "6px 4px",
          fontWeight: 600,
          fontSize: "0.9375rem",
          backgroundColor: color.surface,
          border: rule,
        },
        outlined: { border: rule },
        label: { paddingInline: 12 },
      },
    },

    MuiStack: {
      defaultProps: { useFlexGap: true },
    },

    MuiDivider: {
      styleOverrides: {
        root: {
          borderColor: color.line,
          borderBottomWidth: structure.borderWidth,
        },
      },
    },

    MuiLink: {
      defaultProps: { underline: "always", component: LinkBehavior },
      styleOverrides: {
        root: {
          color: color.accent,
          textDecorationThickness: 2,
          textUnderlineOffset: 3,
        },
      },
    },

    MuiContainer: {
      defaultProps: { maxWidth: false },
      styleOverrides: {
        root: {
          maxWidth: structure.contentWidth,
          paddingInline: 24,
          "@media (min-width:900px)": { paddingInline: 56 },
        },
      },
    },

    MuiAvatar: {
      styleOverrides: {
        root: {
          borderRadius: 0,
          border: rule,
          backgroundColor: color.line,
          color: color.ink,
          fontFamily: fontFamily.condensed,
          fontWeight: 700,
        },
      },
    },

    MuiToggleButtonGroup: {
      styleOverrides: {
        root: { border: rule, borderRadius: 0 },
        grouped: {
          border: 0,
          borderRadius: 0,
          "&:not(:first-of-type)": { borderLeft: rule, marginLeft: 0 },
          "&:not(:last-of-type)": { borderRight: 0 },
        },
        firstButton: { borderRadius: 0 },
        lastButton: { borderRadius: 0 },
        middleButton: { borderRadius: 0 },
      },
    },

    MuiToggleButton: {
      defaultProps: { disableRipple: true },
      styleOverrides: {
        root: {
          minHeight: structure.controlHeight,
          padding: "12px 20px",
          gap: 8,
          border: 0,
          borderRadius: 0,
          color: color.ink,
          backgroundColor: "transparent",
          fontFamily: fontFamily.body,
          fontWeight: 700,
          fontSize: "0.9375rem",
          letterSpacing: "0.04em",
          textTransform: "uppercase",
          "&:hover": { backgroundColor: color.line },
          [`&.${toggleButtonClasses.selected}`]: {
            backgroundColor: color.accent,
            color: color.onDark,
            "&:hover": { backgroundColor: color.ink },
          },
          [`&.${toggleButtonClasses.disabled}`]: {
            color: color.inkMuted,
            border: 0,
          },
        },
      },
    },

    MuiSwitch: {
      defaultProps: { disableRipple: true },
      styleOverrides: {
        root: { width: 52, height: 32, padding: 0, overflow: "visible" },
        switchBase: {
          padding: 6,
          color: color.ink,
          "&:hover": { backgroundColor: "transparent" },
          [`&.${switchClasses.checked}`]: {
            transform: "translateX(20px)",
            color: color.onDark,
            "&:hover": { backgroundColor: "transparent" },
            [`& + .${switchClasses.track}`]: {
              backgroundColor: color.accent,
              borderColor: color.accent,
              opacity: 1,
            },
          },
          [`&.${buttonBaseClasses.focusVisible} + .${switchClasses.track}`]:
            focusRing,
          [`&.${switchClasses.disabled}`]: {
            color: color.inkMuted,
            [`& + .${switchClasses.track}`]: {
              borderColor: color.inkMuted,
              opacity: 1,
            },
          },
        },
        thumb: {
          width: 20,
          height: 20,
          borderRadius: 0,
          boxShadow: "none",
          backgroundColor: "currentColor",
        },
        track: {
          borderRadius: 0,
          border: rule,
          backgroundColor: color.surface,
          opacity: 1,
        },
      },
    },

    MuiTableContainer: {
      styleOverrides: {
        root: { border: rule, backgroundColor: color.surface },
      },
    },

    MuiTableCell: {
      styleOverrides: {
        root: { borderBottom: softRule, padding: "12px 16px" },
        head: {
          fontFamily: fontFamily.body,
          fontWeight: 700,
          fontSize: "0.75rem",
          lineHeight: 1.4,
          letterSpacing: "0.16em",
          textTransform: "uppercase",
          color: color.inkMuted,
          borderBottom: rule,
        },
        body: { fontSize: "1rem" },
      },
    },

    MuiTableRow: {
      styleOverrides: {
        root: {
          "&:last-of-type td, &:last-of-type th": { borderBottom: 0 },
        },
      },
    },

    MuiAutocomplete: {
      styleOverrides: {
        paper: { border: rule, marginTop: -structure.borderWidth },
        listbox: { padding: 0 },
        option: {
          minHeight: 44,
          [`&.${autocompleteClasses.focused}`]: { backgroundColor: color.line },
          '&[aria-selected="true"]': {
            backgroundColor: color.line,
            fontWeight: 700,
          },
        },
        noOptions: { color: color.inkMuted },
        tag: { margin: 4 },
        inputRoot: { padding: "6px 8px", gap: 4 },
      },
    },

    MuiSkeleton: {
      defaultProps: { animation: false },
      styleOverrides: {
        root: { backgroundColor: color.line, borderRadius: 0 },
      },
    },

    MuiDialog: {
      styleOverrides: {
        paper: {
          border: rule,
          borderRadius: 0,
          boxShadow: "none",
          padding: 32,
          margin: 24,
          maxWidth: 480,
        },
      },
    },

    MuiDialogTitle: {
      styleOverrides: { root: { padding: 0, marginBottom: 8 } },
    },

    MuiDialogContent: {
      styleOverrides: { root: { padding: 0, marginBottom: 32 } },
    },

    MuiDialogActions: {
      styleOverrides: { root: { padding: 0, gap: 16 } },
    },
  },
});

export default theme;
