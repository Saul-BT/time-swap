export const CACHE_TAG = {
  categories: "categories",
  listings: "listings",
  listing: (id: number) => `listing:${id}`,
  profile: (memberId: string) => `profile:${memberId}`,
  completion: (memberId: string) => `completion:${memberId}`,
  member: (memberId: string) => `member:${memberId}`,
} as const;
