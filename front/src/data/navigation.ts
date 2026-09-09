import type { FooterLink, NavigationLink } from "./types";

/** Anchors within the landing. */
export const SECTION_ID = {
  listings: "anuncios",
  howItWorks: "como-funciona",
  signUp: "acceso",
} as const;

// FIXME(i18n): replaced by `ROUTES` in `src/i18n/routes.ts` (from #20).
export const PATH = {
  loggedHome: "/inicio",
  listings: "/anuncios",
  createAd: "/anuncios/nuevo",
  listingDetail: (id: string) => `/anuncios/${id}`,
} as const;

export const HEADER_LINKS: readonly NavigationLink[] = [
  { id: "listings", target: `#${SECTION_ID.listings}` },
  { id: "howItWorks", target: `#${SECTION_ID.howItWorks}` },
  { id: "signIn", target: "signIn" },
];

// TODO(content): dead "#" links. Point each one at its route once the legal
// pages exist, and move them to `ROUTES` so they localize like the rest.
export const FOOTER_LINKS: readonly FooterLink[] = [
  { id: "codeOfConduct", href: "#" },
  { id: "privacy", href: "#" },
  { id: "terms", href: "#" },
];
