"use client";

import { Check } from "lucide-react";
import { type KeyboardEvent, useRef } from "react";
import { DAY_SLOTS, WEEKDAYS } from "@/data/settings";
import type { AvailabilityCell, DaySlot, Weekday } from "@/data/types";
import { interpolate } from "@/lib/i18n/interpolate";
import Icon from "../../ui/Icon";
import {
  WeekGridCell,
  WeekGridHead,
  WeekGridRoot,
  WeekGridRowHead,
  WeekGridTable,
  WeekGridToggle,
} from "./WeekGrid.style";
import {
  toCell,
  toggleCell,
  type WeekGridCopy,
  type WeekGridOrientation,
  weekGridClasses,
} from "./WeekGrid.util";

export type WeekGridProps = {
  name: string;
  copy: WeekGridCopy;
  value: readonly AvailabilityCell[];
  onChange: (cells: AvailabilityCell[]) => void;
  disabled?: boolean;
};

const ARROW_KEYS = ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"];

/**
 * Week × slot grid of checkbox cells. Arrow keys move between cells inside
 * the visible table; Space and Enter toggle. Never a calendar: nothing is booked.
 */
export default function WeekGrid({
  name,
  copy,
  value,
  onChange,
  disabled,
}: WeekGridProps) {
  const roots = useRef<Record<WeekGridOrientation, HTMLTableElement | null>>({
    daysAcross: null,
    daysDown: null,
  });

  const moveFocus = (
    event: KeyboardEvent<HTMLButtonElement>,
    orientation: WeekGridOrientation,
  ) => {
    if (!ARROW_KEYS.includes(event.key)) {
      return;
    }

    const table = roots.current[orientation];
    const cells = table
      ? Array.from(table.querySelectorAll<HTMLButtonElement>("button"))
      : [];
    const index = cells.indexOf(event.currentTarget);
    const columns =
      orientation === "daysAcross" ? WEEKDAYS.length : DAY_SLOTS.length;

    if (index < 0) {
      return;
    }

    const delta = {
      ArrowLeft: -1,
      ArrowRight: 1,
      ArrowUp: -columns,
      ArrowDown: columns,
    }[event.key as (typeof ARROW_KEYS)[number]];
    const target = cells[index + (delta ?? 0)];

    if (target) {
      event.preventDefault();
      target.focus();
    }
  };

  const renderToggle = (
    day: Weekday,
    slot: DaySlot,
    orientation: WeekGridOrientation,
    tabbable: boolean,
  ) => {
    const cell = toCell(day, slot);
    const checked = value.includes(cell);

    return (
      <WeekGridCell key={cell} className={weekGridClasses.cell}>
        <WeekGridToggle
          className={weekGridClasses.toggle}
          type="button"
          role="checkbox"
          aria-checked={checked}
          aria-label={interpolate(copy.cellLabel, {
            day: copy.daysLong[day],
            slot: copy.slots[slot],
          })}
          tabIndex={tabbable ? 0 : -1}
          disabled={disabled}
          ownerState={{ checked }}
          onClick={() => onChange(toggleCell(value, cell))}
          onKeyDown={(event) => moveFocus(event, orientation)}
        >
          {checked ? <Icon icon={Check} /> : null}
        </WeekGridToggle>
      </WeekGridCell>
    );
  };

  return (
    <WeekGridRoot
      className={weekGridClasses.root}
      role="group"
      aria-label={copy.label}
    >
      <WeekGridTable
        ref={(node) => {
          roots.current.daysAcross = node;
        }}
        className={weekGridClasses.table}
        ownerState={{ orientation: "daysAcross" }}
      >
        <thead>
          <tr>
            <WeekGridHead className={weekGridClasses.head} scope="col" />
            {WEEKDAYS.map((day) => (
              <WeekGridHead
                key={day}
                className={weekGridClasses.head}
                scope="col"
                abbr={copy.daysLong[day]}
              >
                {copy.days[day]}
              </WeekGridHead>
            ))}
          </tr>
        </thead>
        <tbody>
          {DAY_SLOTS.map((slot, rowIndex) => (
            <tr key={slot}>
              <WeekGridRowHead className={weekGridClasses.rowHead} scope="row">
                {copy.slots[slot]}
              </WeekGridRowHead>
              {WEEKDAYS.map((day, columnIndex) =>
                renderToggle(
                  day,
                  slot,
                  "daysAcross",
                  rowIndex === 0 && columnIndex === 0,
                ),
              )}
            </tr>
          ))}
        </tbody>
      </WeekGridTable>

      <WeekGridTable
        ref={(node) => {
          roots.current.daysDown = node;
        }}
        className={weekGridClasses.table}
        ownerState={{ orientation: "daysDown" }}
      >
        <thead>
          <tr>
            <WeekGridHead className={weekGridClasses.head} scope="col" />
            {DAY_SLOTS.map((slot) => (
              <WeekGridHead
                key={slot}
                className={weekGridClasses.head}
                scope="col"
              >
                {copy.slots[slot]}
              </WeekGridHead>
            ))}
          </tr>
        </thead>
        <tbody>
          {WEEKDAYS.map((day, rowIndex) => (
            <tr key={day}>
              <WeekGridRowHead className={weekGridClasses.rowHead} scope="row">
                {copy.daysLong[day]}
              </WeekGridRowHead>
              {DAY_SLOTS.map((slot, columnIndex) =>
                renderToggle(
                  day,
                  slot,
                  "daysDown",
                  rowIndex === 0 && columnIndex === 0,
                ),
              )}
            </tr>
          ))}
        </tbody>
      </WeekGridTable>

      <input type="hidden" name={name} value={value.join(",")} />
    </WeekGridRoot>
  );
}
