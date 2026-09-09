import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import type { Metadata } from "next";
import Ribbon from "@/components/ui/Ribbon";
import { getDictionary, getLocale } from "@/i18n/dictionary";
import { localizePath, routeAlternates } from "@/i18n/routes";

export async function generateMetadata(): Promise<Metadata> {
  const { recoverAccess } = await getDictionary();
  const locale = await getLocale();

  return {
    title: recoverAccess.metadata.title,
    description: recoverAccess.metadata.description,
    alternates: {
      canonical: localizePath(locale, "recoverAccess"),
      languages: routeAlternates("recoverAccess"),
    },
  };
}

/** Placeholder route: the recovery flow is not designed yet. */
export default async function RecoverAccessPage() {
  const { recoverAccess } = await getDictionary();
  const locale = await getLocale();

  return (
    <>
      <Ribbon variant="page" />
      <Container component="main" sx={{ pt: 7, pb: 12, maxWidth: 640 }}>
        <Typography variant="h2" component="h1" gutterBottom>
          {recoverAccess.title}
        </Typography>
        <Typography variant="body1" sx={{ mb: 4 }}>
          {recoverAccess.lead}
        </Typography>
        <Button variant="outlined" href={localizePath(locale, "signIn")}>
          {recoverAccess.backToSignIn}
        </Button>
      </Container>
    </>
  );
}
