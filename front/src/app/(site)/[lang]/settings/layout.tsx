import SettingsShell from "@/components/layout/SettingsShell";

/**
 * The chrome is shared by every settings route, so navigating between sections
 * only streams the panel. Which section is open is read from the segments.
 */
export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <SettingsShell>{children}</SettingsShell>;
}
