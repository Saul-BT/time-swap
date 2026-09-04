# Mapa de interfaces

Este documento describe qué interfaces necesita Time Swap, qué responsabilidad tiene cada una y qué información debe manejar. No define aún componentes, layout, identidad visual ni microinteracciones.

## Modelo de navegación

La experiencia se divide en tres contextos:

- **Público:** comprender el producto, consultar contenido permitido y registrarse.
- **Miembro:** descubrir, publicar, contactar, acordar, intercambiar y gestionar la cuenta.
- **Moderación:** revisar riesgos, contenido e incidencias.

La navegación autenticada debe mantener accesibles cuatro destinos conceptuales:

- Descubrir.
- Publicar.
- Conversaciones y acuerdos.
- Perfil y actividad.

Esto no obliga a utilizar cuatro elementos de navegación; define las capacidades que no deberían quedar ocultas.

## Interfaces públicas

### Landing

**Propósito:** explicar en pocos minutos qué es un banco del tiempo, por qué es diferente de un marketplace y cómo empezar.

**Información necesaria:**

- Propuesta de valor.
- Ejemplos representativos de ofertas y solicitudes.
- Explicación de créditos frente a trueque directo.
- Resumen del proceso completo.
- Principios de confianza y seguridad.
- Cobertura geográfica y modalidades disponibles.
- Respuestas a dudas sobre dinero, gastos y valor del tiempo.

**Acciones principales:**

- Registrarse.
- Iniciar sesión.
- Explorar anuncios públicos, si finalmente se permite.
- Consultar normas, privacidad y funcionamiento.

**Requisitos relevantes:**

- No debe presentar la plataforma como empleo, voluntariado puro ni compraventa.
- Debe dejar claro que el tiempo no se convierte en dinero.
- Debe distinguir servicio gratuito de reembolso de materiales.
- Debe explicar que la comunidad funciona dando y recibiendo.

### Explorar contenido público

**Propósito:** permitir comprender la actividad disponible antes de crear una cuenta.

**Decisión pendiente:** determinar si los visitantes pueden consultar anuncios completos, una selección anonimizada o solo ejemplos editoriales.

**Información potencial:**

- Tipo de anuncio.
- Categoría y modalidad.
- Zona aproximada.
- Descripción limitada.
- Identidad pública mínima del autor.

**Restricciones:**

- Nunca mostrar información de contacto.
- Nunca mostrar ubicación precisa.
- No permitir solicitudes de contacto sin cuenta verificada.

### Inicio de sesión

**Propósito:** autenticar a un miembro y devolverlo al contexto que intentaba visitar.

**Información necesaria:**

- Identificador de acceso.
- Credencial.
- Estado de la cuenta: pendiente, activa, suspendida o cerrada.

**Estados relevantes:**

- Credenciales incorrectas.
- Cuenta sin verificar.
- Cuenta suspendida.
- Demasiados intentos.
- Sesión caducada.

### Registro

**Propósito:** crear una identidad básica y obtener los consentimientos obligatorios.

**Información mínima:**

- Nombre visible.
- Email.
- Credencial.
- Confirmación de mayoría de edad.
- Aceptación de términos, privacidad y código de conducta.

**Requisitos relevantes:**

- Evitar pedir habilidades, ubicación detallada o biografía en este primer paso.
- Comunicar claramente por qué la participación está limitada a adultos.
- No activar plenamente la cuenta hasta verificarla.

### Verificación

**Propósito:** confirmar que el canal de contacto pertenece al usuario y aplicar el mecanismo elegido de comprobación de edad.

**Estados relevantes:**

- Código o enlace válido.
- Código caducado.
- Reenvío solicitado.
- Cuenta ya verificada.
- Edad no válida.

### Recuperación de acceso

**Propósito:** recuperar la cuenta sin revelar si un email concreto pertenece a un miembro.

**Requisitos relevantes:**

- Enlace temporal y de un solo uso.
- Invalidación tras el cambio de credencial.
- Respuesta pública indistinguible para emails existentes y no existentes.

## Incorporación del miembro

### Onboarding

**Propósito:** llevar una cuenta verificada hasta un perfil suficientemente útil para participar.

**Información necesaria:**

- Breve presentación.
- Habilidades que puede compartir.
- Intereses o ayuda que le gustaría recibir.
- Modalidad presencial, remota o ambas.
- Zona aproximada.
- Disponibilidad general.
- Preferencias básicas de privacidad y notificaciones.

**Resultado esperado:**

- Perfil con completitud mínima.
- Al menos una habilidad o interés.
- Comprensión del funcionamiento de créditos y contacto consentido.

**Requisitos relevantes:**

- Permitir continuar más tarde.
- Explicar para qué se utiliza cada dato.
- No convertir el onboarding en la publicación obligatoria de un anuncio.

### Inicio autenticado

**Propósito:** responder “¿qué requiere mi atención y qué puedo hacer ahora?”.

**Información prioritaria:**

- Solicitudes de contacto pendientes.
- Mensajes y contrapropuestas.
- Acuerdos que requieren aceptación.
- Intercambios que requieren confirmación.
- Disputas o incidencias abiertas.
- Estado de anuncios propios.
- Saldo de tiempo.

**Contenido secundario:**

- Ofertas y solicitudes compatibles con intereses.
- Sugerencias para completar el perfil o publicar.

**Requisitos relevantes:**

- Priorizar acciones pendientes sobre contenido exploratorio.
- No duplicar toda la interfaz de descubrimiento.
- Distinguir con claridad conversación, acuerdo e intercambio.

## Descubrimiento

### Resultados de búsqueda

**Propósito:** encontrar ofertas, solicitudes o miembros relevantes.

**Filtros funcionales:**

- Texto.
- Oferta o solicitud.
- Categoría o habilidad.
- Presencial, remoto o ambas.
- Cerca de mí.
- Disponibilidad o vigencia, si el dato es suficientemente fiable.

**Información por resultado:**

- Tipo.
- Título y resumen.
- Categorías.
- Modalidad.
- Zona o distancia aproximada.
- Compensación admitida.
- Gastos previstos, si existen.
- Datos mínimos de reputación.

**Estados relevantes:**

- Cargando.
- Sin resultados.
- Ubicación no configurada.
- Permiso de ubicación rechazado.
- Filtros incompatibles.
- Error recuperable.

**Requisitos relevantes:**

- No mezclar visualmente ofertas y solicitudes sin indicar su tipo.
- “Cerca de mí” debe ser una decisión explícita.
- Los resultados remotos no necesitan ubicación.
- La relevancia no debe basarse exclusivamente en la valoración media.

### Detalle de anuncio

**Propósito:** permitir decidir si existe suficiente encaje para contactar.

**Información necesaria:**

- Oferta o solicitud.
- Descripción y alcance orientativo.
- Habilidad o categoría.
- Modalidad.
- Zona aproximada para servicios presenciales.
- Disponibilidad.
- Compensación admitida.
- Prestación deseada a cambio, si el trueque es específico.
- Gastos previstos y responsable.
- Estado y vigencia.
- Autor y reputación relevante.

**Acciones principales:**

- Solicitar contacto.
- Consultar perfil.
- Denunciar anuncio.
- Editar, pausar o retirar si pertenece al usuario.

**Requisitos relevantes:**

- No presentar la duración estimada como precio.
- Diferenciar claramente gastos de compensación.
- Evitar revelar datos necesarios únicamente después del acuerdo.

### Perfil público de miembro

**Propósito:** ayudar a evaluar identidad comunitaria, afinidad y confianza.

**Información necesaria:**

- Nombre visible y presentación.
- Zona aproximada.
- Modalidades.
- Habilidades e intereses.
- Idiomas, si se incorporan.
- Ofertas y solicitudes activas.
- Historial agregado de participación.
- Reputación general.
- Reputación por servicio o categoría.
- Indicadores de verificación.

**Acciones principales:**

- Solicitar contacto.
- Abrir conversación si ya existe permiso.
- Consultar anuncios.
- Bloquear o denunciar.

**Requisitos relevantes:**

- No aceptar valoraciones de personas que no hayan participado en un intercambio.
- No mostrar saldo de créditos a otros miembros.
- No mostrar email, teléfono o dirección.
- La ausencia de valoraciones debe expresarse como falta de historial, no como mala reputación.

## Publicación

### Crear oferta

**Propósito:** declarar una habilidad o ayuda que el miembro está dispuesto a proporcionar.

**Información necesaria:**

- Título.
- Descripción.
- Categorías o habilidades.
- Modalidad.
- Zona aproximada si es presencial.
- Disponibilidad orientativa.
- Duración orientativa o unidad de sesión.
- Créditos, trueque directo o ambos.
- Qué aceptaría a cambio, si desea concretarlo.
- Gastos previstos.
- Vigencia.

### Crear solicitud

**Propósito:** declarar una necesidad que otro miembro pueda cubrir.

**Información necesaria:**

- Título.
- Descripción y resultado esperado.
- Categoría.
- Modalidad.
- Zona aproximada.
- Urgencia o fecha límite, si procede.
- Disponibilidad.
- Compensación admitida.
- Qué puede ofrecer en un trueque.
- Materiales o gastos asociados.

### Revisar y publicar

**Propósito:** mostrar las condiciones completas antes de hacer visible el anuncio.

**Validaciones relevantes:**

- Perfil suficientemente completo.
- Campos obligatorios.
- Modalidad compatible con ubicación.
- Compensación válida.
- Gastos separados del servicio.
- Categoría permitida.
- Ausencia de datos privados innecesarios.

### Mis anuncios

**Propósito:** controlar el ciclo de vida de ofertas y solicitudes propias.

**Información necesaria:**

- Estado: borrador, activo, pausado, caducado o retirado.
- Solicitudes de contacto asociadas.
- Acuerdos activos originados.
- Fecha de publicación y expiración.

**Acciones principales:**

- Crear.
- Editar.
- Pausar y reactivar.
- Renovar.
- Retirar.

**Regla relevante:** retirar un anuncio no cancela los acuerdos ya formalizados.

## Contacto y comunicación

### Solicitudes de contacto

**Propósito:** gestionar quién puede iniciar una conversación.

**Vistas necesarias:**

- Recibidas.
- Enviadas.
- Pendientes.
- Aceptadas.
- Rechazadas o caducadas.

**Información necesaria:**

- Emisor y receptor.
- Anuncio o perfil que origina la solicitud.
- Mensaje inicial.
- Fecha y estado.

**Acciones principales:**

- Aceptar y habilitar chat.
- Rechazar.
- Bloquear o denunciar.
- Retirar una solicitud enviada, si sigue pendiente.

**Requisitos relevantes:**

- No habilitar chat mientras esté pendiente.
- Evitar solicitudes duplicadas.
- Aplicar límites de frecuencia.
- No exigir al receptor justificar el rechazo.

### Bandeja de conversaciones

**Propósito:** localizar conversaciones habilitadas y comprender su contexto.

**Información necesaria:**

- Contraparte.
- Anuncio o acuerdo relacionado.
- Último mensaje.
- Estado: conversación, negociación, acuerdo activo o cerrado.
- Indicadores de mensajes pendientes.

### Conversación

**Propósito:** permitir aclarar dudas y comenzar una negociación sin revelar datos privados.

**Información necesaria:**

- Mensajes.
- Contexto original.
- Estado del contacto.
- Propuestas de acuerdo relacionadas.

**Acciones principales:**

- Enviar mensajes.
- Proponer intercambio.
- Revisar o responder propuestas.
- Bloquear o denunciar.

**Requisitos relevantes:**

- El bloqueo impide nuevos mensajes.
- Una denuncia conserva el contexto necesario para moderación.
- El sistema debe diferenciar un mensaje informal de una propuesta formal.

## Negociación y acuerdo

### Crear o editar propuesta

**Propósito:** transformar una conversación en condiciones estructuradas.

**Información necesaria:**

- Qué prestación se realizará.
- Quién presta y quién recibe.
- Duración estimada.
- Modalidad.
- Fecha o periodo.
- Lugar aproximado o canal remoto.
- Créditos o trueque directo.
- Prestación recíproca en un trueque.
- Materiales y gastos.
- Observaciones y condiciones de cancelación.

**Requisitos relevantes:**

- Cualquier cambio crea una nueva versión.
- La aceptación siempre se refiere a una versión concreta.
- Una contrapropuesta invalida la aceptación anterior.
- No existe acuerdo activo hasta la aceptación bilateral.

### Revisar y aceptar acuerdo

**Propósito:** asegurar que ambas partes comprenden y aceptan las mismas condiciones.

**Información necesaria:**

- Resumen completo.
- Diferencias respecto de la versión anterior.
- Identidad y rol de cada participante.
- Consecuencias de créditos o trueque.
- Gastos fuera de la plataforma.

**Acciones principales:**

- Aceptar.
- Rechazar.
- Proponer cambios.

### Detalle de acuerdo

**Propósito:** actuar como fuente de verdad durante la preparación y ejecución.

**Estados:**

- Borrador.
- Propuesto.
- Aceptado.
- Reprogramación pendiente.
- Activo.
- Cancelado.
- En finalización.
- Completado.
- Disputado.

**Acciones contextuales:**

- Reprogramar.
- Cancelar.
- Abrir conversación.
- Marcar prestación realizada.
- Confirmar o rechazar.
- Abrir disputa.

## Ejecución y cierre

### Intercambio activo

**Propósito:** mostrar qué debe ocurrir y qué acción corresponde a cada parte.

**Información necesaria:**

- Condiciones aceptadas.
- Participantes y roles.
- Fecha y modalidad.
- Prestaciones pendientes.
- Estado de ejecución.
- Gastos acordados.
- Acceso a conversación.

**Requisitos relevantes:**

- En un trueque, mostrar las dos prestaciones por separado.
- En créditos, mostrar las horas previstas sin tratarlas como precio.
- Los datos precisos del encuentro solo deben mostrarse a participantes autorizados.

### Confirmación de finalización

**Propósito:** obtener confirmación bilateral antes de cerrar o mover créditos.

**Flujo:**

- Una parte marca su prestación como realizada.
- La contraparte confirma o rechaza.
- Si confirma, se liquida.
- Si rechaza, se permite negociar o disputar.

**Requisitos relevantes:**

- La confirmación debe ser idempotente.
- No debe haber transferencia parcial accidental.
- Debe quedar claro qué se está confirmando.

### Valoración

**Propósito:** registrar confianza verificable después del intercambio.

**Dimensiones conceptuales:**

- Cumplimiento y comunicación del participante.
- Calidad percibida del servicio concreto.
- Comentario opcional sujeto a moderación.

**Requisitos relevantes:**

- Una valoración por participante e intercambio.
- Vínculo verificable con el intercambio.
- Separación entre reputación general y por servicio.
- Tratamiento claro de valoraciones editadas, ocultas o moderadas.

### Disputa

**Propósito:** detener el cierre automático y reunir el contexto necesario para una resolución.

**Información necesaria:**

- Motivo.
- Descripción.
- Acuerdo y versión.
- Mensajes o evidencias relevantes.
- Estado y resolución.

**Requisitos relevantes:**

- Suspender la liquidación.
- Permitir respuesta de ambas partes.
- Restringir acceso a información sensible.
- Registrar decisiones y ajustes.

## Cartera y actividad

### Cartera de tiempo

**Propósito:** explicar con claridad cuánto tiempo puede utilizar el miembro.

**Información necesaria:**

- Saldo actual.
- Límite mínimo permitido.
- Créditos pendientes, si se modelan.
- Explicación de cómo se gana y utiliza tiempo.

**Requisitos relevantes:**

- Evitar lenguaje bancario que implique dinero real.
- Explicar por qué puede existir saldo negativo.
- No permitir compra, venta o retirada.

### Historial

**Propósito:** ofrecer trazabilidad de intercambios y movimientos.

**Información necesaria:**

- Fecha.
- Tipo de movimiento.
- Intercambio relacionado.
- Contraparte.
- Horas.
- Saldo resultante.
- Estado, reversión o disputa.

**Requisitos relevantes:**

- Un movimiento revertido no desaparece.
- Las operaciones repetidas no crean duplicados.
- El historial privado solo pertenece al titular y a moderación autorizada.

## Cuenta, preferencias y seguridad

### Editar perfil

**Propósito:** mantener la información comunitaria actualizada.

**Áreas:**

- Identidad visible y presentación.
- Habilidades e intereses.
- Disponibilidad.
- Ubicación.
- Privacidad.
- Notificaciones.

### Privacidad

**Propósito:** controlar qué información se muestra y en qué contexto.

**Decisiones necesarias:**

- Perfil visible para visitantes o solo miembros.
- Zona aproximada mostrada.
- Datos revelados tras aceptar contacto.
- Datos revelados solo al formalizar un acuerdo.

### Seguridad de cuenta

**Propósito:** proteger acceso y sesiones.

**Capacidades:**

- Cambiar credencial.
- Cerrar otras sesiones.
- Revisar actividad de seguridad relevante.
- Solicitar cierre de cuenta.

**Regla relevante:** cerrar la cuenta debe considerar acuerdos, disputas y movimientos que deban conservarse.

## Moderación

### Panel de moderación

**Propósito:** priorizar riesgos y trabajo pendiente.

**Información necesaria:**

- Denuncias por gravedad y antigüedad.
- Disputas abiertas.
- Contenido pendiente de revisión.
- Usuarios con sanciones o patrones repetidos.
- Acciones recientes.

### Gestión de denuncias

**Propósito:** investigar contenido o comportamiento denunciado.

**Capacidades:**

- Clasificar.
- Asignar.
- Consultar contexto.
- Solicitar información.
- Ocultar contenido.
- Aplicar sanciones.
- Resolver y comunicar.

### Resolución de disputas

**Propósito:** decidir el estado final de un intercambio.

**Resultados posibles:**

- Confirmar el intercambio.
- Cancelarlo.
- Corregir horas.
- Ajustar o revertir créditos.
- Aplicar medidas sobre una cuenta.

### Gestión de taxonomía y prohibiciones

**Propósito:** mantener categorías útiles y prevenir servicios incompatibles con las normas.

**Capacidades:**

- Crear y editar categorías.
- Desactivar sin destruir referencias históricas.
- Mantener sinónimos y etiquetas.
- Definir servicios prohibidos o sujetos a revisión.

## Estados transversales

Todas las interfaces con datos remotos deben considerar:

- Carga inicial.
- Operación en progreso.
- Contenido vacío.
- Error recuperable.
- Permiso insuficiente.
- Recurso retirado o no disponible.
- Sesión caducada.
- Estado actualizado por la contraparte.

Las interfaces relacionadas con acuerdos y créditos deben comunicar concurrencia: si otra persona modifica o confirma algo, el usuario no debe actuar sobre una versión obsoleta sin advertencia.

