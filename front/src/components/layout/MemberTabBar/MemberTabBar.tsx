import CountBadge from "@/components/ui/CountBadge";
import Icon from "@/components/ui/Icon";
import { MEMBER_NAV_IDS, MEMBER_NAV_TARGET } from "@/data/navigation";
import type { MemberNavId } from "@/data/types";
import { getDictionary, getLocale } from "@/i18n/dictionary";
import { localizePath } from "@/i18n/routes";
import { plural } from "@/lib/i18n/plural";
import {
  MemberTabBarBadge,
  MemberTabBarItem,
  MemberTabBarList,
  MemberTabBarRoot,
  MemberTabBarTab,
} from "./MemberTabBar.style";
import { MEMBER_NAV_ICON, memberTabBarClasses } from "./MemberTabBar.util";

export type MemberTabBarProps = {
  current: MemberNavId;
  unreadMessages: number;
};

export default async function MemberTabBar({
  current,
  unreadMessages,
}: MemberTabBarProps) {
  const { memberNav } = await getDictionary();
  const locale = await getLocale();

  return (
    <MemberTabBarRoot
      className={memberTabBarClasses.root}
      aria-label={memberNav.label}
    >
      <MemberTabBarList className={memberTabBarClasses.list}>
        {MEMBER_NAV_IDS.map((id) => (
          <MemberTabBarItem key={id} className={memberTabBarClasses.item}>
            <MemberTabBarTab
              className={memberTabBarClasses.tab}
              href={localizePath(locale, MEMBER_NAV_TARGET[id])}
              aria-current={id === current ? "page" : undefined}
              ownerState={{
                current: id === current,
                solid: id === "publish",
              }}
            >
              <Icon icon={MEMBER_NAV_ICON[id]} />
              {memberNav[id]}
              {id === "messages" && unreadMessages > 0 ? (
                <MemberTabBarBadge className={memberTabBarClasses.badge}>
                  <CountBadge
                    count={unreadMessages}
                    label={plural(locale, unreadMessages, memberNav.unread)}
                  />
                </MemberTabBarBadge>
              ) : null}
            </MemberTabBarTab>
          </MemberTabBarItem>
        ))}
      </MemberTabBarList>
    </MemberTabBarRoot>
  );
}
