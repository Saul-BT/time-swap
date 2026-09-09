"use client";

import { CheckboxBox, CheckboxLabel, CheckboxRoot } from "./Checkbox.style";
import { checkboxClasses } from "./Checkbox.util";

export type CheckboxProps = {
  id: string;
  name: string;
  label: React.ReactNode;
  defaultChecked?: boolean;
  value?: string;
};

/** Square, ruled checkbox with its label. No ripple: nothing in the system radiates. */
export default function Checkbox({
  id,
  name,
  label,
  defaultChecked,
  value = "on",
}: CheckboxProps) {
  return (
    <CheckboxLabel
      className={checkboxClasses.label}
      label={label}
      control={
        <CheckboxRoot
          className={checkboxClasses.root}
          id={id}
          name={name}
          value={value}
          defaultChecked={defaultChecked}
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
      }
    />
  );
}
