import Typography from "@mui/material/Typography";
import NextLink from "next/link";
import { PATH } from "@/data/navigation";
import type { Listing } from "@/data/types";
import { getDictionary, getLocale } from "@/i18n/dictionary";
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
  const locale = await getLocale();
  // FIXME(i18n): use `localizePath` (from #20).
  const href = `/${locale}${PATH.listingDetail(listing.id)}`;

  return (
    <NextLink
      href={href}
      style={{
        textDecoration: "none",
        color: "inherit",
        display: "flex",
        flex: 1,
      }}
    >
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
    </NextLink>
  );
}
