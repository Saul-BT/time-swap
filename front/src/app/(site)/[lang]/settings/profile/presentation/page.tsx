import type { Metadata } from "next";
import PresentationForm from "@/components/settings/PresentationForm";
import SectionPanel from "@/components/settings/SectionPanel";
import { revealAnchor } from "@/data/settings";
import { getProfile } from "@/lib/api/profile";
import { panelMetadata } from "@/lib/settings/metadata";
import {
  getPanelContext,
  getRevealCopy,
  type PanelContext,
} from "@/lib/settings/panel";
import { savePresentation } from "./actions";

const SECTION = "presentation";

export function generateMetadata(): Promise<Metadata> {
  return panelMetadata(SECTION);
}

export default async function PresentationPage() {
  const context = await getPanelContext(SECTION);

  return (
    <SectionPanel context={context} lead={context.settings.presentation.lead}>
      <PresentationPanel {...context} />
    </SectionPanel>
  );
}

async function PresentationPanel({ settings, chrome, titleId }: PanelContext) {
  const profile = await getProfile();
  const { presentation } = settings;

  return (
    <PresentationForm
      action={savePresentation}
      titleId={titleId}
      revealId={revealAnchor("bio")}
      initials={profile.initials}
      initial={{
        displayName: profile.displayName,
        pronouns: profile.pronouns,
        bio: profile.bio,
        reveal: profile.privacySettings.reveal.bio,
      }}
      nextHref={chrome.nextHref}
      copy={{
        photo: presentation.photo,
        changePhoto: presentation.changePhoto,
        displayName: presentation.displayName,
        displayNameHint: presentation.displayNameHint,
        pronouns: presentation.pronouns,
        optional: presentation.optional,
        pronounsPlaceholder: presentation.pronounsPlaceholder,
        bio: presentation.bio,
        counter: presentation.counter,
        errors: presentation.errors,
        reveal: getRevealCopy(settings, presentation.bioField),
        footer: chrome.footer,
        serverError: chrome.serverError,
      }}
    />
  );
}
