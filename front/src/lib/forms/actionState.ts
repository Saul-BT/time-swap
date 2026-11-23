/**
 * Result of a settings section's server action. Field errors travel as
 * dictionary ids; the form maps them to copy it received as props.
 */
export type PanelActionState<
  FieldId extends string = string,
  ErrorId extends string = string,
> =
  | { status: "idle" }
  | { status: "saved"; savedAt: number }
  | { status: "invalid"; fieldErrors: Partial<Record<FieldId, ErrorId>> }
  | { status: "failed" };

export type FieldErrors<State extends PanelActionState> = Extract<
  State,
  { status: "invalid" }
>["fieldErrors"];

export const IDLE_STATE = {
  status: "idle",
} as const satisfies PanelActionState;
