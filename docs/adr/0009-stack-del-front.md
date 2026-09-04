# ADR 0009: stack del front — Next 16 App Router, MUI 9 sobre Emotion, Biome y bun

- **Estado:** Aceptado
- **Fecha:** 2026-09-04
- **Ámbito:** front

## Contexto

El front parte de cero con `create-next-app` (Next 16.3, React 19.2, Turbopack por defecto, React Compiler disponible). El sistema de diseño ya está elegido (Relevo, ADR 0008) y exige control fino de tema: borde de 2 px, radio 0, sin elevación, dos familias tipográficas. Se necesita una librería de componentes accesible y un motor de estilos que funcione con Server Components y streaming SSR.

Durante el arranque convivieron `bun.lock` y `package-lock.json`, y hubo que evaluar Pigment CSS frente a Emotion.

## Decisión

- **Next 16 App Router** con `proxy.ts` (sustituto de `middleware.ts`), `next/root-params` y React Compiler activado. Todo es Server Component salvo lo que necesite estado o eventos.
- **MUI 9 con Emotion** (`@emotion/react` + `@emotion/styled` + `@mui/material-nextjs` con `AppRouterCacheProvider` y `enableCssLayer`). Estilos con `styled(el, { name, slot })`; clases con `generateUtilityClasses`.
- **Pigment CSS descartado**: su plugin de Next solo soporta webpack, el proyecto está «on hold» en alpha, y adoptarlo obligaría a renunciar a Turbopack.
- **Biome** como único linter y formateador (dominios `next` y `react`, `organizeImports`). Sin ESLint ni Prettier.
- **bun** como gestor de paquetes. `package-lock.json` eliminado.
- **TypeScript `strict`**, alias `@/` → `src/`.
- Sin runner de tests por ahora; se decidirá en un ADR aparte cuando exista lógica que lo justifique.

## Consecuencias positivas

- Un solo idioma de estilos (Emotion) compatible con SSR en App Router sin `@emotion/server`.
- El tema controla toda la jerarquía visual; el brand book se renderiza desde el tema real y no puede desviarse.
- Turbopack en dev y build; React Compiler evita memoización manual.
- Una sola cadena de herramientas (bun + Biome) barata de ejecutar y de explicar a un agente.

## Costes y riesgos

- Emotion inyecta estilos en runtime; el coste es aceptable para una landing pero conviene revisar si crece la interactividad.
- MUI 9 y Next 16 son recientes: la documentación de entrenamiento de los agentes está desactualizada, de ahí el bloque que `next dev` añade a `AGENTS.md` y la lista de trampas en `front/docs/conventions.md`.
- Sin tests, la verificación es lint + tsc + build + revisión manual.

## Alternativas consideradas

- **Pigment CSS (zero-runtime)**: mejor rendimiento teórico, pero incompatible hoy con Turbopack y sin garantía de continuidad.
- **Tailwind + shadcn**: sin coste de runtime, pero obliga a reconstruir accesibilidad y componentes que MUI ya resuelve, y el sistema Relevo se expresa mejor como tema que como utilidades.
- **ESLint + Prettier**: más ecosistema, pero dos herramientas y dos configuraciones para lo que Biome hace en una.
- **pnpm/npm**: equivalentes; se elige bun por velocidad y porque ya era el lockfile en uso.
