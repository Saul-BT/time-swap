# ADR 0008: paleta de estados de MUI y desviaciones del sistema Relevo

- **Estado:** Aceptado
- **Fecha:** 2026-09-03
- **Ampliado:** 2026-09-14 — el par de estados pendientes sobre tinta

## Contexto

El sistema de diseño Relevo define exactamente dos colores con
significado: el acento `#7A2E5C`, que marca la acción, y el freno `#17595B`, que marca
lo que está detenido o en revisión. Material UI, en cambio, exige `error`, `warning`, `info` y `success`
en la paleta, y si no se fijan usa sus valores por defecto, que no pertenecen a esta familia.

La propuesta inicial de tema traía cuatro candidatos verificados sin darlos por aprobados,
señalando que `info` (`#2C4A6B`) quedaría cerca del freno en tono y
podría confundir «esto informa» con «esto está detenido».

Además, al llevar el sistema a componentes reales aparecieron dos huecos que el sistema no cubre: el
estado `:focus-visible` y el comportamiento de los titulares condensados en castellano.

## Decisión

**Colores de estado:**

| Rol | Valor | Motivo |
|---|---|---|
| `error` | `#A32036` | Interrumpe. El rojo es convención y no se negocia. 6,7:1 sobre fondo. |
| `warning` | `#8A5A00` | Interrumpe. 5,3:1 sobre fondo. |
| `info` | `#151318` (tinta) | **Se descarta el azul propuesto.** Un tercer color frío competiría con el freno y rompería la regla «un solo acento». Lo informativo en este sistema es tinta sobre superficie con borde. |
| `success` | `#1E5B3A` | Se acepta el candidato. El verde de confirmación es convención y su tono (148°) se distingue del freno (182°). |

**Los dos estados pendientes sobre tinta.** Los valores de arriba están calibrados contra el fondo
(`#F3F2F5`). Sobre las superficies invertidas —la fila activa del rail de ajustes, que usa tinta de
fondo— los mismos valores caen a 3,1:1 (`warning`) y 2,3:1 (`success`), por debajo del 4,5:1 de texto
y del 3:1 de gráficos. Se añade un par de valores solo para ese contexto, mismo tono, subidos en
luminosidad, expuestos como `palette.onInk`:

| Rol | Valor | Contraste sobre tinta |
|---|---|---|
| `onInk.warning` | `#E09600` | 7,5:1 |
| `onInk.success` | `#4FB483` | 7,2:1 |

No son colores nuevos del sistema: son los mismos dos estados resueltos para el segundo fondo que el
producto usa. Ningún componente los elige por su cuenta; los pide con `tone="inverse"`.

**Desviaciones respecto a la especificación del sistema**, ambas necesarias para que el sistema funcione en producto:

1. **Interlineado de titulares: 1,06 en lugar de 0,98.** Con 0,98 las tildes y virgulillas de los
   titulares en caja alta se recortan contra la línea superior (`ÁYUDA`, `PEQUEÑA`, `MAÑANA`). 1,06 es
   el paso mínimo que las libera manteniendo el ajuste apretado.
2. **Anillo de foco: 3 px sólidos en color texto, con 2 px de separación.** El sistema no define el
   foco. Se elige tinta porque contrasta 16,5:1 sobre el fondo y 4,4:1 sobre el botón de acento relleno,
   así que se ve en los dos contextos con una sola regla.

## Consecuencias positivas

- La regla «un solo acento» sobrevive al contacto con la paleta obligatoria de MUI.
- No queda ningún color por defecto de Material Design en el producto.
- Los titulares son legibles en castellano sin renunciar al ajuste condensado.
- El foco es visible sobre superficie clara y sobre relleno de acento sin necesitar dos estilos.

## Costes y riesgos

- Un `info` en tinta es menos reconocible como «aviso informativo» que un azul; depende del icono y del
  texto que lo acompañen.
- `success` (`#1E5B3A`) y el freno (`#17595B`) siguen siendo dos verdes oscuros. A tamaño pequeño y sin
  etiqueta pueden confundirse; conviene que ningún componente los use como único portador de significado.
- El interlineado de 1,06 se aparta de la especificación original, así que especificación y tema divergen en ese
  valor concreto.
- La paleta de estados pasa de cuatro valores a seis. Cada fondo nuevo que no sea ni fondo ni tinta
  volvería a abrir el problema; la salida entonces no es un tercer par, sino dejar de invertir.

## Alternativas consideradas

- **Aceptar los cuatro candidatos de la propuesta:** más fiel a ella, pero introduce el azul que la
  propia propuesta señala como problemático.
- **Poner `info` y `success` en tinta:** máxima coherencia con «un solo acento», pero deja la confirmación
  sin señal de color, que es justo donde más se espera.
- **Mantener 0,98 y aceptar el recorte:** fiel a la especificación, pero degrada el castellano escrito.
