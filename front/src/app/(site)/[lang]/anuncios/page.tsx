import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import type { Metadata } from "next";
import FilterList from "@/components/landing/FilterList";
import ListingCard from "@/components/landing/ListingCard";
import Section from "@/components/layout/Section";
import SiteFooter from "@/components/layout/SiteFooter";
import SiteHeader from "@/components/layout/SiteHeader";
import { LISTINGS } from "@/data/listings";
import { PATH } from "@/data/navigation";
import { getDictionary, getLocale } from "@/i18n/dictionary";

export async function generateMetadata(): Promise<Metadata> {
  const { browseListings } = await getDictionary();
  return { title: browseListings.title };
}

/** Temporary listings browse: sample cards only, no search backend. */
export default async function BrowseListingsPage() {
  const { browseListings, common } = await getDictionary();
  const locale = await getLocale();
  const loggedHomeHref = `/${locale}${PATH.loggedHome}`;

  return (
    <>
      <SiteHeader />
      <main>
        <Section>
          <Typography variant="h2" gutterBottom>
            {browseListings.title}
          </Typography>
          <Typography variant="body1" sx={{ mb: 2, maxWidth: 640 }}>
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

          <Box
            component="ul"
            sx={{
              listStyle: "none",
              p: 0,
              m: 0,
              display: "grid",
              gap: 2.5,
              gridTemplateColumns: {
                xs: "1fr",
                sm: "repeat(2, minmax(0, 1fr))",
                md: "repeat(3, minmax(0, 1fr))",
              },
            }}
          >
            {LISTINGS.map((listing) => (
              <Box
                key={listing.id}
                component="li"
                sx={{ display: "flex", minWidth: 0 }}
              >
                <ListingCard listing={listing} />
              </Box>
            ))}
          </Box>

          <Button variant="outlined" href={loggedHomeHref} sx={{ mt: 4 }}>
            {browseListings.back}
          </Button>
        </Section>
      </main>
      <SiteFooter />
    </>
  );
}
