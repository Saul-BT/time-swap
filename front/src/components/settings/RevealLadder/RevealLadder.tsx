"use client";

import { useEffect, useRef, useState } from "react";
import { REVEAL_ORDER, type RevealMoment } from "@/data/types";
import {
  RevealLadderHint,
  RevealLadderInput,
  RevealLadderLegend,
  RevealLadderRoot,
  RevealLadderStep,
  RevealLadderSteps,
  type StepState,
} from "./RevealLadder.style";
import {
  ARRIVAL_MS,
  type RevealLadderCopy,
  revealLadderClasses,
} from "./RevealLadder.util";

export type RevealLadderProps = {
  /** Anchor the visibility matrix links to. */
  id: string;
  name: string;
  copy: RevealLadderCopy;
  value: RevealMoment;
  onChange: (moment: RevealMoment) => void;
  disabled?: boolean;
};

/**
 * Four ordered moments as one radio group. Choosing one implies the later
 * ones, so the earlier steps grey out: those people do not see the data (ADR 0013).
 */
export default function RevealLadder({
  id,
  name,
  copy,
  value,
  onChange,
  disabled,
}: RevealLadderProps) {
  const root = useRef<HTMLFieldSetElement>(null);
  const [marked, setMarked] = useState(false);
  const chosenIndex = REVEAL_ORDER.indexOf(value);

  useEffect(() => {
    if (window.location.hash !== `#${id}`) {
      return;
    }

    setMarked(true);
    root.current?.focus();
    root.current?.scrollIntoView({ block: "center" });

    const timer = setTimeout(() => setMarked(false), ARRIVAL_MS);

    return () => clearTimeout(timer);
  }, [id]);

  return (
    <RevealLadderRoot
      ref={root}
      id={id}
      tabIndex={-1}
      className={revealLadderClasses.root}
      disabled={disabled}
      ownerState={{ marked }}
    >
      <RevealLadderLegend className={revealLadderClasses.legend}>
        {copy.legend}
      </RevealLadderLegend>
      <RevealLadderSteps className={revealLadderClasses.steps}>
        {REVEAL_ORDER.map((moment, index) => {
          const state: StepState =
            index < chosenIndex
              ? "before"
              : index === chosenIndex
                ? "chosen"
                : "after";

          return (
            <RevealLadderStep
              key={moment}
              className={revealLadderClasses.step}
              ownerState={{ state }}
            >
              <RevealLadderInput
                className={revealLadderClasses.input}
                type="radio"
                name={name}
                value={moment}
                checked={moment === value}
                onChange={() => onChange(moment)}
                disabled={disabled}
              />
              <span className={revealLadderClasses.label}>
                {copy.moments[moment]}
              </span>
            </RevealLadderStep>
          );
        })}
      </RevealLadderSteps>
      <RevealLadderHint className={revealLadderClasses.hint}>
        {copy.hints[value]}
      </RevealLadderHint>
    </RevealLadderRoot>
  );
}
