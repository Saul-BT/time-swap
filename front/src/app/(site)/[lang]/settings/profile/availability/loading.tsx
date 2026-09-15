import PanelSkeleton from "@/components/settings/PanelSkeleton";
import { getDictionary } from "@/i18n/dictionary";

export default async function AvailabilityLoading() {
  const { settings } = await getDictionary();

  return <PanelSkeleton rows={4} label={settings.sections.availability} />;
}
