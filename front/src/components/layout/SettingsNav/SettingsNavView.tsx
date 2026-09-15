import { ChevronRight } from "lucide-react";
import { SECTION_ROUTE, SETTINGS_SECTIONS } from "@/data/settings";
import type { CompletionStatus } from "@/data/types";
import { getDictionary, getLocale } from "@/i18n/dictionary";
import { localizePath } from "@/i18n/routes";
import Icon from "../../ui/Icon";
import {
  SettingsNavItem,
  SettingsNavList,
  SettingsNavRoot,
} from "./SettingsNav.style";
import {
  SECTION_ICON,
  type SettingsNavVariant,
  settingsNavClasses,
} from "./SettingsNav.util";
import SettingsNavRow from "./SettingsNavRow";

export type SettingsNavViewProps = {
  variant: SettingsNavVariant;
  /** `null` drops the badges and keeps the links: the section states failed. */
  completion: CompletionStatus | null;
};

export default async function SettingsNavView({
  variant,
  completion,
}: SettingsNavViewProps) {
  const { settings } = await getDictionary();
  const locale = await getLocale();
  const isIndex = variant === "index";

  return (
    <SettingsNavRoot
      className={settingsNavClasses.root}
      ownerState={{ variant }}
      aria-label={settings.shell.navLabel}
    >
      <SettingsNavList className={settingsNavClasses.list}>
        {SETTINGS_SECTIONS.map((section) => {
          const status = completion?.sections[section];
          const statusLabel = isIndex
            ? status === "review"
              ? settings.status.reviewLong
              : status === "missing"
                ? settings.status.missingLong
                : settings.status.done
            : status && settings.status[status];

          return (
            <SettingsNavItem key={section} className={settingsNavClasses.item}>
              <SettingsNavRow
                section={section}
                href={localizePath(locale, SECTION_ROUTE[section])}
                variant={variant}
                name={settings.sections[section]}
                status={status}
                statusLabel={statusLabel || undefined}
                icon={<Icon icon={SECTION_ICON[section]} />}
                chevron={isIndex ? <Icon icon={ChevronRight} /> : undefined}
              />
            </SettingsNavItem>
          );
        })}
      </SettingsNavList>
    </SettingsNavRoot>
  );
}
