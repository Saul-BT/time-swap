import { cacheLife, cacheTag } from "next/cache";
import { notFound } from "next/navigation";
import { connection } from "next/server";
import { CACHE_TAG } from "./cache-tags";

export type Category = { id: number; name: string };

async function fetchCategories(): Promise<Category[]> {
  "use cache";
  cacheLife("hours");
  cacheTag(CACHE_TAG.categories);

  const response = await fetch(`${process.env.BACKEND_URL}/category/search`);

  if (!response.ok) {
    console.log("Error while fetching categories: ", response.statusText);
    notFound();
  }

  return response.json();
}

/** The front image builds without a backend, so this never prerenders. */
export async function getCategories(): Promise<Category[]> {
  await connection();
  return fetchCategories();
}
