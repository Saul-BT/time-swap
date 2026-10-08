import MemberShell from "@/components/layout/MemberShell";
import LoggedHomeSkeleton from "@/components/logged-home/LoggedHomeSkeleton";

export default function Loading() {
  return (
    <MemberShell current="home" unreadMessages={0} initials="">
      <LoggedHomeSkeleton />
    </MemberShell>
  );
}
