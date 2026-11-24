"use server";

import { updateTag } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { CACHE_TAG } from "@/data/cache-tags";
import type { Locale } from "@/i18n/config";
import { localizePath } from "@/i18n/routes";

export async function createListingAction(
  locale: Locale,
  formData: FormData,
): Promise<void> {
  //get jwt token from cookies
  const cookieStore = await cookies();
  const token = cookieStore.get("accessToken")?.value;

  const response = await fetch(`${process.env.BACKEND_URL}/listing/create`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      title: formData.get("title"),
      description: formData.get("description"),
      kind: formData.get("kind"),
      mode: formData.get("mode"),
      categoryId: formData.get("categoryId"),
      duration: formData.get("hours"),
      location: formData.get("area"),
    }),
  });

  if (!response.ok) {
    throw new Error(`Failed to create listing: ${response.statusText}`);
  }

  updateTag(CACHE_TAG.listings);
  redirect(localizePath(locale, "loggedHome"));
}
