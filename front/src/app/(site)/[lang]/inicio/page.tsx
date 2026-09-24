import { Button, Stack, Typography } from "@mui/material";
import type { Metadata } from "next";
import Section from "@/components/layout/Section";
import SiteFooter from "@/components/layout/SiteFooter";
import SiteHeader from "@/components/layout/SiteHeader";
import { ATTENTION_ITEMS } from "@/data/attention";
import { PATH } from "@/data/navigation";
import { getDictionary, getLocale } from "@/i18n/dictionary";

export async function generateMetadata(): Promise<Metadata> {
  const { loggedHome } = await getDictionary();
  return { title: loggedHome.title };
}

// FIXME: Temporary member home: UI only, no session and no backend (revist).
export default async function LoggedHomePage() {
  const { loggedHome } = await getDictionary();
  const locale = await getLocale();
  // FIXME(i18n): use `localizePath` (from #20).
  const publishHref = `/${locale}${PATH.createAd}`;
  const listingsHref = `/${locale}${PATH.listings}`;

  return (
    <>
      <SiteHeader />
      <main>
        <Section>
          <Typography variant="h2" gutterBottom>
            {loggedHome.title}
          </Typography>
          <Typography variant="body1" sx={{ mb: 4, maxWidth: 640 }}>
            {loggedHome.lead}
          </Typography>

          <Typography variant="overline" component="p" color="textSecondary">
            {loggedHome.balanceLabel}
          </Typography>
          <Typography variant="h3" component="p" sx={{ mb: 4 }}>
            {loggedHome.balanceValue}
          </Typography>

          <Typography variant="h3" component="h2" gutterBottom>
            {loggedHome.attentionTitle}
          </Typography>
          <Stack
            component="ul"
            spacing={2}
            sx={{ listStyle: "none", p: 0, m: 0, mb: 4, maxWidth: 640 }}
          >
            {ATTENTION_ITEMS.map((item) => (
              <Stack
                key={item.id}
                component="li"
                spacing={0.5}
                sx={{
                  borderBottom: 2,
                  borderColor: "divider",
                  pb: 2,
                }}
              >
                <Typography variant="subtitle1">{item.label}</Typography>
                <Typography variant="body2" color="textSecondary">
                  {item.detail}
                </Typography>
              </Stack>
            ))}
          </Stack>

          <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
            <Button variant="contained" href={publishHref}>
              {loggedHome.publish}
            </Button>
            <Button variant="outlined" href={listingsHref}>
              {loggedHome.discover}
            </Button>
          </Stack>
        </Section>
      </main>
      <SiteFooter />
    </>
  );
}
