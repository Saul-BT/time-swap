import type { Metadata } from "next";
import { PROFILE_SECTIONS, SECTION_ROUTE } from "@/data/settings";
import type { SettingsSectionId } from "@/data/types";
import { getDictionary, getLocale } from "@/i18n/dictionary";
import { localizePath, routeAlternates } from "@/i18n/routes";

export async function panelMetadata(
  section: SettingsSectionId,
): Promise<Metadata> {
  const { settings } = await getDictionary();
  const locale = await getLocale();
  const { metadata, sections } = settings;

  return {
    title: PROFILE_SECTIONS.includes(section)
      ? `${sections[section]} · ${metadata.profileTitle}`
      : metadata.privacyTitle,
    description: metadata.description,
    alternates: {
      canonical: localizePath(locale, SECTION_ROUTE[section]),
      languages: routeAlternates(SECTION_ROUTE[section]),
    },
  };
}
