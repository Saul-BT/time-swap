import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import type { Dictionary } from "@/i18n/types";
import {
  RegisterFormLead,
  RegisterFormTitle,
  RegisterWizardRoot,
} from "./RegisterWizard.style";
import { registerWizardClasses } from "./RegisterWizard.util";

export type RegisterWizardDoneProps = {
  copy: Dictionary["register"]["done"];
  signInHref: string;
};

/** Mock confirmation: there is no back end yet, so nothing was actually saved. */
export default function RegisterWizardDone({
  copy,
  signInHref,
}: RegisterWizardDoneProps) {
  return (
    <RegisterWizardRoot className={registerWizardClasses.root}>
      <RegisterFormTitle variant="h2" component="h1">
        {copy.title}
      </RegisterFormTitle>
      <RegisterFormLead variant="body1">{copy.lead}</RegisterFormLead>
      <Typography variant="body2" sx={{ mb: 4 }}>
        {copy.body}
      </Typography>
      <Button variant="contained" href={signInHref}>
        {copy.cta}
      </Button>
    </RegisterWizardRoot>
  );
}
