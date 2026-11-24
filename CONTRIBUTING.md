# Contributing to Time Swap

Thanks for helping. This guide covers how work moves from an issue to `main`. What the product is lives in [`README.md`](README.md); how each app is written lives next to its code.

## Before you start

- Read the product definition ([`README.md`](README.md)) and the decisions in [`docs/adr/`](docs/adr/README.md).
- Front-end work: read [`front/AGENTS.md`](front/AGENTS.md) and [`front/docs/conventions.md`](front/docs/conventions.md) first.
- Pick an open issue or open one with a template. Work is planned as **user stories** (`historia`) grouped in **epics** (`epic`); comment on the issue before you take it so nobody duplicates it.

## Running the project

| App | Path | Package manager | Commands |
|---|---|---|---|
| Web | `front/` | bun | `bun install`, `bun run dev`, `bun run lint`, `bun run typecheck`, `bun run build` |
| API | `back/nest-back/` | pnpm | `pnpm install`, `pnpm run start:dev`, `pnpm run lint`, `pnpm run test`, `pnpm run build` |

The full stack (front, API, Postgres, Redis) runs with Docker. Copy `back/nest-back/.env.example` to `back/nest-back/.env`, fill it in, then:

```bash
docker compose --env-file back/nest-back/.env up -d --build
```

Never commit a `.env` file or any secret.

## Branches and commits

- Branch from `main`: `feat/<topic>`, `fix/<topic>`, `chore/<topic>`, `docs/<topic>`.
- Commits follow [Conventional Commits](https://www.conventionalcommits.org/), with the app as scope when it applies: `feat(front): …`, `fix(back): …`, `docs: …`.
- Keep a pull request to one story or one fix. Stack branches when a change depends on an open PR, and say so in the description.

## Pull requests

1. Open the PR against `main` and fill in the template. Link the issue with `Closes #n`.
2. Add the `frontend` and/or `backend` label.
3. When it is ready, add the `ready to review` label. Draft PRs are welcome for early feedback.
4. At least one other member reviews before merging.

Before asking for review:

- **Front:** `bun run lint && bun run typecheck` pass, and `bun run build` passes when routes or dictionaries change.
- **Back:** `pnpm run lint`, `pnpm run test` and `pnpm run build` pass; Swagger reflects any endpoint change.
- No private data (exact location, contact details) reaches a response or a screen that should not see it.

## Documentation and language

- Product docs and ADRs: Spanish. Code, identifiers, comments and convention docs: English.
- The product name is **Time Swap**.
- A decision that is costly to reverse, would surprise someone without context, and had a real alternative gets an ADR in [`docs/adr/`](docs/adr/README.md). A code convention does not: it goes in the app's conventions doc.
- User-facing copy in the front goes in the dictionaries (`front/src/i18n/dictionaries/`), never hard-coded.

## License

By contributing you agree that your contributions are licensed under the [MIT License](LICENSE).
