import { Box, Button, Grid, Typography } from "@mui/material";
import type { Metadata } from "next";
import { Suspense } from "react";
import Section from "@/components/layout/Section";
import SiteFooter from "@/components/layout/SiteFooter";
import SiteHeader from "@/components/layout/SiteHeader";
import FilterList from "@/components/ui/FilterList";
import ListingCard, { ListingCardSkeleton } from "@/components/ui/ListingCard";
import { getListingsPaged } from "@/data/listings";
import { getDictionary, getLocale } from "@/i18n/dictionary";
import { localizePath } from "@/i18n/routes";
import { bareList } from "@/theme/rules";

export async function generateMetadata(): Promise<Metadata> {
  const { browseListings } = await getDictionary();
  return { title: browseListings.title };
}

const PAGE_SIZE = 6; //todo tweak fetch size by screen size?

function ListingsGridLayout({ children }: { children: React.ReactNode[] }) {
  return (
    <Grid container component="ul" spacing={2.5} sx={bareList}>
      {children}
    </Grid>
  );
}

function ListingsGridItem({ children }: { children: React.ReactNode }) {
  return (
    <Grid
      component="li"
      size={{ xs: 12, sm: 6, md: 4 }}
      sx={{ display: "flex", minWidth: 0 }}
    >
      {children}
    </Grid>
  );
}

async function ListingsGrid() {
  const listings = await getListingsPaged(1, PAGE_SIZE);

  return (
    <ListingsGridLayout>
      {listings.map((listing) => (
        <ListingsGridItem key={String(listing.id)}>
          <ListingCard listing={listing} />
        </ListingsGridItem>
      ))}
    </ListingsGridLayout>
  );
}

// FIXME: Temporary listings browse: UI only, sample data and no search backend (revisit).
export default async function BrowseListingsPage() {
  const { browseListings, common } = await getDictionary();
  const locale = await getLocale();
  const loggedHomeHref = localizePath(locale, "loggedHome");

  return (
    <>
      <SiteHeader />
      <main>
        <Section>
          <Typography variant="h2" gutterBottom>
            {browseListings.title}
          </Typography>
          <Typography variant="body1" sx={{ mb: 2 }}>
            {browseListings.lead}
          </Typography>
          <Typography
            variant="overline"
            component="p"
            color="textSecondary"
            sx={{ mb: 3 }}
          >
            {common.sampleContent}
          </Typography>

          <Box sx={{ mb: 4 }}>
            <FilterList />
          </Box>

          <Suspense
            fallback={
              <ListingsGridLayout>
                {Array.from({ length: PAGE_SIZE }, (_, index) => (
                  // biome-ignore lint/suspicious/noArrayIndexKey: placeholders have no identity.
                  <ListingsGridItem key={index}>
                    <ListingCardSkeleton />
                  </ListingsGridItem>
                ))}
              </ListingsGridLayout>
            }
          >
            <ListingsGrid />
          </Suspense>

          <Button variant="outlined" href={loggedHomeHref} sx={{ mt: 4 }}>
            {browseListings.back}
          </Button>
        </Section>
      </main>
      <SiteFooter />
    </>
  );
}
