import type { Metadata } from "next";
import PanelHeader from "@/components/settings/PanelHeader";
import SkillsForm from "@/components/settings/SkillsForm";
import { INTERESTS_CATALOG, SKILLS_CATALOG } from "@/data/catalog";
import { revealAnchor } from "@/data/settings";
import { panelMetadata } from "@/lib/settings/metadata";
import { getPanelContext, getRevealCopy } from "@/lib/settings/panel";
import { saveSkills } from "./actions";

const SECTION = "skills";

export function generateMetadata(): Promise<Metadata> {
  return panelMetadata(SECTION);
}

export default async function SkillsPage() {
  const { settings, profile, chrome, titleId } = await getPanelContext(SECTION);
  const { skills } = settings;

  return (
    <>
      <PanelHeader
        titleId={titleId}
        step={chrome.step}
        title={chrome.title}
        lead={skills.lead}
      />
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
    </>
  );
}
