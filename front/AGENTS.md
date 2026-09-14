# front/ — Time Swap web app

Next.js 16 (App Router, Turbopack, React Compiler) + React 19 + MUI 9 on Emotion. TypeScript strict. Biome for lint and format. **bun** is the package manager (`bun install`, `bun run dev|build|lint|format|typecheck`).

- Product definition, domain model and decisions live at the repo root: `../README.md`, `../docs/`, `../docs/adr/`. Front decisions are ADRs there too (0008 onwards).
- Conventions for this app: [`docs/conventions.md`](docs/conventions.md). Read it before adding or changing a component, a token, a locale string or a route. It also lists the traps that already cost time (client-module proxies, `sx` callbacks, CSS layers, `Typography color`).
- Design system: **Relevo**, specified in `../docs/sistema-de-diseno.md`. Tokens in `src/theme/tokens.ts`, the only file allowed to contain a hex value. `/brand-book` renders the live theme.
- Code, identifiers and comments in English. Product copy in Spanish, in `src/i18n/dictionaries/es.json` (source of truth; `en.json` must match its shape).
- Comments: default none. Keep one only for a constraint the code cannot show (a why, a trap, a domain rule). Never name call sites or consumers. Examples go in JSDoc `@example`.
- Everything is a Server Component unless it needs state or events. Nothing in `src/data`, `src/theme` or `src/i18n` imports from `src/components`.
- Before finishing: `bun run lint && bun run typecheck`. No test runner yet (decision pending, see conventions §Testing).

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
