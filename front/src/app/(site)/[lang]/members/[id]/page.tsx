import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Section from "@/components/layout/Section";
import SiteFooter from "@/components/layout/SiteFooter";
import SiteHeader from "@/components/layout/SiteHeader";
import PublicProfile from "@/components/member/PublicProfile";
import { findZone } from "@/data/zones";
import { getDictionary, getLocale } from "@/i18n/dictionary";
import { localizePath, routeAlternates } from "@/i18n/routes";
import { getMember } from "@/lib/api/profile";
import { interpolate } from "@/lib/i18n/interpolate";
import { toPublicProfile } from "@/lib/profile/publicView";

export async function generateMetadata({
  params,
}: PageProps<"/[lang]/members/[id]">): Promise<Metadata> {
  const { id } = await params;
  const { memberProfile } = await getDictionary();
  const locale = await getLocale();
  const member = await getMember(id);

  if (!member) {
    return { title: memberProfile.notFound };
  }

  return {
    title: interpolate(memberProfile.metadata.title, {
      name: member.displayName,
    }),
    description: interpolate(memberProfile.metadata.description, {
      name: member.displayName,
    }),
    alternates: {
      canonical: localizePath(locale, "memberProfile", { id }),
      languages: routeAlternates("memberProfile", { id }),
    },
  };
}

export default async function MemberProfilePage({
  params,
}: PageProps<"/[lang]/members/[id]">) {
  const { id } = await params;
  const member = await getMember(id);

  if (!member) {
    notFound();
  }

  // FIXME(auth): the viewer's moment comes from the session and the contact
  // state between both members. Fixed to `member` until auth exists.
  const profile = toPublicProfile(member, "member", (location) =>
    findZone(location.zoneId),
  );

  return (
    <>
      <SiteHeader />
      <main>
        <Section>
          <PublicProfile profile={profile} own={id === member.userId} />
        </Section>
      </main>
      <SiteFooter />
    </>
  );
}
