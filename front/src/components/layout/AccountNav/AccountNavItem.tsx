"use client";

import type { AccountNavId } from "@/data/types";
import { useSettingsPlace } from "../../settings/SettingsPlace";
import { AccountNavLink } from "./AccountNav.style";
import { accountNavClasses } from "./AccountNav.util";

export type AccountNavItemProps = {
  id: AccountNavId;
  href: string;
  name: string;
};

/** Marks itself, like the section rows: the masthead sits in a layout. */
export default function AccountNavItem({
  id,
  href,
  name,
}: AccountNavItemProps) {
  const active = useSettingsPlace().account === id;

  return (
    <AccountNavLink
      className={accountNavClasses.link}
      href={href}
      ownerState={{ active }}
      aria-current={active ? "page" : undefined}
    >
      {name}
    </AccountNavLink>
  );
}
