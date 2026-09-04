# ADR 0003: consentimiento antes del chat

- **Estado:** Aceptado
- **Fecha:** 2026-08-03

## Contexto

La plataforma conecta a desconocidos. Permitir mensajes directos desde cualquier perfil o anuncio aumenta spam, acoso y exposición no deseada.

## Decisión

El contacto comienza mediante una solicitud contextualizada. El receptor puede aceptarla o rechazarla. Solo una solicitud aceptada habilita la conversación.

Un rechazo:

- No abre chat.
- No requiere justificación.
- No revela datos privados.

Los bloqueos impiden nuevas solicitudes y mensajes.

## Consecuencias positivas

- El receptor conserva control.
- Reduce mensajes no solicitados.
- Mantiene el contexto del anuncio o perfil.
- Facilita límites de frecuencia y moderación.

## Costes y riesgos

- Introduce fricción antes de conversar.
- Requiere estados, caducidad y tratamiento de duplicados.
- Deben diseñarse notificaciones para no perder solicitudes.

## Alternativas consideradas

- Mensajería abierta: más rápida, pero con mayor riesgo.
- Revelar email o teléfono: desplaza la seguridad fuera de la plataforma.
- Aprobación administrativa de cada contacto: demasiado costosa y lenta.

