"use server";

import { Button, MenuItem, Stack, TextField, Typography } from "@mui/material";
import type { Metadata } from "next";
import Section from "@/components/layout/Section";
import SiteFooter from "@/components/layout/SiteFooter";
import SiteHeader from "@/components/layout/SiteHeader";
import { CATEGORY_IDS } from "@/data/categories";
import { getDictionary, getLocale } from "@/i18n/dictionary";
import { localizePath } from "@/i18n/routes";
import { cookies } from "next/headers";

export async function generateMetadata(): Promise<Metadata> {
  const { createAd } = await getDictionary();
  return { title: createAd.title };
}

export async function createExchangeAction(
    formData: FormData,
): Promise<void> {
  console.log("DEBUG!!!");
  //get jwt token from cookies
  const cookieStore = await cookies();
  const token = cookieStore.get('accessToken')?.value;

  const response = await fetch(
    `${process.env.BACKEND_URL}/exchange`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        title: formData.get('title'),
        description: formData.get('description'),
        //type: formData.get('kind'),
        type: 'offer', //todo get from form
        //mode: formData.get('mode'),
        mode: 'any', //todo get from form
        //categoryId: Number(formData.get('category')),
        categoryId: 1, //todo get from form
        startTime: '2030-01-01', //todo get from form
        duration: formData.get('hours'),
        location: formData.get('area'),
      }),
    },
  );

    if (!response.ok) {
        throw new Error('Failed to create exchange');
    }

    const locale = await getLocale();
    localizePath(locale, "loggedHome");
}

// FIXME: Temporary publish screen: UI only, nothing is persisted (revisit).
export default async function CreateAdPage() {
  const { createAd, listings, categories } = await getDictionary();
  const locale = await getLocale();
  const loggedHomeHref = localizePath(locale, "loggedHome");

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
          <form action={createExchangeAction}>
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
                name="category"
                label={createAd.categoryLabel}
                defaultValue={CATEGORY_IDS[0]}
                fullWidth
              >
                {CATEGORY_IDS.map((id) => (
                  <MenuItem key={id} value={id}>
                    {categories.items[id]}
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
