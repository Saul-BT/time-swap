import {
  FormFieldHead,
  FormFieldLabel,
  FormFieldRoot,
} from "./FormField.style";
import { formFieldClasses } from "./FormField.util";

export type FormFieldProps = {
  /** Id of the control rendered as `children`. */
  htmlFor: string;
  label: React.ReactNode;
  /** Secondary action shown on the label row, such as a recovery link. */
  aside?: React.ReactNode;
  children: React.ReactNode;
};

/** Label above a control, with room for one aside on the label row. */
export default function FormField({
  htmlFor,
  label,
  aside,
  children,
}: FormFieldProps) {
  return (
    <FormFieldRoot className={formFieldClasses.root}>
      <FormFieldHead className={formFieldClasses.head}>
        <FormFieldLabel className={formFieldClasses.label} htmlFor={htmlFor}>
          {label}
        </FormFieldLabel>
        {aside ? <span className={formFieldClasses.aside}>{aside}</span> : null}
      </FormFieldHead>
      {children}
    </FormFieldRoot>
  );
}
