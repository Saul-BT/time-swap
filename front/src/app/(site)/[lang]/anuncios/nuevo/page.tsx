import Button from "@mui/material/Button";
import MenuItem from "@mui/material/MenuItem";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import type { Metadata } from "next";
import Section from "@/components/layout/Section";
import SiteFooter from "@/components/layout/SiteFooter";
import SiteHeader from "@/components/layout/SiteHeader";
import { CATEGORY_IDS } from "@/data/categories";
import { PATH } from "@/data/navigation";
import { getDictionary, getLocale } from "@/i18n/dictionary";

export async function generateMetadata(): Promise<Metadata> {
  const { createAd } = await getDictionary();
  return { title: createAd.title };
}

/** Temporary publish screen: UI only, nothing is persisted. */
export default async function CreateAdPage() {
  const { createAd, listings, categories } = await getDictionary();
  const locale = await getLocale();
  const loggedHomeHref = `/${locale}${PATH.loggedHome}`;

  return (
    <>
      <SiteHeader />
      <main>
        <Section>
          <Typography variant="h2" gutterBottom>
            {createAd.title}
          </Typography>
          <Typography variant="body1" sx={{ mb: 4, maxWidth: 640 }}>
            {createAd.lead}
          </Typography>

          {/* Demo only: submit returns to the temporary logged home. */}
          <form action={loggedHomeHref}>
            <Stack spacing={3} sx={{ maxWidth: 640 }}>
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
