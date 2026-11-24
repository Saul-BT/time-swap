import { createComponentClasses } from "@/lib/mui/componentClasses";

/** `warning` for a listing about to expire, `brake` for one that is paused. */
export type OwnListingsTone = "plain" | "warning" | "brake";

export type OwnListingsPart = { text: string; tone: OwnListingsTone };

export const ownListingsBarClasses = createComponentClasses("OwnListingsBar", [
  "root",
  "text",
  "title",
  "line",
  "part",
  "wide",
  "manage",
  "chevron",
]);
