/**
 * Design tokens of the Relevo system (`docs/sistema-de-diseno.md`).
 * The only module allowed to contain a hexadecimal value.
 */

/** Contrast ratios below are WCAG, measured against `background`. */
export const color = {
  /** Fog grey. Page background. */
  background: "#F3F2F5",
  /** White. Cards and fields. */
  surface: "#FFFFFF",
  /** Primary text. 16.5:1. */
  ink: "#151318",
  /** Metadata, labels and helper text. 5.1:1. */
  inkMuted: "#68656E",
  /** The only action colour. 7.9:1, and 8.9:1 with white on top. */
  accent: "#7A2E5C",
  /** Only for what is stopped or under review. 7.2:1, and 8.0:1 with white on top. */
  brake: "#17595B",
  /** Soft separators. */
  line: "#DEDCE3",
  /** Text on accent, brake and inverted surfaces. */
  onDark: "#FFFFFF",
} as const;

/** Not part of the design system; decided in ADR 0008. */
export const statusColor = {
  /** 6.7:1, and 7.5:1 with white on top. */
  error: "#A32036",
  /** 5.3:1, and 5.9:1 with white on top. */
  warning: "#8A5A00",
  /** Ink: a blue would compete with the brake. */
  info: color.ink,
  /** 7.2:1, and 8.0:1 with white on top. */
  success: "#1E5B3A",
} as const;

/** CSS variables published by `next/font` in `fonts.ts`. */
export const fontFamily = {
  /** Oswald 700. Uppercase headlines. */
  condensed: "var(--font-oswald), 'Arial Narrow', Impact, sans-serif",
  /** Fira Sans 400/600/700. Body copy and figures. */
  body: "var(--font-fira-sans), ui-sans-serif, system-ui, sans-serif",
} as const;

/** Multipliers of MUI's 8 px spacing unit: 8 · 16 · 32 · 56 · 96 px. */
export const space = {
  /** 8 px */
  xs: 1,
  /** 16 px */
  sm: 2,
  /** 32 px */
  md: 4,
  /** 56 px */
  lg: 7,
  /** 96 px */
  xl: 12,
} as const;

/** Structural measurements, exposed as `theme.system`. */
export const structure = {
  /** The only border width. There are no 1 px borders. */
  borderWidth: 2,
  cardRibbonHeight: 14,
  pageRibbonHeight: 22,
  /** Minimum height of any interactive control. */
  controlHeight: 52,
  contentWidth: 1240,
  focusRingWidth: 3,
} as const;

/**
 * Kept as data rather than inline in `createTheme` so it can be read back.
 *
 * Headline line height is 1.06, not the system's 0.98: at 0.98 Oswald clips
 * the diacritics of uppercase Spanish (ÁYUDA, PEQUEÑA) against the line above.
 */
export const typeScale = {
  h1: {
    family: "condensed",
    weight: 700,
    size: "clamp(3rem, 7.5vw, 6rem)",
    lineHeight: 1.06,
    uppercase: true,
  },
  h2: {
    family: "condensed",
    weight: 700,
    size: "clamp(2.25rem, 4.5vw, 3.5rem)",
    lineHeight: 1.06,
    uppercase: true,
  },
  h3: {
    family: "condensed",
    weight: 700,
    size: "clamp(1.625rem, 2.4vw, 2rem)",
    lineHeight: 1.06,
    uppercase: true,
  },
  // h4-h6 are paragraph-level subheadings, not headlines, so they stay in the
  // body family and in sentence case.
  h4: {
    family: "body",
    weight: 700,
    size: "1.375rem",
    lineHeight: 1.25,
    uppercase: false,
  },
  h5: {
    family: "body",
    weight: 700,
    size: "1.125rem",
    lineHeight: 1.3,
    uppercase: false,
  },
  h6: {
    family: "body",
    weight: 700,
    size: "1.0625rem",
    lineHeight: 1.35,
    uppercase: false,
  },
  subtitle1: {
    family: "body",
    weight: 400,
    size: "1.3125rem",
    lineHeight: 1.45,
    uppercase: false,
  },
  subtitle2: {
    family: "body",
    weight: 600,
    size: "0.9375rem",
    lineHeight: 1.4,
    uppercase: false,
  },
  body1: {
    family: "body",
    weight: 400,
    size: "1.0625rem",
    lineHeight: 1.55,
    uppercase: false,
  },
  body2: {
    family: "body",
    weight: 400,
    size: "1rem",
    lineHeight: 1.55,
    uppercase: false,
  },
  caption: {
    family: "body",
    weight: 400,
    size: "0.8125rem",
    lineHeight: 1.45,
    uppercase: false,
  },
  // 15 px of text plus 15 px padding top and bottom plus the 2 px rule on each
  // side is exactly the 52 px control height. MUI's default 1.75 would push
  // every button to 60 px.
  button: {
    family: "body",
    weight: 700,
    size: "0.9375rem",
    lineHeight: 1.2,
    uppercase: true,
  },
  overline: {
    family: "body",
    weight: 700,
    size: "0.75rem",
    lineHeight: 1.4,
    uppercase: true,
  },
} as const;

export type TypeScaleVariant = keyof typeof typeScale;

export const FAMILY_NAME = {
  condensed: "Oswald",
  body: "Fira Sans",
} as const;
