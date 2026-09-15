import type { LinkTarget } from "@/i18n/routes";
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
  /** Resolved per locale with `localizePath`. */
  target: LinkTarget;
};

export type FooterLink = {
  id: FooterLinkId;
  href: string;
};

export type SignInErrorId = keyof Dictionary["signIn"]["errors"];

export type SettingsSectionId = keyof Dictionary["settings"]["sections"];

export type AccountNavId = Exclude<
  keyof Dictionary["settings"]["account"],
  "label"
>;

export type AccountNavLink = {
  id: AccountNavId;
  target: LinkTarget;
};

/** Completion of a settings section, as the API reports it (issue #5). */
export type SectionStatus = "done" | "review" | "missing";

export type CompletionStatus = {
  sections: Record<SettingsSectionId, SectionStatus>;
  canPublish: boolean;
};

/** Moments at which a profile field becomes visible, in order (ADR 0013). */
export type RevealMoment = keyof Dictionary["settings"]["reveal"]["hint"];

export const REVEAL_ORDER: readonly RevealMoment[] = [
  "visitor",
  "member",
  "contact",
  "agreement",
];

export type RevealableField =
  | "bio"
  | "skills"
  | "interests"
  | "availability"
  | "neighborhood";

export type Modality = keyof Dictionary["settings"]["zone"]["modality"];

export type Weekday = keyof Dictionary["settings"]["availability"]["days"];

export type DaySlot = keyof Dictionary["settings"]["availability"]["slots"];

export type AvailabilityCell = `${Weekday}.${DaySlot}`;

export type ZonePrecision = keyof Dictionary["settings"]["zone"]["precision"];

/** `name` is catalogue content, not copy: it is not translated. */
export type CatalogEntry = {
  id: string;
  name: string;
};

export type Zone = {
  id: string;
  city: string;
  district: string;
  neighborhood: string;
  /** Centre of the neighbourhood. Never a member's address. */
  center: { lat: number; lng: number };
};

export type PrivacySettings = {
  visibleToVisitors: boolean;
  searchable: boolean;
  reveal: Record<RevealableField, RevealMoment>;
};

export type ApproximateLocation = {
  zoneId: string;
  precision: ZonePrecision;
};

export type Profile = {
  userId: string;
  displayName: string;
  initials: string;
  pronouns: string;
  bio: string;
  /** Catalogue ids. */
  skills: readonly string[];
  interests: readonly string[];
  modalities: readonly Modality[];
  availability: readonly AvailabilityCell[];
  approximateLocation: ApproximateLocation | null;
  privacySettings: PrivacySettings;
};

export type PresentationErrorId =
  keyof Dictionary["settings"]["presentation"]["errors"];
export type SkillsErrorId = keyof Dictionary["settings"]["skills"]["errors"];
export type ZoneErrorId = keyof Dictionary["settings"]["zone"]["errors"];
