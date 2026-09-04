import type { FooterLink, NavigationLink } from "./types";

/** Anchors within the landing, the only page for now. */
export const SECTION_ID = {
  listings: "anuncios",
  howItWorks: "como-funciona",
  signUp: "acceso",
} as const;

export const HEADER_LINKS: readonly NavigationLink[] = [
  { id: "listings", href: `#${SECTION_ID.listings}` },
  { id: "howItWorks", href: `#${SECTION_ID.howItWorks}` },
  { id: "signIn", href: `#${SECTION_ID.signUp}` },
];

export const FOOTER_LINKS: readonly FooterLink[] = [
  { id: "codeOfConduct", href: "#" },
  { id: "privacy", href: "#" },
  { id: "terms", href: "#" },
];
