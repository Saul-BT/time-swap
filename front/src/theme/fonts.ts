import { Fira_Sans, Oswald } from "next/font/google";

/**
 * Declared once: `next/font` runs at module scope, and a second declaration
 * elsewhere would fetch and inline the same faces twice.
 */
const oswald = Oswald({
  weight: ["700"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-oswald",
});

const firaSans = Fira_Sans({
  weight: ["400", "600", "700"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-fira-sans",
});

/** Class names for `<html>`; they publish the CSS variables the theme reads. */
export const fontVariables = `${oswald.variable} ${firaSans.variable}`;
