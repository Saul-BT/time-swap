import { Box, Button, Grid, Typography } from "@mui/material";
import type { Metadata } from "next";
import Section from "@/components/layout/Section";
import SiteFooter from "@/components/layout/SiteFooter";
import SiteHeader from "@/components/layout/SiteHeader";
import FilterList from "@/components/ui/FilterList";
import ListingCard from "@/components/ui/ListingCard";
import { LISTINGS } from "@/data/listings";
import { PATH } from "@/data/navigation";
import { getDictionary, getLocale } from "@/i18n/dictionary";
import { bareList } from "@/theme/rules";

export async function generateMetadata(): Promise<Metadata> {
  const { browseListings } = await getDictionary();
  return { title: browseListings.title };
}

// FIXME: Temporary listings browse: UI only, sample data and no search backend (revisit).
export default async function BrowseListingsPage() {
  const { browseListings, common } = await getDictionary();
  const locale = await getLocale();
  // FIXME(i18n): use `localizePath` (from #20).
  const loggedHomeHref = `/${locale}${PATH.loggedHome}`;

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

          <Grid container component="ul" spacing={2.5} sx={bareList}>
            {LISTINGS.map((listing) => (
              <Grid
                key={listing.id}
                component="li"
                size={{ xs: 12, sm: 6, md: 4 }}
                sx={{ display: "flex", minWidth: 0 }}
              >
                <ListingCard listing={listing} />
              </Grid>
            ))}
          </Grid>

          <Button variant="outlined" href={loggedHomeHref} sx={{ mt: 4 }}>
            {browseListings.back}
          </Button>
        </Section>
      </main>
      <SiteFooter />
    </>
  );
}
