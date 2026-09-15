# ADR 0013: cuatro momentos de revelación por dato del perfil

- **Estado:** Aceptado
- **Fecha:** 2026-09-12
- **Ámbito:** producto

## Contexto

ADR 0004 establece que la ubicación precisa se revela de manera progresiva. El resto del perfil (presentación, habilidades, intereses, disponibilidad) también tiene datos que un miembro puede no querer mostrar a cualquiera, y la interfaz de privacidad (issue #6) debe explicar «qué verá otra persona y desde cuándo», no ofrecer una lista de interruptores sin contexto.

Hacen falta una escala común a todos los datos y una lista cerrada de lo que no se controla.

## Decisión

- **Cuatro momentos ordenados:** `visitor` (cualquiera, también sin cuenta), `member` (con cuenta verificada), `contact` (tras aceptar una solicitud de contacto), `agreement` (con un acuerdo formalizado). Cada dato opcional del perfil tiene exactamente un momento.
- **Elegir un momento implica los siguientes.** Un dato visible para `member` lo es también para `contact` y `agreement`. No existe «visible para contactos pero no para acuerdos».
- **Datos con momento configurable:** presentación, habilidades, intereses, disponibilidad y barrio.
- **Datos fijos, siempre públicos:** nombre visible, modalidad y distrito. Son el mínimo para que un anuncio tenga sentido y para la búsqueda por cercanía.
- **Datos que nunca se muestran y no tienen control:** correo, teléfono, dirección exacta y saldo de horas. El punto de encuentro se comparte en el chat, por el propio miembro, con un acuerdo cerrado (ADR 0004).
- **Dos ajustes globales** complementan los momentos: «mi perfil se ve sin tener cuenta» y «mis anuncios salen en buscadores», ambos apagados por defecto. El primero apagado equivale a subir a `member` cualquier dato en `visitor`.
- **El filtrado lo aplica la API.** Un dato fuera de su momento no viaja en la respuesta pública (issue #5); la interfaz solo refleja la política.

## Consecuencias positivas

- Una sola pregunta por dato («desde cuándo se ve») en lugar de combinaciones de interruptores.
- La política completa cabe en una matriz dato × momento, comparable de un vistazo.
- Los momentos coinciden con estados que el producto ya tiene (visitante, miembro, contacto aceptado según ADR 0003, acuerdo).
- Lo que nunca se muestra queda escrito, no depende de una casilla.

## Costes y riesgos

- La escala es lineal: no admite políticas no monótonas. Es intencionado.
- Añadir un momento nuevo (por ejemplo, «tras el primer intercambio») obliga a migrar los valores guardados.
- Las cuentas no verificadas quedan en `visitor` a efectos de lectura, lo que puede sorprender a quien acaba de registrarse.

## Alternativas consideradas

- **Un booleano «público / privado» por dato.** Simple, pero no distingue contacto de acuerdo, que es justo lo que ADR 0004 exige para la ubicación. Descartado.
- **Dos niveles (público / solo miembros) más ubicación aparte.** Cubre el MVP mínimo, pero deja la disponibilidad y la presentación sin un momento intermedio y obliga a una segunda escala para la zona. Descartado.
- **Listas de permitidos por persona.** Máximo control, pero inviable de explicar y de mantener. Descartado.
