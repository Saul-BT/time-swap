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

/**
 * Stand-in for the network round trip while the API does not exist.
 * A form can force the failed state in development by sending `__fail=1`.
 */
export async function finishSave(
  formData: FormData,
): Promise<Extract<PanelActionState, { status: "saved" | "failed" }>> {
  await new Promise((resolve) => setTimeout(resolve, 600));

  if (process.env.NODE_ENV !== "production" && formData.get("__fail") === "1") {
    return { status: "failed" };
  }

  return { status: "saved", savedAt: Date.now() };
}
