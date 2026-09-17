import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import type { Member } from "@/data/types";
import { getDictionary, getLocale } from "@/i18n/dictionary";
import { interpolate } from "@/lib/i18n/interpolate";
import SkillChipList from "@/components/ui/SkillChipList";
import {
  MemberProfileActions,
  MemberProfileAvatar,
  MemberProfileIdentity,
  MemberProfileQuote,
  MemberProfileRoot,
} from "./MemberProfile.style";
import { memberProfileClasses } from "./MemberProfile.util";

export default async function MemberProfile({ member }: { member: Member }) {
  const { profile } = await getDictionary();
  const locale = await getLocale();

  return (
    <MemberProfileRoot
      className={memberProfileClasses.root}
      component="article"
    >
      <MemberProfileIdentity
        className={memberProfileClasses.identity}
        direction="row"
        spacing={2}
      >
        <MemberProfileAvatar
          className={memberProfileClasses.avatar}
          aria-hidden
        >
          {member.initial}
        </MemberProfileAvatar>
        <Box>
          <Typography variant="h5" component="h1">
            {member.name}
          </Typography>
          <Typography variant="body2" color="textSecondary">
            {member.context}
          </Typography>
        </Box>
      </MemberProfileIdentity>

      <MemberProfileQuote className={memberProfileClasses.quote}>
        «{member.quote}»
      </MemberProfileQuote>

      <MemberProfileActions className={memberProfileClasses.actions}>
        <SkillChipList
          label={interpolate(profile.skillsLabel, { name: member.name })}
          items={member.skills}
        />
        <Button href={`/${locale}`} variant="outlined">
          {profile.backLink}
        </Button>
      </MemberProfileActions>
    </MemberProfileRoot>
  );
}