import { MessageCircle, Plus } from "lucide-react";
import CountBadge from "@/components/ui/CountBadge";
import Icon from "@/components/ui/Icon";
import { MEMBER_NAV_TARGET } from "@/data/navigation";
import type { MemberNavId } from "@/data/types";
import { getDictionary, getLocale } from "@/i18n/dictionary";
import { localizePath } from "@/i18n/routes";
import { plural } from "@/lib/i18n/plural";
import NavCell from "../NavCell";
import {
  MemberHeaderAvatar,
  MemberHeaderBrand,
  MemberHeaderBrandName,
  MemberHeaderNarrow,
  MemberHeaderNav,
  MemberHeaderRoot,
} from "./MemberHeader.style";
import { memberHeaderClasses } from "./MemberHeader.util";

export type MemberHeaderProps = {
  current: MemberNavId;
  unreadMessages: number;
  /** One or two letters standing in for the member's photo. */
  initials: string;
};

export default async function MemberHeader({
  current,
  unreadMessages,
  initials,
}: MemberHeaderProps) {
  const { brand, memberNav } = await getDictionary();
  const locale = await getLocale();
  const unread = plural(locale, unreadMessages, memberNav.unread);
  const hrefOf = (id: MemberNavId) =>
    localizePath(locale, MEMBER_NAV_TARGET[id]);

  return (
    <MemberHeaderRoot className={memberHeaderClasses.root}>
      <MemberHeaderBrand
        className={memberHeaderClasses.brand}
        href={hrefOf("home")}
        aria-current={current === "home" ? "page" : undefined}
      >
        <MemberHeaderBrandName
          className={memberHeaderClasses.brandName}
          variant="h3"
          component="span"
        >
          {brand.name}
        </MemberHeaderBrandName>
      </MemberHeaderBrand>

      <MemberHeaderNav
        className={memberHeaderClasses.nav}
        aria-label={memberNav.label}
      >
        <NavCell href={hrefOf("discover")} current={current === "discover"}>
          {memberNav.discover}
        </NavCell>
        <NavCell href={hrefOf("messages")} current={current === "messages"}>
          {memberNav.messages}
          <CountBadge count={unreadMessages} label={unread} />
        </NavCell>
        <NavCell
          href={hrefOf("publish")}
          emphasis="solid"
          current={current === "publish"}
        >
          <Icon icon={Plus} size="sm" />
          {memberNav.publish}
        </NavCell>
        <NavCell
          href={hrefOf("profile")}
          current={current === "profile"}
          label={memberNav.profileLabel}
        >
          <MemberHeaderAvatar className={memberHeaderClasses.avatar}>
            {initials}
          </MemberHeaderAvatar>
        </NavCell>
      </MemberHeaderNav>

      <MemberHeaderNarrow className={memberHeaderClasses.narrow}>
        <NavCell
          href={hrefOf("messages")}
          current={current === "messages"}
          label={
            unreadMessages > 0
              ? `${memberNav.messages}, ${unread}`
              : memberNav.messages
          }
        >
          <Icon icon={MessageCircle} />
          <CountBadge count={unreadMessages} />
        </NavCell>
      </MemberHeaderNarrow>
    </MemberHeaderRoot>
  );
}
