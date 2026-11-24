import { Button } from "@mui/material";
import { Suspense } from "react";
import ListingCard, { ListingCardSkeleton } from "@/components/ui/ListingCard";
import { getListingsPaged } from "@/data/listings";
import { SECTION_ID } from "@/data/navigation";
import { getDictionary } from "@/i18n/dictionary";
import { interpolate } from "@/lib/i18n/interpolate";
import Section from "../../layout/Section";
import SectionHeader from "../../ui/SectionHeader";
import {
  ListingsSectionGrid,
  ListingsSectionItem,
  ListingsSectionMore,
} from "./ListingsSection.style";
import { listingsSectionClasses } from "./ListingsSection.util";

const PAGE_SIZE = 6; //todo tweak fetch size by screen size?

function ListingsGridSkeleton() {
  return (
    <ListingsSectionGrid className={listingsSectionClasses.grid}>
      {Array.from({ length: PAGE_SIZE }, (_, index) => (
        <ListingsSectionItem
          className={listingsSectionClasses.item}
          // biome-ignore lint/suspicious/noArrayIndexKey: placeholders have no identity.
          key={index}
        >
          <ListingCardSkeleton />
        </ListingsSectionItem>
      ))}
    </ListingsSectionGrid>
  );
}

async function ListingsGrid() {
  const listings = await getListingsPaged(1, PAGE_SIZE);

  return (
    <ListingsSectionGrid className={listingsSectionClasses.grid}>
      {listings.map((listing) => (
        <ListingsSectionItem
          className={listingsSectionClasses.item}
          key={listing.id}
        >
          <ListingCard listing={listing} />
        </ListingsSectionItem>
      ))}
    </ListingsSectionGrid>
  );
}

export default async function ListingsSection() {
  const { listings, common, placeholder } = await getDictionary();

  return (
    // The hero above already carries its bottom padding, so the top edge is flushed.
    <Section id={SECTION_ID.listings} flushTop>
      <SectionHeader
        compact
        title={interpolate(listings.title, { area: placeholder.area })}
        note={common.sampleContent}
      />

      <Suspense fallback={<ListingsGridSkeleton />}>
        <ListingsGrid />
      </Suspense>

      <ListingsSectionMore className={listingsSectionClasses.more}>
        <Button variant="outlined" href={`#${SECTION_ID.listings}`}>
          {listings.more}
        </Button>
      </ListingsSectionMore>
    </Section>
  );
}
