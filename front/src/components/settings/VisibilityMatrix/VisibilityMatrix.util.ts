import {
  REVEAL_ORDER,
  type RevealableField,
  type RevealMoment,
} from "@/data/types";
import { createComponentClasses } from "@/lib/mui/componentClasses";

export type VisibilityMatrixCopy = {
  label: string;
  dataHeader: string;
  moments: Record<RevealMoment, string>;
  /** Initials the columns fall back to below `md`. */
  momentsShort: Record<RevealMoment, string>;
  rows: Record<
    RevealableField | "nameAndModality" | "district" | "contact",
    string
  >;
  fixed: string;
  never: string;
  /** With `{field}` and `{moment}`. */
  cellLabel: string;
  /** With `{field}`. */
  change: string;
  footnote: string;
};

export type RevealMap = Record<RevealableField, RevealMoment>;

export function isVisibleAt(chosen: RevealMoment, moment: RevealMoment) {
  return REVEAL_ORDER.indexOf(moment) >= REVEAL_ORDER.indexOf(chosen);
}

export const visibilityMatrixClasses = createComponentClasses(
  "VisibilityMatrix",
  [
    "root",
    "table",
    "rowHead",
    "cell",
    "momentShort",
    "momentFull",
    "empty",
    "fixed",
    "never",
    "edit",
    "legend",
    "legendItem",
    "footnote",
  ],
);
