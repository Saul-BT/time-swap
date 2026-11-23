import { connection } from "next/server";
import type { PanelActionState } from "@/lib/forms/actionState";

/**
 * FIXME(api): scaffolding for #5. When the endpoints exist, delete this module
 * and the calls to it.
 */

/** Latency of a mocked endpoint. `MOCK_API_LATENCY_MS=0` turns it off. */
const LATENCY_MS = Number(process.env.MOCK_API_LATENCY_MS ?? 900);

/**
 * Without `connection()` the mock resolves at build time and the route turns
 * static, so no skeleton is ever reachable; without the wait it resolves too
 * fast to see one.
 */
export async function mockRequest(): Promise<void> {
  await connection();
  await mockLatency();
}

/**
 * Stand-in for the save round trip of a section's server action.
 * A form can force the failed state in development by sending `__fail=1`.
 */
export async function finishSave(
  formData: FormData,
): Promise<Extract<PanelActionState, { status: "saved" | "failed" }>> {
  await mockLatency();

  if (process.env.NODE_ENV !== "production" && formData.get("__fail") === "1") {
    return { status: "failed" };
  }

  return { status: "saved", savedAt: Date.now() };
}

async function mockLatency(): Promise<void> {
  if (LATENCY_MS > 0) {
    await new Promise((resolve) => setTimeout(resolve, LATENCY_MS));
  }
}
