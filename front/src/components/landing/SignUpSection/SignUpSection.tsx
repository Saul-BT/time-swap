import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { SECTION_ID } from "@/data/navigation";
import { getDictionary, getLocale } from "@/i18n/dictionary";
import { localizePath } from "@/i18n/routes";
import Section from "../../layout/Section";
import { SignUpActions, SignUpCopy, SignUpLayout } from "./SignUpSection.style";
import { signUpSectionClasses } from "./SignUpSection.util";

export default async function SignUpSection() {
  const { signUp } = await getDictionary();
  const locale = await getLocale();

  return (
    <Section id={SECTION_ID.signUp}>
      <SignUpLayout className={signUpSectionClasses.layout}>
        <SignUpCopy className={signUpSectionClasses.copy}>
          <Typography variant="h2" gutterBottom>
            {signUp.title}
          </Typography>
          <Typography variant="body1">{signUp.lead}</Typography>
        </SignUpCopy>
        <SignUpActions
          className={signUpSectionClasses.actions}
          direction={{ xs: "column", sm: "row" }}
          spacing={2}
        >
          <Button variant="contained" href={`#${SECTION_ID.signUp}`}>
            {signUp.create}
          </Button>
          <Button variant="outlined" href={localizePath(locale, "signIn")}>
            {signUp.signIn}
          </Button>
          <Button variant="text" href={`#${SECTION_ID.listings}`}>
            {signUp.browse}
          </Button>
        </SignUpActions>
      </SignUpLayout>
    </Section>
  );
}
