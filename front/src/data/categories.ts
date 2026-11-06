import { notFound } from "next/navigation";

export async function getCategories(): Promise<Array<{id: number, name: string}>> {
  const response = await fetch(
      `${process.env.BACKEND_URL}/category/search`,
      {
        cache: 'no-store',
      },
    );
  
    if (!response.ok) {
      console.log("Error while fetching categories: ", response.statusText);
      notFound();
    }
  
    return (await response.json());
}