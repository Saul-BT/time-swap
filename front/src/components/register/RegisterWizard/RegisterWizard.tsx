"use client";

import { useRouter } from "next/navigation";
import type { FormEvent } from "react";
import { useState, useTransition } from "react";
import type {
  RegisterErrorId,
  RegisterInput,
  RegisterResult,
} from "@/data/types";
import type { Dictionary } from "@/i18n/types";
import { meetsPasswordPolicy } from "../PasswordStrengthMeter";
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

export type RegisterWizardProps = {
  copy: Dictionary["register"];
  tagOptions: readonly CategoryOption[];
  homeHref: string;
  action: (input: RegisterInput) => Promise<RegisterResult>;
};

type Step = 1 | 2 | 3;

/**
 * The account is created when the password step is submitted: the profile
 * step is optional. FIXME(register): nickname, postal code, skills and
 * interests are not sent — the sign-up endpoint does not accept them yet.
 */

export default function RegisterWizard({
  copy,
  tagOptions,
  homeHref,
  action,
}: RegisterWizardProps) {
  const router = useRouter();
  const [step, setStep] = useState<Step>(1);
  const [values, setValues] = useState<RegisterValues>(INITIAL_REGISTER_VALUES);
  const [passwordMismatch, setPasswordMismatch] = useState(false);
  const [passwordWeak, setPasswordWeak] = useState(false);
  const [error, setError] = useState<RegisterErrorId>();
  const [pending, startTransition] = useTransition();

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
    setError(undefined);
    setStep(2);
  }

  function handlePasswordSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const password = String(data.get("password") ?? "");
    const confirmPassword = String(data.get("confirmPassword") ?? "");

    const weak = !meetsPasswordPolicy(password);
    const mismatch = password !== confirmPassword;
    setPasswordWeak(weak);
    setPasswordMismatch(mismatch);
    if (weak || mismatch) {
      return;
    }

    setValues((current) => ({ ...current, password }));

    startTransition(async () => {
      const result = await action({
        fullName: values.fullName,
        email: values.email,
        password,
        confirmPassword,
      });

      if (result.ok) {
        setError(undefined);
        setStep(3);
        return;
      }

      setError(result.error);
      if (result.error === "mailTaken") {
        setStep(1);
      }
    });
  }

  // TODO(register): lands on the home page until there is a signed-in area
  // to send the new account to.
  function finish() {
    router.push(homeHref);
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
          error={error === "mailTaken" ? copy.errors.mailTaken : undefined}
          onSubmit={handleAccountSubmit}
        />
      ) : null}

      {step === 2 ? (
        <RegisterStepPassword
          copy={copy.password}
          mismatch={passwordMismatch}
          weak={passwordWeak}
          error={
            error && error !== "mailTaken" ? copy.errors[error] : undefined
          }
          pending={pending}
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
          onSkip={finish}
          onSave={finish}
        />
      ) : null}
    </RegisterWizardRoot>
  );
}
