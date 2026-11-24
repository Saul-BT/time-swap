import { updateTag } from "next/cache";
import { cache } from "react";
import { CACHE_TAG } from "@/data/cache-tags";
import { SAMPLE_COMPLETION, SAMPLE_PROFILE } from "@/data/profile";
import type { CompletionStatus, Profile } from "@/data/types";
import type { PanelActionState } from "@/lib/forms/actionState";
import { finishSave, mockRequest } from "./mock";

/**
 * FIXME(api): the loaders below stand in for #5 — the session cookie,
 * `GET /profile/me/completion`, `GET /profile/me` and `GET /members/:id`.
 * Each keeps the shape and the timing its endpoint will have, so integrating
 * means replacing a body with a `fetch` and dropping the `mockRequest` call.
 * Keep them split: the completion and the profile stream independently.
 *
 * With Cache Components, the owner reads become `'use cache: private'` (they
 * depend on the session cookie) tagged with `CACHE_TAG.profile` and
 * `CACHE_TAG.completion`; `getMember` becomes `'use cache'` tagged with
 * `CACHE_TAG.member`, and the per-viewer filter stays outside the cache.
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

/**
 * Saves a section and expires what it changed, so the meter, the badges and
 * the public profile come back fresh in the action's own response.
 */
export async function saveProfile(
  formData: FormData,
): Promise<Extract<PanelActionState, { status: "saved" | "failed" }>> {
  // FIXME(api): PATCH /profile/me with the section's fields (#5).
  const result = await finishSave(formData);

  if (result.status === "saved") {
    const memberId = await getSessionMemberId();

    updateTag(CACHE_TAG.profile(memberId));
    updateTag(CACHE_TAG.completion(memberId));
    updateTag(CACHE_TAG.member(memberId));
  }

  return result;
}
