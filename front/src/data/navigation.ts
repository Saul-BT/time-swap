import type { FooterLink, NavigationLink } from "./types";

/** Anchors within the landing. */
export const SECTION_ID = {
  listings: "anuncios",
  howItWorks: "como-funciona",
  signUp: "acceso",
} as const;

/**
 * Paths under `/[lang]`. Temporary until auth and the member API exist.
 */
export const PATH = {
  loggedHome: "/inicio",
  createAd: "/anuncios/nuevo",
} as const;

export const HEADER_LINKS: readonly NavigationLink[] = [
  { id: "listings", href: `#${SECTION_ID.listings}` },
  { id: "howItWorks", href: `#${SECTION_ID.howItWorks}` },
  { id: "signIn", href: PATH.loggedHome },
];

export const FOOTER_LINKS: readonly FooterLink[] = [
  { id: "codeOfConduct", href: "#" },
  { id: "privacy", href: "#" },
  { id: "terms", href: "#" },
];
