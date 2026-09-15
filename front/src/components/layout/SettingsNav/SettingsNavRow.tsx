"use client";

import type { ReactNode } from "react";
import type { SettingsSectionId } from "@/data/types";
import GuardedLink from "../../settings/GuardedLink";
import { useSettingsPlace } from "../../settings/SettingsPlace";
import StatusBadge, { type SectionStatus } from "../../ui/StatusBadge";
import { SettingsNavLink, SettingsNavName } from "./SettingsNav.style";
import {
  type SettingsNavVariant,
  settingsNavClasses,
} from "./SettingsNav.util";

export type SettingsNavRowProps = {
  section: SettingsSectionId;
  href: string;
  variant: SettingsNavVariant;
  name: string;
  /** Both absent when the section states could not be loaded. */
  status?: SectionStatus;
  statusLabel?: string;
  icon: ReactNode;
  chevron?: ReactNode;
};

/**
 * Each row decides whether it is the open one. The chrome lives in a layout
 * that is not re-rendered per section, so nothing above can pass it down.
 */
export default function SettingsNavRow({
  section,
  href,
  variant,
  name,
  status,
  statusLabel,
  icon,
  chevron,
}: SettingsNavRowProps) {
  const active = useSettingsPlace().active === section;

  return (
    <GuardedLink
      link={SettingsNavLink}
      className={settingsNavClasses.link}
      href={href}
      ownerState={{ active, variant }}
      aria-current={active ? "page" : undefined}
    >
      <span className={settingsNavClasses.icon}>{icon}</span>
      <SettingsNavName className={settingsNavClasses.name}>
        {name}
      </SettingsNavName>
      {status && statusLabel ? (
        <span className={settingsNavClasses.status}>
          <StatusBadge
            status={status}
            label={statusLabel}
            tone={active ? "inverse" : "default"}
          />
        </span>
      ) : null}
      {chevron ? (
        <span className={settingsNavClasses.chevron}>{chevron}</span>
      ) : null}
    </GuardedLink>
  );
}
