import type { RouteId } from "@/i18n/routes";
import type {
  AccountNavLink,
  DaySlot,
  RevealableField,
  SettingsSectionId,
  Weekday,
} from "./types";

/** Order of the five sections: the meter, the tabs and «Siguiente» follow it. */
export const SETTINGS_SECTIONS: readonly SettingsSectionId[] = [
  "presentation",
  "skills",
  "availability",
  "zone",
  "privacy",
];

/** Privacy sits beside the profile, not under it: its metadata stands alone. */
export const PROFILE_SECTIONS: readonly SettingsSectionId[] =
  SETTINGS_SECTIONS.filter((section) => section !== "privacy");

export const SECTION_ROUTE: Record<SettingsSectionId, RouteId> = {
  presentation: "settingsProfilePresentation",
  skills: "settingsProfileSkills",
  availability: "settingsProfileAvailability",
  zone: "settingsProfileZone",
  privacy: "settingsPrivacy",
};

export const BIO_MAX_LENGTH = 600;

export const DISPLAY_NAME_MAX_LENGTH = 60;

export const WEEKDAYS: readonly Weekday[] = [
  "mon",
  "tue",
  "wed",
  "thu",
  "fri",
  "sat",
  "sun",
];

export const DAY_SLOTS: readonly DaySlot[] = [
  "morning",
  "afternoon",
  "evening",
];

/** Rows of the visibility matrix that a member can change, in display order. */
export const REVEALABLE_FIELDS: readonly RevealableField[] = [
  "bio",
  "skills",
  "interests",
  "availability",
  "neighborhood",
];

/** Fragment of the section URL that points at the field's reveal ladder. */
export function revealAnchor(field: RevealableField): string {
  return `reveal-${field}`;
}

export const REVEAL_FIELD_SECTION: Record<RevealableField, SettingsSectionId> =
  {
    bio: "presentation",
    skills: "skills",
    interests: "skills",
    availability: "availability",
    neighborhood: "zone",
  };

/** Suggestions shown under each catalogue picker before any search. */
export const SUGGESTION_COUNT = 3;

// TODO(routes): notifications, wallet and listings point nowhere until their
// screens exist. Move each one to `ROUTES` when it does.
export const ACCOUNT_NAV: readonly AccountNavLink[] = [
  { id: "profile", target: "settingsProfile" },
  { id: "notifications", target: "#" },
  { id: "wallet", target: "#" },
  { id: "listings", target: "#" },
];
