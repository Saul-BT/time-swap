/** Same entries regardless of order: what a form compares to decide it is dirty. */
export function sameItems<T>(a: readonly T[], b: readonly T[]): boolean {
  return a.length === b.length && a.every((item) => b.includes(item));
}
