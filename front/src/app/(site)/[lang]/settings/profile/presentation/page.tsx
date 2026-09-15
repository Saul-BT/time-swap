import type { Metadata } from "next";
import PanelHeader from "@/components/settings/PanelHeader";
import PresentationForm from "@/components/settings/PresentationForm";
import { revealAnchor } from "@/data/settings";
import { panelMetadata } from "@/lib/settings/metadata";
import { getPanelContext, getRevealCopy } from "@/lib/settings/panel";
import { savePresentation } from "./actions";

const SECTION = "presentation";

export function generateMetadata(): Promise<Metadata> {
  return panelMetadata(SECTION);
}

export default async function PresentationPage() {
  const { settings, profile, chrome, titleId } = await getPanelContext(SECTION);
  const { presentation } = settings;

  return (
    <>
      <PanelHeader
        titleId={titleId}
        step={chrome.step}
        title={chrome.title}
        lead={presentation.lead}
      />
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
    </>
  );
}
