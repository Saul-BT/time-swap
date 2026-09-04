# Sistema de diseño: Relevo

Especificación visual de Time Swap. La implementación es el tema de MUI en `front/src/theme/` y la referencia viva es `/brand-book`. Si este documento y el tema discrepan, manda el tema y se corrige aquí.

## Paleta

| Token | Valor | Papel | Contraste (WCAG) |
|---|---|---|---|
| `background` | `#F3F2F5` | Fondo de página | — |
| `surface` | `#FFFFFF` | Tarjetas y campos | — |
| `ink` | `#151318` | Todo el texto principal | 16,5:1 sobre fondo |
| `inkMuted` | `#68656E` | Metadatos, etiquetas, ayudas | 5,1:1 sobre fondo |
| `accent` | `#7A2E5C` | **La acción.** Único color de acción | 7,9:1 sobre fondo · 8,9:1 con blanco encima |
| `brake` | `#17595B` | Lo que se detiene o se revisa: disputa, acuerdo en pausa | 7,2:1 sobre fondo · 8,0:1 con blanco encima |
| `line` | `#DEDCE3` | Separadores suaves | — |
| `onDark` | `#FFFFFF` | Texto sobre acento, freno y bloques invertidos | — |

Colores de estado (`error`, `warning`, `info`, `success`): no forman parte del sistema; están decididos en [ADR 0008](adr/0008-paleta-de-estados-y-desviaciones-del-tema.md).

## Tipografía

- **Oswald 700** en caja alta para titulares (`h1`–`h3`). Interlineado 1,06 (ADR 0008), espaciado 0,01em.
- **Fira Sans 400/600/700** para todo lo demás, incluidas las cifras. Cuerpo 17 px, interlineado 1,55.
- `button`: Fira Sans 700 · 15 px · caja alta · 0,04em. `overline`: 700 · 12 px · caja alta · 0,16em · `inkMuted`.
- Ninguna otra familia. La escala completa está en `front/src/theme/tokens.ts` (`typeScale`).

## Espaciado y estructura

- Escala: 8 · 16 · 32 · 56 · 96 px (`space.xs…xl`, múltiplos de la unidad de 8 de MUI).
- Borde único de 2 px. Altura mínima de control 52 px. Ancho de contenido 1240 px. Anillo de foco 3 px en `ink` con 2 px de separación.
- Cintas: 22 px al abrir una página o bloque de cartera, 14 px al abrir una tarjeta.

## Las cinco reglas

1. **Un solo acento.** No se crea un tono más claro ni más oscuro del acento para escribir con él; el valor cumple contraste como texto y como fondo.
2. **Radio 0 en todo.** Sin excepciones.
3. **Borde de 2 px, sin sombras.** La elevación está desactivada; la jerarquía la hacen el borde y las cintas.
4. **El freno solo frena.** Aparece únicamente donde algo está detenido o en revisión. Nunca decorativo, nunca segundo botón.
5. **Cifras tabulares.** Todo número comparable en vertical (saldos, horas, movimientos) usa `font-variant-numeric: tabular-nums` (`TabularFigure`).

## La cinta

Banda horizontal a sangre que abre cada pantalla y cada tarjeta, formada por tramos proporcionales de acento, tinta, freno y línea. Es el elemento que identifica al sistema y es un componente propio (`Ribbon`), no una variante de `Paper`. Variantes: `page`, `offer`, `request`, `stopped` (la única donde lidera el freno).

## Mapeo a MUI

```
palette.background.default   background
palette.background.paper     surface
palette.text.primary         ink
palette.text.secondary       inkMuted
palette.divider              line
palette.primary.main         accent   (light y dark repiten main)
palette.secondary.main       brake
shape.borderRadius           0
spacing                      8
shadows                      todas "none"
theme.system                 medidas estructurales (borderWidth, controlHeight, …)
```

Anulaciones que llevan el peso del sistema: `MuiButton` (52 px, borde 2 px, `contained` acento, `outlined` borde tinta, `text` acento subrayado), `MuiOutlinedInput` (fondo `surface`, borde 2 px tinta, foco en acento), `MuiPaper` (`elevation 0`, `outlined`), `MuiCssBaseline` (fondo, familias, `:focus-visible`), `MuiAvatar` (cuadrado, con borde).

## No definido

Modo oscuro y densidad para tablas de historial. Se decidirán cuando haya pantalla que lo necesite.
