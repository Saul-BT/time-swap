import { connection } from "next/server";

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

  if (LATENCY_MS > 0) {
    await new Promise((resolve) => setTimeout(resolve, LATENCY_MS));
  }
}
