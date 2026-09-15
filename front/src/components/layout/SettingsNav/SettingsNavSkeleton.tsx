import Skeleton from "@mui/material/Skeleton";
import { SETTINGS_SECTIONS } from "@/data/settings";
import {
  SettingsNavItem,
  SettingsNavList,
  SettingsNavRoot,
  SettingsNavRowShell,
} from "./SettingsNav.style";
import {
  type SettingsNavVariant,
  settingsNavClasses,
} from "./SettingsNav.util";

export type SettingsNavSkeletonProps = {
  variant: SettingsNavVariant;
  /** Announced while the badges load. */
  label: string;
};

/**
 * The same rows at the same heights, so nothing shifts when the real
 * navigation replaces it.
 */
export default function SettingsNavSkeleton({
  variant,
  label,
}: SettingsNavSkeletonProps) {
  return (
    <SettingsNavRoot
      className={settingsNavClasses.root}
      ownerState={{ variant }}
      as="div"
      role="status"
      aria-label={label}
      aria-busy
    >
      <SettingsNavList className={settingsNavClasses.list}>
        {SETTINGS_SECTIONS.map((section) => (
          <SettingsNavItem key={section} className={settingsNavClasses.item}>
            <SettingsNavRowShell
              className={settingsNavClasses.link}
              ownerState={{ variant }}
            >
              <Skeleton variant="circular" width={22} height={22} />
              <Skeleton variant="text" sx={{ flex: 1, maxWidth: 140 }} />
            </SettingsNavRowShell>
          </SettingsNavItem>
        ))}
      </SettingsNavList>
    </SettingsNavRoot>
  );
}
