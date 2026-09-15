"use client";

import Switch from "@mui/material/Switch";
import { useId } from "react";
import {
  ConsequenceRowBody,
  ConsequenceRowControl,
  ConsequenceRowNow,
  ConsequenceRowRoot,
  ConsequenceRowText,
  ConsequenceRowTitle,
} from "./ConsequenceRow.style";
import { consequenceRowClasses } from "./ConsequenceRow.util";

export type ConsequenceRowProps = {
  name: string;
  title: string;
  /** What changes for other people, in one sentence. */
  body: string;
  /** "Ahora mismo:" */
  nowLabel: string;
  /** The current effect in words, such as "solo miembros verificados". */
  nowValue: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
};

/** A privacy switch that always says what it does and what is true right now. */
export default function ConsequenceRow({
  name,
  title,
  body,
  nowLabel,
  nowValue,
  checked,
  onChange,
  disabled,
}: ConsequenceRowProps) {
  const titleId = useId();
  const bodyId = useId();

  return (
    <ConsequenceRowRoot className={consequenceRowClasses.root}>
      <ConsequenceRowText className={consequenceRowClasses.text}>
        <ConsequenceRowTitle
          className={consequenceRowClasses.title}
          id={titleId}
        >
          {title}
        </ConsequenceRowTitle>
        <ConsequenceRowBody className={consequenceRowClasses.body} id={bodyId}>
          {body}
        </ConsequenceRowBody>
        <ConsequenceRowNow
          className={consequenceRowClasses.now}
          aria-live="polite"
        >
          {nowLabel} <strong>{nowValue}</strong>
        </ConsequenceRowNow>
      </ConsequenceRowText>
      <ConsequenceRowControl className={consequenceRowClasses.control}>
        <Switch
          name={name}
          value="on"
          checked={checked}
          onChange={(_, next) => onChange(next)}
          disabled={disabled}
          slotProps={{
            input: { "aria-labelledby": titleId, "aria-describedby": bodyId },
          }}
        />
      </ConsequenceRowControl>
    </ConsequenceRowRoot>
  );
}
