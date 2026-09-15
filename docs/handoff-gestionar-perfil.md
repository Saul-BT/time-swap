# Handoff: gestionar perfil (variante 08 · Paneles)

Semilla de implementación de la pantalla de gestión de perfil ([issue #6](https://github.com/Saul-BT/time-swap/issues/6)) sobre la API de [#5](https://github.com/Saul-BT/time-swap/issues/5). Recoge las decisiones tomadas durante la exploración de diseño y apunta a los artboards que las fijan. Es el punto de partida del front; no sustituye a los ADR ni a las convenciones.

## Estado

Implementado en `front/` (rama `feat/interfaz-gestionar-perfil`, sobre PR #20): shell, cinco paneles, perfil público de ejemplo en `/[lang]/members/[id]`, muestras en `/brand-book`. Datos de ejemplo en `src/data/profile.ts` hasta que exista #5; cada `actions.ts` lleva un `FIXME(api)` con el `PATCH` que lo sustituye. Decisiones con coste de reversión: ADR 0012 (guardado por apartado) y ADR 0013 (momentos de revelación).

## Referencias

- Lienzo de diseño: <https://claude.ai/code/artifact/6b723922-2e1d-4ab8-ad64-a9ff530e4b2f>, página **«08 · Paneles, completa»**. Las páginas anteriores (A · B · C, exploración sobre C, diez alternativas) son historia; solo vale la variante 08.
- Artboards exportados: `~/Documents/otros/Time Swap Recursos/canvas-perfil-paneles/` (un `.dc.html` por artboard más `canvas.json`). Fuera del repo por tamaño, como el resto de recursos.
- Sistema de diseño Relevo: [`sistema-de-diseno.md`](sistema-de-diseno.md); tema real en `front/src/theme/`.
- Decisiones previas: [ADR 0004](adr/0004-privacidad-de-ubicacion.md) (ubicación), [ADR 0008](adr/0008-paleta-de-estados-y-desviaciones-del-tema.md) (estados), [ADR 0010](adr/0010-i18n-por-ruta-con-diccionarios-en-servidor.md) (i18n).
- Convenciones del front: [`front/docs/conventions.md`](../front/docs/conventions.md).

## Artboards de referencia

| Artboard | Qué fija | Estados que muestra |
|---|---|---|
| `PanelesPresentacionEscritorio` / `…Movil` | Panel 1: foto, nombre visible, pronombres, presentación; escalera «quién ve tu presentación» | Error de validación por campo (teléfono en la presentación), contador 164 / 600 |
| `PanelesHabilidadesEscritorio` / `…Movil` | Panel 2: dos buscadores de catálogo con chips y sugerencias; escalera para intereses | Habilidades elegidas, sugerencias del catálogo |
| `PanelesDisponibilidadEscritorio` / `…Movil` | Panel 3: rejilla semana × franja; escalera «tras aceptar contacto» | Franjas marcadas; en móvil rejilla transpuesta |
| `PanelesZonaEscritorio` / `…Movil` | Panel 4: zona sin configurar, precisión Ciudad · Distrito · Barrio, escalera para el barrio | Ubicación no configurada, falta para publicar |
| `PanelesPrivacidadEscritorio` / `…Movil` | Panel 5: interruptores con consecuencia y matriz «desde cuándo se ve cada dato» | Perfil solo para miembros, fuera de buscadores |
| `PanelesIndiceMovil` | Índice móvil: lista de apartados con estado | 3 de 5 listos, «Por revisar», «Falta para publicar» |

La cabecera, la navegación de cuenta y el medidor son comunes a los cinco artboards de escritorio.

## Decisiones

### Arquitectura de la pantalla

1. **Cinco apartados, uno visible cada vez:** Presentación, Habilidades, Disponibilidad, Zona, Privacidad. En escritorio, pestañas verticales de 300 px con icono y estado a la izquierda y el panel activo a la derecha, dentro de un contenedor con borde de 2 px. Nada de scroll largo.
2. **Guardado por apartado.** Cada panel cierra con «Guardar [apartado]» (primario) y «Siguiente: [apartado]» (outlined); el último ofrece «Ver mi perfil público». No hay barra global de «cambios sin guardar»: el aviso de abandono se limita al panel abierto con cambios.
3. **Sin vista previa.** El botón «Ver mi perfil público» en la cabecera de la página lleva al perfil público real del miembro (pantalla del bloque Descubrimiento). Es la única forma de «cómo te ven».
4. **Móvil: índice + detalle.** Fuera la cinta de pestañas horizontal. `/settings/profile` en móvil es un índice tipo ajustes (icono · apartado · estado · chevron) con el medidor y «Ver mi perfil público»; cada apartado se abre a pantalla completa con cabecera «← Tu perfil · n de 5» y botones fijos abajo (Guardar, Siguiente).
5. **Completitud visible siempre:** medidor (cinta `request`: acento = hecho, línea = pendiente) y frase de estado «3 de 5 listos. Presentación por revisar; falta zona». En las pestañas, ✓ (verde `success`), «Revisar» y «Falta» (ámbar `warning`).

### Selectores por tipo de dato

| Dato | Control | Motivo |
|---|---|---|
| Modalidad (en persona, a distancia) | Checks cuadrados con icono lucide junto a la etiqueta | Dos opciones no excluyentes; el check es lo que menos ruido mete |
| Disponibilidad | Rejilla semana × franja (L–D × mañana, tarde, noche), celdas de 44 px | Más expresiva que dos filas y sigue siendo orientativa; nunca un calendario |
| Precisión de zona | Toggle group outlined + activo primario, icono + texto (Ciudad · Distrito · Barrio) | Excluyente, tres opciones cortas |
| «Quién lo ve» dentro de cada panel | Escalera de cuatro peldaños (Visitante · Miembro · Contacto · Acuerdo); lo anterior al elegido en gris | Comunica el momento de revelación como una secuencia, no como interruptores sueltos |
| Resumen de privacidad | Matriz de checks dato × momento; se marca el primer momento y los siguientes quedan marcados solos; filas fijas con ✓ y fila «nunca» | Toda la política de un vistazo y comparable |
| Booleanos de privacidad | Interruptor cuadrado con frase de consecuencia y «Ahora mismo: valor» | Patrón de ajustes conocido; el efecto se explica en una frase |
| Habilidades e intereses | Buscador de catálogo + chips seleccionadas (tinta invertida, con ×) + sugerencias («+ Idiomas») | Del catálogo, nunca texto libre |

Iconos: lucide, 16–22 px, trazo 2, siempre con etiqueta visible o nombre accesible. Nunca emoji.

### Privacidad

6. **Cuatro momentos de revelación** para cada dato opcional: todo el mundo (visitante), solo miembros, tras aceptar contacto, al formalizar acuerdo. Elegir un momento implica los siguientes.
7. **Fijos:** nombre visible, modalidad y distrito son siempre públicos. Correo, teléfono, dirección exacta y saldo de horas no se muestran nunca y no tienen control.
8. **Dos ajustes globales** en el panel Privacidad: «Mi perfil se ve sin tener cuenta» y «Mis anuncios salen en buscadores», ambos apagados por defecto.
9. **Zona:** se guarda el centro de la zona, nunca la dirección; el distrito es público y el barrio sigue su momento de revelación; el punto de encuentro lo comparte el propio miembro en el chat con un acuerdo cerrado (ADR 0004). Dos formas de fijarla: elegir el barrio a mano o aproximar con el navegador; el permiso rechazado se resuelve con el barrio a mano.

### Copy

10. Todo texto pasa por los diccionarios (ADR 0010). Tono de segunda persona y frases cortas, como en los artboards. Los mensajes de error dicen qué hacer, no qué está mal: «Quita el número de teléfono. Los datos de contacto se comparten en el chat, cuando tú quieras».
11. Cada panel abre con una frase que explica para qué sirve el dato, sobre todo disponibilidad («orientativa, no reserva nada») y zona («solo el distrito o el barrio, nunca la dirección»).

## Rutas

```
/[lang]/settings/profile                  escritorio: shell + panel Presentación · móvil: índice
/[lang]/settings/profile/presentation     panel 1
/[lang]/settings/profile/skills           panel 2
/[lang]/settings/profile/availability     panel 3
/[lang]/settings/profile/zone             panel 4
/[lang]/settings/privacy                  panel 5, misma shell (el issue lo pide como ruta propia)
```

Escritorio y móvil comparten rutas; cambia la shell (pestañas verticales frente a índice + detalle). Cada panel es una página con su propio formulario y su propia server action, así el guardado por apartado sale solo.

## Componentes

Siguiendo la anatomía de cuatro ficheros de `conventions.md`. Todo lo nuevo se añade a `/brand-book` en el mismo cambio.

| Componente | Carpeta | Notas |
|---|---|---|
| `SettingsShell` | `components/layout/` | Cabecera de página (título, entradilla, «Ver mi perfil público»), medidor, contenedor con borde. En `md+` renderiza `SettingsNav` vertical; por debajo, el índice o el detalle |
| `SettingsNav` | `components/layout/` | Pestañas verticales: icono, nombre, estado. Activa en tinta invertida. En móvil, lista índice con chevron |
| `PanelHeader` / `PanelFooter` | `components/settings/` | Título Oswald 40 px + «Apartado n de 5» + entradilla; pie con Guardar y Siguiente; en móvil el pie es `position: sticky` abajo |
| `CompletionMeter` | `components/ui/` | Sobre `Ribbon` variante `request` con pesos hecho/pendiente, más frase de estado |
| `WeekGrid` | `components/settings/` | 7 × 3 celdas `role="checkbox"`, 44 px mínimo; transpuesta bajo `md` (días en filas) |
| `RevealLadder` | `components/settings/` | `RadioGroup` visual de cuatro peldaños; los anteriores al elegido con fondo `divider`; 2 × 2 bajo `md` |
| `VisibilityMatrix` | `components/settings/` | Tabla dato × momento con `Checkbox`; una fila marca desde el primer check en adelante; filas fijas de solo lectura |
| `CatalogPicker` | `components/settings/` | `Autocomplete` sobre el catálogo (`skills` / `interests`), chips seleccionadas y sugerencias; nunca texto libre |
| `ZonePicker` | `components/settings/` | Estado sin zona, «Elegir mi barrio», «Aproximar» (geolocalización con permiso rechazado contemplado), `ToggleButtonGroup` de precisión |
| `ConsequenceRow` | `components/settings/` | Título, frase de consecuencia, «Ahora mismo: valor», control a la derecha |

Anulaciones de tema pendientes (todas en `theme/index.ts`, con tokens de `tokens.ts`):

- `MuiToggleButton` / `MuiToggleButtonGroup`: 52 px, borde 2 px tinta, separador interno de 2 px, inactivo como `outlined`, `Mui-selected` como `contained` en acento.
- `MuiCheckbox` y `MuiRadio`: cuadrados de 24 px, borde 2 px, marcados en acento (el radio con cuadrado interior de 12 px).
- `MuiSwitch`: pista 52 × 32 cuadrada, pulgar 20 px, encendido en acento.
- `MuiTable`: cabeceras en `overline`, celdas con regla suave de 2 px, contenedor con borde de 2 px.

## Estados por panel

| Estado | Dónde se ve | Comportamiento |
|---|---|---|
| Cargando | Cada panel | Esqueleto con líneas en `divider` respetando la estructura del panel; sin spinner |
| Perfil incompleto | Medidor, pestañas, índice móvil | Frase con lo que falta y enlaces a los apartados |
| Sin habilidades ni intereses | Panel 2 | Buscador vacío con sugerencias del catálogo y aviso «hace falta al menos una para publicar» |
| Cambios sin guardar | Panel abierto | Pie del panel con Guardar habilitado; aviso al navegar fuera del panel |
| Guardando | Pie del panel | Botón deshabilitado con texto «Guardando…», panel a opacidad reducida |
| Guardado correcto | Pie del panel | Texto de confirmación en `success` durante unos segundos; pestaña pasa a ✓ |
| Error de validación | Campo afectado | Borde `error`, mensaje bajo el campo con icono, `aria-describedby` |
| Error recuperable del servidor | Cabecera del panel | Bloque con borde `error`, «Tus cambios siguen aquí» y botón Reintentar |
| Ubicación no configurada | Panel 4 | Tarjeta con borde `warning` y los dos caminos |
| Permiso de ubicación rechazado | Panel 4 | Mismo bloque, texto que remite a elegir el barrio a mano |

## Datos (contrato con #5)

| Campo de `Profile` | Panel | Forma esperada |
|---|---|---|
| `displayName`, `bio`, `pronouns` (opcional) | Presentación | `bio` con límite 600 y validación de datos de contacto en servidor |
| `skills[]`, `interests[]` | Habilidades | Ids del catálogo |
| `modalities[]` | Presentación o Zona (ver preguntas) | `in_person`, `remote` |
| `availability` | Disponibilidad | 7 × 3 booleanos (día × franja) |
| `approximateLocation` | Zona | Centro de zona + `precision` ∈ `city`, `district`, `neighborhood` |
| `privacySettings` | Privacidad y escaleras | `visibleToVisitors`, `searchable`, `reveal.{bio,skills,interests,availability,neighborhood}` ∈ `visitor`, `member`, `contact`, `agreement` |
| `completionStatus` | Medidor | Lista de apartados completos y pendientes, no solo un booleano. Forma pedida en [#5](https://github.com/Saul-BT/time-swap/issues/5#issuecomment-5645488414) |

## Accesibilidad

- Pestañas verticales como `nav` con `aria-current="page"`; índice móvil como lista de enlaces.
- Rejilla y matriz con nombre accesible por celda («Martes · Tarde», «Barrio · Contacto»); teclado con flechas dentro del grupo.
- Escalera como `radiogroup`; toggle group con `aria-pressed`.
- Errores asociados al campo con `aria-describedby`; foco al primer error al guardar.
- Anillo de foco del tema (3 px tinta) en todos los controles nuevos.

## Preguntas resueltas

- Modalidad: bloque propio con checks dentro del panel Zona, junto a «a distancia no necesita zona».
- Medidor de completitud: cuenta apartados. `completionStatus` devuelve la lista (forma pedida en #5).
- Guardado por apartado → ADR 0012. Momentos de revelación → ADR 0013.
- Perfil público: ruta `/[lang]/members/[id]` (`/miembros/:id`), placeholder con la misma regla de filtrado que aplicará la API.

## Preguntas abiertas

- Precisión y radio de la búsqueda por proximidad siguen sin cerrarse (ADR 0004 lo deja abierto); la pantalla asume tres niveles.
- Cabecera de miembro (Qué circula · Publicar · Mensajes · Mi cuenta) y enlaces de «Mi cuenta» sin pantalla: la shell usa `SiteHeader` y `AccountNav` con `TODO(routes)` hasta que exista sesión.
