# ADR 0002: contabilidad de créditos de tiempo

- **Estado:** Aceptado
- **Fecha:** 2026-08-03

## Contexto

El producto necesita una unidad sencilla que no reproduzca precios de mercado. También debe evitar que una cuenta nueva quede bloqueada hasta encontrar primero a quién ayudar.

## Decisión

- Una hora confirmada equivale a un crédito.
- Todas las cuentas comienzan con saldo cero.
- El saldo mínimo permitido en el MVP es `-3`.
- La liquidación debita y acredita de forma atómica.
- Los movimientos son inmutables.
- Los errores se corrigen mediante movimientos compensatorios.
- Los créditos no se compran, venden ni convierten en dinero.

## Consecuencias positivas

- Regla fácil de explicar.
- Reduce jerarquías económicas entre habilidades.
- La deuda limitada mejora la activación inicial.
- El libro inmutable facilita auditoría y resolución de disputas.

## Costes y riesgos

- El límite `-3` requiere seguimiento y puede cambiar con evidencia.
- Algunos servicios tienen duraciones difíciles de estimar.
- Debe decidirse la fracción mínima registrable.
- La concurrencia y la idempotencia son requisitos técnicos esenciales.

## Alternativas consideradas

- Exigir saldo positivo: técnicamente simple, pero empeora el arranque.
- Regalar créditos iniciales: accesible, pero crea créditos sin una contraparte clara.
- Deuda ilimitada: inclusiva, pero vulnerable a abuso.
- Créditos ponderados por habilidad: contradice la igualdad del tiempo.

