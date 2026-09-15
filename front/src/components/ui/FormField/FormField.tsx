import FieldError from "../FieldError";
import {
  FormFieldHead,
  FormFieldHint,
  FormFieldLabel,
  FormFieldRoot,
} from "./FormField.style";
import { formFieldClasses, formFieldIds } from "./FormField.util";

export type FormFieldProps = {
  /** Id of the control rendered as `children`. */
  htmlFor: string;
  label: React.ReactNode;
  /** Secondary action shown on the label row, such as a recovery link. */
  aside?: React.ReactNode;
  /** Explains the field; announced through `formFieldIds(htmlFor).hint`. */
  hint?: React.ReactNode;
  /** Validation message; announced through `formFieldIds(htmlFor).error`. */
  error?: React.ReactNode;
  children: React.ReactNode;
};

/** Label above a control, with room for one aside on the label row and texts below. */
export default function FormField({
  htmlFor,
  label,
  aside,
  hint,
  error,
  children,
}: FormFieldProps) {
  const ids = formFieldIds(htmlFor);

  return (
    <FormFieldRoot className={formFieldClasses.root}>
      <FormFieldHead className={formFieldClasses.head}>
        <FormFieldLabel className={formFieldClasses.label} htmlFor={htmlFor}>
          {label}
        </FormFieldLabel>
        {aside ? <span className={formFieldClasses.aside}>{aside}</span> : null}
      </FormFieldHead>
      {children}
      {error ? (
        <FieldError className={formFieldClasses.error} id={ids.error}>
          {error}
        </FieldError>
      ) : null}
      {hint ? (
        <FormFieldHint className={formFieldClasses.hint} id={ids.hint}>
          {hint}
        </FormFieldHint>
      ) : null}
    </FormFieldRoot>
  );
}
