import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { SECTION_ID } from "@/data/navigation";
import { getDictionary } from "@/i18n/dictionary";
import Section from "../../layout/Section";
import { SignUpActions, SignUpCopy, SignUpLayout } from "./SignUpSection.style";
import { signUpSectionClasses } from "./SignUpSection.util";

export default async function SignUpSection() {
  const { signUp } = await getDictionary();

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
          <Button variant="outlined" href={`#${SECTION_ID.signUp}`}>
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
