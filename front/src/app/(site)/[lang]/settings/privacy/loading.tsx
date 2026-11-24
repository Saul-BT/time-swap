import PanelSkeleton from "@/components/settings/PanelSkeleton";
import { PANEL_SKELETON_ROWS } from "@/data/settings";
import { getDictionary } from "@/i18n/dictionary";

export default async function PrivacyLoading() {
  const { settings } = await getDictionary();

  return (
    <PanelSkeleton
      rows={PANEL_SKELETON_ROWS.privacy}
      label={settings.sections.privacy}
    />
  );
}
