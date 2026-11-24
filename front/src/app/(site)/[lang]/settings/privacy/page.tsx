import type { Metadata } from "next";
import PrivacyForm from "@/components/settings/PrivacyForm";
import SectionPanel from "@/components/settings/SectionPanel";
import VisibilityMatrix from "@/components/settings/VisibilityMatrix";
import { getProfile } from "@/lib/api/profile";
import { panelMetadata } from "@/lib/settings/metadata";
import {
  getPanelContext,
  getRevealEditHref,
  getRevealMoments,
  getRevealMomentsShort,
  type PanelContext,
} from "@/lib/settings/panel";
import { savePrivacy } from "./actions";

const SECTION = "privacy";

export function generateMetadata(): Promise<Metadata> {
  return panelMetadata(SECTION);
}

export default async function PrivacyPage() {
  const context = await getPanelContext(SECTION);

  return (
    <SectionPanel context={context} lead={context.settings.privacy.lead}>
      <PrivacyPanel {...context} />
    </SectionPanel>
  );
}

async function PrivacyPanel({
  settings,
  locale,
  chrome,
  titleId,
}: PanelContext) {
  const profile = await getProfile();
  const { privacy } = settings;

  return (
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
  );
}
