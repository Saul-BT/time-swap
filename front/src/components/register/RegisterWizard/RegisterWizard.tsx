"use client";

import type { FormEvent } from "react";
import { useState } from "react";
import type { Dictionary } from "@/i18n/types";
import RegisterStepper from "../RegisterStepper";
import RegisterStepAccount from "./RegisterStepAccount";
import RegisterStepPassword from "./RegisterStepPassword";
import RegisterStepProfile from "./RegisterStepProfile";
import { RegisterWizardRoot } from "./RegisterWizard.style";
import {
  type CategoryOption,
  INITIAL_REGISTER_VALUES,
  type RegisterValues,
  registerWizardClasses,
} from "./RegisterWizard.util";
import RegisterWizardDone from "./RegisterWizardDone";

export type RegisterWizardProps = {
  copy: Dictionary["register"];
  tagOptions: readonly CategoryOption[];
  signInHref: string;
};

type Step = 1 | 2 | 3;

/**
 * FIXME(register): `values` never leaves this component's state — there is
 * no back end yet to send it to, and it is discarded on unmount. Wire the
 * real submit once the sign-up endpoint exists.
 */

export default function RegisterWizard({
  copy,
  tagOptions,
  signInHref,
}: RegisterWizardProps) {
  const [step, setStep] = useState<Step>(1);
  const [done, setDone] = useState(false);
  const [values, setValues] = useState<RegisterValues>(INITIAL_REGISTER_VALUES);
  const [passwordMismatch, setPasswordMismatch] = useState(false);

  function handleAccountSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);

    setValues((current) => ({
      ...current,
      fullName: String(data.get("fullName") ?? ""),
      postalCode: String(data.get("postalCode") ?? ""),
      nickname: String(data.get("nickname") ?? ""),
      email: String(data.get("email") ?? ""),
    }));
    setStep(2);
  }

  function handlePasswordSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const password = String(data.get("password") ?? "");
    const confirmPassword = String(data.get("confirmPassword") ?? "");

    if (password !== confirmPassword) {
      setPasswordMismatch(true);
      return;
    }

    setPasswordMismatch(false);
    setValues((current) => ({ ...current, password }));
    setStep(3);
  }

  function toggleTag(group: "skills" | "interests", id: string) {
    setValues((current) => {
      const next = new Set(current[group]);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return { ...current, [group]: next };
    });
  }

  if (done) {
    return <RegisterWizardDone copy={copy.done} signInHref={signInHref} />;
  }

  const stepLabels = [
    copy.stepper.account,
    copy.stepper.password,
    copy.stepper.profile,
  ];

  return (
    <RegisterWizardRoot className={registerWizardClasses.root}>
      <RegisterStepper
        steps={stepLabels}
        current={step}
        label={copy.stepper.label}
      />

      {step === 1 ? (
        <RegisterStepAccount
          copy={copy.account}
          defaultValues={values}
          onSubmit={handleAccountSubmit}
        />
      ) : null}

      {step === 2 ? (
        <RegisterStepPassword
          copy={copy.password}
          mismatch={passwordMismatch}
          onBack={() => setStep(1)}
          onSubmit={handlePasswordSubmit}
        />
      ) : null}

      {step === 3 ? (
        <RegisterStepProfile
          copy={copy.profile}
          tagOptions={tagOptions}
          skills={values.skills}
          interests={values.interests}
          onToggleSkill={(id) => toggleTag("skills", id)}
          onToggleInterest={(id) => toggleTag("interests", id)}
          onBack={() => setStep(2)}
          onSkip={() => setDone(true)}
          onSave={() => setDone(true)}
        />
      ) : null}
    </RegisterWizardRoot>
  );
}
