# ADR 0015: la chrome de ajustes vive en el layout y la navegación se marca sola

- **Estado:** Aceptado
- **Fecha:** 2026-09-14
- **Ámbito:** front

## Contexto

Las seis rutas de ajustes (`/ajustes/perfil`, sus cuatro apartados y `/ajustes/privacidad`) compartían
la misma envoltura: cabecera, fila de cuenta, título, medidor de completitud y el marco con rail y
panel. Cada página la componía a mano pasando `active` y `account` como props, y cada `loading.tsx` la
repetía entera para que el esqueleto no apareciera desnudo.

Eso tenía tres consecuencias. La envoltura se volvía a renderizar en el servidor en cada salto entre
apartados, aunque no cambiara nada de ella. Los seis `loading.tsx` duplicaban la chrome. Y la raíz
`/ajustes/perfil`, que no tiene apartado abierto, no sabía qué pintar: pasaba `active={null}` y la
envoltura lo resolvía con `active ?? "presentation"`, de modo que el rail marcaba Presentación como
activa sin serlo y el panel quedaba vacío a la derecha.

La duda real era de dónde sacar «qué apartado está abierto» si la envoltura sube a un `layout.tsx`, que
Next no vuelve a renderizar por sección y al que no llega ninguna prop de la página.

## Decisión

La chrome vive en `app/(site)/[lang]/settings/layout.tsx`. Una página de apartado renderiza solo su
cabecera de panel y su formulario; un `loading.tsx`, solo su esqueleto.

Dónde estoy se lee del router, en dos sitios y de dos formas distintas según lo que haga falta:

- **Cada enlace de navegación se marca solo**, comparando `usePathname()` con el `href` que ya calcula.
  No hay mapa de segmentos que mantener y funciona en cualquier idioma, porque `usePathname()` devuelve
  la ruta pública, que es exactamente lo que devuelve `localizePath`.
- **La disposición** (índice contra apartado abierto, y el número de paso) se deriva una sola vez con
  `useSelectedLayoutSegments()` en `SettingsShellBody`, a través del helper puro
  `lib/settings/segment.ts`, que construye su tabla desde `SECTION_ROUTE` y `ROUTES` en lugar de
  repetirla. Los rewrites del ADR 0011 garantizan que los segmentos son siempre los de carpeta en
  inglés, iguales en todos los idiomas.

**Dónde se piden los datos.** Un layout se renderiza por encima de su propio `loading.tsx`, así que
cualquier `await` lento aquí bloquearía todas las navegaciones hacia ajustes en lugar de transmitirse.
Los datos quedan repartidos en tres, y ese reparto es la parte que cuesta revertir:

| Dato | Quién lo pide | Por qué ahí |
|---|---|---|
| Sesión (id de miembro) | el layout, directo | barato, sin petición; solo sirve para el enlace al perfil público |
| Completitud (medidor, insignias) | `CompletionSummary` y `SettingsNav`, cada uno bajo su `Suspense` | es chrome: se transmite aparte y no hace esperar al panel |
| Perfil del apartado | la página, con su `loading.tsx` | es lo que el `PanelSkeleton` está cubriendo |

Mientras no exista la API, `lib/api/profile.ts` simula los tres con la latencia y la forma que tendrán
(ADR pendiente de #5). Usa `connection()` para salir del prerenderizado: sin eso las rutas se
resolverían en build, serían estáticas y ningún esqueleto llegaría a verse — que es justo lo que pasaba.

Cada uno de esos huecos de chrome va envuelto en `SlotBoundary` además de en `Suspense`. Un `error.tsx`
se renderiza por debajo del layout de su segmento, así que no puede cubrir un fallo del propio layout:
sin la frontera por hueco, que fallara el medidor tumbaba la pantalla entera. Con ella, lo que no
necesita datos sigue en pie —la navegación conserva los enlaces y la marca de apartado abierto, que
viene del router— y solo desaparece la insignia.

Con la disposición derivada, la raíz de perfil deja de ser un caso degenerado: es el índice, la misma
lista de apartados en todos los anchos, y el rail y el panel solo existen cuando hay apartado abierto.

## Consecuencias positivas

- Saltar de apartado a apartado transmite solo el panel; la cabecera, la fila de cuenta y el medidor no
  se repintan.
- Los seis `loading.tsx` se reducen a su esqueleto.
- Desaparece el «apartado activo por defecto» y con él el hueco blanco de la raíz.
- El `UnsavedChangesProvider` deja de remontarse en cada navegación, que es lo que se espera de un
  guardián de cambios sin guardar.
- Una sección nueva se añade tocando `SETTINGS_SECTIONS` y `ROUTES`; nada más sabe el orden.

## Costes y riesgos

- La marca de activo pasa a ser cliente. Se renderiza bien en servidor —los hooks de router de Next
  funcionan en SSR—, pero deja de estar comprobada por tipos: una ruta mal escrita ya no rompe la
  compilación, simplemente no marca nada.
- `settingsPlace` depende de que los segmentos sean los de carpeta. Si algún día se sirvieran los slugs
  localizados sin rewrite, dejaría de resolver y habría que revisar el ADR 0011 junto con este.
- Las seis rutas de ajustes pasan de estáticas a dinámicas (`ƒ`). Es lo correcto —el perfil es de cada
  miembro y nunca se pudo prerenderizar— pero hasta ahora el build decía lo contrario.
- El rail sigue en el DOM en el índice, oculto por CSS, para que el servidor mande el mismo HTML en
  todos los anchos. Es marcado repetido a cambio de no parpadear.

## Alternativas consideradas

- **Dejar `active` y `account` como props de página.** Comprobado por tipos y sin JavaScript de cliente
  para el estado activo, que era la virtud del diseño anterior; pero mantiene la chrome duplicada en
  doce ficheros y repintándose en cada salto, y no resuelve la raíz sin inventarse un apartado.
- **Un `layout.tsx` por apartado.** Devuelve el dato en servidor, pero multiplica por cinco la misma
  envoltura y no cubre `privacidad`, que cuelga de otra rama.
- **Derivar también la marca de los enlaces con `useSelectedLayoutSegments()`.** Un único origen para
  todo, pero obliga a mantener la tabla segmento → sección en la navegación, cuando cada enlace ya
  conoce su propia URL.
