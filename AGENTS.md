# Time Swap — repo map

Plataforma para intercambiar tiempo y habilidades sin dinero. Definición de producto en [`README.md`](README.md); dominio, interfaces y decisiones en [`docs/`](docs/).

| Path | Qué es | Contexto propio |
|---|---|---|
| `front/` | Web app Next.js 16 + MUI 9 | [`front/AGENTS.md`](front/AGENTS.md) → [`front/docs/conventions.md`](front/docs/conventions.md) |
| `back/nest-back/` | API NestJS (primera versión) | `back/nest-back/README.md` |
| `docs/adr/` | Decisiones de producto y técnicas, numeración única, columna de ámbito | [`docs/adr/README.md`](docs/adr/README.md) |
| `docs/sistema-de-diseno.md` | Sistema de diseño **Relevo**: tokens, tipografía, reglas y mapeo a MUI | — |

Reglas transversales:

- Docs de producto y ADRs en castellano. Código, comentarios y docs de convenciones en inglés.
- El nombre del producto es **Time Swap**; «Banco del Tiempo» solo sobrevive en nombres de ficheros históricos.
- Antes de decidir algo con coste de reversión, busca un ADR; si no existe y hay alternativa real, escríbelo.
