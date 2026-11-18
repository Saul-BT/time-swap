"use server";

import { Button, MenuItem, Stack, TextField, Typography } from "@mui/material";
import type { Metadata } from "next";
import Section from "@/components/layout/Section";
import SiteFooter from "@/components/layout/SiteFooter";
import SiteHeader from "@/components/layout/SiteHeader";
import { getDictionary, getLocale } from "@/i18n/dictionary";
import { localizePath } from "@/i18n/routes";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { Locale } from "@/i18n/config";
import { getCategories } from "@/data/categories";

export async function generateMetadata(): Promise<Metadata> {
  const { createAd } = await getDictionary();
  return { title: createAd.title };
}

export async function createListingAction(
    locale: Locale,
    formData: FormData,
): Promise<void> {
  //get jwt token from cookies
  const cookieStore = await cookies();
  const token = cookieStore.get('accessToken')?.value;

  const response = await fetch(
    `${process.env.BACKEND_URL}/listing/create`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        title: formData.get('title'),
        description: formData.get('description'),
        kind: formData.get('kind'),
        mode: formData.get('mode'),
        categoryId: formData.get('categoryId'),
        duration: formData.get('hours'),
        location: formData.get('area'),
      }),
    },
  );

  if (!response.ok) {
      throw new Error('Failed to create listing: ' + response.statusText);
  }

  redirect(localizePath(locale, "loggedHome"));
}

export default async function CreateAdPage() {
  const { createAd, listings, categories } = await getDictionary();
  const locale = await getLocale();
  const loggedHomeHref = localizePath(locale, "loggedHome");

  const categoryList = await getCategories();

  //pass the locale to the action beforehand
  const formAction = createListingAction.bind(null, locale);

  return (
    <>
      <SiteHeader />
      <main>
        <Section>
          <Typography variant="h2" gutterBottom>
            {createAd.title}
          </Typography>
          <Typography variant="body1" sx={{ mb: 4 }}>
            {createAd.lead}
          </Typography>

          {/* Demo only: submit returns to the temporary logged home. */}
          <form action={formAction}>
            <Stack spacing={3}>
              <TextField
                required
                select
                name="kind"
                label={createAd.kindLabel}
                defaultValue="offer"
                fullWidth
              >
                <MenuItem value="offer">{listings.kind.offer}</MenuItem>
                <MenuItem value="request">{listings.kind.request}</MenuItem>
              </TextField>
              <TextField
                required
                name="title"
                label={createAd.titleLabel}
                fullWidth
              />
              <TextField
                required
                name="description"
                label={createAd.descriptionLabel}
                fullWidth
                multiline
                minRows={4}
              />
              <TextField
                required
                select
                name="categoryId"
                label={createAd.categoryLabel}
                defaultValue={categoryList[0]?.id}
                fullWidth
              >
                {categoryList.map((category) => (
                  <MenuItem key={category.id} value={category.id}>
                    {category.name}
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                required
                select
                name="mode"
                label={createAd.modeLabel}
                defaultValue="inPerson"
                fullWidth
              >
                <MenuItem value="inPerson">{listings.mode.inPerson}</MenuItem>
                <MenuItem value="remote">{listings.mode.remote}</MenuItem>
                <MenuItem value="both">{listings.mode.both}</MenuItem>
              </TextField>
              <TextField name="area" label={createAd.areaLabel} fullWidth />
              <TextField
                required
                name="hours"
                label={createAd.hoursLabel}
                fullWidth
              />

              <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                <Button type="submit" variant="contained">
                  {createAd.submit}
                </Button>
                <Button variant="outlined" href={loggedHomeHref}>
                  {createAd.cancel}
                </Button>
              </Stack>
            </Stack>
          </form>
        </Section>
      </main>
      <SiteFooter />
    </>
  );
}
