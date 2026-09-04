# ADR 0001: modelo híbrido de intercambio

- **Estado:** Aceptado
- **Fecha:** 2026-08-03

## Contexto

El banco del tiempo clásico utiliza créditos que permiten ayudar a una persona y recibir ayuda de otra. La idea del producto también contempla acuerdos bilaterales del tipo “yo hago X y tú haces Y”.

Permitir mezclar libremente créditos, dinero y prestaciones dentro de un mismo acuerdo aumentaría la negociación y haría difícil explicar el valor.

## Decisión

La plataforma admite:

- Créditos de tiempo.
- Trueque directo.
- Anuncios abiertos a cualquiera de ambos.

Cada acuerdo selecciona exactamente un modo. En el MVP no se mezclan créditos y trueque directo dentro del mismo acuerdo.

## Consecuencias positivas

- Soporta reciprocidad generalizada y bilateral.
- Mantiene una regla de liquidación clara.
- Evita asignar precios implícitos a habilidades.
- Simplifica disputas y trazabilidad.

## Costes y riesgos

- Algunos acuerdos asimétricos no encajarán bien en trueque.
- El usuario debe comprender la diferencia entre modo admitido por el anuncio y modo final del acuerdo.
- Un cambio de modo requiere una nueva versión del acuerdo.

## Alternativas consideradas

- Solo créditos: más simple, pero elimina el trueque directo deseado.
- Solo trueque: reduce liquidez y obliga a coincidencias dobles.
- Mezcla dentro del acuerdo: flexible, pero demasiado compleja para el MVP.

