import type { Metadata } from "next";
import SignInScreen from "@/components/sign-in/SignInScreen";
import { isSignInErrorId } from "@/data/sign-in";
import { getDictionary, getLocale } from "@/i18n/dictionary";
import { localizePath, routeAlternates } from "@/i18n/routes";
import { signIn } from "./actions";

export async function generateMetadata(): Promise<Metadata> {
  const { signIn: copy } = await getDictionary();
  const locale = await getLocale();

  return {
    title: copy.metadata.title,
    description: copy.metadata.description,
    alternates: {
      canonical: localizePath(locale, "signIn"),
      languages: routeAlternates("signIn"),
    },
  };
}

export default async function SignInPage({
  searchParams,
}: PageProps<"/[lang]/sign-in">) {
  const { error } = await searchParams;
  const locale = await getLocale();

  return (
    <SignInScreen
      action={signIn.bind(null, locale)}
      error={isSignInErrorId(error) ? error : undefined}
    />
  );
}
