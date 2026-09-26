import type { Dictionary } from "@/i18n/types";

/**
 * Ids are derived from the dictionary shape, so an id without a translation,
 * or a translation without an id, fails the build instead of rendering empty.
 */

export type ListingKind = keyof Dictionary["listings"]["kind"];

export type ListingMode = keyof Dictionary["listings"]["mode"];

export type Listing = {
  id: string;
  kind: ListingKind;
  mode: ListingMode;
  /** Author-written text. Not translated. */
  title: string;
  /** Author-written text. Not translated. */
  summary: string;
  byline: string;
  /** Free text such as `"1 h + material"`, not a number. */
  hours: string;
};

/** `label` is the accessible name of the list, not a filter. */
export type FilterId = Exclude<keyof Dictionary["hero"]["filters"], "label">;

export type Filter = {
  id: FilterId;
  active?: boolean;
};

export type CategoryId = keyof Dictionary["categories"]["items"];

export type LedgerFactId = keyof Dictionary["howItWorks"]["facts"];

export type Member = {
  id: string;
  name: string;
  initial: string;
  /** Area and exchange count, as one line. */
  context: string;
  /** Member-written text. Not translated. */
  quote: string;
  skills: readonly string[];
};

export type NavigationLinkId = keyof Dictionary["nav"];
export type FooterLinkId = keyof Dictionary["footer"]["links"];

export type NavigationLink = {
  id: Exclude<NavigationLinkId, "label" | "signUp">;
  href: string;
};

export type FooterLink = {
  id: FooterLinkId;
  href: string;
};

export type ChatMessage = {
  id: string;
  body: string;
  sentAt: string;
  from: "self" | "peer";
};

export type Conversation = {
  id: string;
  peerName: string;
  messages: readonly ChatMessage[];
};
