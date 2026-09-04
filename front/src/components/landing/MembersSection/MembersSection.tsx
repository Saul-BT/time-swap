import { MEMBERS } from "@/data/members";
import { getDictionary } from "@/i18n/dictionary";
import Section from "../../layout/Section";
import SectionHeader from "../../ui/SectionHeader";
import MemberCard from "../MemberCard";
import { MembersSectionGrid, MembersSectionItem } from "./MembersSection.style";
import { membersSectionClasses } from "./MembersSection.util";

export default async function MembersSection() {
  const { members, common } = await getDictionary();

  return (
    <Section tone="framed">
      <SectionHeader title={members.title} note={common.sampleContent} />
      <MembersSectionGrid className={membersSectionClasses.grid}>
        {MEMBERS.map((member) => (
          <MembersSectionItem
            className={membersSectionClasses.item}
            key={member.id}
          >
            <MemberCard member={member} />
          </MembersSectionItem>
        ))}
      </MembersSectionGrid>
    </Section>
  );
}
