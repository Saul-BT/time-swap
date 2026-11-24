import type { Metadata } from "next";
import SectionPanel from "@/components/settings/SectionPanel";
import SkillsForm from "@/components/settings/SkillsForm";
import { INTERESTS_CATALOG, SKILLS_CATALOG } from "@/data/catalog";
import { revealAnchor } from "@/data/settings";
import { getProfile } from "@/lib/api/profile";
import { panelMetadata } from "@/lib/settings/metadata";
import {
  getPanelContext,
  getRevealCopy,
  type PanelContext,
} from "@/lib/settings/panel";
import { saveSkills } from "./actions";

const SECTION = "skills";

export function generateMetadata(): Promise<Metadata> {
  return panelMetadata(SECTION);
}

export default async function SkillsPage() {
  const context = await getPanelContext(SECTION);

  return (
    <SectionPanel context={context} lead={context.settings.skills.lead}>
      <SkillsPanel {...context} />
    </SectionPanel>
  );
}

async function SkillsPanel({ settings, chrome, titleId }: PanelContext) {
  const profile = await getProfile();
  const { skills } = settings;

  return (
    <SkillsForm
      action={saveSkills}
      titleId={titleId}
      skillsRevealId={revealAnchor("skills")}
      interestsRevealId={revealAnchor("interests")}
      skillsCatalog={SKILLS_CATALOG}
      interestsCatalog={INTERESTS_CATALOG}
      initial={{
        skills: [...profile.skills],
        interests: [...profile.interests],
        skillsReveal: profile.privacySettings.reveal.skills,
        interestsReveal: profile.privacySettings.reveal.interests,
      }}
      nextHref={chrome.nextHref}
      copy={{
        offerLabel: skills.offerLabel,
        offerHint: skills.offerHint,
        wantLabel: skills.wantLabel,
        wantHint: skills.wantHint,
        emptyOffer: skills.emptyOffer,
        emptyWant: skills.emptyWant,
        picker: {
          search: skills.search,
          selectedLabel: skills.selectedLabel,
          suggestionsLabel: skills.suggestionsLabel,
          add: skills.add,
          remove: skills.remove,
          noMatch: skills.noMatch,
        },
        errors: skills.errors,
        skillsReveal: getRevealCopy(settings, skills.skillsField),
        interestsReveal: getRevealCopy(settings, skills.interestsField),
        footer: chrome.footer,
        serverError: chrome.serverError,
      }}
    />
  );
}
