import type { LinkTarget } from "@/i18n/routes";
import type { FooterLink, MemberNavId, NavigationLink } from "./types";

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

// TODO(content): dead "#" links. Point each one at its route once the legal
// pages exist, and move them to `ROUTES` so they localize like the rest.
export const FOOTER_LINKS: readonly FooterLink[] = [
  { id: "codeOfConduct", href: "#" },
  { id: "privacy", href: "#" },
  { id: "terms", href: "#" },
];

// TODO(routes): messages and profile have no page yet. Point them at their
// `ROUTES` entries once the chat and profile screens land.
export const MEMBER_NAV_TARGET: Record<MemberNavId, LinkTarget> = {
  home: "loggedHome",
  discover: "listings",
  publish: "createAd",
  messages: "#",
  profile: "#",
};

/** Tab order on phones. */
export const MEMBER_NAV_IDS: readonly MemberNavId[] = [
  "home",
  "discover",
  "publish",
  "messages",
  "profile",
];
