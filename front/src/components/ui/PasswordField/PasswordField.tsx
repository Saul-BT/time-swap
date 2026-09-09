"use client";

import InputAdornment from "@mui/material/InputAdornment";
import OutlinedInput from "@mui/material/OutlinedInput";
import { useState } from "react";
import { PasswordFieldToggle } from "./PasswordField.style";
import { passwordFieldClasses } from "./PasswordField.util";

export type PasswordFieldProps = {
  id: string;
  name: string;
  /** Copy for the visibility toggle, passed down from a server component. */
  showLabel: string;
  hideLabel: string;
  autoComplete?: "current-password" | "new-password";
  required?: boolean;
  error?: boolean;
};

/** Password input with a text toggle that reveals what was typed. */
export default function PasswordField({
  id,
  name,
  showLabel,
  hideLabel,
  autoComplete = "current-password",
  required,
  error,
}: PasswordFieldProps) {
  const [visible, setVisible] = useState(false);

  return (
    <OutlinedInput
      className={passwordFieldClasses.root}
      id={id}
      name={name}
      type={visible ? "text" : "password"}
      autoComplete={autoComplete}
      required={required}
      error={error}
      fullWidth
      endAdornment={
        <InputAdornment position="end">
          <PasswordFieldToggle
            className={passwordFieldClasses.toggle}
            type="button"
            aria-pressed={visible}
            aria-controls={id}
            onClick={() => setVisible((current) => !current)}
          >
            {visible ? hideLabel : showLabel}
          </PasswordFieldToggle>
        </InputAdornment>
      }
    />
  );
}
