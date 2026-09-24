import Typography from "@mui/material/Typography";
import type { Listing } from "@/data/types";
import { getDictionary } from "@/i18n/dictionary";
import Ribbon from "../Ribbon";
import {
  ListingCardBody,
  ListingCardFooter,
  ListingCardHours,
  ListingCardMeta,
  ListingCardRoot,
  ListingCardSummary,
  ListingCardTitle,
} from "./ListingCard.style";
import {
  formatListingMeta,
  getListingRibbon,
  listingCardClasses,
} from "./ListingCard.util";

/** Title, summary and byline are author-written text, so they are not translated. */
export default async function ListingCard({ listing }: { listing: Listing }) {
  const { listings } = await getDictionary();

  return (
    <ListingCardRoot className={listingCardClasses.root} component="article">
      <Ribbon variant={getListingRibbon(listing)} />
      <ListingCardBody className={listingCardClasses.body}>
        <ListingCardMeta className={listingCardClasses.meta}>
          {formatListingMeta(listing, listings)}
        </ListingCardMeta>
        <ListingCardTitle className={listingCardClasses.title} variant="h3">
          {listing.title}
        </ListingCardTitle>
        <ListingCardSummary
          className={listingCardClasses.summary}
          variant="body2"
        >
          {listing.summary}
        </ListingCardSummary>
        <ListingCardFooter className={listingCardClasses.footer}>
          <Typography variant="subtitle2" color="textSecondary">
            {listing.byline}
          </Typography>
          <ListingCardHours
            className={listingCardClasses.hours}
            variant="h4"
            component="p"
          >
            {listing.hours}
          </ListingCardHours>
        </ListingCardFooter>
      </ListingCardBody>
    </ListingCardRoot>
  );
}
