# Banco del tiempo: criterios de aceptación del MVP

## Reglas transversales

- Solo pueden participar personas mayores de 18 años con una cuenta verificada.
- Un usuario puede ofrecer y solicitar servicios con la misma cuenta.
- Una hora confirmada equivale a un crédito.
- El saldo no puede quedar por debajo de `-3` créditos.
- Cada acuerdo utiliza créditos de tiempo o trueque directo, pero no ambos.
- Los gastos reales deben acordarse previamente y no remuneran el servicio.
- El chat solo está disponible tras aceptar una solicitud de contacto.
- Solo se puede valorar un intercambio completado y confirmado.
- Las acciones sensibles deben quedar registradas con usuario, fecha y estado.

## Cuenta y perfil

### ACC-01 Registrarse

- **Registro válido:** Dado un visitante mayor de edad con un email no registrado, cuando completa los campos obligatorios y envía el formulario, entonces se crea una cuenta pendiente de verificación.
- **Email duplicado:** Dado un email asociado a otra cuenta, cuando se intenta registrar de nuevo, entonces no se crea otra cuenta y se ofrece iniciar sesión o recuperar el acceso.
- **Datos inválidos:** Dado un formulario incompleto o inválido, cuando se intenta enviarlo, entonces se indican los campos que deben corregirse sin perder los datos válidos.

### ACC-02 Verificar cuenta y mayoría de edad

- **Verificación correcta:** Dada una cuenta pendiente, cuando el usuario completa la verificación requerida y declara tener al menos 18 años, entonces la cuenta queda verificada.
- **Verificación fallida:** Dado un código caducado o incorrecto, cuando se intenta verificar la cuenta, entonces permanece pendiente y se permite solicitar un nuevo código.
- **Menor de edad:** Dado un usuario que no cumple la edad mínima, cuando intenta completar la verificación, entonces no se habilita su participación.

### ACC-03 Aceptar términos y código de conducta

- **Consentimiento registrado:** Dada una cuenta pendiente, cuando el usuario acepta la versión vigente de los términos y del código de conducta, entonces se registran versión, fecha y consentimiento.
- **Rechazo:** Dado que el usuario no acepta ambos documentos, cuando intenta finalizar el registro, entonces la cuenta no se activa.
- **Cambio relevante:** Dado que existe una nueva versión obligatoria, cuando el usuario vuelve a acceder, entonces debe aceptarla antes de realizar nuevos intercambios.

### ACC-04 Iniciar sesión o recuperar acceso

- **Inicio correcto:** Dada una cuenta activa y credenciales válidas, cuando el usuario inicia sesión, entonces accede a su área privada.
- **Credenciales incorrectas:** Dadas credenciales inválidas, cuando se intenta iniciar sesión, entonces se rechaza el acceso sin revelar qué dato es incorrecto.
- **Recuperación:** Dado un email registrado, cuando se solicita recuperar el acceso, entonces se envía un enlace temporal y de un solo uso.

### ACC-05 Gestionar perfil, habilidades e intereses

- **Actualización:** Dado un miembro autenticado, cuando modifica sus datos, habilidades o intereses y guarda, entonces el perfil refleja la nueva información.
- **Campos obligatorios:** Dado un perfil sin la información mínima requerida, cuando se intenta publicar un anuncio, entonces se solicita completar primero el perfil.
- **Visibilidad:** Dado un perfil consultado por otro miembro, cuando se muestra, entonces no expone datos privados de contacto.

### ACC-06 Configurar disponibilidad, ubicación y privacidad

- **Disponibilidad:** Dado un miembro autenticado, cuando define franjas de disponibilidad, entonces se muestran como referencia en sus anuncios y acuerdos.
- **Ubicación:** Dada una ubicación válida, cuando se guarda, entonces se utiliza para búsquedas por proximidad sin publicar la dirección exacta.
- **Privacidad:** Dado que el usuario oculta un campo opcional, cuando otro miembro consulta su perfil, entonces dicho campo no se muestra.

## Anuncios y búsqueda

### ANU-01 Publicar oferta de servicio

- **Publicación válida:** Dado un perfil completo, cuando el miembro introduce título, descripción y condiciones válidas, entonces se publica una oferta activa.
- **Información insuficiente:** Dado que falta un campo obligatorio, cuando se intenta publicar, entonces el anuncio permanece como borrador y se indican los errores.
- **Servicio prohibido:** Dada una categoría o descripción no permitida, cuando se intenta publicar, entonces el anuncio se bloquea o se envía a moderación.

### ANU-02 Publicar solicitud de servicio

- **Publicación válida:** Dado un perfil completo, cuando el miembro describe qué necesita y define sus condiciones, entonces se publica una solicitud activa.
- **Caducidad:** Dada una solicitud con fecha límite, cuando vence, entonces deja de aparecer como activa.
- **Contenido prohibido:** Dada una solicitud que incumple las normas, cuando se detecta, entonces no queda disponible públicamente.

### ANU-03 Definir condiciones del anuncio

- **Condiciones completas:** Dado un anuncio nuevo, cuando el autor selecciona modalidad, compensación y etiquetas, entonces esas condiciones quedan asociadas al anuncio.
- **Compensación:** Dado un anuncio que admite “cualquiera”, cuando se formaliza un acuerdo, entonces debe elegirse créditos o trueque directo.
- **Gastos:** Dado que existen gastos previstos, cuando se declaran, entonces aparecen separados del servicio y no se convierten en créditos.
- **Presencialidad:** Dado un servicio presencial, cuando se publica, entonces debe tener una zona aproximada sin mostrar una dirección privada.

### ANU-04 Gestionar mis anuncios

- **Edición:** Dado un anuncio propio, cuando el autor lo modifica, entonces la versión actualizada se muestra a partir del guardado.
- **Pausa o retirada:** Dado un anuncio activo, cuando se pausa o retira, entonces deja de aceptar nuevas solicitudes.
- **Acuerdo existente:** Dado un anuncio vinculado a un acuerdo vigente, cuando se retira, entonces el acuerdo no se cancela automáticamente.

### ANU-05 Buscar y filtrar

- **Búsqueda:** Dados anuncios activos, cuando el miembro busca por texto, categoría, modalidad o tipo, entonces se muestran solo resultados coincidentes.
- **Proximidad:** Dada una ubicación configurada, cuando se activa “cerca de mí”, entonces los resultados se ordenan o filtran por distancia aproximada.
- **Sin resultados:** Dada una combinación sin coincidencias, cuando se ejecuta la búsqueda, entonces se informa claramente y se permite eliminar filtros.

### ANU-06 Consultar anuncio, perfil y reputación

- **Detalle:** Dado un anuncio activo, cuando un miembro lo abre, entonces ve descripción, modalidad, compensación, gastos, disponibilidad y autor.
- **Reputación:** Dado un autor con intercambios valorados, cuando se consulta su perfil, entonces se muestran valoración general y valoraciones relacionadas con servicios.
- **Privacidad:** Dado que aún no existe contacto aceptado, cuando se consulta el perfil, entonces no se muestran dirección, email ni teléfono privados.

## Contacto y acuerdo

### CON-01 Solicitar contacto

- **Solicitud válida:** Dado un anuncio o perfil accesible, cuando un miembro envía una solicitud con un mensaje, entonces el receptor recibe una solicitud pendiente.
- **Duplicado:** Dada una solicitud pendiente entre las mismas personas y contexto, cuando se intenta enviar otra, entonces no se crea un duplicado.
- **Bloqueo:** Dado que cualquiera de las partes ha bloqueado a la otra, cuando se intenta solicitar contacto, entonces la acción se rechaza.

### CON-02 Aceptar solicitud y habilitar chat

- **Aceptación:** Dada una solicitud pendiente, cuando el receptor la acepta, entonces cambia a aceptada y se habilita una conversación privada.
- **Autorización:** Dado un usuario distinto del receptor, cuando intenta aceptar la solicitud, entonces la operación se rechaza.
- **Notificación:** Dada una solicitud aceptada, cuando se completa la acción, entonces el remitente puede conocer el nuevo estado.

### CON-03 Rechazar solicitud

- **Rechazo:** Dada una solicitud pendiente, cuando el receptor la rechaza, entonces queda cerrada y no se habilita el chat.
- **Privacidad:** Dada una solicitud rechazada, cuando el remitente consulta su estado, entonces ve el rechazo sin datos privados adicionales.
- **Nueva solicitud:** Dado un rechazo, cuando el remitente intenta contactar repetidamente, entonces se aplican límites para evitar acoso o spam.

### CON-04 Chatear

- **Acceso permitido:** Dada una solicitud aceptada, cuando cualquiera de las partes abre la conversación, entonces puede enviar y recibir mensajes.
- **Acceso denegado:** Dada una solicitud pendiente o rechazada, cuando se intenta abrir el chat, entonces no se permite el acceso.
- **Bloqueo posterior:** Dado que una parte bloquea a la otra, cuando se intenta enviar un nuevo mensaje, entonces el envío queda deshabilitado.

### CON-05 Negociar intercambio

- **Propuesta:** Dada una conversación habilitada, cuando una parte propone un intercambio, entonces puede especificar servicio, duración, modalidad, compensación y gastos.
- **Contrapropuesta:** Dada una propuesta pendiente, cuando la otra parte modifica sus condiciones, entonces se conserva el estado como no acordado hasta la aceptación bilateral.
- **Sin compromiso:** Dada una negociación sin acuerdo, cuando una parte la abandona, entonces no se transfieren créditos ni se crea un intercambio activo.

### CON-06 Formalizar condiciones

- **Acuerdo bilateral:** Dadas unas condiciones completas, cuando ambas partes aceptan la misma versión, entonces se crea un acuerdo activo.
- **Versión modificada:** Dado un acuerdo aún no formalizado, cuando se modifica cualquier condición, entonces se invalida la aceptación anterior de la contraparte.
- **Modo de compensación:** Dado un anuncio que admite ambos modos, cuando se formaliza, entonces el acuerdo contiene exactamente uno: créditos o trueque directo.
- **Gastos:** Dados gastos previstos, cuando se formaliza el acuerdo, entonces su concepto y responsable quedan registrados separadamente.

### CON-07 Reprogramar o cancelar

- **Reprogramación:** Dado un acuerdo activo, cuando una parte propone otra fecha y la contraparte acepta, entonces se actualiza la programación.
- **Cancelación:** Dado un acuerdo no completado, cuando una parte lo cancela, entonces queda cerrado sin transferir créditos.
- **Historial:** Dada una reprogramación o cancelación, cuando se completa, entonces se conserva quién realizó la acción y cuándo.

### CON-08 Bloquear o denunciar

- **Bloqueo:** Dado otro miembro, cuando el usuario lo bloquea, entonces se impiden nuevas solicitudes y mensajes.
- **Denuncia:** Dado un usuario, anuncio o mensaje, cuando se denuncia con un motivo, entonces se crea un expediente para moderación.
- **Conservación:** Dado contenido denunciado, cuando se oculta al denunciante, entonces se conserva de forma restringida para que moderación pueda revisarlo.

## Intercambio y reputación

### INT-01 Marcar servicio como realizado

- **Marcado:** Dado un acuerdo activo, cuando la parte correspondiente declara realizada su prestación, entonces el intercambio queda pendiente de confirmación.
- **Autorización:** Dado un usuario ajeno al acuerdo, cuando intenta marcarlo como realizado, entonces la operación se rechaza.
- **Trueque:** Dado un trueque directo con dos prestaciones, cuando una se marca realizada, entonces la otra puede seguir pendiente.

### INT-02 Confirmar o rechazar la finalización

- **Confirmación:** Dado un servicio marcado como realizado, cuando la contraparte lo confirma, entonces se habilita la liquidación del intercambio.
- **Rechazo:** Dado un desacuerdo sobre la prestación, cuando la contraparte rechaza la finalización, entonces no se transfieren créditos y puede abrirse una disputa.
- **Confirmación duplicada:** Dado un intercambio ya confirmado, cuando se intenta confirmar de nuevo, entonces no se duplica ninguna operación.

### INT-03 Liquidar intercambio

- **Créditos:** Dado un acuerdo por créditos confirmado, cuando se liquida, entonces se debita al receptor y se acredita al proveedor según las horas confirmadas.
- **Límite de saldo:** Dado que la operación dejaría al receptor por debajo de `-3`, cuando se intenta liquidar, entonces se bloquea y se informa del motivo.
- **Trueque:** Dado un acuerdo de trueque, cuando ambas prestaciones están confirmadas, entonces se cierra sin mover créditos.
- **Atomicidad:** Dado un error durante la liquidación, cuando no pueden completarse todos los movimientos, entonces no se aplica ninguno parcialmente.

### INT-04 Consultar saldo e historial

- **Saldo:** Dado un miembro autenticado, cuando abre su cartera, entonces ve su saldo actualizado.
- **Historial:** Dado que existen movimientos o intercambios, cuando consulta el historial, entonces ve fecha, concepto, contraparte, horas y estado.
- **Privacidad:** Dado otro miembro, cuando intenta consultar movimientos privados ajenos, entonces se rechaza el acceso.

### INT-05 Valorar participante y servicio

- **Valoración permitida:** Dado un intercambio completado, cuando una parte valora a la otra y el servicio, entonces la valoración queda vinculada al intercambio.
- **Valoración anticipada:** Dado un intercambio pendiente, cancelado o disputado, cuando se intenta valorar, entonces la acción no se permite.
- **Duplicado:** Dado que el miembro ya valoró ese intercambio, cuando vuelve a valorar, entonces actualiza su valoración o se impide una segunda según la política definida.
- **Agregación:** Dada una nueva valoración válida, cuando se publica, entonces se actualizan por separado la reputación del perfil y la del servicio.

### INT-06 Abrir disputa

- **Apertura:** Dado un intercambio no resuelto, cuando una parte selecciona un motivo y aporta una explicación, entonces se crea una disputa abierta.
- **Bloqueo de liquidación:** Dada una disputa abierta, cuando se intenta liquidar el intercambio, entonces la operación queda suspendida.
- **Seguimiento:** Dada una disputa existente, cuando cualquiera de las partes la consulta, entonces ve su estado y las solicitudes de información de moderación.

## Moderación

### MOD-01 Moderar usuarios, anuncios y mensajes

- **Revisión:** Dado contenido marcado o detectado, cuando un moderador lo revisa, entonces puede mantenerlo, ocultarlo o retirarlo indicando un motivo.
- **Sanción:** Dado un incumplimiento confirmado, cuando se aplica una sanción, entonces esta queda registrada y el usuario afectado conoce sus consecuencias.
- **Permisos:** Dado un miembro sin rol de moderación, cuando intenta ejecutar una acción administrativa, entonces se rechaza.

### MOD-02 Gestionar denuncias

- **Clasificación:** Dada una denuncia nueva, cuando un moderador la abre, entonces puede clasificarla, asignarla y cambiar su estado.
- **Resolución:** Dada una investigación completada, cuando se cierra la denuncia, entonces se registra la decisión y las medidas aplicadas.
- **Confidencialidad:** Dada una denuncia, cuando se muestra a las partes, entonces no se revela información interna o innecesaria del denunciante.

### MOD-03 Resolver disputas

- **Decisión:** Dada una disputa abierta con información suficiente, cuando el moderador decide, entonces puede confirmar, cancelar o corregir el intercambio.
- **Trazabilidad:** Dada una resolución, cuando se guarda, entonces quedan registrados motivo, moderador, fecha y efectos.
- **Notificación:** Dada una disputa resuelta, cuando se cierra, entonces ambas partes pueden consultar el resultado.

### MOD-04 Ajustar o revertir créditos

- **Ajuste autorizado:** Dada una resolución que requiere corregir créditos, cuando el moderador confirma el ajuste, entonces se crean movimientos compensatorios trazables.
- **Sin edición destructiva:** Dado un movimiento previo, cuando se revierte, entonces no se elimina el registro original.
- **Validación:** Dado un ajuste sin motivo o sin referencia a una incidencia, cuando se intenta aplicar, entonces la operación se rechaza.

### MOD-05 Gestionar categorías y servicios prohibidos

- **Categorías:** Dado un administrador autorizado, cuando crea, edita o desactiva una categoría, entonces el catálogo se actualiza sin invalidar el historial.
- **Prohibiciones:** Dada una regla de servicio prohibido, cuando se activa, entonces nuevas publicaciones coincidentes se bloquean o se envían a revisión.
- **Categoría en uso:** Dada una categoría asociada a anuncios, cuando se desactiva, entonces los anuncios existentes conservan su referencia histórica.

## Condiciones de salida del MVP

- Todos los criterios P0 anteriores cuentan con pruebas automatizadas o casos de prueba documentados.
- Los movimientos de créditos son atómicos, trazables e idempotentes.
- Ningún usuario puede iniciar un chat sin consentimiento del receptor.
- Ningún intercambio disputado puede liquidarse automáticamente.
- Ningún usuario no autorizado puede acceder a funciones de moderación.
