import type { Metadata } from "next";
import PanelHeader from "@/components/settings/PanelHeader";
import PrivacyForm from "@/components/settings/PrivacyForm";
import VisibilityMatrix from "@/components/settings/VisibilityMatrix";
import { panelMetadata } from "@/lib/settings/metadata";
import {
  getPanelContext,
  getRevealEditHref,
  getRevealMoments,
  getRevealMomentsShort,
} from "@/lib/settings/panel";
import { savePrivacy } from "./actions";

const SECTION = "privacy";

export function generateMetadata(): Promise<Metadata> {
  return panelMetadata(SECTION);
}

export default async function PrivacyPage() {
  const { settings, locale, profile, chrome, titleId } =
    await getPanelContext(SECTION);
  const { privacy } = settings;

  return (
    <>
      <PanelHeader
        titleId={titleId}
        step={chrome.step}
        title={chrome.title}
        lead={privacy.lead}
      />
      <PrivacyForm
        action={savePrivacy}
        titleId={titleId}
        initial={{
          visibleToVisitors: profile.privacySettings.visibleToVisitors,
          searchable: profile.privacySettings.searchable,
        }}
        matrix={
          <VisibilityMatrix
            value={{ ...profile.privacySettings.reveal }}
            editHref={getRevealEditHref(locale)}
            copy={{
              label: privacy.matrixTitle,
              dataHeader: privacy.dataHeader,
              moments: getRevealMoments(settings),
              momentsShort: getRevealMomentsShort(settings),
              rows: privacy.rows,
              fixed: privacy.fixed,
              never: privacy.never,
              cellLabel: privacy.cellLabel,
              change: privacy.change,
              footnote: privacy.footnote,
            }}
          />
        }
        nextHref={chrome.nextHref}
        copy={{
          now: privacy.now,
          visibleToVisitors: privacy.visibleToVisitors,
          searchable: privacy.searchable,
          matrixTitle: privacy.matrixTitle,
          matrixHint: privacy.matrixHint,
          footer: chrome.footer,
          serverError: chrome.serverError,
        }}
      />
    </>
  );
}
