# ADR 0011: slugs públicos por idioma sobre carpetas en inglés

- **Estado:** Aceptado
- **Fecha:** 2026-09-04
- **Ámbito:** front

## Contexto

ADR 0010 fija el idioma como primer segmento de ruta (`/[lang]/…`). Con la primera pantalla fuera de la landing apareció la pregunta de si el resto de la URL también se traduce: una URL compartida es contenido de producto tanto como el copy, y `/es/sign-in` es incoherente para quien lee en castellano.

Next 16 App Router no traduce slugs: la carpeta bajo `app/` es la URL. Cualquier traducción hay que construirla encima.

## Decisión

- **La carpeta es el slug en inglés**, como el resto del código. `app/(site)/[lang]/sign-in/` sirve la pantalla en todos los idiomas.
- **El slug público de cada idioma vive en `src/i18n/routes.ts`** (`ROUTES`), tipado como `Record<RouteId, Record<Locale, string>>`. Falta un idioma en una ruta: falla la compilación.
- **`next.config.ts` genera un `rewrite` por cada slug traducido** (`/es/entrar` → `/es/sign-in`). La URL visible no cambia.
- **`proxy.ts` redirige con 308 el slug de carpeta cuando no es el público de ese idioma** (`/es/sign-in` → `/es/entrar`). Cada página tiene una sola URL por idioma; el slug de un idioma no existe en otro (`/en/entrar` es 404).
- **Ningún enlace interno escribe un path.** `localizePath(locale, routeId)` lo resuelve; las anclas de la landing pasan sin tocar.
- **Cada página declara `alternates`** (`canonical` y `languages`) con `routeAlternates(id)`.

## Consecuencias positivas

- URLs legibles en cada idioma, sin duplicar carpetas ni componentes.
- Añadir una página son dos gestos: la carpeta y una entrada en `ROUTES`. Rewrites, redirects y `hreflang` se derivan de la misma tabla.
- Los enlaces rotos por un slug mal escrito son errores de tipo.

## Costes y riesgos

- `PageProps<"/[lang]/sign-in">` y el resto del tipado de rutas de Next hablan en el slug interno, no en el público.
- Un slug traducido que coincida con otra carpeta real produciría una ambigüedad silenciosa; la tabla es pequeña y se revisa a mano.
- Cambiar un slug público ya publicado exige un redirect adicional que la tabla no genera.

## Alternativas consideradas

- **Un solo slug para todos los idiomas** (`/es/sign-in`): cero mecanismo, pero URL en inglés para quien navega en castellano. Descartado por producto.
- **Carpeta catch-all `[lang]/[...slug]` resolviendo contra la tabla**: máxima flexibilidad, pero se pierde el tipado de rutas de Next, `PageProps` y el prerender por página. Descartado.
- **Carpetas duplicadas por idioma** (`sign-in/` y `entrar/`): sin rewrites, pero cada página se define dos veces y nada garantiza que ambas rendericen lo mismo. Descartado.
