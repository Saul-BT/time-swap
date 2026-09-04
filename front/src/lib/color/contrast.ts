/** WCAG 2.x contrast, computed so a changed token cannot keep a stale ratio. */

function channelLuminance(channel: number): number {
  const value = channel / 255;
  return value <= 0.03928 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
}

/** Relative luminance of a `#rrggbb` colour. */
export function relativeLuminance(hex: string): number {
  const value = hex.replace("#", "");
  const [r, g, b] = [0, 2, 4].map((offset) =>
    Number.parseInt(value.slice(offset, offset + 2), 16),
  );

  return (
    0.2126 * channelLuminance(r) +
    0.7152 * channelLuminance(g) +
    0.0722 * channelLuminance(b)
  );
}

/** Contrast ratio between two `#rrggbb` colours, from 1 to 21. */
export function contrastRatio(foreground: string, background: string): number {
  const a = relativeLuminance(foreground);
  const b = relativeLuminance(background);
  const [lighter, darker] = a > b ? [a, b] : [b, a];

  return (lighter + 0.05) / (darker + 0.05);
}

/**
 * @example
 * formatContrastRatio(7.94, "es"); // "7,9:1"
 * formatContrastRatio(7.94, "en"); // "7.9:1"
 */
export function formatContrastRatio(ratio: number, locale: string): string {
  return `${ratio.toLocaleString(locale, {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  })}:1`;
}
