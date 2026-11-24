import { Button, Stack, Typography } from "@mui/material";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import Section from "@/components/layout/Section";
import SiteFooter from "@/components/layout/SiteFooter";
import SiteHeader from "@/components/layout/SiteHeader";
import {
  formatListingMeta,
  getListingRibbon,
} from "@/components/ui/ListingCard/ListingCard.util";
import Ribbon from "@/components/ui/Ribbon";
import TabularFigure from "@/components/ui/TabularFigure";
import { getListingById } from "@/data/listings";
import { getDictionary, getLocale } from "@/i18n/dictionary";
import { localizePath } from "@/i18n/routes";

type ListingDetailPageProps = PageProps<"/[lang]/listings/[id]">;

export async function generateMetadata({
  params,
}: ListingDetailPageProps): Promise<Metadata> {
  const { id } = await params;
  const listing = await getListingById(Number(id));
  return { title: listing?.title ?? "Anuncio" };
}

async function ListingDetail({
  params,
}: Pick<ListingDetailPageProps, "params">) {
  const { id } = await params;
  const listing = await getListingById(Number(id));

  if (!listing) {
    notFound();
  }

  const { listingDetail, listings } = await getDictionary();
  const locale = await getLocale();
  const backHref = localizePath(locale, "loggedHome");

  return (
    <Section>
      <Ribbon variant={getListingRibbon(listing)} />
      <Typography
        variant="overline"
        component="p"
        color="textSecondary"
        sx={{ mt: 2 }}
      >
        {formatListingMeta(listing, listings)}
      </Typography>
      <Typography variant="h2" gutterBottom sx={{ mt: 1 }}>
        {listing.title}
      </Typography>
      <Typography variant="body1" sx={{ mb: 3, maxWidth: 640 }}>
        {listingDetail.lead}
      </Typography>
      <Typography variant="body1" sx={{ mb: 3, maxWidth: 640 }}>
        {listing.summary}
      </Typography>

      <Typography variant="overline" component="p" color="textSecondary">
        {listingDetail.hoursLabel}
      </Typography>
      <TabularFigure variant="h3" component="p" sx={{ mb: 2 }}>
        {listing.hours}
      </TabularFigure>
      <Typography variant="subtitle2" color="textSecondary" sx={{ mb: 4 }}>
        {listing.byline}
      </Typography>

      <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
        <Button variant="contained" href={backHref}>
          {listingDetail.contact}
        </Button>
        <Button variant="outlined" href={backHref}>
          {listingDetail.back}
        </Button>
      </Stack>
    </Section>
  );
}

/** Temporary listing detail: sample content only, no contact backend. */
export default function ListingDetailPage({ params }: ListingDetailPageProps) {
  return (
    <>
      <SiteHeader />
      <main>
        <Suspense>
          <ListingDetail params={params} />
        </Suspense>
      </main>
      <SiteFooter />
    </>
  );
}
