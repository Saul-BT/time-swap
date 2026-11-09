import {
  RegisterStepperCircle,
  RegisterStepperConnector,
  RegisterStepperItem,
  RegisterStepperLabel,
  RegisterStepperRoot,
} from "./RegisterStepper.style";
import { registerStepperClasses } from "./RegisterStepper.util";

export type RegisterStepperProps = {
  steps: readonly string[];
  /** 1-based index of the step being shown. */
  current: number;
  label: string;
};

/** Progress read-out for the register wizard: filled up to the current step. */
export default function RegisterStepper({
  steps,
  current,
  label,
}: RegisterStepperProps) {
  return (
    <RegisterStepperRoot
      className={registerStepperClasses.root}
      aria-label={label}
    >
      {steps.map((label, index) => {
        const stepNumber = index + 1;
        const filled = stepNumber <= current;

        return (
          <RegisterStepperItem
            key={label}
            className={registerStepperClasses.item}
          >
            <RegisterStepperCircle
              className={registerStepperClasses.circle}
              ownerState={{ filled }}
              aria-current={stepNumber === current ? "step" : undefined}
            >
              {stepNumber}
            </RegisterStepperCircle>
            <RegisterStepperLabel
              className={registerStepperClasses.label}
              variant="body2"
              component="span"
            >
              {label}
            </RegisterStepperLabel>
            {stepNumber < steps.length ? (
              <RegisterStepperConnector
                className={registerStepperClasses.connector}
                ownerState={{ filled: stepNumber < current }}
              />
            ) : null}
          </RegisterStepperItem>
        );
      })}
    </RegisterStepperRoot>
  );
}
