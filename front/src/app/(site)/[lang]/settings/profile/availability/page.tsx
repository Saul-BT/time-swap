import type { Metadata } from "next";
import AvailabilityForm from "@/components/settings/AvailabilityForm";
import PanelHeader from "@/components/settings/PanelHeader";
import { revealAnchor } from "@/data/settings";
import { panelMetadata } from "@/lib/settings/metadata";
import { getPanelContext, getRevealCopy } from "@/lib/settings/panel";
import { saveAvailability } from "./actions";

const SECTION = "availability";

export function generateMetadata(): Promise<Metadata> {
  return panelMetadata(SECTION);
}

export default async function AvailabilityPage() {
  const { settings, profile, chrome, titleId } = await getPanelContext(SECTION);
  const { availability } = settings;

  return (
    <>
      <PanelHeader
        titleId={titleId}
        step={chrome.step}
        title={chrome.title}
        lead={availability.lead}
      />
      <AvailabilityForm
        action={saveAvailability}
        titleId={titleId}
        revealId={revealAnchor("availability")}
        initial={{
          availability: [...profile.availability],
          reveal: profile.privacySettings.reveal.availability,
        }}
        nextHref={chrome.nextHref}
        copy={{
          hint: availability.hint,
          grid: {
            label: availability.gridLabel,
            days: availability.days,
            daysLong: availability.daysLong,
            slots: availability.slots,
            cellLabel: availability.cellLabel,
          },
          reveal: getRevealCopy(settings, availability.field),
          footer: chrome.footer,
          serverError: chrome.serverError,
        }}
      />
    </>
  );
}
