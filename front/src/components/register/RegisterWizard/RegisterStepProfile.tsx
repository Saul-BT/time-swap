import Button from "@mui/material/Button";
import type { Dictionary } from "@/i18n/types";
import TagToggleGroup from "../TagToggleGroup";
import {
  RegisterFormLead,
  RegisterFormNav,
  RegisterFormNavActions,
  RegisterFormTitle,
  RegisterProfileGroup,
} from "./RegisterWizard.style";
import {
  type CategoryOption,
  registerWizardClasses,
} from "./RegisterWizard.util";

export type RegisterStepProfileProps = {
  copy: Dictionary["register"]["profile"];
  tagOptions: readonly CategoryOption[];
  skills: ReadonlySet<string>;
  interests: ReadonlySet<string>;
  onToggleSkill: (id: string) => void;
  onToggleInterest: (id: string) => void;
  onBack: () => void;
  onSkip: () => void;
  onSave: () => void;
};

/** The only optional step: both actions on the right finish the wizard. */
export default function RegisterStepProfile({
  copy,
  tagOptions,
  skills,
  interests,
  onToggleSkill,
  onToggleInterest,
  onBack,
  onSkip,
  onSave,
}: RegisterStepProfileProps) {
  return (
    <div className={registerWizardClasses.form}>
      <RegisterFormTitle variant="h2" component="h1">
        {copy.title}
      </RegisterFormTitle>
      <RegisterFormLead variant="body1">{copy.lead}</RegisterFormLead>

      <RegisterProfileGroup>
        <TagToggleGroup
          legend={copy.skillsLegend}
          options={tagOptions}
          selected={skills}
          onToggle={onToggleSkill}
        />
      </RegisterProfileGroup>

      <RegisterProfileGroup>
        <TagToggleGroup
          legend={copy.interestsLegend}
          options={tagOptions}
          selected={interests}
          onToggle={onToggleInterest}
        />
      </RegisterProfileGroup>

      <RegisterFormNav className={registerWizardClasses.nav}>
        <Button variant="text" type="button" onClick={onBack}>
          {copy.back}
        </Button>
        <RegisterFormNavActions className={registerWizardClasses.navActions}>
          <Button variant="outlined" type="button" onClick={onSkip}>
            {copy.skip}
          </Button>
          <Button variant="contained" type="button" onClick={onSave}>
            {copy.save}
          </Button>
        </RegisterFormNavActions>
      </RegisterFormNav>
    </div>
  );
}
