# Mapa de dominio e implementación

Este documento conecta la definición de producto con una futura implementación. No prescribe lenguaje, framework, base de datos ni arquitectura de despliegue.

## Objetivo del modelo

El núcleo no es el anuncio ni el chat de forma aislada. Es el ciclo verificable:

`descubrir → consentir contacto → negociar → acordar → ejecutar → confirmar → liquidar → valorar`

Cada módulo debe proteger ese ciclo y evitar atajos que rompan consentimiento, trazabilidad o reciprocidad.

## Contextos funcionales

### Identidad y acceso

**Responsabilidad:** saber quién puede entrar y en qué estado se encuentra su cuenta.

**Incluye:**

- Registro.
- Verificación.
- Mayoría de edad.
- Sesiones.
- Recuperación.
- Consentimientos legales.
- Roles y estado de cuenta.

**No debe conocer:** anuncios, acuerdos o saldo salvo para comprobar bloqueos generales de acceso.

### Perfiles

**Responsabilidad:** representar lo que un miembro puede ofrecer, lo que le interesa y cómo puede participar.

**Incluye:**

- Identidad visible.
- Presentación.
- Habilidades.
- Intereses.
- Disponibilidad.
- Modalidades.
- Ubicación aproximada.
- Preferencias de privacidad.

**No debe contener:** saldo, mensajes ni dirección pública exacta.

### Catálogo y anuncios

**Responsabilidad:** describir ofertas y solicitudes disponibles.

**Incluye:**

- Tipo de anuncio.
- Contenido.
- Categorías y etiquetas.
- Modalidad.
- Compensación admitida.
- Gastos previstos.
- Vigencia.
- Estado de publicación.

**No debe ejecutar:** contacto, acuerdos o transferencias.

### Descubrimiento

**Responsabilidad:** recuperar y ordenar anuncios y perfiles compatibles con una consulta.

**Incluye:**

- Búsqueda textual.
- Filtros.
- Proximidad.
- Relevancia.
- Visibilidad pública o privada.

**Dependencias:** anuncios, perfiles y reputación agregada.

### Contacto y mensajería

**Responsabilidad:** controlar el consentimiento para conversar y preservar el contexto.

**Incluye:**

- Solicitudes de contacto.
- Aceptación, rechazo, retirada y caducidad.
- Conversaciones.
- Mensajes.
- Bloqueos.
- Referencias a anuncios o perfiles.

**Invariante principal:** no hay conversación habilitada sin una solicitud aceptada.

### Negociación y acuerdos

**Responsabilidad:** convertir una intención informal en condiciones versionadas y aceptadas.

**Incluye:**

- Propuestas.
- Versiones.
- Participantes y roles.
- Prestaciones.
- Duración.
- Modalidad.
- Fecha o periodo.
- Compensación.
- Gastos.
- Aceptaciones.
- Reprogramación y cancelación.

**Invariante principal:** las dos partes aceptan exactamente la misma versión.

### Intercambios

**Responsabilidad:** registrar la ejecución y determinar si puede cerrarse.

**Incluye:**

- Prestaciones esperadas.
- Marcado de realización.
- Confirmación o rechazo.
- Estado de finalización.
- Referencia a disputa.

**Invariante principal:** no se liquida antes de la confirmación necesaria.

### Créditos de tiempo

**Responsabilidad:** mantener un libro de movimientos consistente.

**Incluye:**

- Cuentas de tiempo.
- Movimientos.
- Saldo.
- Límite de débito.
- Liquidaciones.
- Ajustes y reversiones.
- Claves de idempotencia.

**Invariante principal:** los movimientos no se editan ni eliminan; se compensan.

### Reputación

**Responsabilidad:** representar confianza derivada de experiencias verificadas.

**Incluye:**

- Valoración del participante.
- Valoración del servicio.
- Comentarios.
- Agregados.
- Estado de moderación.

**Invariante principal:** solo valora quien participó en un intercambio completado.

### Confianza y moderación

**Responsabilidad:** investigar problemas, limitar daño y documentar decisiones.

**Incluye:**

- Denuncias.
- Disputas.
- Evidencias.
- Sanciones.
- Moderación de contenido.
- Resoluciones.
- Acciones administrativas.
- Servicios prohibidos.

## Entidades principales

### User

Identidad de acceso.

**Campos conceptuales:**

- `id`
- `email`
- `credential`
- `status`
- `roles`
- `emailVerifiedAt`
- `adultVerificationStatus`
- `createdAt`
- `closedAt`

### Consent

Aceptación versionada de términos.

**Campos conceptuales:**

- `userId`
- `documentType`
- `documentVersion`
- `acceptedAt`
- `revokedAt`

### Profile

Identidad comunitaria de un usuario.

**Campos conceptuales:**

- `userId`
- `displayName`
- `bio`
- `skills`
- `interests`
- `modalities`
- `availability`
- `approximateLocation`
- `privacySettings`
- `completionStatus`

### Listing

Anuncio publicado por un miembro.

**Campos conceptuales:**

- `id`
- `authorId`
- `type`
- `title`
- `description`
- `categories`
- `modality`
- `approximateLocation`
- `availability`
- `compensationOptions`
- `desiredCounterService`
- `estimatedDuration`
- `expectedExpenses`
- `status`
- `publishedAt`
- `expiresAt`

### ContactRequest

Permiso solicitado para iniciar conversación.

**Campos conceptuales:**

- `id`
- `senderId`
- `recipientId`
- `contextType`
- `contextId`
- `initialMessage`
- `status`
- `createdAt`
- `resolvedAt`

### Conversation

Canal habilitado después del consentimiento.

**Campos conceptuales:**

- `id`
- `participantIds`
- `contactRequestId`
- `context`
- `status`
- `createdAt`

### Message

Comunicación dentro de una conversación.

**Campos conceptuales:**

- `id`
- `conversationId`
- `senderId`
- `content`
- `sentAt`
- `moderationStatus`

### Agreement

Compromiso resultante de una negociación.

**Campos conceptuales:**

- `id`
- `conversationId`
- `listingId`
- `providerId`
- `receiverId`
- `exchangeMode`
- `status`
- `currentVersion`
- `scheduledWindow`
- `createdAt`

### AgreementVersion

Condiciones inmutables de una propuesta concreta.

**Campos conceptuales:**

- `agreementId`
- `version`
- `services`
- `duration`
- `modality`
- `locationOrRemoteChannel`
- `expenses`
- `cancellationTerms`
- `proposedBy`
- `createdAt`

### AgreementAcceptance

Aceptación de una versión por una parte.

**Campos conceptuales:**

- `agreementId`
- `version`
- `userId`
- `acceptedAt`

### Exchange

Ejecución de un acuerdo activo.

**Campos conceptuales:**

- `id`
- `agreementId`
- `status`
- `startedAt`
- `completedAt`
- `disputeId`

### Obligation

Prestación que debe completar una parte. En créditos suele existir una prestación; en trueque directo, dos.

**Campos conceptuales:**

- `id`
- `exchangeId`
- `performerId`
- `recipientId`
- `description`
- `expectedMinutes`
- `status`
- `markedCompletedAt`
- `confirmedAt`
- `rejectedAt`

### TimeAccount

Cartera de un miembro.

**Campos conceptuales:**

- `userId`
- `currentBalance`
- `minimumBalance`

El saldo puede calcularse desde el libro de movimientos; si se materializa, debe tratarse como proyección verificable, no como única fuente de verdad.

### TimeTransaction

Movimiento inmutable de créditos.

**Campos conceptuales:**

- `id`
- `accountId`
- `exchangeId`
- `type`
- `amount`
- `counterpartyId`
- `balanceAfter`
- `idempotencyKey`
- `reversesTransactionId`
- `createdAt`

### Review

Valoración derivada de un intercambio.

**Campos conceptuales:**

- `id`
- `exchangeId`
- `reviewerId`
- `reviewedUserId`
- `serviceCategoryId`
- `participantRating`
- `serviceRating`
- `comment`
- `moderationStatus`
- `createdAt`

### Report

Denuncia de contenido o comportamiento.

**Campos conceptuales:**

- `id`
- `reporterId`
- `targetType`
- `targetId`
- `reason`
- `description`
- `status`
- `assignedModeratorId`
- `resolution`

### Dispute

Desacuerdo sobre un intercambio.

**Campos conceptuales:**

- `id`
- `exchangeId`
- `openedBy`
- `reason`
- `description`
- `status`
- `resolution`
- `resolvedBy`
- `resolvedAt`

### ModerationAction

Registro inmutable de una decisión administrativa.

**Campos conceptuales:**

- `id`
- `moderatorId`
- `targetType`
- `targetId`
- `action`
- `reason`
- `metadata`
- `createdAt`

## Enumeraciones de dominio

### ListingType

- `OFFER`
- `REQUEST`

### Modality

- `IN_PERSON`
- `REMOTE`
- `BOTH`

### CompensationOption

- `TIME_CREDITS`
- `DIRECT_SWAP`
- `EITHER`

`EITHER` solo existe en el anuncio. Un acuerdo utiliza `TIME_CREDITS` o `DIRECT_SWAP`.

### AccountStatus

- `PENDING_VERIFICATION`
- `ACTIVE`
- `SUSPENDED`
- `CLOSED`

### ListingStatus

- `DRAFT`
- `ACTIVE`
- `PAUSED`
- `EXPIRED`
- `REMOVED`
- `MODERATION_HOLD`

### ContactRequestStatus

- `PENDING`
- `ACCEPTED`
- `REJECTED`
- `WITHDRAWN`
- `EXPIRED`

### AgreementStatus

- `DRAFT`
- `PROPOSED`
- `ACCEPTED`
- `ACTIVE`
- `RESCHEDULE_PENDING`
- `CANCELLED`
- `COMPLETION_PENDING`
- `COMPLETED`
- `DISPUTED`

### ObligationStatus

- `PENDING`
- `MARKED_COMPLETED`
- `CONFIRMED`
- `REJECTED`
- `CANCELLED`

### DisputeStatus

- `OPEN`
- `AWAITING_INFORMATION`
- `UNDER_REVIEW`
- `RESOLVED`
- `CLOSED`

## Máquinas de estados

### Anuncio

```text
DRAFT → ACTIVE ↔ PAUSED
           ↓
        EXPIRED
           ↓
         ACTIVE  (renovación)

DRAFT | ACTIVE | PAUSED | EXPIRED → REMOVED
ACTIVE → MODERATION_HOLD → ACTIVE | REMOVED
```

### Solicitud de contacto

```text
PENDING → ACCEPTED
        → REJECTED
        → WITHDRAWN
        → EXPIRED
```

Solo `ACCEPTED` permite crear o habilitar una conversación.

### Acuerdo e intercambio

```text
DRAFT → PROPOSED → ACCEPTED → ACTIVE
          ↑   ↓                  ↓
          └── nueva versión   COMPLETION_PENDING
                                 ↓
                           COMPLETED | DISPUTED

PROPOSED | ACCEPTED | ACTIVE → CANCELLED
```

Una nueva versión devuelve el acuerdo a `PROPOSED` y requiere nuevas aceptaciones.

### Prestación

```text
PENDING → MARKED_COMPLETED → CONFIRMED
                           → REJECTED
PENDING → CANCELLED
```

## Invariantes

### Identidad

- Una cuenta no verificada no publica, contacta ni intercambia.
- Una cuenta suspendida no inicia nuevas acciones.
- Los consentimientos obligatorios indican versión y fecha.

### Anuncios

- El autor debe ser miembro activo.
- El tipo no cambia después de publicar; se crea otro anuncio.
- Una modalidad presencial requiere zona aproximada.
- El trabajo nunca tiene precio monetario.
- Los gastos están separados de la compensación.

### Contacto

- Emisor y receptor son diferentes.
- No hay más de una solicitud pendiente equivalente.
- Un bloqueo impide nuevas solicitudes y mensajes.
- Rechazar no crea conversación.

### Acuerdos

- Participan exactamente dos miembros en el MVP.
- Existe un proveedor y un receptor por prestación.
- El modo final es créditos o trueque.
- Las aceptaciones pertenecen a una versión concreta.
- Una versión modificada invalida las aceptaciones previas.

### Intercambios

- Solo participantes pueden cambiar su ejecución.
- Un intercambio disputado no se liquida automáticamente.
- El cierre no puede ejecutarse dos veces.
- El trueque exige confirmar todas sus prestaciones.

### Créditos

- Una hora confirmada equivale a un crédito.
- La precisión temporal debe ser uniforme en toda la plataforma.
- El saldo posterior no puede ser inferior a `-3`.
- Cada liquidación tiene una clave de idempotencia.
- El total debitado y acreditado en una transferencia es equivalente.
- Una reversión referencia el movimiento original.

### Reputación

- Solo participantes pueden valorar.
- Solo se valora después de completar.
- Una valoración identifica el intercambio y la categoría.
- La valoración general y la valoración de servicio son agregados diferentes.

## Permisos resumidos

| Acción | Visitante | Miembro | Participante | Moderador |
|---|---:|---:|---:|---:|
| Consultar contenido público | Sí | Sí | Sí | Sí |
| Publicar anuncio | No | Sí | Sí | Sí |
| Solicitar contacto | No | Sí | Sí | Sí |
| Leer conversación | No | No | Sí | Solo con causa autorizada |
| Modificar acuerdo | No | No | Sí | No |
| Confirmar prestación | No | No | Sí | No |
| Consultar cartera propia | No | Sí | Sí | Solo con causa autorizada |
| Valorar | No | No | Sí | No |
| Resolver denuncia o disputa | No | No | No | Sí |
| Ajustar créditos | No | No | No | Sí, con justificación |

“Participante” es un miembro relacionado con la conversación, el acuerdo o el intercambio concreto.

## Eventos de dominio sugeridos

Estos eventos permiten desacoplar notificaciones, proyecciones y auditoría:

- `UserVerified`
- `ProfileCompleted`
- `ListingPublished`
- `ListingPaused`
- `ContactRequested`
- `ContactAccepted`
- `ContactRejected`
- `MessageSent`
- `AgreementProposed`
- `AgreementVersionAccepted`
- `AgreementActivated`
- `AgreementRescheduled`
- `AgreementCancelled`
- `ObligationMarkedCompleted`
- `ObligationConfirmed`
- `ObligationRejected`
- `ExchangeCompleted`
- `ExchangeDisputed`
- `TimeCreditsTransferred`
- `TimeCreditsReversed`
- `ReviewSubmitted`
- `ReportCreated`
- `ModerationActionApplied`

No es necesario implementar event sourcing. Los eventos pueden ser simples hechos publicados después de una transacción correcta.

## Operaciones que requieren atomicidad

- Aceptar la misma versión de un acuerdo por ambas partes y activarlo.
- Confirmar una prestación y decidir si el intercambio puede liquidarse.
- Debitar y acreditar créditos.
- Cerrar un trueque al confirmar todas sus prestaciones.
- Abrir una disputa y bloquear la liquidación.
- Revertir una transferencia mediante movimientos compensatorios.

## Idempotencia y concurrencia

- Confirmar un intercambio repetidamente produce un único resultado.
- Dos confirmaciones simultáneas no duplican créditos.
- Una propuesta se acepta mediante identificador y versión.
- Si la versión cambió, la aceptación se rechaza como obsoleta.
- La cartera se actualiza con bloqueo transaccional o control optimista equivalente.
- Las tareas asíncronas utilizan claves estables por operación.

## Datos sensibles

Tratar con especial cuidado:

- Email y credenciales.
- Fecha o prueba de edad.
- Dirección o coordenadas precisas.
- Lugar de un intercambio.
- Mensajes privados.
- Evidencias de denuncias o disputas.
- Historial individual de créditos.
- Acciones de moderación.

Las superficies públicas deben trabajar con proyecciones reducidas, no reutilizar directamente objetos internos completos.

## Búsqueda y geolocalización

- Indexar solo anuncios activos y visibles.
- Guardar una representación aproximada separada de cualquier dato preciso.
- Calcular proximidad sin devolver coordenadas privadas.
- Excluir la distancia en servicios exclusivamente remotos.
- Permitir buscar sin compartir ubicación.
- Definir una estrategia clara de actualización del índice ante cambios de estado.

## Notificaciones

Las notificaciones son una reacción a eventos, no el origen del estado.

Notificaciones mínimas:

- Solicitud de contacto recibida.
- Solicitud aceptada o rechazada.
- Mensaje nuevo.
- Propuesta o contrapropuesta.
- Acuerdo pendiente de aceptación.
- Reprogramación o cancelación.
- Prestación pendiente de confirmación.
- Disputa actualizada.

Si una notificación falla, la acción original sigue siendo válida y visible dentro del producto.

## Observabilidad mínima

- Errores por flujo.
- Tiempo desde registro hasta perfil completo.
- Búsquedas sin resultados.
- Solicitudes aceptadas y rechazadas.
- Acuerdos formalizados.
- Intercambios completados y disputados.
- Fallos y reintentos de liquidación.
- Saldos cercanos al límite.
- Denuncias por tipo y tiempo de resolución.

Estas métricas describen la salud del sistema. No constituyen un roadmap ni objetivos de crecimiento.

## Decisiones técnicas aún abiertas

- Monolito modular o servicios separados.
- Sistema de autenticación.
- Base de datos transaccional.
- Motor de búsqueda.
- Representación geoespacial.
- Transporte de mensajes en tiempo real.
- Proveedor de email.
- Almacenamiento de evidencias.
- Estrategia de moderación automática.
- Despliegue y observabilidad.

La implementación inicial debería favorecer consistencia transaccional y separación modular antes que distribución prematura.

