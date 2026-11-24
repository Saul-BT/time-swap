import PanelSkeleton from "@/components/settings/PanelSkeleton";
import { PANEL_SKELETON_ROWS } from "@/data/settings";
import { getDictionary } from "@/i18n/dictionary";

export default async function SkillsLoading() {
  const { settings } = await getDictionary();

  return (
    <PanelSkeleton
      rows={PANEL_SKELETON_ROWS.skills}
      label={settings.sections.skills}
    />
  );
}
