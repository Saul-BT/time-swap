"use client";

import type { LucideIcon } from "lucide-react";
import Icon from "../Icon";
import {
  SegmentedControlRoot,
  SegmentedControlSegment,
} from "./SegmentedControl.style";
import { segmentedControlClasses } from "./SegmentedControl.util";

export type SegmentedControlOption<Value extends string> = {
  value: Value;
  /** Visible text. Without it the segment shows only its icon and needs `ariaLabel`. */
  label?: string;
  ariaLabel?: string;
  icon?: LucideIcon;
  /** Plain actions such as "next" are buttons, not toggles: no `aria-pressed`. */
  action?: boolean;
};

export type SegmentedControlProps<Value extends string> = {
  label: string;
  options: readonly SegmentedControlOption<Value>[];
  value?: Value;
  onChange: (value: Value) => void;
};

/** A row of joined buttons; at most one is pressed. */
export default function SegmentedControl<Value extends string>({
  label,
  options,
  value,
  onChange,
}: SegmentedControlProps<Value>) {
  return (
    <SegmentedControlRoot
      className={segmentedControlClasses.root}
      role="group"
      aria-label={label}
    >
      {options.map((option) => {
        const pressed = !option.action && option.value === value;

        return (
          <SegmentedControlSegment
            key={option.value}
            className={segmentedControlClasses.segment}
            ownerState={{ pressed }}
            aria-pressed={option.action ? undefined : pressed}
            aria-label={option.ariaLabel}
            onClick={() => onChange(option.value)}
          >
            {option.icon ? <Icon icon={option.icon} size="sm" /> : null}
            {option.label}
          </SegmentedControlSegment>
        );
      })}
    </SegmentedControlRoot>
  );
}
