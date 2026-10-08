import type { Metadata } from "next";
import { redirect } from "next/navigation";
import MemberShell from "@/components/layout/MemberShell";
import LoggedHomeScreen from "@/components/logged-home/LoggedHomeScreen";
import LoggedHomeSkeleton from "@/components/logged-home/LoggedHomeSkeleton";
import { getSampleMemberHome, isLoggedHomeState } from "@/data/logged-home";
import { getDictionary, getLocale } from "@/i18n/dictionary";
import { localizePath, routeAlternates } from "@/i18n/routes";

export async function generateMetadata(): Promise<Metadata> {
  const { loggedHome } = await getDictionary();
  const locale = await getLocale();

  return {
    title: loggedHome.metadata.title,
    alternates: {
      canonical: localizePath(locale, "loggedHome"),
      languages: routeAlternates("loggedHome"),
    },
  };
}

// FIXME(auth): UI only. No session is read: the member comes from sample data
// and `?state=` switches between its data states (see `LOGGED_HOME_STATES`).
// Read the session and fetch the member home instead once the API exists.
export default async function LoggedHomePage({
  searchParams,
}: PageProps<"/[lang]/home">) {
  const { state } = await searchParams;
  const locale = await getLocale();
  const scenario = isLoggedHomeState(state) ? state : "default";

  if (scenario === "sessionExpired") {
    redirect(`${localizePath(locale, "signIn")}?error=sessionExpired`);
  }

  const now = new Date();
  const home = getSampleMemberHome(now, scenario);

  return (
    <MemberShell
      current="home"
      unreadMessages={home.unreadMessages}
      initials={home.member.initials}
    >
      {scenario === "loading" ? (
        <LoggedHomeSkeleton />
      ) : (
        <LoggedHomeScreen home={home} now={now} />
      )}
    </MemberShell>
  );
}
