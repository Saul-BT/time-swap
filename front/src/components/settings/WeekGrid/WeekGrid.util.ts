import type { AvailabilityCell, DaySlot, Weekday } from "@/data/types";
import { createComponentClasses } from "@/lib/mui/componentClasses";

export type WeekGridCopy = {
  label: string;
  days: Record<Weekday, string>;
  daysLong: Record<Weekday, string>;
  slots: Record<DaySlot, string>;
  /** With `{day}` and `{slot}`. */
  cellLabel: string;
};

/** Days across, slots down: the desktop reading. Transposed below `md`. */
export type WeekGridOrientation = "daysAcross" | "daysDown";

export function toCell(day: Weekday, slot: DaySlot): AvailabilityCell {
  return `${day}.${slot}`;
}

export function toggleCell(
  cells: readonly AvailabilityCell[],
  cell: AvailabilityCell,
): AvailabilityCell[] {
  return cells.includes(cell)
    ? cells.filter((current) => current !== cell)
    : [...cells, cell];
}

export const weekGridClasses = createComponentClasses("WeekGrid", [
  "root",
  "table",
  "head",
  "rowHead",
  "cell",
  "toggle",
]);
