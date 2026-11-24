import type { Metadata } from "next";
import AvailabilityForm from "@/components/settings/AvailabilityForm";
import SectionPanel from "@/components/settings/SectionPanel";
import { revealAnchor } from "@/data/settings";
import { getProfile } from "@/lib/api/profile";
import { panelMetadata } from "@/lib/settings/metadata";
import {
  getPanelContext,
  getRevealCopy,
  type PanelContext,
} from "@/lib/settings/panel";
import { saveAvailability } from "./actions";

const SECTION = "availability";

export function generateMetadata(): Promise<Metadata> {
  return panelMetadata(SECTION);
}

export default async function AvailabilityPage() {
  const context = await getPanelContext(SECTION);

  return (
    <SectionPanel context={context} lead={context.settings.availability.lead}>
      <AvailabilityPanel {...context} />
    </SectionPanel>
  );
}

async function AvailabilityPanel({ settings, chrome, titleId }: PanelContext) {
  const profile = await getProfile();
  const { availability } = settings;

  return (
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
  );
}
