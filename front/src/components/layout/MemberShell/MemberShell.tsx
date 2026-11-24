import type { MemberNavId } from "@/data/types";
import Ribbon from "../../ui/Ribbon";
import MemberHeader from "../MemberHeader";
import MemberTabBar from "../MemberTabBar";
import { MemberShellMain, MemberShellRoot } from "./MemberShell.style";
import { memberShellClasses } from "./MemberShell.util";

export type MemberShellProps = {
  current: MemberNavId;
  unreadMessages: number;
  initials: string;
  children: React.ReactNode;
};

/** Chrome of every signed-in page: header on top, tab bar at the bottom on phones. */
export default function MemberShell({
  current,
  unreadMessages,
  initials,
  children,
}: MemberShellProps) {
  return (
    <MemberShellRoot className={memberShellClasses.root}>
      <Ribbon variant="member" />
      <MemberHeader
        current={current}
        unreadMessages={unreadMessages}
        initials={initials}
      />
      <MemberShellMain className={memberShellClasses.main}>
        {children}
      </MemberShellMain>
      <MemberTabBar current={current} unreadMessages={unreadMessages} />
    </MemberShellRoot>
  );
}
