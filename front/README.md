# Time Swap · front

Web app for [Time Swap](../README.md). Next.js 16, React 19, MUI 9, TypeScript, Biome, bun.

```bash
bun install
bun run dev        # http://localhost:3000 → redirects to /es or /en
bun run lint       # biome check
bun run format     # biome format --write
bun run build
```

Routes:

| Path | What |
|---|---|
| `/es`, `/en` | Landing (single page for now) |
| `/brand-book` | Design system reference, rendered from the live theme |

Working on the code? Start with [`AGENTS.md`](AGENTS.md) and [`docs/conventions.md`](docs/conventions.md). Product and domain docs are at the repo root under [`docs/`](../docs/).
