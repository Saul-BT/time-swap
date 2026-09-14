import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import type { Member } from "@/data/types";
import { getDictionary } from "@/i18n/dictionary";
import { interpolate } from "@/lib/i18n/interpolate";
import SkillChipList from "../../ui/SkillChipList";
import {
  MemberCardAvatar,
  MemberCardIdentity,
  MemberCardQuote,
  MemberCardRoot,
} from "./MemberCard.style";
import { memberCardClasses } from "./MemberCard.util";

/** Name, context and quote are member-written text, so they are not translated. */
export default async function MemberCard({ member }: { member: Member }) {
  const { members } = await getDictionary();

  return (
    <MemberCardRoot className={memberCardClasses.root} component="figure">
      <MemberCardIdentity
        className={memberCardClasses.identity}
        direction="row"
        spacing={2}
      >
        <MemberCardAvatar className={memberCardClasses.avatar} aria-hidden>
          {member.initial}
        </MemberCardAvatar>
        <Box>
          <Typography variant="h6" component="p">
            {member.name}
          </Typography>
          <Typography variant="caption" color="textSecondary">
            {member.context}
          </Typography>
        </Box>
      </MemberCardIdentity>

      <MemberCardQuote className={memberCardClasses.quote}>
        «{member.quote}»
      </MemberCardQuote>

      <Box component="figcaption">
        <SkillChipList
          compact
          label={interpolate(members.skillsLabel, { name: member.name })}
          items={member.skills}
        />
      </Box>
    </MemberCardRoot>
  );
}
