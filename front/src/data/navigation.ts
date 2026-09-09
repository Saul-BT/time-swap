import type { FooterLink, NavigationLink } from "./types";

/** Anchors within the landing. */
export const SECTION_ID = {
  listings: "anuncios",
  howItWorks: "como-funciona",
  signUp: "acceso",
} as const;

export const HEADER_LINKS: readonly NavigationLink[] = [
  { id: "listings", target: `#${SECTION_ID.listings}` },
  { id: "howItWorks", target: `#${SECTION_ID.howItWorks}` },
  { id: "signIn", target: "signIn" },
];

export const FOOTER_LINKS: readonly FooterLink[] = [
  { id: "codeOfConduct", href: "#" },
  { id: "privacy", href: "#" },
  { id: "terms", href: "#" },
];
