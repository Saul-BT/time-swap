import {
  type ApproximateLocation,
  type AvailabilityCell,
  type Modality,
  type Profile,
  REVEAL_ORDER,
  type RevealableField,
  type RevealMoment,
} from "@/data/types";

/**
 * What a viewer at a given moment is allowed to see. The API applies the same
 * rule server-side (issue #5); this one only shapes the sample data.
 */
export type PublicProfile = {
  userId: string;
  displayName: string;
  initials: string;
  pronouns: string;
  modalities: readonly Modality[];
  district: string | null;
  bio: string | null;
  skills: readonly string[] | null;
  interests: readonly string[] | null;
  availability: readonly AvailabilityCell[] | null;
  neighborhood: string | null;
};

type ZoneLookup = (
  location: ApproximateLocation,
) => { district: string; neighborhood: string } | undefined;

export function canSee(
  viewer: RevealMoment,
  reveal: Record<RevealableField, RevealMoment>,
  field: RevealableField,
): boolean {
  return REVEAL_ORDER.indexOf(viewer) >= REVEAL_ORDER.indexOf(reveal[field]);
}

export function toPublicProfile(
  profile: Profile,
  viewer: RevealMoment,
  lookupZone: ZoneLookup,
): PublicProfile {
  const { reveal, visibleToVisitors } = profile.privacySettings;
  // A profile closed to visitors treats a visitor like nobody: nothing optional.
  const effective: RevealMoment =
    viewer === "visitor" && !visibleToVisitors ? "visitor" : viewer;
  const show = (field: RevealableField) =>
    !(viewer === "visitor" && !visibleToVisitors) &&
    canSee(effective, reveal, field);
  const zone = profile.approximateLocation
    ? lookupZone(profile.approximateLocation)
    : undefined;
  const precision = profile.approximateLocation?.precision;

  return {
    userId: profile.userId,
    displayName: profile.displayName,
    initials: profile.initials,
    pronouns: profile.pronouns,
    modalities: profile.modalities,
    district: zone && precision !== "city" ? zone.district : null,
    bio: show("bio") ? profile.bio : null,
    skills: show("skills") ? profile.skills : null,
    interests: show("interests") ? profile.interests : null,
    availability: show("availability") ? profile.availability : null,
    neighborhood:
      zone && precision === "neighborhood" && show("neighborhood")
        ? zone.neighborhood
        : null,
  };
}
