import { notFound } from "next/navigation";
import Section from "@/components/layout/Section";
import SiteFooter from "@/components/layout/SiteFooter";
import SiteHeader from "@/components/layout/SiteHeader";
import MemberProfile from "@/components/profile/MemberProfile";
import { MEMBERS } from "@/data/members";

export function generateStaticParams() {
  return MEMBERS.map(({ id }) => ({ memberId: id }));
}

export default async function MemberProfilePage({
  params,
}: PageProps<"/[lang]/profile/[memberId]">) {
  const { memberId } = await params;
  const member = MEMBERS.find((candidate) => candidate.id === memberId);

  if (!member) {
    notFound();
  }
  return (
    <>
      <SiteHeader />
      <main>
        <Section>
          <MemberProfile member={member} />
        </Section>
      </main>
      <SiteFooter />
    </>
  );
}
