import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { MapPin, Users, Wifi } from "lucide-react";
import {
  findCatalogEntry,
  INTERESTS_CATALOG,
  SKILLS_CATALOG,
} from "@/data/catalog";
import { DAY_SLOTS, WEEKDAYS } from "@/data/settings";
import type { Modality } from "@/data/types";
import { getDictionary, getLocale } from "@/i18n/dictionary";
import { localizePath } from "@/i18n/routes";
import { interpolate } from "@/lib/i18n/interpolate";
import type { PublicProfile as PublicProfileData } from "@/lib/profile/publicView";
import Eyebrow from "../../ui/Eyebrow";
import Icon from "../../ui/Icon";
import SkillChipList from "../../ui/SkillChipList";
import {
  PublicProfileAvailability,
  PublicProfileHead,
  PublicProfileHidden,
  PublicProfileMeta,
  PublicProfileNotice,
  PublicProfileOwn,
  PublicProfileRoot,
  PublicProfileSection,
} from "./PublicProfile.style";
import { publicProfileClasses } from "./PublicProfile.util";

export type PublicProfileProps = {
  profile: PublicProfileData;
  /** True when the viewer is looking at their own profile. */
  own: boolean;
};

const MODALITY_ICON: Record<Modality, typeof Users> = {
  in_person: Users,
  remote: Wifi,
};

/** A member as other people see them. Hidden fields say so instead of vanishing. */
export default async function PublicProfile({
  profile,
  own,
}: PublicProfileProps) {
  const { memberProfile, settings } = await getDictionary();
  const locale = await getLocale();
  const names = (ids: readonly string[], catalog: typeof SKILLS_CATALOG) =>
    ids
      .map((id) => findCatalogEntry(catalog, id)?.name)
      .filter((name): name is string => Boolean(name));
  const zone = [profile.neighborhood, profile.district]
    .filter(Boolean)
    .join(", ");

  const slots = DAY_SLOTS.flatMap((slot) =>
    WEEKDAYS.filter((day) =>
      profile.availability?.includes(`${day}.${slot}`),
    ).map((day) =>
      interpolate(settings.availability.cellLabel, {
        day: settings.availability.daysLong[day],
        slot: settings.availability.slots[slot],
      }),
    ),
  );

  return (
    <PublicProfileRoot className={publicProfileClasses.root}>
      {own ? (
        <PublicProfileOwn className={publicProfileClasses.own}>
          <div>
            <Typography variant="h6" component="p">
              {memberProfile.ownProfileTitle}
            </Typography>
            <Typography variant="body2">
              {memberProfile.ownProfileBody}
            </Typography>
          </div>
          <Button
            variant="outlined"
            href={localizePath(locale, "settingsProfile")}
          >
            {memberProfile.editProfile}
          </Button>
        </PublicProfileOwn>
      ) : null}

      <PublicProfileHead className={publicProfileClasses.head}>
        <Avatar
          className={publicProfileClasses.avatar}
          sx={{ width: 88, height: 88, fontSize: 32 }}
        >
          {profile.initials}
        </Avatar>
        <div className={publicProfileClasses.identity}>
          <Eyebrow>{memberProfile.eyebrow}</Eyebrow>
          <Typography
            className={publicProfileClasses.name}
            variant="h2"
            component="h1"
          >
            {profile.displayName}
          </Typography>
          <PublicProfileMeta className={publicProfileClasses.meta}>
            {profile.pronouns ? <li>{profile.pronouns}</li> : null}
            {profile.modalities.map((modality) => (
              <li key={modality}>
                <Icon icon={MODALITY_ICON[modality]} size="sm" />
                {settings.zone.modality[modality]}
              </li>
            ))}
            {zone ? (
              <li>
                <Icon icon={MapPin} size="sm" />
                {zone}
              </li>
            ) : null}
          </PublicProfileMeta>
        </div>
      </PublicProfileHead>

      {profile.bio ? (
        <Typography className={publicProfileClasses.bio} variant="body1">
          {profile.bio}
        </Typography>
      ) : (
        <PublicProfileHidden className={publicProfileClasses.hidden}>
          {memberProfile.hidden}
        </PublicProfileHidden>
      )}

      <PublicProfileSection className={publicProfileClasses.section}>
        <Typography
          className={publicProfileClasses.sectionTitle}
          variant="h5"
          component="h2"
        >
          {memberProfile.offers}
        </Typography>
        {profile.skills ? (
          <SkillChipList
            items={names(profile.skills, SKILLS_CATALOG)}
            label={memberProfile.offers}
          />
        ) : (
          <PublicProfileHidden className={publicProfileClasses.hidden}>
            {memberProfile.hidden}
          </PublicProfileHidden>
        )}
      </PublicProfileSection>

      <PublicProfileSection className={publicProfileClasses.section}>
        <Typography
          className={publicProfileClasses.sectionTitle}
          variant="h5"
          component="h2"
        >
          {memberProfile.wants}
        </Typography>
        {profile.interests ? (
          <SkillChipList
            items={names(profile.interests, INTERESTS_CATALOG)}
            label={memberProfile.wants}
            compact
          />
        ) : (
          <PublicProfileHidden className={publicProfileClasses.hidden}>
            {memberProfile.hidden}
          </PublicProfileHidden>
        )}
      </PublicProfileSection>

      <PublicProfileSection className={publicProfileClasses.section}>
        <Typography
          className={publicProfileClasses.sectionTitle}
          variant="h5"
          component="h2"
        >
          {memberProfile.availability}
        </Typography>
        {profile.availability ? (
          <PublicProfileAvailability
            className={publicProfileClasses.availability}
            aria-label={memberProfile.availability}
          >
            {slots.map((slot) => (
              <li key={slot}>{slot}</li>
            ))}
          </PublicProfileAvailability>
        ) : (
          <PublicProfileHidden className={publicProfileClasses.hidden}>
            {memberProfile.hidden}
          </PublicProfileHidden>
        )}
      </PublicProfileSection>

      <PublicProfileNotice className={publicProfileClasses.notice}>
        {memberProfile.contactNotice}
      </PublicProfileNotice>
    </PublicProfileRoot>
  );
}
