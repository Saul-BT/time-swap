# ADR 0016: Cache Components y prerender parcial en el front

- **Estado:** Aceptado
- **Fecha:** 2026-11-23
- **Ámbito:** front

## Contexto

Con la conexión al back (#39, #40), todas las rutas de `[lang]` pasaron a renderizarse en cada petición (`ƒ`). Una sola llamada `fetch` con `cache: 'no-store'` dentro de la landing bastaba para que la página entera esperase al back, cabecera y pie incluidos.

Next 16.4 recomienda Cache Components (`cacheComponents`) junto con Partial Prefetching (`partialPrefetching`) para cualquier aplicación y anuncia que serán el modelo por defecto en Next 17. Con ellos, cada ruta se divide en un *static shell* prerenderizado y unos huecos que llegan por streaming, y la caché pasa a ser explícita (`'use cache'`, `cacheLife`, `cacheTag`).

Hay una restricción del despliegue: la imagen Docker del front se construye sin back y sin `BACKEND_URL` (`front/Dockerfile`, `docker-compose.yml`). Nada que dependa del back puede prerenderizarse en `next build`.

## Decisión

- **Next 16.4.6 con `cacheComponents: true` y `partialPrefetching: true`** en `next.config.ts`.
- **Todo lo que no depende de la petición forma el static shell:** cabecera, pie, diccionarios y textos fijos. Los datos del back van en un componente hijo dentro de `<Suspense>`, lo más abajo posible.
- **Datos del back: `getX()` público + `fetchX()` cacheado** en `src/data/`. `getX()` llama primero a `await connection()`, porque el build no tiene back. `fetchX()` lleva `'use cache'`, `cacheLife` y `cacheTag`, y la caché se rellena en tiempo de ejecución. Las etiquetas viven en `src/data/cache-tags.ts` (`CACHE_TAG`).
- **Lectura de lo propio:** las server actions que escriben llaman a `updateTag(...)` antes de redirigir (por ejemplo `createListingAction` → `CACHE_TAG.listings`).
- **Datos del miembro** (sesión, saldo, pendientes): cuando exista la API, `'use cache: private'` para lo que lee cookies y `'use cache'` con el id del miembro como clave para lo que se comparte. En ningún caso pasan a formar parte del shell.
- **Datos que solo necesita un paso posterior del cliente** (categorías del paso 3 del registro): el servidor pasa la promesa sin `await` y el cliente la resuelve con `use()` dentro de `<Suspense>`.
- **`searchParams` solo donde se usan:** en `sign-in`, `<Suspense>` envuelve únicamente el formulario y el fallback es ese mismo formulario sin error.

## Consecuencias positivas

- Todas las rutas pasan de `ƒ` a `◐` (prerender parcial) u `○` (estáticas). El HTML del shell sale sin esperar al back.
- Una petición repetida no vuelve a llamar al back mientras dure el `cacheLife`. Con un back simulado, cuatro visitas a la landing hicieron una sola llamada a `/listing/search`.
- Partial Prefetching precarga el App Shell de cada `<Link>` visible, así que la navegación interna muestra la pantalla al instante.
- La caché es visible en el código: qué se cachea, cuánto tiempo y quién la invalida.

## Costes y riesgos

- **Más estructura:** un componente hijo y un `<Suspense>` por cada dato del back. Leer `cookies()`, `searchParams` o hacer un `fetch` sin caché fuera de `<Suspense>` rompe el build.
- **La caché del servidor es en memoria por proceso** (handler por defecto). Con varias réplicas, cada una tiene la suya y `updateTag` solo afecta a la réplica que atiende la acción. Hay que revisarlo si se escala horizontalmente (`'use cache: remote'` o un `cacheHandler` compartido).
- **Datos desactualizados acotados:** un cambio hecho en el back por otra vía tarda hasta un `cacheLife` en verse (`minutes` para anuncios, `hours` para categorías).
- **Huecos sin fallback visual:** las rejillas que llegan por streaming no reservan altura todavía, lo que puede provocar desplazamiento de layout. Quedan pendientes skeletons para ellas.
- `next dev` reescribe el bloque gestionado de `front/AGENTS.md` en cada versión de Next.

## Alternativas consideradas

- **Modelo anterior (`fetch` con `cache`/`next.revalidate`, ISR por ruta):** sigue funcionando en 16.x, pero hace dinámica la ruta entera en cuanto aparece una cookie o un `searchParams`, y Next lo retira como modelo por defecto en 17. Descartado.
- **Prerenderizar los datos del back en el build** (`'use cache'` sin `connection()`): daría shells con anuncios reales, pero exige un back accesible durante `docker build`, y los datos del shell quedarían congelados hasta la siguiente revalidación. Descartado mientras la imagen se construya sin back.
- **Adopción incremental con `export const instant = false`** ruta a ruta: menos cambios de golpe, pero con seis rutas pequeñas el coste de migrar todas en la misma rama era menor que mantener el estado mixto. Descartado.
