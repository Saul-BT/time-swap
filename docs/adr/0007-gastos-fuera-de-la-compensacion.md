# ADR 0007: gastos fuera de la compensación

- **Estado:** Aceptado
- **Fecha:** 2026-08-03

## Contexto

Algunos servicios requieren pintura, ingredientes, combustible, peajes, entradas u otros costes reales. Prohibir cualquier gasto haría inviables intercambios legítimos; permitir importes sin separación convertiría el producto en un marketplace.

## Decisión

- Se pueden declarar gastos reales previstos.
- Deben pactarse antes de formalizar el acuerdo.
- Se muestran separados de la duración y de los créditos.
- La persona receptora suministra los materiales o reembolsa el coste acordado.
- El MVP no procesa esos pagos.
- El dinero no remunera tiempo, habilidad ni servicio.

## Consecuencias positivas

- Permite servicios con materiales.
- Mantiene visible la naturaleza no monetaria del intercambio.
- Evita que la plataforma actúe como procesador de pagos en el MVP.

## Costes y riesgos

- La plataforma no puede verificar automáticamente reembolsos externos.
- Los gastos pueden generar disputas.
- Deben definirse categorías y límites para impedir pagos encubiertos.

## Alternativas consideradas

- Prohibir gastos: simple, pero poco práctico.
- Procesar pagos: mayor control, pero cambia alcance y obligaciones.
- Convertir gastos en créditos: mezcla tiempo y bienes.

