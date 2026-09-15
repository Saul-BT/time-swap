# ADR 0012: guardado por apartado en la gestión del perfil

- **Estado:** Aceptado
- **Fecha:** 2026-09-12
- **Ámbito:** front

## Contexto

La pantalla de gestión del perfil (issue #6) reúne cinco apartados con datos de naturaleza distinta: presentación, habilidades, disponibilidad, zona y privacidad. Un formulario único obliga a validar todo a la vez, mezcla errores de campos que no están a la vista y convierte cualquier abandono en una pérdida grande. El autoguardado evita eso, pero oculta cuándo un dato pasa a ser visible para otras personas, y en un perfil con revelación progresiva (ADR 0004, ADR 0013) ese momento importa.

Cada apartado tiene además su propia ruta (`/settings/profile/presentation`, `…/skills`, `…/availability`, `…/zone` y `/settings/privacy`), así que la unidad natural de envío ya existe.

## Decisión

- **Cada apartado es un formulario con su propia Server Action.** `actions.ts` vive junto a la página del apartado y recibe solo los campos de ese apartado.
- **Guardar es explícito.** Cada panel cierra con «Guardar [apartado]» y «Siguiente: [apartado]». No hay botón global ni barra de «cambios sin guardar» para toda la pantalla.
- **El aviso de abandono se limita al panel abierto.** Si hay cambios sin guardar y se navega a otro apartado, un diálogo ofrece seguir editando o salir sin guardar. Abandonar la página avisa con `beforeunload`.
- **La validación de campo se resuelve en la acción** y vuelve como identificadores tipados que el panel traduce con el diccionario. Un error de servidor deja los valores en pantalla y ofrece reintentar.
- **El estado de completitud lo calcula la API** (`completionStatus`, issue #5) y se refresca tras cada guardado. El front no deduce si el perfil se puede publicar.

## Consecuencias positivas

- Errores siempre junto al campo que los provoca, dentro del apartado visible.
- Un fallo de red afecta a un apartado, no a toda la edición.
- El momento en que un dato se vuelve visible coincide con un gesto del miembro.
- Cada acción tiene un contrato pequeño, fácil de mapear a un `PATCH` parcial.

## Costes y riesgos

- Campos relacionados que viven en apartados distintos (modalidad y zona) se validan por separado; la regla «en persona necesita zona» se comprueba en el apartado Zona, que contiene ambos.
- Cinco acciones en lugar de una: más ficheros, aunque con el mismo patrón.
- Un miembro puede dejar un apartado a medias sin darse cuenta si ignora el diálogo; el medidor y el estado de cada pestaña lo hacen visible.

## Alternativas consideradas

- **Formulario único con un solo «Guardar».** Menos ficheros, pero errores fuera de la vista, pérdida grande al abandonar y un `PATCH` que envía datos que no han cambiado. Descartado.
- **Autoguardado por campo.** Sin fricción, pero el miembro no controla cuándo un dato pasa a ser visible y las validaciones cruzadas se vuelven ambiguas. Descartado por el peso de la privacidad en este perfil.
- **Guardado por apartado con barra global de cambios pendientes.** Duplica el aviso y contradice «un apartado cada vez». Descartado.
