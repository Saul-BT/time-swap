import type { Metadata } from "next";
import RegisterScreen from "@/components/register/RegisterScreen";
import { getDictionary, getLocale } from "@/i18n/dictionary";
import { localizePath, routeAlternates } from "@/i18n/routes";

export async function generateMetadata(): Promise<Metadata> {
  const { register } = await getDictionary();
  const locale = await getLocale();

  return {
    title: register.metadata.title,
    description: register.metadata.description,
    alternates: {
      canonical: localizePath(locale, "register"),
      languages: routeAlternates("register"),
    },
  };
}

export default function RegisterPage() {
  return <RegisterScreen />;
}
