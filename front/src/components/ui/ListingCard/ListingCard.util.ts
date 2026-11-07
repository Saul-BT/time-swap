import type { RibbonVariant } from "@/components/ui/Ribbon";
import type { Listing } from "@/data/types";
import type { Dictionary } from "@/i18n/types";
import { createComponentClasses } from "@/lib/mui/componentClasses";

export const listingCardClasses = createComponentClasses("ListingCard", [
  "root",
  "body",
  "meta",
  "title",
  "summary",
  "footer",
  "hours",
]);

/** `"Oferta · Presencial"`. The separator is punctuation, not copy, so it is not in the dictionary. */
export function formatListingMeta(
  listing: Listing,
  listings: Dictionary["listings"],
): string {
  return `${listings.kind[listing.kind]} · ${listings.mode[listing.mode]}`;
}

/** Offers and requests differ by ribbon proportion, never by colour: there is one accent. */
export function getListingRibbon(listing: Listing): RibbonVariant {
  return listing.kind === "offer" ? "offer" : "request";
}
