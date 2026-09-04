# ADR 0004: privacidad de ubicación

- **Estado:** Aceptado
- **Fecha:** 2026-08-03

## Contexto

La proximidad es útil para servicios presenciales, pero publicar una dirección precisa expone a los miembros. Los servicios remotos no necesitan ubicación.

## Decisión

- Perfiles y anuncios públicos utilizan una zona aproximada.
- “Cerca de mí” es un filtro explícito.
- Las búsquedas calculan distancia sin devolver coordenadas privadas.
- Los servicios exclusivamente remotos no dependen de ubicación.
- Cualquier ubicación precisa necesaria para un encuentro se revela de manera progresiva y solo a participantes autorizados.

## Consecuencias positivas

- Permite descubrimiento local.
- Reduce exposición pública.
- Separa necesidades de búsqueda y coordinación.
- El usuario puede participar remotamente sin compartir ubicación.

## Costes y riesgos

- Debe elegirse precisión, radio y proveedor geoespacial.
- Una zona muy amplia reduce utilidad; una muy precisa reduce privacidad.
- Los cambios de ubicación deben actualizar el índice.

## Alternativas consideradas

- Dirección pública: precisa, pero insegura.
- Sin geolocalización: más privada, pero limita servicios presenciales.
- Ubicación exacta desde el registro: innecesaria y desproporcionada.

