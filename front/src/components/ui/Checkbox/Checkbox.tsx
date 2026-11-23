"use client";

import type { ChangeEvent } from "react";
import { CheckboxBox, CheckboxLabel, CheckboxRoot } from "./Checkbox.style";
import { checkboxClasses } from "./Checkbox.util";

export type CheckboxProps = {
  id: string;
  name: string;
  label: React.ReactNode;
  /** Decoration placed before the label text. */
  icon?: React.ReactNode;
  checked?: boolean;
  defaultChecked?: boolean;
  onChange?: (event: ChangeEvent<HTMLInputElement>, checked: boolean) => void;
  disabled?: boolean;
  value?: string;
};

/** Square, ruled checkbox with its label. No ripple: nothing in the system radiates. */
export default function Checkbox({
  id,
  name,
  label,
  icon,
  checked,
  defaultChecked,
  onChange,
  disabled,
  value = "on",
}: CheckboxProps) {
  const control = (
    <CheckboxRoot
      className={checkboxClasses.root}
      id={id}
      name={name}
      value={value}
      checked={checked}
      defaultChecked={defaultChecked}
      onChange={onChange}
      disabled={disabled}
      disableRipple
      icon={
        <CheckboxBox
          className={checkboxClasses.box}
          ownerState={{ checked: false }}
        />
      }
      checkedIcon={
        <CheckboxBox
          className={checkboxClasses.box}
          ownerState={{ checked: true }}
        />
      }
    />
  );

  return (
    <CheckboxLabel
      className={checkboxClasses.label}
      label={
        icon ? (
          <>
            <span className={checkboxClasses.icon} aria-hidden>
              {icon}
            </span>
            {label}
          </>
        ) : (
          label
        )
      }
      control={control}
      disabled={disabled}
    />
  );
}
