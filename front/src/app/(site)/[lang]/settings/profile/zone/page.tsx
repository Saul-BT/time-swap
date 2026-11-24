import type { Metadata } from "next";
import SectionPanel from "@/components/settings/SectionPanel";
import ZoneForm from "@/components/settings/ZoneForm";
import { revealAnchor } from "@/data/settings";
import { ZONES } from "@/data/zones";
import { getProfile } from "@/lib/api/profile";
import { panelMetadata } from "@/lib/settings/metadata";
import {
  getPanelContext,
  getRevealCopy,
  type PanelContext,
} from "@/lib/settings/panel";
import { saveZone } from "./actions";

const SECTION = "zone";

export function generateMetadata(): Promise<Metadata> {
  return panelMetadata(SECTION);
}

export default async function ZonePage() {
  const context = await getPanelContext(SECTION);

  return (
    <SectionPanel context={context} lead={context.settings.zone.lead}>
      <ZonePanel {...context} />
    </SectionPanel>
  );
}

async function ZonePanel({ settings, chrome, titleId }: PanelContext) {
  const profile = await getProfile();
  const { zone } = settings;

  return (
    <ZoneForm
      action={saveZone}
      titleId={titleId}
      revealId={revealAnchor("neighborhood")}
      zones={ZONES}
      initial={{
        modalities: [...profile.modalities],
        zoneId: profile.approximateLocation?.zoneId ?? null,
        precision: profile.approximateLocation?.precision ?? "district",
        reveal: profile.privacySettings.reveal.neighborhood,
      }}
      nextHref={chrome.nextHref}
      copy={{
        modalityLegend: zone.modalityLegend,
        modalityHint: zone.modalityHint,
        modality: zone.modality,
        picker: {
          emptyTitle: zone.emptyTitle,
          emptyBody: zone.emptyBody,
          pick: zone.pick,
          approximate: zone.approximate,
          approximating: zone.approximating,
          deniedTitle: zone.deniedTitle,
          deniedBody: zone.deniedBody,
          unsupportedTitle: zone.unsupportedTitle,
          unsupportedBody: zone.unsupportedBody,
          pickerLabel: zone.pickerLabel,
          pickerPlaceholder: zone.pickerPlaceholder,
          noMatch: zone.noMatch,
          currentTitle: zone.currentTitle,
          current: zone.current,
          change: zone.change,
        },
        precisionLegend: zone.precisionLegend,
        precisionHint: zone.precisionHint,
        precision: zone.precision,
        revealHint: zone.revealHint,
        errors: zone.errors,
        reveal: getRevealCopy(settings, zone.field),
        footer: chrome.footer,
        serverError: chrome.serverError,
      }}
    />
  );
}
