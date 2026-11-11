# `src/data` — sample content and content structure

Two kinds of thing live here, and the difference matters:

- **Sample content** (`listings.ts`, `members.ts`, `conversations.ts`).
  Placeholder stand-ins for user-written text. It is **not** translated and does
  not belong in the dictionary: a listing title is whatever its author typed, so
  an English page showing `[Nombre] · [Barrio]` in a sample card is correct, not
  a bug.
- **Content structure** (`filters.ts`, `categories.ts`, `ledger-facts.ts`,
  `navigation.ts`). Ids and ordering only. Every user-facing label for these
  comes from `src/i18n/dictionaries`, and the id *is* the dictionary key.

Names, neighbourhoods and counts are written between square brackets
(`[Nombre]`, `[Barrio]`, `[n]`) on purpose, so nobody mistakes them for real data
and so the UI is exercised with realistic string lengths.

The ids in `types.ts` are derived from the dictionary shape, so adding a category
without translating it — or translating one that is never listed — fails the
build instead of rendering an empty label.

Nothing here imports from `src/components` or `src/theme`. The dependency only
goes one way: components read data, never the other way round.

When a real source of listings arrives, replace the sample modules with the
fetching layer and keep the types: the components consume the types, not the
constants.
