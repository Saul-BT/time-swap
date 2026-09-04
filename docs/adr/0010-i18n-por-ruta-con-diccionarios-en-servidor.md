# ADR 0010: i18n por segmento de ruta con diccionarios solo en servidor

- **Estado:** Aceptado
- **Fecha:** 2026-09-04
- **Ámbito:** front

## Contexto

El producto se publica en castellano (idioma fuente) e inglés. Next 16 no trae i18n integrado en App Router. Había que decidir dónde vive el idioma en la URL, cómo se cargan las traducciones, cómo se tipan y si hace falta una librería.

## Decisión

- **El idioma es el primer segmento de ruta**: `app/(site)/[lang]/…`. Al estar por encima del root layout es un *root param*, y cualquier Server Component lo lee con `next/root-params` sin pasarlo por props.
- **`proxy.ts` redirige las rutas sin prefijo** al mejor idioma disponible: cookie `NEXT_LOCALE` y, si no, `Accept-Language`. La negociación está escrita a mano (`src/lib/i18n/negotiateLocale.ts`): con dos idiomas sin variantes regionales, la regla es «etiqueta exacta, luego subetiqueta primaria».
- **Los diccionarios son JSON en `src/i18n/dictionaries/`**, cargados con `import()` dinámico desde un módulo que solo se ejecuta en servidor. Un chunk por idioma; ninguna cadena llega al navegador.
- **`es.json` define el tipo `Dictionary`**; `en.json` se asigna a ese tipo, así que una clave que falte o sobre rompe la compilación.
- **Los ids de contenido estructural** (categorías, filtros, navegación) se derivan del tipo del diccionario. El contenido escrito por personas (anuncios, testimonios de ejemplo) no se traduce.
- **El brand book queda fuera de `[lang]`**, en inglés y con copy fijo: es una referencia interna.
- Sin `server-only`: el import de `next/root-params` ya falla en un módulo cliente.

## Consecuencias positivas

- Cero dependencias de i18n y cero JavaScript de traducción en el cliente.
- Las URLs son estables y compartibles por idioma; el prerender genera una página por locale.
- Los errores de traducción son errores de tipo, no cadenas vacías en producción.

## Costes y riesgos

- Un componente cliente que necesite texto tendrá que recibirlo por props desde un Server Component. Si crece la interactividad puede hacer falta un contexto de diccionario en cliente.
- La negociación manual habrá que sustituirla por `@formatjs/intl-localematcher` si aparecen variantes regionales (`en-GB`, `es-MX`).
- Añadir un idioma exige tocar `LOCALES`, crear el JSON y un caso en `loaders`.

## Alternativas consideradas

- **`next-intl` o `next-i18next`**: resuelven más casos (plurales, formatos, cliente), pero añaden runtime y configuración para un producto con dos idiomas y sin interactividad todavía.
- **Idioma en cookie o cabecera sin segmento de ruta**: URLs más cortas, pero sin prerender por idioma y sin enlaces compartibles.
- **Diccionarios en `public/`**: se servirían sin tipos y con `Cache-Control: max-age=0`; cualquiera podría descargarlos.
