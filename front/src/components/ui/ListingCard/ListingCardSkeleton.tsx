import { Skeleton, Typography } from "@mui/material";
import { structure } from "@/theme/tokens";
import {
  ListingCardBody,
  ListingCardFooter,
  ListingCardHours,
  ListingCardMeta,
  ListingCardRoot,
  ListingCardSummary,
  ListingCardTitle,
} from "./ListingCard.style";
import { listingCardClasses } from "./ListingCard.util";

/** Same slots and type scale as `ListingCard`, so swapping it in shifts nothing. */
export default function ListingCardSkeleton() {
  return (
    <ListingCardRoot
      className={listingCardClasses.root}
      component="article"
      aria-hidden
    >
      <Skeleton variant="rectangular" height={structure.cardRibbonHeight} />
      <ListingCardBody className={listingCardClasses.body}>
        <ListingCardMeta className={listingCardClasses.meta}>
          <Skeleton width="40%" />
        </ListingCardMeta>
        <ListingCardTitle className={listingCardClasses.title} variant="h3">
          <Skeleton />
          <Skeleton width="60%" />
        </ListingCardTitle>
        <ListingCardSummary
          className={listingCardClasses.summary}
          variant="body2"
        >
          <Skeleton />
          <Skeleton width="80%" />
        </ListingCardSummary>
        <ListingCardFooter className={listingCardClasses.footer}>
          <Typography variant="subtitle2" sx={{ flex: 1 }}>
            <Skeleton width="50%" />
          </Typography>
          <ListingCardHours
            className={listingCardClasses.hours}
            variant="h4"
            component="p"
          >
            <Skeleton width="2em" />
          </ListingCardHours>
        </ListingCardFooter>
      </ListingCardBody>
    </ListingCardRoot>
  );
}
