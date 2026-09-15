import type { Metadata } from "next";
import { getDictionary, getLocale } from "@/i18n/dictionary";
import { localizePath, routeAlternates } from "@/i18n/routes";

export async function generateMetadata(): Promise<Metadata> {
  const { settings } = await getDictionary();
  const locale = await getLocale();

  return {
    title: settings.metadata.profileTitle,
    description: settings.metadata.description,
    alternates: {
      canonical: localizePath(locale, "settingsProfile"),
      languages: routeAlternates("settingsProfile"),
    },
  };
}

/** The index of sections is the layout's; this route adds only its metadata. */
export default function SettingsProfilePage() {
  return null;
}
