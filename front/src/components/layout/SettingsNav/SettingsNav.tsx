import { getCompletion } from "@/lib/api/profile";
import type { SettingsNavVariant } from "./SettingsNav.util";
import SettingsNavView from "./SettingsNavView";

export type SettingsNavProps = {
  variant: SettingsNavVariant;
};

/** Loads its own badges, so the layout around it renders without waiting. */
export default async function SettingsNav({ variant }: SettingsNavProps) {
  return (
    <SettingsNavView variant={variant} completion={await getCompletion()} />
  );
}
