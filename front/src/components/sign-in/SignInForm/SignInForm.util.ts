import { createComponentClasses } from "@/lib/mui/componentClasses";

export const signInFormClasses = createComponentClasses("SignInForm", [
  "root",
  "title",
  "lead",
  "remember",
  "submit",
  "switch",
]);

export const SIGN_IN_FIELD_ID = {
  email: "sign-in-email",
  password: "sign-in-password",
  remember: "sign-in-remember",
} as const;
