import PanelSkeleton from "@/components/settings/PanelSkeleton";
import { getDictionary } from "@/i18n/dictionary";

export default async function PrivacyLoading() {
  const { settings } = await getDictionary();

  return <PanelSkeleton rows={5} label={settings.sections.privacy} />;
}
