import type { Metadata } from "next";
import RegisterScreen from "@/components/register/RegisterScreen";
import { getDictionary, getLocale } from "@/i18n/dictionary";
import { localizePath, routeAlternates } from "@/i18n/routes";
import { register } from "./actions";

export async function generateMetadata(): Promise<Metadata> {
  const { register: copy } = await getDictionary();
  const locale = await getLocale();

  return {
    title: copy.metadata.title,
    description: copy.metadata.description,
    alternates: {
      canonical: localizePath(locale, "register"),
      languages: routeAlternates("register"),
    },
  };
}

export default async function RegisterPage() {
  const locale = await getLocale();

  return <RegisterScreen action={register.bind(null, locale)} />;
}
