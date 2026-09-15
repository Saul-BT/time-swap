import { cache } from "react";
import { SAMPLE_COMPLETION, SAMPLE_PROFILE } from "@/data/profile";
import type { CompletionStatus, Profile } from "@/data/types";
import { mockRequest } from "./mock";

/**
 * FIXME(api): the loaders below stand in for #5 — the session cookie,
 * `GET /profile/me/completion`, `GET /profile/me` and `GET /members/:id`.
 * Each keeps the shape and the timing its endpoint will have, so integrating
 * means replacing a body with a `fetch` and dropping the `mockRequest` call.
 * Keep them split: the completion and the profile stream independently.
 */

/**
 * Who is logged in. Resolves without a round trip on purpose: a layout can
 * await it, and `loading.tsx` cannot cover a layout's own data.
 */
export const getSessionMemberId = cache(async (): Promise<string> => {
  // FIXME(auth): the member id belongs to the session, not to the profile.
  return SAMPLE_PROFILE.userId;
});

export const getCompletion = cache(async (): Promise<CompletionStatus> => {
  await mockRequest();

  return SAMPLE_COMPLETION;
});

export const getProfile = cache(async (): Promise<Profile> => {
  await mockRequest();

  return SAMPLE_PROFILE;
});

/** Only the sample member resolves, so an unknown id can still reach a 404. */
export const getMember = cache(async (id: string): Promise<Profile | null> => {
  await mockRequest();

  return id === SAMPLE_PROFILE.userId ? SAMPLE_PROFILE : null;
});
