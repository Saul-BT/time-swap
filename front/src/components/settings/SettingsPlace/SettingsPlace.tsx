"use client";

import { useSelectedLayoutSegments } from "next/navigation";
import { createContext, type ReactNode, useContext, useMemo } from "react";
import { type SettingsPlace, settingsPlace } from "@/lib/settings/segment";

const PlaceContext = createContext<SettingsPlace>({
  active: null,
  account: "profile",
});

/**
 * Where in settings the reader is. The chrome lives in a layout that Next does
 * not re-render per section, so nothing can pass it down as a prop. Segments
 * and not `usePathname`: the localized slugs are rewritten to the English
 * folder ones (ADR 0011), so the pathname differs between prerender and
 * browser while the segments do not.
 */
export function SettingsPlaceProvider({ children }: { children: ReactNode }) {
  const segments = useSelectedLayoutSegments();
  const place = useMemo(() => settingsPlace(segments), [segments]);

  return (
    <PlaceContext.Provider value={place}>{children}</PlaceContext.Provider>
  );
}

export function useSettingsPlace(): SettingsPlace {
  return useContext(PlaceContext);
}
