import Button from "@mui/material/Button";
import { LISTINGS } from "@/data/listings";
import { SECTION_ID } from "@/data/navigation";
import { getDictionary } from "@/i18n/dictionary";
import { interpolate } from "@/lib/i18n/interpolate";
import Section from "../../layout/Section";
import SectionHeader from "../../ui/SectionHeader";
import ListingCard from "../ListingCard";
import {
  ListingsSectionGrid,
  ListingsSectionItem,
  ListingsSectionMore,
} from "./ListingsSection.style";
import { listingsSectionClasses } from "./ListingsSection.util";

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

      <ListingsSectionGrid className={listingsSectionClasses.grid}>
        {LISTINGS.map((listing) => (
          <ListingsSectionItem
            className={listingsSectionClasses.item}
            key={listing.id}
          >
            <ListingCard listing={listing} />
          </ListingsSectionItem>
        ))}
      </ListingsSectionGrid>

      <ListingsSectionMore className={listingsSectionClasses.more}>
        <Button variant="outlined" href={`#${SECTION_ID.listings}`}>
          {listings.more}
        </Button>
      </ListingsSectionMore>
    </Section>
  );
}
